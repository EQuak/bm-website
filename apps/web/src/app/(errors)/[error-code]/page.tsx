import { CustomErrorPage } from "../CustomErrorPage"

export default async function ErrorPage({
  params
}: {
  params: Promise<{ "error-code": string }>
}) {
  const { "error-code": errorCode } = await params
  return <CustomErrorPage errorStatus={errorCode} />
}
