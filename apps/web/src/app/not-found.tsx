import { CustomErrorPage } from "#/components/CustomErrorPage"

export default function NotFoundPage() {
  return <CustomErrorPage errorStatus={"404"} canRefresh={false} />
}
