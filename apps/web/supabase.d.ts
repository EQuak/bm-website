import type {
  UserAppMetadata as UserAppMetadataSupabase,
  UserMetadata as UserMetadataSupabase
} from "@supabase/supabase-js"
import type { AppPreferences, RBAC } from "@/core/contexts/rbac/rbac_schema"

declare module "@supabase/auth-js" {
  interface UserAppMetadata extends UserAppMetadataSupabase {
    rbac?: RBAC
    preferences?: AppPreferences
  }

  interface UserMetadata extends UserMetadataSupabase {
    name?: string
    full_name?: string
    avatar?: string
    avatar_url?: string
  }
}
