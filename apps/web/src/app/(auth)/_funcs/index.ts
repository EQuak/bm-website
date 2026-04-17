import * as login from "./login"
import * as resetPassword from "./reset-password"
import * as signUp from "./sign-up"

export const authActions = {
  ...login,
  ...resetPassword,
  ...signUp
}
