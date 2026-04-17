import { relations } from "drizzle-orm/relations"

import {
  bucketsInStorage,
  objectsInStorage,
  s3MultipartUploadsInStorage,
  s3MultipartUploadsPartsInStorage
} from "./storate.tables"

export const objectsInStorageRelations = relations(
  objectsInStorage,
  ({ one }) => ({
    bucketsInStorage: one(bucketsInStorage, {
      fields: [objectsInStorage.bucketId],
      references: [bucketsInStorage.id]
    })
  })
)

export const bucketsInStorageRelations = relations(
  bucketsInStorage,
  ({ many }) => ({
    objectsInStorages: many(objectsInStorage),
    s3MultipartUploadsPartsInStorages: many(s3MultipartUploadsPartsInStorage),
    s3MultipartUploadsInStorages: many(s3MultipartUploadsInStorage)
  })
)

export const s3MultipartUploadsPartsInStorageRelations = relations(
  s3MultipartUploadsPartsInStorage,
  ({ one }) => ({
    s3MultipartUploadsInStorage: one(s3MultipartUploadsInStorage, {
      fields: [s3MultipartUploadsPartsInStorage.uploadId],
      references: [s3MultipartUploadsInStorage.id]
    }),
    bucketsInStorage: one(bucketsInStorage, {
      fields: [s3MultipartUploadsPartsInStorage.bucketId],
      references: [bucketsInStorage.id]
    })
  })
)

export const s3MultipartUploadsInStorageRelations = relations(
  s3MultipartUploadsInStorage,
  ({ one, many }) => ({
    s3MultipartUploadsPartsInStorages: many(s3MultipartUploadsPartsInStorage),
    bucketsInStorage: one(bucketsInStorage, {
      fields: [s3MultipartUploadsInStorage.bucketId],
      references: [bucketsInStorage.id]
    })
  })
)
