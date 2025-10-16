"use server";
import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import {
  createUserSchemaForm,
  updateUserSchemaForm,
} from "@/validations/auth-validation";

export async function createUser(prevState: AuthFormState, formData: FormData) {
  let validatedFields = createUserSchemaForm.safeParse({
    name: formData?.get("name"),
    email: formData?.get("email"),
    role: formData?.get("role"),
    password: formData?.get("password"),
    avatar_url: formData.get("avatar_url"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validatedFields.data.avatar_url instanceof File) {
    const { errors, data } = await uploadFile(
      "images",
      "users",
      validatedFields.data.avatar_url
    );
    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    // * reassign avatar_url, before: file to string
    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        avatar_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        name: validatedFields.data.name,
        role: validatedFields.data.role,
        avatar_url: validatedFields.data.avatar_url,
      },
    },
  });

  if (error) {
    // * assign path images
    const path = (validatedFields.data.avatar_url as string).split(
      `/public/images/`
    )[1];
    // * handle delete image, because image successed send to bucket
    const { errors } = await deleteFile("images", path);
    if (!errors)
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [error.message],
        },
      };
  }

  return {
    status: "success",
  };
}

export async function updateUser(prevState: AuthFormState, formData: FormData) {
  let validatedFields = updateUserSchemaForm.safeParse({
    name: formData?.get("name"),
    role: formData?.get("role"),
    avatar_url: formData?.get("avatar_url"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  if (validatedFields.data.avatar_url instanceof File) {
    const oldAvatarUrl =
      (formData?.get("old_avatar_url") as string) &&
      (formData?.get("old_avatar_url") as string).split("/images/")[1];

    const { errors, data } = await uploadFile(
      "images",
      "users",
      validatedFields.data.avatar_url,
      oldAvatarUrl
    );
    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [...errors._form],
        },
      };
    }

    // * reassign avatar_url, before: file to string
    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        avatar_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      avatar_url: validatedFields.data.avatar_url,
    })
    .eq("id", formData.get("id"));

  if (error) {
    // * assign path images
    const path = (validatedFields.data.avatar_url as string).split(
      "/images/"
    )[1];
    // * handle delete image, because image successed send to bucket
    const { errors } = await deleteFile("images", path);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function deleteUser(prevState: AuthFormState, formData: FormData) {
  const supabase = await createClient({ isAdmin: true });
  const image = formData.get("avatar_url") as string;
  const { errors } = await deleteFile("images", image.split("/images/")?.[1]);

  if (errors) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [...(errors._form?.[0] ?? "Unknown Error")],
      },
    };
  }
  const { error } = await supabase.auth.admin.deleteUser(
    formData.get("id") as string
  );
  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [...error.message],
      },
    };
  }
  return {
    status: "success",
  };
}
