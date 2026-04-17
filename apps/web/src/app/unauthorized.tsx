"use client"

import { CustomErrorPage } from "#/components/CustomErrorPage"

export default function Unauthorized() {
  return (
    <>
      <CustomErrorPage canRefresh={false} errorStatus="403" />
    </>
  )
}
