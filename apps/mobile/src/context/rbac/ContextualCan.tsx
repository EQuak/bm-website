import { createContextualCan } from "@casl/react"

import { AbilityContext } from "./RBACContext"

export const RBAC = createContextualCan(AbilityContext.Consumer)
