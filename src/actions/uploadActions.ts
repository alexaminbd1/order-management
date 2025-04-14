"use server"

import cloudinary from "@/lib/cloudinary"

// Define a type for the upload result
interface UploadResult {
  url: string
  public_id: string
}

// Define the type for the error response
interface UploadError {
  error: string
}

export const uploadImage = async (
  formData: FormData
): Promise<UploadResult | UploadError> => {
  const file = formData.get("file") as File
  if (!file || !file.type.startsWith("image/")) {
    return { error: "Invalid image file" }
  }

  // 5MB limit
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size exceeds 5MB limit" }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "next-uploads",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    return result as { url: string; public_id: string }
  } catch (error) {
    console.error("Upload failed:", error)
    return { error: "Upload failed" }
  }
}

export const deleteImage = async (publicId: string) => {
  console.log(publicId, "Public id")
  try {
    await cloudinary.uploader.destroy(publicId)
    return { success: true }
  } catch (error) {
    console.error("Delete failed:", error)
    return { error: "Delete failed" }
  }
}
