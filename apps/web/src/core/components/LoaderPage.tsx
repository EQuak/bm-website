import { Loader } from "@repo/mantine-ui"

export default function LoaderPage({ message }: { message?: string }) {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-6">
      <Loader type="bars" color="gray" />
      <span className="animate-pulse text-mtn-dimmed text-sm italic">
        {message ?? "Preparing the workspace..."}
      </span>
    </div>
  )
}
