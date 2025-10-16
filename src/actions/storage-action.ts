"use server";

import { environment } from "@/configs/environment";
import { createClient } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import { SupabaseAuthClientOptions } from "@supabase/supabase-js/dist/module/lib/types";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  prevPath?: string
) {
  const supabase = await createClient();
  const newPath = `${path}/${Date.now()}-${file.name}`;
  // untuk update Gambar - gambar yang lama dihapus
  if (prevPath) {
    const { error } = await supabase.storage.from(bucket).remove([prevPath]);
    if (error) {
      return {
        status: "error",
        errors: {
          _form: [error.message],
        },
      };
    }
  }
  const isImageRegex = /\.(png|jpe?g|gif|svg)$/i;

  if (!isImageRegex.test(file.name)) {
    return {
      status: "success",
      data: {
        url: "",
        path: "",
      },
    };
  }

  const { error } = await supabase.storage.from(bucket).upload(newPath, file);
  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }
  return {
    status: "success",
    data: {
      url: `${environment.SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`,
      path: newPath,
    },
  };
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    return {
      status: "error",
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}
