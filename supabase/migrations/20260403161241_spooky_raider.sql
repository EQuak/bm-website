-- CREATE SCHEMA "storage";
-- --> statement-breakpoint
-- CREATE TABLE "storage"."buckets" (
-- 	"id" text PRIMARY KEY NOT NULL,
-- 	"name" text NOT NULL,
-- 	"owner" uuid,
-- 	"created_at" timestamp with time zone DEFAULT now(),
-- 	"updated_at" timestamp with time zone DEFAULT now(),
-- 	"public" boolean DEFAULT false,
-- 	"avif_autodetection" boolean DEFAULT false,
-- 	"file_size_limit" bigint,
-- 	"allowed_mime_types" text[],
-- 	"owner_id" text
-- );
-- --> statement-breakpoint
-- CREATE TABLE "storage"."migrations" (
-- 	"id" integer PRIMARY KEY NOT NULL,
-- 	"name" varchar(100) NOT NULL,
-- 	"hash" varchar(40) NOT NULL,
-- 	"executed_at" timestamp DEFAULT CURRENT_TIMESTAMP,
-- 	CONSTRAINT "migrations_name_key" UNIQUE("name")
-- );
-- --> statement-breakpoint
-- CREATE TABLE "storage"."objects" (
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"bucket_id" text,
-- 	"name" text,
-- 	"owner" uuid,
-- 	"created_at" timestamp with time zone DEFAULT now(),
-- 	"updated_at" timestamp with time zone DEFAULT now(),
-- 	"last_accessed_at" timestamp with time zone DEFAULT now(),
-- 	"metadata" jsonb,
-- 	"path_tokens" text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
-- 	"version" text,
-- 	"owner_id" text,
-- 	"user_metadata" jsonb
-- );
-- --> statement-breakpoint
-- CREATE TABLE "storage"."s3_multipart_uploads" (
-- 	"id" text PRIMARY KEY NOT NULL,
-- 	"in_progress_size" bigint DEFAULT 0 NOT NULL,
-- 	"upload_signature" text NOT NULL,
-- 	"bucket_id" text NOT NULL,
-- 	"key" text NOT NULL,
-- 	"version" text NOT NULL,
-- 	"owner_id" text,
-- 	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
-- 	"user_metadata" jsonb
-- );
-- --> statement-breakpoint
-- CREATE TABLE "storage"."s3_multipart_uploads_parts" (
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"upload_id" text NOT NULL,
-- 	"size" bigint DEFAULT 0 NOT NULL,
-- 	"part_number" integer NOT NULL,
-- 	"bucket_id" text NOT NULL,
-- 	"key" text NOT NULL,
-- 	"etag" text NOT NULL,
-- 	"owner_id" text,
-- 	"version" text NOT NULL,
-- 	"created_at" timestamp with time zone DEFAULT now() NOT NULL
-- );
--> statement-breakpoint
CREATE TABLE "acl_roles" (
	"id" text GENERATED ALWAYS AS (slug) STORED,
	"slug" text PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "acls_roles_permissions" (
	"role_slug" text,
	"module_key" text NOT NULL,
	"title" text NOT NULL,
	"parent_module_key" text,
	"permissions" jsonb DEFAULT '{"actions":{"view":false,"add":false,"edit":false},"extraPermissions":[]}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "acls_roles_permissions_role_slug_module_key_pk" PRIMARY KEY("role_slug","module_key")
);
--> statement-breakpoint
-- CREATE TABLE "auth"."users" (
-- 	"instance_id" uuid,
-- 	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
-- 	"aud" varchar(255),
-- 	"role" varchar(255),
-- 	"email" varchar(255),
-- 	"encrypted_password" varchar(255),
-- 	"email_confirmed_at" timestamp,
-- 	"invited_at" timestamp,
-- 	"last_sign_in_at" timestamp,
-- 	"raw_app_meta_data" jsonb DEFAULT '{}'::jsonb,
-- 	"raw_user_meta_data" jsonb DEFAULT '{}'::jsonb,
-- 	"is_super_admin" boolean,
-- 	"created_at" timestamp,
-- 	"updated_at" timestamp,
-- 	"phone" text,
-- 	"reauthentication_token" varchar(255),
-- 	"reauthentication_sent_at" timestamp,
-- 	"is_sso_user" boolean,
-- 	"deleted_at" timestamp,
-- 	"is_anonymous" boolean
-- );
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"additional_email" varchar(255) DEFAULT '',
	"username" varchar(40) NOT NULL,
	"inactive" boolean DEFAULT false,
	"user_id" uuid,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"full_name" text GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
	"phone" text DEFAULT '',
	"avatar" text DEFAULT '',
	"acl_role" text DEFAULT 'employee' NOT NULL,
	"acl_custom_permissions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"preferences" jsonb DEFAULT '{"theme":{"colorSchema":"system"},"app":{"default_location":null,"accent_color":null,"beta_features":false}}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
-- ALTER TABLE "storage"."objects" ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "storage"."s3_multipart_uploads" ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "storage"."s3_multipart_uploads_parts" ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
-- ALTER TABLE "storage"."s3_multipart_uploads_parts" ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acls_roles_permissions" ADD CONSTRAINT "acls_roles_permissions_role_slug_acl_roles_slug_fk" FOREIGN KEY ("role_slug") REFERENCES "public"."acl_roles"("slug") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_acl_role_acl_roles_slug_fk" FOREIGN KEY ("acl_role") REFERENCES "public"."acl_roles"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
-- CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING btree ("name");--> statement-breakpoint
-- CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING btree ("bucket_id","name");--> statement-breakpoint
-- CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING btree ("bucket_id","name");--> statement-breakpoint
-- CREATE INDEX "name_prefix_search" ON "storage"."objects" USING btree ("name");--> statement-breakpoint
-- CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING btree ("bucket_id","key","created_at");--> statement-breakpoint
CREATE INDEX "acl_roles_slug_idx" ON "acl_roles" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "acls_roles_permissions_role_slug_idx" ON "acls_roles_permissions" USING btree ("role_slug");--> statement-breakpoint
CREATE INDEX "acls_roles_permissions_parent_module_key_idx" ON "acls_roles_permissions" USING btree ("parent_module_key");--> statement-breakpoint
CREATE INDEX "acls_roles_permissions_title_idx" ON "acls_roles_permissions" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_inactive" ON "profiles" USING btree ("inactive");--> statement-breakpoint
CREATE INDEX "idx_username" ON "profiles" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_userId" ON "profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_aclRole" ON "profiles" USING btree ("acl_role");--> statement-breakpoint
CREATE INDEX "profiles_additional_email_idx" ON "profiles" USING btree ("additional_email");--> statement-breakpoint
CREATE INDEX "profiles_first_name_idx" ON "profiles" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "profiles_last_name_idx" ON "profiles" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX "profiles_full_name_idx" ON "profiles" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "profiles_phone_idx" ON "profiles" USING btree ("phone");--> statement-breakpoint
CREATE VIEW "public"."profiles_with_acl_roles" AS (
  SELECT
    p.id AS profile_id,
    r.slug AS role_slug,
    p.full_name
  FROM profiles p
  INNER JOIN acl_roles r ON r.slug = p.acl_role
);