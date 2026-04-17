// import { AUTH_ROUTES, PROTECTED_ROUTES } from "#/core/configs/site"

// /**
//  * Check if the current path is a protected route
//  * If the item at the array ends with a *, it is a wildcard route, means it matches all routes that start with the same path
//  * If not, it is a simple route, means it matches exactly the same path
//  * @param path
//  * @returns boolean
//  */
// export const isProtectedRoute = (path: string) => {
//   return PROTECTED_ROUTES.some(route => {
//     if (route.endsWith("*")) {
//       return path.startsWith(route.replace("/*", ""))
//     }
//     return path === route
//   })
// }

// /**
//  * Check if the current path is an auth route
//  * If the item at the array ends with a *, it is a wildcard route, means it matches all routes that start with the same path
//  * If not, it is a simple route, means it matches exactly the same path
//  * @param path
//  * @returns boolean
//  */
// export const isAuthRoute = (path: string) => {
//   return AUTH_ROUTES.some(route => {
//     if (route.endsWith("*")) {
//       return path.startsWith(route.replace("/*", ""))
//     }
//     return path === route
//   })
// }
