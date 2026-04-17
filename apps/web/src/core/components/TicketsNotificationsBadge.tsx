// import { Badge } from "@repo/mantine-ui"

// import { api } from "#/trpc/react"
// import { useApp } from "../context/AppContext"

// export default function TicketsNotificationsBadge() {
//   const { profile } = useApp()
//   const {
//     data: notifications,
//     isLoading,
//     error
//   } = api.tks.tickets.getNeededTicketsByEmployeeId.useQuery(
//     {
//       employeeId: profile.id
//     },
//     {
//       enabled: !!profile.id,
//       staleTime: 1000 * 60 * 60 * 2 // 2hours
//     }
//   )

//   if (error) {
//     console.error("Error fetching tickets notifications:", error)
//   }

//   // Return null if loading, no notifications, or empty array
//   if (isLoading || !notifications || notifications.length === 0) {
//     return null
//   }

//   return (
//     <Badge component={"span"} size="xs" color="red" circle>
//       {notifications.length}
//     </Badge>
//   )
// }
