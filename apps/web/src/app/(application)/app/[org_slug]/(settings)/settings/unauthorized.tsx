"use client"

import { CustomErrorPage } from "#/app/(errors)/CustomErrorPage"

export default function Unauthorized() {
  return (
    <>
      <CustomErrorPage canRefresh={false} errorStatus="403" />
    </>
  )
}
