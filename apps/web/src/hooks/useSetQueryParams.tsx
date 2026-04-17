"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

type UseSetQueryParamsProps = {
  key: string
  value: string
}

/**
 * Hook will receive a query and value and set the query in the URL or if the query is already set, it will update the value
 * @param props - The props to set the query params
 */
export function useSetQueryParams({ replace = false }: { replace?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueryParams = ({ key, value }: UseSetQueryParamsProps) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set(key, value)
    replace
      ? router.replace(`${pathname}?${newSearchParams.toString()}`)
      : router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  return setQueryParams
}

export function useSetQueriesParams({
  replace = false
}: {
  replace?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueriesParams = (queries: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams)

    Object.entries(queries).forEach(([key, value]) => {
      newSearchParams.set(key, value)
    })

    replace
      ? router.replace(`${pathname}?${newSearchParams.toString()}`)
      : router.push(`${pathname}?${newSearchParams.toString()}`)
  }

  return setQueriesParams
}

/**
 * Hook will remove the query from the URL
 */
export function useClearQueryParams({
  replace = false
}: {
  replace?: boolean
}) {
  const router = useRouter()
  const pathname = usePathname()

  const clearQueryParams = () => {
    replace ? router.replace(pathname) : router.push(pathname)
  }

  return clearQueryParams
}

export function useGetQueryParam() {
  const searchParams = useSearchParams()

  const getQueryParam = (key: string) => {
    return searchParams.get(key)
  }

  return getQueryParam
}
