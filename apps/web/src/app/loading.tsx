import { Center, Loader } from "@repo/mantine-ui"

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <Center className="flex h-screen w-full">
      <Loader type="bars" size={"lg"} />
    </Center>
  )
}
