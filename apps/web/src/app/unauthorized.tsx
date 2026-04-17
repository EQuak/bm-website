"use client"

import { CustomErrorPage } from "./(errors)/CustomErrorPage"

export default function Unauthorized() {
  return (
    <>
      <CustomErrorPage canRefresh={false} errorStatus="403" />
    </>
  )
}
