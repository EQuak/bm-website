import { faker } from "@faker-js/faker"
import type { AppPreferences } from "../../acl/rbac_schema"
import {
  DEFAULT_ORGANIZATION_ID,
  INTERNAL_ORGANIZATION_ID
} from "../../lib/default-organization"
import type { ProfileInsert } from "../../schema"

export const DEFAULT_PROFILES: (Omit<ProfileInsert, "app_preferences"> & {
  email: string
  app_preferences?: AppPreferences
})[] = [
  {
    organizationId: INTERNAL_ORGANIZATION_ID,
    email: "developer@developer.com",
    firstName: "Developer",
    lastName: "Developer",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    phone: faker.helpers.fromRegExp("(321) ###-####"),
    aclRole: "admin",
    app_preferences: {
      theme: {
        colorSchema: "system"
      },
      app: {
        accent_color: null,
        beta_features: true
      }
    }
  },
  {
    organizationId: DEFAULT_ORGANIZATION_ID,
    email: "user@user.com",
    firstName: "User",
    lastName: "User",
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    phone: faker.helpers.fromRegExp("(321) ###-####"),
    aclRole: "user",
    app_preferences: {
      theme: {
        colorSchema: "system"
      },
      app: {
        accent_color: null,
        beta_features: false
      }
    }
  },
  {
    organizationId: DEFAULT_ORGANIZATION_ID,
    email: "admin@admin.com",
    firstName: "Admin",
    lastName: "Admin",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
    phone: faker.helpers.fromRegExp("(321) ###-####"),
    aclRole: "admin",
    app_preferences: {
      theme: {
        colorSchema: "system"
      },
      app: {
        accent_color: null,
        beta_features: false
      }
    }
  },
]