"use server";
import { deleteFile, uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { MenuFormState } from "@/types/menu";
import { MenuSchema } from "@/validations/menu-validation";

export async function createMenu(prevState: MenuFormState, formData: FormData) {
  let validatedFields = MenuSchema.safeParse({
    name: formData?.get("name"),
    description: formData?.get("description"),
    price: parseFloat(formData?.get("price") as string),
    discount: parseFloat(formData?.get("discount") as string),
    category: formData?.get("category"),
    is_available: formData?.get("is_available") === "true" ? true : false,
    image_url: formData?.get("image_url"),
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

  if (validatedFields.data.image_url instanceof File) {
    const { errors, data } = await uploadFile(
      "images",
      "menus",
      validatedFields.data.image_url
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

    // * reassign image_url, before: file to string
    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("menus").insert({
    name: validatedFields.data!.name,
    description: validatedFields.data!.description as string,
    price: validatedFields.data!.price,
    discount: validatedFields.data!.discount,
    category: validatedFields.data!.category,
    is_available: validatedFields.data!.is_available,
    image_url: validatedFields.data!.image_url,
  });

  if (error) {
    // * assign path images
    const path = (validatedFields.data!.image_url as string).split(
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

export async function updateMenu(prevState: MenuFormState, formData: FormData) {
  let validatedFields = MenuSchema.safeParse({
    name: formData?.get("name"),
    description: formData?.get("description"),
    price: parseFloat(formData?.get("price") as string),
    discount: parseFloat(formData?.get("discount") as string),
    category: formData?.get("category"),
    is_available: formData?.get("is_available") === "true" ? true : false,
    image_url: formData?.get("image_url"),
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

  if (validatedFields.data.image_url instanceof File) {
    const oldImageUrl =
      (formData?.get("image_url") as string) &&
      (formData?.get("image_url") as string).split("/images/")[1];

    const { errors, data } = await uploadFile(
      "images",
      "users",
      validatedFields.data.image_url,
      oldImageUrl
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

    // * reassign image_url, before: file to string
    validatedFields = {
      ...validatedFields,
      data: {
        ...validatedFields.data,
        image_url: data.url,
      },
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("menus")
    .update({
      name: validatedFields.data!.name,
      description: validatedFields.data!.description as string,
      price: validatedFields.data!.price,
      discount: validatedFields.data!.discount,
      category: validatedFields.data!.category,
      is_available: validatedFields.data!.is_available,
      image_url: validatedFields.data!.image_url,
    })
    .eq("id", formData?.get("id"));

  if (error) {
    // * assign path images
    const path = (validatedFields.data.image_url as string).split(
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

export async function deleteMenu(prevState: MenuFormState, formData: FormData) {
  const supabase = await createClient();
  const image = formData.get("image_url") as string;
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
  const { error } = await supabase
    .from("menus")
    .delete()
    .eq("id", formData.get("id"));
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
