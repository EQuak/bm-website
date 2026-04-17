CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"inactive" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"organization_id" uuid PRIMARY KEY NOT NULL,
	"maintenance_mode" boolean DEFAULT false NOT NULL,
	"email_notification_enable" boolean DEFAULT true NOT NULL,
	"global_notification_enable" boolean DEFAULT true NOT NULL,
	"rate_limit" integer,
	"secure_mode" boolean DEFAULT false NOT NULL,
	"resend_enabled" boolean DEFAULT false NOT NULL,
	"resend_provider" text DEFAULT 'resend' NOT NULL,
	"resend_api_key" text,
	"resend_from_email" text,
	"resend_domain" text,
	"resend_smtp_host" text,
	"resend_smtp_port" integer,
	"resend_smtp_user" text,
	"resend_smtp_pass" text,
	"resend_rate_limit" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_username_unique";--> statement-breakpoint
DROP INDEX "idx_username";--> statement-breakpoint
DROP INDEX "profiles_additional_email_idx";--> statement-breakpoint
ALTER TABLE "acls_roles_permissions" ALTER COLUMN "permissions" SET DEFAULT '{"actions":{"view":false,"add":false,"edit":false}}'::jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "acl_role" SET DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "preferences" SET DEFAULT '{"theme":{"colorSchema":"system"},"app":{"accent_color":null,"beta_features":false}}'::jsonb;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "organization_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "organizations_slug_idx" ON "organizations" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "organizations_inactive_idx" ON "organizations" USING btree ("inactive");--> statement-breakpoint
CREATE INDEX "system_settings_maintenance_mode_idx" ON "system_settings" USING btree ("maintenance_mode");--> statement-breakpoint
CREATE INDEX "system_settings_email_notification_enable_idx" ON "system_settings" USING btree ("email_notification_enable");--> statement-breakpoint
CREATE INDEX "system_settings_global_notification_enable_idx" ON "system_settings" USING btree ("global_notification_enable");--> statement-breakpoint
CREATE INDEX "system_settings_resend_enabled_idx" ON "system_settings" USING btree ("resend_enabled");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_org_user_id_unique" ON "profiles" USING btree ("organization_id","user_id");--> statement-breakpoint
CREATE INDEX "idx_organization_id" ON "profiles" USING btree ("organization_id");--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "additional_email";--> statement-breakpoint
ALTER TABLE "profiles" DROP COLUMN "username";