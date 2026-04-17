import sharp from "sharp"

export const compressImage = async (file: File): Promise<File> => {
  const buffer = await file.arrayBuffer()
  const compressedBuffer = await sharp(buffer)
    .resize(512, 512, {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .toFormat("jpeg", { quality: 80 })
    .toBuffer()

  const compressedFile = new File(
    [new Uint8Array(compressedBuffer)],
    file.name,
    {
      type: "image/jpeg"
    }
  )

  return compressedFile
}
