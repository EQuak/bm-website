import { Center, Loader } from "@mantine/core"
import type { FC } from "react"

const Spinner: FC = () => {
  return (
    <Center style={{ flex: 1 }}>
      <Loader size={"lg"} type="bars" />
    </Center>
  )
}

export default Spinner
