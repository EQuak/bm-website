import { Divider, Loader, Skeleton, Stack } from "@repo/mantine-ui"
import { cn } from "@repo/mantine-ui/utils/cn"

import { LogoIcon } from "#/assets/icons/logo"

export const LoaderSkeleton = () => {
  return (
    <div
      className={cn(
        "flex h-svh w-full bg-white max-lg:flex-col md:bg-mtn-gray-1"
      )}
    >
      <div className="fixed inset-y-0 left-0 w-64 max-md:hidden md:w-[72px] lg:w-64">
        <nav className="flex h-full min-h-0 flex-col">
          <div className="mb-4 flex h-16 items-center justify-start">
            <div className="px-4 pt-6">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <LogoIcon height={40} className={"grayscale"} />
              </div>
            </div>
          </div>
          <Divider />
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
            {/* Links */}
            <Stack gap={8}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} height={40} />
              ))}
            </Stack>
          </div>
          {/* Sidebar Footer */}
          <Divider />
          <div className="p-4">
            <Skeleton height={40} className="my-2" />
          </div>
        </nav>
      </div>
      <main className="flex flex-1 flex-col pb-2 transition-all duration-300 ease-in-out md:min-w-0 md:pt-2 md:pr-2 md:pl-[72px] lg:pl-64">
        <div className="relative flex flex-1 grow items-center justify-center md:rounded-md md:bg-white md:shadow-md">
          <header
            className={cn(
              "absolute top-0 mx-0 mt-0 flex w-full items-center px-4 py-2 transition-all duration-300 ease-in-out md:top-2 md:mt-2 lg:hidden"
            )}
          >
            <div
              className={cn(
                "flex w-full items-center justify-between rounded-none"
              )}
            >
              <Skeleton height={40} width={40} />
              <Skeleton height={40} width={40} />
            </div>
          </header>
          <div className="flex flex-col items-center justify-center gap-6">
            <Loader type="bars" color="gray" />
            <span className="animate-pulse text-mtn-dimmed text-sm italic">
              Building your experience...
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}
