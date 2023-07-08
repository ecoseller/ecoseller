-- -------------------------------------------------------------
-- TablePlus 4.6.4(414)
--
-- https://tableplus.com/
--
-- Database: ecoseller
-- Generation Time: 2023-07-08 23:11:03.7700
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."auth_group";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS auth_group_id_seq;

-- Table Definition
CREATE TABLE "public"."auth_group" (
    "id" int4 NOT NULL DEFAULT nextval('auth_group_id_seq'::regclass),
    "name" varchar(150) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."auth_group_permissions";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS auth_group_permissions_id_seq;

-- Table Definition
CREATE TABLE "public"."auth_group_permissions" (
    "id" int8 NOT NULL DEFAULT nextval('auth_group_permissions_id_seq'::regclass),
    "group_id" int4 NOT NULL,
    "permission_id" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."auth_permission";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS auth_permission_id_seq;

-- Table Definition
CREATE TABLE "public"."auth_permission" (
    "id" int4 NOT NULL DEFAULT nextval('auth_permission_id_seq'::regclass),
    "name" varchar(255) NOT NULL,
    "content_type_id" int4 NOT NULL,
    "codename" varchar(100) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."authtoken_token";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."authtoken_token" (
    "key" varchar(40) NOT NULL,
    "created" timestamptz NOT NULL,
    "user_id" varchar(40) NOT NULL,
    PRIMARY KEY ("key")
);

DROP TABLE IF EXISTS "public"."cart_cart";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."cart_cart" (
    "token" uuid NOT NULL,
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "country_id" varchar(2),
    "user_id" varchar(40),
    "billing_info_id" int8,
    "shipping_info_id" int8,
    "payment_method_country_id" int8,
    "shipping_method_country_id" int8,
    "pricelist_id" varchar(200),
    PRIMARY KEY ("token")
);

DROP TABLE IF EXISTS "public"."cart_cartitem";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_cartitem_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_cartitem" (
    "id" int8 NOT NULL DEFAULT nextval('cart_cartitem_id_seq'::regclass),
    "unit_price_incl_vat" numeric(10,2),
    "unit_price_without_vat" numeric(10,2),
    "quantity" int4 NOT NULL,
    "cart_id" uuid,
    "product_variant_id" varchar(255),
    "product_id" int8,
    "discount" numeric(10,2),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cart_paymentmethod";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_paymentmethod_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_paymentmethod" (
    "id" int8 NOT NULL DEFAULT nextval('cart_paymentmethod_id_seq'::regclass),
    "image" varchar(100),
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cart_paymentmethod_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_paymentmethod_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_paymentmethod_translation" (
    "id" int8 NOT NULL DEFAULT nextval('cart_paymentmethod_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "title" varchar(255) NOT NULL,
    "description" text,
    "master_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cart_paymentmethodcountry";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_paymentmethodcountry_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_paymentmethodcountry" (
    "id" int8 NOT NULL DEFAULT nextval('cart_paymentmethodcountry_id_seq'::regclass),
    "price" numeric(10,2) NOT NULL,
    "is_active" bool NOT NULL,
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "country_id" varchar(2) NOT NULL,
    "currency_id" varchar(3) NOT NULL,
    "payment_method_id" int8 NOT NULL,
    "vat_group_id" int8 NOT NULL,
    "api_request" varchar(42),
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cart_shippingmethod";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_shippingmethod_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_shippingmethod" (
    "id" int8 NOT NULL DEFAULT nextval('cart_shippingmethod_id_seq'::regclass),
    "image" varchar(100),
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cart_shippingmethod_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_shippingmethod_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_shippingmethod_translation" (
    "id" int8 NOT NULL DEFAULT nextval('cart_shippingmethod_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "title" varchar(255) NOT NULL,
    "description" text,
    "master_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cart_shippingmethodcountry";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_shippingmethodcountry_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_shippingmethodcountry" (
    "id" int8 NOT NULL DEFAULT nextval('cart_shippingmethodcountry_id_seq'::regclass),
    "price" numeric(10,2) NOT NULL,
    "is_active" bool NOT NULL,
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "country_id" varchar(2) NOT NULL,
    "currency_id" varchar(3) NOT NULL,
    "shipping_method_id" int8 NOT NULL,
    "vat_group_id" int8 NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cart_shippingmethodcountry_payment_methods";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cart_shippingmethodcountry_payment_methods_id_seq;

-- Table Definition
CREATE TABLE "public"."cart_shippingmethodcountry_payment_methods" (
    "id" int8 NOT NULL DEFAULT nextval('cart_shippingmethodcountry_payment_methods_id_seq'::regclass),
    "shippingmethodcountry_id" int8 NOT NULL,
    "paymentmethodcountry_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."category_category";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS category_category_id_seq;

-- Table Definition
CREATE TABLE "public"."category_category" (
    "id" int8 NOT NULL DEFAULT nextval('category_category_id_seq'::regclass),
    "lft" int4 NOT NULL CHECK (lft >= 0),
    "rght" int4 NOT NULL CHECK (rght >= 0),
    "tree_id" int4 NOT NULL CHECK (tree_id >= 0),
    "level" int4 NOT NULL CHECK (level >= 0),
    "parent_id" int8,
    "create_at" timestamptz NOT NULL,
    "published" bool NOT NULL,
    "update_at" timestamptz NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."category_category_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS category_category_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."category_category_translation" (
    "id" int8 NOT NULL DEFAULT nextval('category_category_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "title" varchar(200) NOT NULL,
    "meta_title" varchar(200) NOT NULL,
    "meta_description" text NOT NULL,
    "description" text,
    "slug" varchar(200) NOT NULL,
    "master_id" int8,
    "description_editorjs" jsonb,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_page";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_page_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_page" (
    "id" int8 NOT NULL DEFAULT nextval('cms_page_id_seq'::regclass),
    "published" bool NOT NULL,
    "ordering" int4 NOT NULL,
    "recommended" bool NOT NULL,
    "polymorphic_ctype_id" int4,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_page_categories";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_page_categories_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_page_categories" (
    "id" int8 NOT NULL DEFAULT nextval('cms_page_categories_id_seq'::regclass),
    "page_id" int8 NOT NULL,
    "pagecategory_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_pagecategory";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_pagecategory_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_pagecategory" (
    "id" int8 NOT NULL DEFAULT nextval('cms_pagecategory_id_seq'::regclass),
    "sort_order" int4,
    "published" bool NOT NULL,
    "code" varchar(20) NOT NULL,
    "ordering" int4 NOT NULL,
    "image" varchar(100),
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_pagecategory_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_pagecategory_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_pagecategory_translation" (
    "id" int8 NOT NULL DEFAULT nextval('cms_pagecategory_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "title" varchar(250) NOT NULL,
    "master_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_pagecategory_type";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_pagecategory_type_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_pagecategory_type" (
    "id" int8 NOT NULL DEFAULT nextval('cms_pagecategory_type_id_seq'::regclass),
    "pagecategory_id" int8 NOT NULL,
    "pagecategorytype_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_pagecategorytype";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_pagecategorytype_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_pagecategorytype" (
    "id" int8 NOT NULL DEFAULT nextval('cms_pagecategorytype_id_seq'::regclass),
    "identifier" varchar(100) NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_pagecms";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."cms_pagecms" (
    "page_ptr_id" int8 NOT NULL,
    PRIMARY KEY ("page_ptr_id")
);

DROP TABLE IF EXISTS "public"."cms_pagecms_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_pagecms_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_pagecms_translation" (
    "id" int8 NOT NULL DEFAULT nextval('cms_pagecms_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "slug" varchar(255) NOT NULL,
    "title" varchar(250) NOT NULL,
    "content" jsonb,
    "master_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."cms_pagefrontend";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."cms_pagefrontend" (
    "page_ptr_id" int8 NOT NULL,
    "frontend_path" varchar(250) NOT NULL,
    PRIMARY KEY ("page_ptr_id")
);

DROP TABLE IF EXISTS "public"."cms_pagefrontend_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS cms_pagefrontend_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."cms_pagefrontend_translation" (
    "id" int8 NOT NULL DEFAULT nextval('cms_pagefrontend_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "title" varchar(250) NOT NULL,
    "master_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."country_billinginfo";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS country_billingaddress_id_seq;

-- Table Definition
CREATE TABLE "public"."country_billinginfo" (
    "id" int8 NOT NULL DEFAULT nextval('country_billingaddress_id_seq'::regclass),
    "first_name" varchar(255) NOT NULL,
    "surname" varchar(255) NOT NULL,
    "street" varchar(255) NOT NULL,
    "city" varchar(255) NOT NULL,
    "postal_code" varchar(255) NOT NULL,
    "company_name" varchar(255),
    "company_id" varchar(255),
    "vat_number" varchar(255),
    "country_id" varchar(2) NOT NULL,
    "user_id" varchar(40),
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."country_country";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."country_country" (
    "code" varchar(2) NOT NULL,
    "name" varchar(200) NOT NULL,
    "locale" varchar(2) NOT NULL,
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "default_price_list_id" varchar(200),
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("code")
);

DROP TABLE IF EXISTS "public"."country_currency";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."country_currency" (
    "code" varchar(3) NOT NULL,
    "symbol" varchar(3) NOT NULL,
    "symbol_position" varchar(6) NOT NULL,
    "create_at" timestamptz NOT NULL,
    "update_at" timestamptz NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("code")
);

DROP TABLE IF EXISTS "public"."country_shippinginfo";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS country_shippingaddress_id_seq;

-- Table Definition
CREATE TABLE "public"."country_shippinginfo" (
    "id" int8 NOT NULL DEFAULT nextval('country_shippingaddress_id_seq'::regclass),
    "first_name" varchar(255) NOT NULL,
    "surname" varchar(255) NOT NULL,
    "street" varchar(255) NOT NULL,
    "city" varchar(255) NOT NULL,
    "postal_code" varchar(255) NOT NULL,
    "email" varchar(255),
    "phone" varchar(255),
    "additional_info" text,
    "country_id" varchar(2) NOT NULL,
    "user_id" varchar(40),
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."country_vatgroup";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS country_vatgroup_id_seq;

-- Table Definition
CREATE TABLE "public"."country_vatgroup" (
    "id" int8 NOT NULL DEFAULT nextval('country_vatgroup_id_seq'::regclass),
    "name" varchar(200) NOT NULL,
    "rate" numeric(5,2) NOT NULL,
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "country_id" varchar(2) NOT NULL,
    "is_default" bool NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."django_admin_log";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS django_admin_log_id_seq;

-- Table Definition
CREATE TABLE "public"."django_admin_log" (
    "id" int4 NOT NULL DEFAULT nextval('django_admin_log_id_seq'::regclass),
    "action_time" timestamptz NOT NULL,
    "object_id" text,
    "object_repr" varchar(200) NOT NULL,
    "action_flag" int2 NOT NULL CHECK (action_flag >= 0),
    "change_message" text NOT NULL,
    "content_type_id" int4,
    "user_id" varchar(40) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."django_content_type";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS django_content_type_id_seq;

-- Table Definition
CREATE TABLE "public"."django_content_type" (
    "id" int4 NOT NULL DEFAULT nextval('django_content_type_id_seq'::regclass),
    "app_label" varchar(100) NOT NULL,
    "model" varchar(100) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."django_migrations";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS django_migrations_id_seq;

-- Table Definition
CREATE TABLE "public"."django_migrations" (
    "id" int8 NOT NULL DEFAULT nextval('django_migrations_id_seq'::regclass),
    "app" varchar(255) NOT NULL,
    "name" varchar(255) NOT NULL,
    "applied" timestamptz NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."django_session";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."django_session" (
    "session_key" varchar(40) NOT NULL,
    "session_data" text NOT NULL,
    "expire_date" timestamptz NOT NULL,
    PRIMARY KEY ("session_key")
);

DROP TABLE IF EXISTS "public"."order_order";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."order_order" (
    "token" uuid NOT NULL,
    "create_at" timestamptz NOT NULL,
    "cart_id" uuid,
    "status" varchar(10) NOT NULL,
    "agreed_to_terms" bool NOT NULL,
    "marketing_flag" bool NOT NULL,
    "payment_id" varchar(100),
    PRIMARY KEY ("token")
);

DROP TABLE IF EXISTS "public"."product_attributetype";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_attributetype_id_seq;

-- Table Definition
CREATE TABLE "public"."product_attributetype" (
    "id" int8 NOT NULL DEFAULT nextval('product_attributetype_id_seq'::regclass),
    "type_name" varchar(200),
    "unit" varchar(200),
    "value_type" varchar(10) NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_attributetype_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_attributetype_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."product_attributetype_translation" (
    "id" int8 NOT NULL DEFAULT nextval('product_attributetype_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "name" varchar(200) NOT NULL,
    "master_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_baseattribute";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_baseattribute_id_seq;

-- Table Definition
CREATE TABLE "public"."product_baseattribute" (
    "id" int8 NOT NULL DEFAULT nextval('product_baseattribute_id_seq'::regclass),
    "value" varchar(200),
    "order" int4,
    "type_id" int8 NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_baseattribute_ext_attributes";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_baseattribute_ext_attributes_id_seq;

-- Table Definition
CREATE TABLE "public"."product_baseattribute_ext_attributes" (
    "id" int8 NOT NULL DEFAULT nextval('product_baseattribute_ext_attributes_id_seq'::regclass),
    "baseattribute_id" int8 NOT NULL,
    "extensionattribute_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_baseattribute_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_baseattribute_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."product_baseattribute_translation" (
    "id" int8 NOT NULL DEFAULT nextval('product_baseattribute_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "name" varchar(200) NOT NULL,
    "master_id" int8,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_extattributetype";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_extattributetype_id_seq;

-- Table Definition
CREATE TABLE "public"."product_extattributetype" (
    "id" int8 NOT NULL DEFAULT nextval('product_extattributetype_id_seq'::regclass),
    "type_name" varchar(200) NOT NULL,
    "unit" varchar(200),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_extensionattribute";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_extensionattribute_id_seq;

-- Table Definition
CREATE TABLE "public"."product_extensionattribute" (
    "id" int8 NOT NULL DEFAULT nextval('product_extensionattribute_id_seq'::regclass),
    "value" varchar(200) NOT NULL,
    "type_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_extensionattribute_ext_attributes";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_extensionattribute_ext_attributes_id_seq;

-- Table Definition
CREATE TABLE "public"."product_extensionattribute_ext_attributes" (
    "id" int8 NOT NULL DEFAULT nextval('product_extensionattribute_ext_attributes_id_seq'::regclass),
    "from_extensionattribute_id" int8 NOT NULL,
    "to_extensionattribute_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_pricelist";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."product_pricelist" (
    "code" varchar(200) NOT NULL,
    "rounding" bool NOT NULL,
    "currency_id" varchar(3) NOT NULL,
    "create_at" timestamptz NOT NULL,
    "update_at" timestamptz NOT NULL,
    "is_default" bool NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("code")
);

DROP TABLE IF EXISTS "public"."product_product";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_product_id_seq;

-- Table Definition
CREATE TABLE "public"."product_product" (
    "id" int8 NOT NULL DEFAULT nextval('product_product_id_seq'::regclass),
    "published" bool NOT NULL,
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "category_id" int8,
    "type_id" int8,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_product_product_variants";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_product_product_variants_id_seq;

-- Table Definition
CREATE TABLE "public"."product_product_product_variants" (
    "id" int8 NOT NULL DEFAULT nextval('product_product_product_variants_id_seq'::regclass),
    "product_id" int8 NOT NULL,
    "productvariant_id" varchar(255) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_product_translation";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_product_translation_id_seq;

-- Table Definition
CREATE TABLE "public"."product_product_translation" (
    "id" int8 NOT NULL DEFAULT nextval('product_product_translation_id_seq'::regclass),
    "language_code" varchar(15) NOT NULL,
    "title" varchar(200) NOT NULL,
    "meta_title" varchar(200) NOT NULL,
    "meta_description" text NOT NULL,
    "short_description" text,
    "description" text,
    "slug" varchar(200) NOT NULL,
    "master_id" int8,
    "description_editorjs" jsonb,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_productmedia";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_productmedia_id_seq;

-- Table Definition
CREATE TABLE "public"."product_productmedia" (
    "id" int8 NOT NULL DEFAULT nextval('product_productmedia_id_seq'::regclass),
    "sort_order" int4,
    "media" varchar(100) NOT NULL,
    "type" varchar(10) NOT NULL,
    "alt" varchar(128),
    "product_id" int8,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_productprice";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_productprice_id_seq;

-- Table Definition
CREATE TABLE "public"."product_productprice" (
    "id" int8 NOT NULL DEFAULT nextval('product_productprice_id_seq'::regclass),
    "price" numeric(10,2) NOT NULL,
    "price_list_id" varchar(200) NOT NULL,
    "product_variant_id" varchar(255),
    "create_at" timestamptz NOT NULL,
    "update_at" timestamptz NOT NULL,
    "discount" numeric(10,2),
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_producttype";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_producttype_id_seq;

-- Table Definition
CREATE TABLE "public"."product_producttype" (
    "id" int8 NOT NULL DEFAULT nextval('product_producttype_id_seq'::regclass),
    "name" varchar(200),
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_producttype_allowed_attribute_types";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_producttype_allowed_attribute_types_id_seq;

-- Table Definition
CREATE TABLE "public"."product_producttype_allowed_attribute_types" (
    "id" int8 NOT NULL DEFAULT nextval('product_producttype_allowed_attribute_types_id_seq'::regclass),
    "producttype_id" int8 NOT NULL,
    "attributetype_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_producttype_vat_groups";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_producttype_vat_groups_id_seq;

-- Table Definition
CREATE TABLE "public"."product_producttype_vat_groups" (
    "id" int8 NOT NULL DEFAULT nextval('product_producttype_vat_groups_id_seq'::regclass),
    "producttype_id" int8 NOT NULL,
    "vatgroup_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_productvariant";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."product_productvariant" (
    "sku" varchar(255) NOT NULL,
    "ean" varchar(13) NOT NULL,
    "weight" numeric(10,2),
    "update_at" timestamptz NOT NULL,
    "create_at" timestamptz NOT NULL,
    "stock_quantity" int4 NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("sku")
);

DROP TABLE IF EXISTS "public"."product_productvariant_attributes";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_productvariant_attributes_id_seq;

-- Table Definition
CREATE TABLE "public"."product_productvariant_attributes" (
    "id" int8 NOT NULL DEFAULT nextval('product_productvariant_attributes_id_seq'::regclass),
    "productvariant_id" varchar(255) NOT NULL,
    "baseattribute_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."product_productvariantmedia";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS product_productvariantmedia_id_seq;

-- Table Definition
CREATE TABLE "public"."product_productvariantmedia" (
    "id" int8 NOT NULL DEFAULT nextval('product_productvariantmedia_id_seq'::regclass),
    "media_id" int8 NOT NULL,
    "product_variant_id" varchar(255) NOT NULL,
    "safe_deleted" bool NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."review_review";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."review_review" (
    "token" uuid NOT NULL,
    "create_at" timestamptz NOT NULL,
    "rating" int4 NOT NULL,
    "comment" text NOT NULL,
    "order_id" uuid,
    "product_id" int8,
    "product_variant_id" varchar(255),
    "country" varchar(255),
    PRIMARY KEY ("token")
);

DROP TABLE IF EXISTS "public"."roles_managergroup";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."roles_managergroup" (
    "name" varchar(200) NOT NULL,
    "description" varchar(200) NOT NULL,
    PRIMARY KEY ("name")
);

DROP TABLE IF EXISTS "public"."roles_managergroup_permissions";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS roles_managergroup_permissions_id_seq;

-- Table Definition
CREATE TABLE "public"."roles_managergroup_permissions" (
    "id" int8 NOT NULL DEFAULT nextval('roles_managergroup_permissions_id_seq'::regclass),
    "managergroup_id" varchar(200) NOT NULL,
    "managerpermission_id" varchar(200) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."roles_managerpermission";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."roles_managerpermission" (
    "name" varchar(200) NOT NULL,
    "model" varchar(200) NOT NULL,
    "description" varchar(200) NOT NULL,
    "type" varchar(200) NOT NULL,
    PRIMARY KEY ("name")
);

DROP TABLE IF EXISTS "public"."token_blacklist_blacklistedtoken";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS token_blacklist_blacklistedtoken_id_seq;

-- Table Definition
CREATE TABLE "public"."token_blacklist_blacklistedtoken" (
    "id" int8 NOT NULL DEFAULT nextval('token_blacklist_blacklistedtoken_id_seq'::regclass),
    "blacklisted_at" timestamptz NOT NULL,
    "token_id" int8 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."token_blacklist_outstandingtoken";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS token_blacklist_outstandingtoken_id_seq;

-- Table Definition
CREATE TABLE "public"."token_blacklist_outstandingtoken" (
    "id" int8 NOT NULL DEFAULT nextval('token_blacklist_outstandingtoken_id_seq'::regclass),
    "token" text NOT NULL,
    "created_at" timestamptz,
    "expires_at" timestamptz NOT NULL,
    "user_id" varchar(40),
    "jti" varchar(255) NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."user_user";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."user_user" (
    "password" varchar(128) NOT NULL,
    "last_login" timestamptz,
    "email" varchar(40) NOT NULL,
    "first_name" varchar(40) NOT NULL,
    "last_name" varchar(40) NOT NULL,
    "birth_date" date,
    "is_active" bool NOT NULL,
    "is_admin" bool NOT NULL,
    "is_staff" bool NOT NULL,
    "is_superuser" bool NOT NULL,
    PRIMARY KEY ("email")
);

DROP TABLE IF EXISTS "public"."user_user_groups";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_user_groups_id_seq;

-- Table Definition
CREATE TABLE "public"."user_user_groups" (
    "id" int8 NOT NULL DEFAULT nextval('user_user_groups_id_seq'::regclass),
    "user_id" varchar(40) NOT NULL,
    "group_id" int4 NOT NULL,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."user_user_user_permissions";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS user_user_user_permissions_id_seq;

-- Table Definition
CREATE TABLE "public"."user_user_user_permissions" (
    "id" int8 NOT NULL DEFAULT nextval('user_user_user_permissions_id_seq'::regclass),
    "user_id" varchar(40) NOT NULL,
    "permission_id" int4 NOT NULL,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."auth_group" ("id", "name") VALUES
(1, 'Editor'),
(2, 'Copywriter'),
(3, 'UserManager');

INSERT INTO "public"."auth_group_permissions" ("id", "group_id", "permission_id") VALUES
(1, 1, 110),
(2, 1, 111),
(3, 1, 114),
(4, 1, 115),
(5, 1, 38),
(6, 1, 45),
(7, 1, 46),
(8, 1, 95),
(9, 1, 57),
(10, 1, 58),
(11, 1, 126),
(12, 1, 127),
(13, 1, 106),
(14, 1, 107),
(15, 1, 134),
(16, 1, 135),
(17, 1, 130),
(18, 1, 131),
(19, 1, 102),
(20, 1, 103),
(21, 2, 46),
(22, 2, 58),
(23, 2, 107),
(24, 2, 135),
(25, 3, 166),
(26, 3, 167);

INSERT INTO "public"."auth_permission" ("id", "name", "content_type_id", "codename") VALUES
(1, 'Can add log entry', 1, 'add_logentry'),
(2, 'Can change log entry', 1, 'change_logentry'),
(3, 'Can delete log entry', 1, 'delete_logentry'),
(4, 'Can view log entry', 1, 'view_logentry'),
(5, 'Can add permission', 2, 'add_permission'),
(6, 'Can change permission', 2, 'change_permission'),
(7, 'Can delete permission', 2, 'delete_permission'),
(8, 'Can view permission', 2, 'view_permission'),
(9, 'Can add group', 3, 'add_group'),
(10, 'Can change group', 3, 'change_group'),
(11, 'Can delete group', 3, 'delete_group'),
(12, 'Can view group', 3, 'view_group'),
(13, 'Can add Token', 4, 'add_token'),
(14, 'Can change Token', 4, 'change_token'),
(15, 'Can delete Token', 4, 'delete_token'),
(16, 'Can view Token', 4, 'view_token'),
(17, 'Can add token', 5, 'add_tokenproxy'),
(18, 'Can change token', 5, 'change_tokenproxy'),
(19, 'Can delete token', 5, 'delete_tokenproxy'),
(20, 'Can view token', 5, 'view_tokenproxy'),
(21, 'Can add shipping method', 7, 'add_shippingmethod'),
(22, 'Can change shipping method', 7, 'change_shippingmethod'),
(23, 'Can delete shipping method', 7, 'delete_shippingmethod'),
(24, 'Can view shipping method', 7, 'view_shippingmethod'),
(25, 'Can add shipping method country', 8, 'add_shippingmethodcountry'),
(26, 'Can change shipping method country', 8, 'change_shippingmethodcountry'),
(27, 'Can delete shipping method country', 8, 'delete_shippingmethodcountry'),
(28, 'Can view shipping method country', 8, 'view_shippingmethodcountry'),
(29, 'Can add payment method', 10, 'add_paymentmethod'),
(30, 'Can change payment method', 10, 'change_paymentmethod'),
(31, 'Can delete payment method', 10, 'delete_paymentmethod'),
(32, 'Can view payment method', 10, 'view_paymentmethod'),
(33, 'Can add payment method country', 11, 'add_paymentmethodcountry'),
(34, 'Can change payment method country', 11, 'change_paymentmethodcountry'),
(35, 'Can delete payment method country', 11, 'delete_paymentmethodcountry'),
(36, 'Can view payment method country', 11, 'view_paymentmethodcountry'),
(37, 'Can add cart', 12, 'add_cart'),
(38, 'Can change cart', 12, 'change_cart'),
(39, 'Can delete cart', 12, 'delete_cart'),
(40, 'Can view cart', 12, 'view_cart'),
(41, 'Can add cart item', 13, 'add_cartitem'),
(42, 'Can change cart item', 13, 'change_cartitem'),
(43, 'Can delete cart item', 13, 'delete_cartitem'),
(44, 'Can view cart item', 13, 'view_cartitem'),
(45, 'Can add category', 15, 'add_category'),
(46, 'Can change category', 15, 'change_category'),
(47, 'Can delete category', 15, 'delete_category'),
(48, 'Can view category', 15, 'view_category'),
(49, 'Can add Page category type', 16, 'add_pagecategorytype'),
(50, 'Can change Page category type', 16, 'change_pagecategorytype'),
(51, 'Can delete Page category type', 16, 'delete_pagecategorytype'),
(52, 'Can view Page category type', 16, 'view_pagecategorytype'),
(53, 'Can add Page Category', 18, 'add_pagecategory'),
(54, 'Can change Page Category', 18, 'change_pagecategory'),
(55, 'Can delete Page Category', 18, 'delete_pagecategory'),
(56, 'Can view Page Category', 18, 'view_pagecategory'),
(57, 'Can add page', 19, 'add_page'),
(58, 'Can change page', 19, 'change_page'),
(59, 'Can delete page', 19, 'delete_page'),
(60, 'Can view page', 19, 'view_page'),
(61, 'Can add PageCMS', 21, 'add_pagecms'),
(62, 'Can change PageCMS', 21, 'change_pagecms'),
(63, 'Can delete PageCMS', 21, 'delete_pagecms'),
(64, 'Can view PageCMS', 21, 'view_pagecms'),
(65, 'Can add PageFrontend', 23, 'add_pagefrontend'),
(66, 'Can change PageFrontend', 23, 'change_pagefrontend'),
(67, 'Can delete PageFrontend', 23, 'delete_pagefrontend'),
(68, 'Can view PageFrontend', 23, 'view_pagefrontend'),
(69, 'Can add content type', 24, 'add_contenttype'),
(70, 'Can change content type', 24, 'change_contenttype'),
(71, 'Can delete content type', 24, 'delete_contenttype'),
(72, 'Can view content type', 24, 'view_contenttype'),
(73, 'Can add Country', 25, 'add_country'),
(74, 'Can change Country', 25, 'change_country'),
(75, 'Can delete Country', 25, 'delete_country'),
(76, 'Can view Country', 25, 'view_country'),
(77, 'Can add Currency', 26, 'add_currency'),
(78, 'Can change Currency', 26, 'change_currency'),
(79, 'Can delete Currency', 26, 'delete_currency'),
(80, 'Can view Currency', 26, 'view_currency'),
(81, 'Can add VAT Group', 27, 'add_vatgroup'),
(82, 'Can change VAT Group', 27, 'change_vatgroup'),
(83, 'Can delete VAT Group', 27, 'delete_vatgroup'),
(84, 'Can view VAT Group', 27, 'view_vatgroup'),
(85, 'Can add Billing Address', 28, 'add_billinginfo'),
(86, 'Can change Billing Address', 28, 'change_billinginfo'),
(87, 'Can delete Billing Address', 28, 'delete_billinginfo'),
(88, 'Can view Billing Address', 28, 'view_billinginfo'),
(89, 'Can add Shipping Address', 29, 'add_shippinginfo'),
(90, 'Can change Shipping Address', 29, 'change_shippinginfo'),
(91, 'Can delete Shipping Address', 29, 'delete_shippinginfo'),
(92, 'Can view Shipping Address', 29, 'view_shippinginfo'),
(93, 'Access admin page', 30, 'view'),
(94, 'Can add order', 31, 'add_order'),
(95, 'Can change order', 31, 'change_order'),
(96, 'Can delete order', 31, 'delete_order'),
(97, 'Can view order', 31, 'view_order'),
(98, 'Can add product variant', 32, 'add_productvariant'),
(99, 'Can change product variant', 32, 'change_productvariant'),
(100, 'Can delete product variant', 32, 'delete_productvariant'),
(101, 'Can view product variant', 32, 'view_productvariant'),
(102, 'Can add product type', 33, 'add_producttype'),
(103, 'Can change product type', 33, 'change_producttype'),
(104, 'Can delete product type', 33, 'delete_producttype'),
(105, 'Can view product type', 33, 'view_producttype'),
(106, 'Can add product', 35, 'add_product'),
(107, 'Can change product', 35, 'change_product'),
(108, 'Can delete product', 35, 'delete_product'),
(109, 'Can view product', 35, 'view_product'),
(110, 'Can add attribute type', 37, 'add_attributetype'),
(111, 'Can change attribute type', 37, 'change_attributetype'),
(112, 'Can delete attribute type', 37, 'delete_attributetype'),
(113, 'Can view attribute type', 37, 'view_attributetype'),
(114, 'Can add base attribute', 39, 'add_baseattribute'),
(115, 'Can change base attribute', 39, 'change_baseattribute'),
(116, 'Can delete base attribute', 39, 'delete_baseattribute'),
(117, 'Can view base attribute', 39, 'view_baseattribute'),
(118, 'Can add ext attribute type', 40, 'add_extattributetype'),
(119, 'Can change ext attribute type', 40, 'change_extattributetype'),
(120, 'Can delete ext attribute type', 40, 'delete_extattributetype'),
(121, 'Can view ext attribute type', 40, 'view_extattributetype'),
(122, 'Can add extension attribute', 41, 'add_extensionattribute'),
(123, 'Can change extension attribute', 41, 'change_extensionattribute'),
(124, 'Can delete extension attribute', 41, 'delete_extensionattribute'),
(125, 'Can view extension attribute', 41, 'view_extensionattribute'),
(126, 'Can add price list', 42, 'add_pricelist'),
(127, 'Can change price list', 42, 'change_pricelist'),
(128, 'Can delete price list', 42, 'delete_pricelist'),
(129, 'Can view price list', 42, 'view_pricelist'),
(130, 'Can add product price', 43, 'add_productprice'),
(131, 'Can change product price', 43, 'change_productprice'),
(132, 'Can delete product price', 43, 'delete_productprice'),
(133, 'Can view product price', 43, 'view_productprice'),
(134, 'Can add product media', 44, 'add_productmedia'),
(135, 'Can change product media', 44, 'change_productmedia'),
(136, 'Can delete product media', 44, 'delete_productmedia'),
(137, 'Can view product media', 44, 'view_productmedia'),
(138, 'Can add product variant media', 45, 'add_productvariantmedia'),
(139, 'Can change product variant media', 45, 'change_productvariantmedia'),
(140, 'Can delete product variant media', 45, 'delete_productvariantmedia'),
(141, 'Can view product variant media', 45, 'view_productvariantmedia'),
(142, 'Can add review', 46, 'add_review'),
(143, 'Can change review', 46, 'change_review'),
(144, 'Can delete review', 46, 'delete_review'),
(145, 'Can view review', 46, 'view_review'),
(146, 'Can add manager permission', 47, 'add_managerpermission'),
(147, 'Can change manager permission', 47, 'change_managerpermission'),
(148, 'Can delete manager permission', 47, 'delete_managerpermission'),
(149, 'Can view manager permission', 47, 'view_managerpermission'),
(150, 'Can add manager group', 48, 'add_managergroup'),
(151, 'Can change manager group', 48, 'change_managergroup'),
(152, 'Can delete manager group', 48, 'delete_managergroup'),
(153, 'Can view manager group', 48, 'view_managergroup'),
(154, 'Can add session', 49, 'add_session'),
(155, 'Can change session', 49, 'change_session'),
(156, 'Can delete session', 49, 'delete_session'),
(157, 'Can view session', 49, 'view_session'),
(158, 'Can add outstanding token', 50, 'add_outstandingtoken'),
(159, 'Can change outstanding token', 50, 'change_outstandingtoken'),
(160, 'Can delete outstanding token', 50, 'delete_outstandingtoken'),
(161, 'Can view outstanding token', 50, 'view_outstandingtoken'),
(162, 'Can add blacklisted token', 51, 'add_blacklistedtoken'),
(163, 'Can change blacklisted token', 51, 'change_blacklistedtoken'),
(164, 'Can delete blacklisted token', 51, 'delete_blacklistedtoken'),
(165, 'Can view blacklisted token', 51, 'view_blacklistedtoken'),
(166, 'Can add user', 52, 'add_user'),
(167, 'Can change user', 52, 'change_user'),
(168, 'Can delete user', 52, 'delete_user'),
(169, 'Can view user', 52, 'view_user');

INSERT INTO "public"."cart_paymentmethod" ("id", "image", "update_at", "create_at", "safe_deleted") VALUES
(1, '', '2023-07-07 07:37:13.917893+00', '2023-07-07 07:34:55.724067+00', 'f'),
(2, '', '2023-07-07 07:42:04.825276+00', '2023-07-07 07:37:17.523842+00', 'f'),
(3, '', '2023-07-07 07:44:45.222701+00', '2023-07-07 07:44:08.535449+00', 'f');

INSERT INTO "public"."cart_paymentmethod_translation" ("id", "language_code", "title", "description", "master_id") VALUES
(1, 'en', 'Cash on delivery', 'You''ll pay to the courier by cash or by card.', 1),
(2, 'cs', 'Dobírka', 'Zaplatíte hotově při doručení.', 1),
(3, 'en', 'Bank transfer', NULL, 2),
(4, 'cs', 'Platba převodem', NULL, 2),
(5, 'en', 'Online payment', 'You''ll pay via online payment gateway.', 3),
(6, 'cs', 'Platba online', 'Zaplatíte online v platební bráně.', 3);

INSERT INTO "public"."cart_paymentmethodcountry" ("id", "price", "is_active", "update_at", "create_at", "country_id", "currency_id", "payment_method_id", "vat_group_id", "api_request", "safe_deleted") VALUES
(1, 20.00, 't', '2023-07-07 07:35:42.187675+00', '2023-07-07 07:35:42.187695+00', 'CZ', 'CZK', 1, 1, NULL, 'f'),
(2, 1.00, 't', '2023-07-07 07:35:58.286691+00', '2023-07-07 07:35:58.286716+00', 'SK', 'EUR', 1, 3, NULL, 'f'),
(3, 4.00, 't', '2023-07-07 07:36:58.513677+00', '2023-07-07 07:36:58.513701+00', 'PL', 'PLN', 1, 7, NULL, 'f'),
(4, 0.00, 't', '2023-07-07 07:38:17.054577+00', '2023-07-07 07:38:17.054617+00', 'SK', 'EUR', 2, 3, 'BANKTRANSFER_EUR', 'f'),
(5, 0.00, 't', '2023-07-07 07:38:33.17811+00', '2023-07-07 07:38:33.178168+00', 'CZ', 'CZK', 2, 1, 'BANKTRANSFER_CZK', 'f'),
(6, 0.00, 't', '2023-07-07 07:39:03.469923+00', '2023-07-07 07:39:03.469971+00', 'DE', 'EUR', 2, 5, 'BANKTRANSFER_EUR', 'f'),
(7, 0.00, 't', '2023-07-07 07:39:18.341524+00', '2023-07-07 07:39:18.341548+00', 'AT', 'EUR', 2, 5, 'BANKTRANSFER_EUR', 'f'),
(8, 0.00, 't', '2023-07-07 07:39:30.421062+00', '2023-07-07 07:39:30.421084+00', 'SI', 'EUR', 2, 11, 'BANKTRANSFER_EUR', 'f'),
(9, 0.00, 't', '2023-07-07 07:39:44.01318+00', '2023-07-07 07:39:44.013241+00', 'BE', 'EUR', 2, 13, 'BANKTRANSFER_EUR', 'f'),
(10, 0.00, 't', '2023-07-07 07:39:58.253309+00', '2023-07-07 07:39:58.253342+00', 'DK', 'EUR', 2, 15, 'BANKTRANSFER_EUR', 'f'),
(11, 0.00, 't', '2023-07-07 07:40:14.171436+00', '2023-07-07 07:40:14.171459+00', 'EE', 'EUR', 2, 16, 'BANKTRANSFER_EUR', 'f'),
(12, 0.00, 't', '2023-07-07 07:40:31.252012+00', '2023-07-07 07:40:31.252063+00', 'FI', 'EUR', 2, 18, 'BANKTRANSFER_EUR', 'f'),
(13, 0.00, 't', '2023-07-07 07:40:43.196521+00', '2023-07-07 07:40:43.196542+00', 'FR', 'EUR', 2, 24, 'BANKTRANSFER_EUR', 'f'),
(14, 0.00, 't', '2023-07-07 07:41:04.615614+00', '2023-07-07 07:41:04.61566+00', 'HR', 'EUR', 2, 21, 'BANKTRANSFER_EUR', 'f'),
(15, 0.00, 't', '2023-07-07 07:41:16.275984+00', '2023-07-07 07:41:16.276006+00', 'NL', 'EUR', 2, 23, 'BANKTRANSFER_EUR', 'f'),
(16, 0.00, 't', '2023-07-07 07:41:27.731963+00', '2023-07-07 07:41:27.731985+00', 'SE', 'EUR', 2, 26, 'BANKTRANSFER_EUR', 'f'),
(17, 0.00, 't', '2023-07-07 07:42:04.204036+00', '2023-07-07 07:42:04.204085+00', 'PL', 'PLN', 2, 7, 'BANKTRANSFER_PLN', 'f'),
(18, 0.00, 't', '2023-07-07 07:38:17.054577+00', '2023-07-07 07:38:17.054617+00', 'SK', 'EUR', 3, 3, 'TEST_API', 'f'),
(19, 0.00, 't', '2023-07-07 07:38:33.17811+00', '2023-07-07 07:38:33.178168+00', 'CZ', 'CZK', 3, 1, 'TEST_API', 'f'),
(20, 0.00, 't', '2023-07-07 07:39:03.469923+00', '2023-07-07 07:39:03.469971+00', 'DE', 'EUR', 3, 5, 'TEST_API', 'f'),
(21, 0.00, 't', '2023-07-07 07:39:18.341524+00', '2023-07-07 07:39:18.341548+00', 'AT', 'EUR', 3, 5, 'TEST_API', 'f'),
(22, 0.00, 't', '2023-07-07 07:39:30.421062+00', '2023-07-07 07:39:30.421084+00', 'SI', 'EUR', 3, 11, 'TEST_API', 'f'),
(23, 0.00, 't', '2023-07-07 07:39:44.01318+00', '2023-07-07 07:39:44.013241+00', 'BE', 'EUR', 3, 13, 'TEST_API', 'f'),
(24, 0.00, 't', '2023-07-07 07:39:58.253309+00', '2023-07-07 07:39:58.253342+00', 'DK', 'EUR', 3, 15, 'TEST_API', 'f'),
(25, 0.00, 't', '2023-07-07 07:40:14.171436+00', '2023-07-07 07:40:14.171459+00', 'EE', 'EUR', 3, 16, 'TEST_API', 'f'),
(26, 0.00, 't', '2023-07-07 07:40:31.252012+00', '2023-07-07 07:40:31.252063+00', 'FI', 'EUR', 3, 18, 'TEST_API', 'f'),
(27, 0.00, 't', '2023-07-07 07:40:43.196521+00', '2023-07-07 07:40:43.196542+00', 'FR', 'EUR', 3, 24, 'TEST_API', 'f'),
(28, 0.00, 't', '2023-07-07 07:41:04.615614+00', '2023-07-07 07:41:04.61566+00', 'HR', 'EUR', 3, 21, 'TEST_API', 'f'),
(29, 0.00, 't', '2023-07-07 07:41:16.275984+00', '2023-07-07 07:41:16.276006+00', 'NL', 'EUR', 3, 23, 'TEST_API', 'f'),
(30, 0.00, 't', '2023-07-07 07:41:27.731963+00', '2023-07-07 07:41:27.731985+00', 'SE', 'EUR', 3, 26, 'TEST_API', 'f'),
(31, 0.00, 't', '2023-07-07 07:42:04.204036+00', '2023-07-07 07:42:04.204085+00', 'PL', 'PLN', 3, 7, 'TEST_API', 'f');

INSERT INTO "public"."cart_shippingmethod" ("id", "image", "update_at", "create_at", "safe_deleted") VALUES
(1, '', '2023-07-07 09:21:55.395014+00', '2023-07-07 07:26:48.518684+00', 'f'),
(2, '', '2023-07-07 08:01:02.209433+00', '2023-07-07 07:32:27.758993+00', 'f');

INSERT INTO "public"."cart_shippingmethod_translation" ("id", "language_code", "title", "description", "master_id") VALUES
(1, 'en', 'Express shipping', 'Delivered by courier providing express shipping.', 1),
(2, 'cs', 'Rychlé doručení', NULL, 1),
(3, 'en', 'Standard shipping', 'Delivered by your local post office.', 2),
(4, 'cs', 'Standardní doprava', 'Doručení lokální poštou.', 2);

INSERT INTO "public"."cart_shippingmethodcountry" ("id", "price", "is_active", "update_at", "create_at", "country_id", "currency_id", "shipping_method_id", "vat_group_id", "safe_deleted") VALUES
(1, 50.00, 't', '2023-07-07 07:54:29.200368+00', '2023-07-07 07:54:29.200392+00', 'CZ', 'CZK', 2, 1, 'f'),
(2, 2.00, 't', '2023-07-07 07:54:47.848744+00', '2023-07-07 07:54:47.848768+00', 'SK', 'EUR', 2, 3, 'f'),
(3, 10.00, 't', '2023-07-07 07:55:26.319502+00', '2023-07-07 07:55:26.319529+00', 'PL', 'PLN', 2, 7, 'f'),
(4, 2.00, 't', '2023-07-07 07:55:44.65883+00', '2023-07-07 07:55:44.658851+00', 'DE', 'EUR', 2, 5, 'f'),
(5, 2.00, 't', '2023-07-07 07:55:58.458023+00', '2023-07-07 07:55:58.458047+00', 'AT', 'EUR', 2, 9, 'f'),
(6, 2.00, 't', '2023-07-07 07:56:15.39668+00', '2023-07-07 07:56:15.396707+00', 'SI', 'EUR', 2, 11, 'f'),
(7, 2.00, 't', '2023-07-07 07:56:30.092547+00', '2023-07-07 07:56:30.092568+00', 'BE', 'EUR', 2, 13, 'f'),
(8, 2.00, 't', '2023-07-07 07:56:45.652363+00', '2023-07-07 07:56:45.652426+00', 'DK', 'EUR', 2, 15, 'f'),
(9, 2.00, 't', '2023-07-07 07:56:56.794065+00', '2023-07-07 07:56:56.794087+00', 'EE', 'EUR', 2, 16, 'f'),
(10, 2.00, 't', '2023-07-07 07:57:10.194307+00', '2023-07-07 07:57:10.194328+00', 'FI', 'EUR', 2, 18, 'f'),
(11, 2.00, 't', '2023-07-07 07:57:24.49231+00', '2023-07-07 07:57:24.492338+00', 'FR', 'EUR', 2, 24, 'f'),
(12, 2.00, 't', '2023-07-07 08:00:19.932878+00', '2023-07-07 08:00:19.932925+00', 'HR', 'EUR', 2, 21, 'f'),
(13, 2.00, 't', '2023-07-07 08:00:33.186956+00', '2023-07-07 08:00:33.186979+00', 'NL', 'EUR', 2, 23, 'f'),
(14, 3.00, 't', '2023-07-07 08:01:01.539504+00', '2023-07-07 08:00:48.381962+00', 'SE', 'EUR', 2, 26, 'f'),
(15, 100.00, 't', '2023-07-07 09:13:37.707166+00', '2023-07-07 09:13:37.707222+00', 'CZ', 'CZK', 1, 1, 'f'),
(16, 5.00, 't', '2023-07-07 09:18:09.274356+00', '2023-07-07 09:18:09.274401+00', 'AT', 'EUR', 1, 9, 'f'),
(17, 5.00, 't', '2023-07-07 09:18:20.874174+00', '2023-07-07 09:18:20.874216+00', 'BE', 'EUR', 1, 13, 'f'),
(18, 5.00, 't', '2023-07-07 09:18:34.155642+00', '2023-07-07 09:18:34.155676+00', 'DE', 'EUR', 1, 5, 'f'),
(19, 5.00, 't', '2023-07-07 09:19:46.224704+00', '2023-07-07 09:18:47.904136+00', 'DK', 'EUR', 1, 15, 'f'),
(20, 5.00, 't', '2023-07-07 09:19:00.376715+00', '2023-07-07 09:19:00.376754+00', 'EE', 'CZK', 1, 16, 'f'),
(21, 5.00, 't', '2023-07-07 09:19:13.307577+00', '2023-07-07 09:19:13.307597+00', 'FI', 'EUR', 1, 18, 'f'),
(22, 5.00, 't', '2023-07-07 09:19:32.992364+00', '2023-07-07 09:19:32.992386+00', 'FR', 'EUR', 1, 24, 'f'),
(23, 5.00, 't', '2023-07-07 09:20:05.422923+00', '2023-07-07 09:20:05.422949+00', 'HR', 'EUR', 1, 21, 'f'),
(24, 5.00, 't', '2023-07-07 09:20:19.061668+00', '2023-07-07 09:20:19.06169+00', 'NL', 'EUR', 1, 23, 'f'),
(25, 20.00, 't', '2023-07-07 09:21:54.778994+00', '2023-07-07 09:20:35.808044+00', 'PL', 'PLN', 1, 7, 'f'),
(26, 5.00, 't', '2023-07-07 09:20:49.181154+00', '2023-07-07 09:20:49.181175+00', 'SE', 'EUR', 1, 25, 'f'),
(27, 5.00, 't', '2023-07-07 09:21:13.084474+00', '2023-07-07 09:21:13.084498+00', 'SI', 'EUR', 1, 11, 'f'),
(28, 4.00, 't', '2023-07-07 09:21:30.75465+00', '2023-07-07 09:21:30.754674+00', 'SK', 'EUR', 1, 3, 'f');

INSERT INTO "public"."cart_shippingmethodcountry_payment_methods" ("id", "shippingmethodcountry_id", "paymentmethodcountry_id") VALUES
(5, 1, 1),
(6, 1, 19),
(7, 1, 5),
(8, 2, 2),
(9, 2, 18),
(10, 2, 4),
(11, 3, 17),
(12, 3, 3),
(13, 3, 31),
(14, 4, 20),
(15, 4, 6),
(16, 5, 21),
(17, 5, 7),
(18, 6, 8),
(19, 6, 22),
(20, 7, 9),
(21, 7, 23),
(22, 8, 24),
(23, 8, 10),
(24, 9, 25),
(25, 9, 11),
(26, 10, 26),
(27, 10, 12),
(28, 11, 27),
(29, 11, 13),
(30, 12, 28),
(31, 12, 14),
(32, 13, 29),
(33, 13, 15),
(34, 14, 16),
(35, 14, 30),
(36, 15, 19),
(37, 15, 5),
(38, 16, 21),
(39, 16, 7),
(40, 17, 9),
(41, 17, 23),
(42, 18, 20),
(43, 18, 6),
(44, 19, 24),
(45, 19, 10),
(46, 20, 25),
(47, 20, 11),
(48, 21, 26),
(49, 21, 12),
(50, 22, 27),
(51, 22, 13),
(52, 23, 28),
(53, 23, 14),
(54, 24, 29),
(55, 24, 15),
(56, 25, 17),
(57, 25, 31),
(58, 26, 16),
(59, 26, 30),
(60, 27, 8),
(61, 27, 22),
(62, 28, 18),
(63, 28, 4);

INSERT INTO "public"."category_category" ("id", "lft", "rght", "tree_id", "level", "parent_id", "create_at", "published", "update_at", "safe_deleted") VALUES
(2, 1, 8, 1, 0, NULL, '2023-07-08 13:21:09.29009+00', 't', '2023-07-08 13:24:37.153948+00', 'f'),
(3, 2, 3, 1, 1, 2, '2023-07-08 13:22:25.942316+00', 't', '2023-07-08 13:25:10.273405+00', 'f'),
(4, 4, 5, 1, 1, 2, '2023-07-08 13:23:30.875518+00', 't', '2023-07-08 13:25:47.706598+00', 'f'),
(5, 6, 7, 1, 1, 2, '2023-07-08 13:23:41.68401+00', 't', '2023-07-08 13:25:35.727527+00', 'f');

INSERT INTO "public"."category_category_translation" ("id", "language_code", "title", "meta_title", "meta_description", "description", "slug", "master_id", "description_editorjs") VALUES
(3, 'en', 'Entertainment', 'Entertainment - products', 'Immerse yourself in a world of endless entertainment possibilities as you explore our carefully curated selection.', '', 'entertainment', 2, '{"time": 1688822442429, "blocks": [{"id": "D48CBYJh-n", "data": {"text": "Immerse yourself in a world of endless entertainment possibilities as you explore our carefully curated selection. From critically acclaimed films that will transport you to new dimensions, to bestselling books that will ignite your imagination, and thrilling games that will challenge and delight you, our entertainment category has something for everyone. Get ready to embark on unforgettable adventures, discover new stories, and unleash your inner entertainment enthusiast. Start browsing now and let the magic of entertainment sweep you away!"}, "type": "paragraph"}], "version": "2.26.5"}'),
(4, 'cs', 'Zábava', 'Zábava - produkty', 'Ponořte se do světa nekonečných možností zábavy, když prozkoumáte naši pečlivě vybranou nabídku.', '', 'zabava', 2, '{"time": 1688822468439, "blocks": [{"id": "-AZiiw7Frt", "data": {"text": "Ponořte se do světa nekonečných možností zábavy, když prozkoumáte naši pečlivě vybranou nabídku. Od kriticky uznávaných filmů, které vás přenesou do nových dimenzí, po bestsellery knih, které rozdmýchají vaši představivost, a napínavé hry, které vás budou vyzývat a potěšit, naše kategorie zábavy má něco pro každého. Připravte se na nezapomenutelná dobrodružství, objevte nové příběhy a propusťte svého vnitřního nadšence pro zábavu. Začněte prohlížet nyní a nechte kouzlo zábavy se nad vámi rozprostřít!"}, "type": "paragraph"}], "version": "2.26.5"}'),
(5, 'en', 'Movies', 'Movies - category', 'From action-packed adventures to heartwrenching dramas, and from clever comedies to epic fantasy films - we offer a wide selection of movies to please every film enthusiast.', '', 'movies', 3, '{"time": 1688822540276, "blocks": [{"id": "STTRt8QkXS", "data": {"text": "From action-packed adventures to heartwrenching dramas, and from clever comedies to epic fantasy films - we offer a wide selection of movies to please every film enthusiast. Disconnect from reality and get swept away in stories filled with emotions, suspense, and unforgettable performances. Browse through our collection and discover the latest releases, classics, and hidden gems of the cinematic world. Get ready for an unforgettable movie experience!"}, "type": "paragraph"}], "version": "2.26.5"}'),
(6, 'cs', 'Filmy', 'Filmy - kategorie', 'Od akčních dobrodružství po srdcervoucí drama a od chytrých komedií po epické fantasy filmy - u nás najdete široký výběr filmů, které potěší každého filmového nadšence.', '', 'filmy', 3, '{"time": 1688822544753, "blocks": [{"id": "vbi0zIIw9Z", "data": {"text": "Od akčních dobrodružství po srdcervoucí drama a od chytrých komedií po epické fantasy filmy - u nás najdete široký výběr filmů, které potěší každého filmového nadšence. Odpojte se od reality a nechte se unést do příběhů plných emocí, napětí a nezapomenutelných herectví. Procházejte naši kolekci a objevte nejnovější filmy, klasiky i skryté poklady filmového světa. Připravte se na nezapomenutelnou filmovou zábavu!"}, "type": "paragraph"}], "version": "2.26.5"}'),
(7, 'en', 'Books', 'Books - products', '', '', 'books', 4, '{}'),
(8, 'cs', 'Knihy', 'Knihy - produkty', '', '', 'knihy', 4, '{}'),
(9, 'en', 'Games', 'Games - products', '', '', 'games', 5, '{}'),
(10, 'cs', 'Hry', 'Hry - produkty', '', '', 'hry', 5, '{}');

INSERT INTO "public"."country_country" ("code", "name", "locale", "update_at", "create_at", "default_price_list_id", "safe_deleted") VALUES
('AT', 'Austria', 'at', '2023-07-07 07:00:09.167457+00', '2023-07-07 07:00:09.167484+00', 'EUR_retail', 'f'),
('BE', 'Belgium', 'en', '2023-07-07 07:08:59.611139+00', '2023-07-07 07:08:59.611173+00', 'EUR_retail', 'f'),
('CZ', 'Česká republika', 'cs', '2023-07-07 06:59:21.808902+00', '2023-07-07 06:59:21.808928+00', 'CZK_retail', 'f'),
('DE', 'Germany', 'en', '2023-07-07 06:59:59.517269+00', '2023-07-07 06:59:59.517291+00', 'EUR_retail', 'f'),
('DK', 'Denmark', 'en', '2023-07-07 07:09:22.203234+00', '2023-07-07 07:09:22.20326+00', 'EUR_retail', 'f'),
('EE', 'Estonia', 'en', '2023-07-07 07:09:52.927645+00', '2023-07-07 07:09:52.92768+00', 'EUR_retail', 'f'),
('FI', 'Finland', 'en', '2023-07-07 07:10:07.559091+00', '2023-07-07 07:10:07.559116+00', 'EUR_retail', 'f'),
('FR', 'France', 'en', '2023-07-07 07:10:24.432263+00', '2023-07-07 07:10:24.432299+00', 'EUR_retail', 'f'),
('HR', 'Croatia', 'en', '2023-07-07 07:11:03.714417+00', '2023-07-07 07:11:03.714438+00', 'EUR_retail', 'f'),
('NL', 'Netherlands', 'en', '2023-07-07 07:11:24.720606+00', '2023-07-07 07:11:24.720639+00', 'EUR_retail', 'f'),
('PL', 'Poland', 'en', '2023-07-07 06:59:51.318575+00', '2023-07-07 06:59:51.318617+00', 'PLN_retail', 'f'),
('SE', 'Sweden', 'en', '2023-07-07 07:11:49.660239+00', '2023-07-07 07:11:49.660275+00', 'EUR_retail', 'f'),
('SI', 'Slovenia', 'en', '2023-07-07 07:07:33.669586+00', '2023-07-07 07:07:33.669618+00', 'EUR_retail', 'f'),
('SK', 'Slovenská republika', 'cs', '2023-07-07 06:59:30.941559+00', '2023-07-07 06:59:30.94159+00', 'EUR_retail', 'f');

INSERT INTO "public"."country_currency" ("code", "symbol", "symbol_position", "create_at", "update_at", "safe_deleted") VALUES
('CZK', 'Kč', 'AFTER', '2023-07-07 06:56:39.285199+00', '2023-07-07 06:56:39.285142+00', 'f'),
('EUR', '€', 'AFTER', '2023-07-07 06:56:43.001655+00', '2023-07-07 06:56:43.001622+00', 'f'),
('PLN', 'zł', 'AFTER', '2023-07-07 06:56:58.658177+00', '2023-07-07 06:56:58.658152+00', 'f');

INSERT INTO "public"."country_vatgroup" ("id", "name", "rate", "update_at", "create_at", "country_id", "is_default", "safe_deleted") VALUES
(1, 'CZ_STANDARD', 21.00, '2023-07-07 07:01:20.844611+00', '2023-07-07 07:01:20.844663+00', 'CZ', 't', 'f'),
(2, 'CZ_REDUCED', 12.00, '2023-07-07 07:01:35.459376+00', '2023-07-07 07:01:35.459406+00', 'CZ', 'f', 'f'),
(3, 'SK_STANDARD', 20.00, '2023-07-07 07:01:46.144468+00', '2023-07-07 07:01:46.144514+00', 'SK', 't', 'f'),
(4, 'SK_REDUCED', 10.00, '2023-07-07 07:01:59.863046+00', '2023-07-07 07:01:59.863077+00', 'SK', 'f', 'f'),
(5, 'DE_STANDARD', 19.00, '2023-07-07 07:02:15.217332+00', '2023-07-07 07:02:15.217386+00', 'DE', 't', 'f'),
(6, 'DE_REDUCED', 7.00, '2023-07-07 07:02:22.617971+00', '2023-07-07 07:02:22.617996+00', 'DE', 'f', 'f'),
(7, 'PL_STANDARD', 23.00, '2023-07-07 07:02:38.033133+00', '2023-07-07 07:02:38.033204+00', 'PL', 't', 'f'),
(8, 'PL_REDUCED', 8.00, '2023-07-07 07:02:47.170898+00', '2023-07-07 07:02:47.170936+00', 'PL', 'f', 'f'),
(9, 'AT_STANDARD', 20.00, '2023-07-07 07:03:05.280238+00', '2023-07-07 07:03:05.280285+00', 'AT', 't', 'f'),
(10, 'AT_REDUCED', 10.00, '2023-07-07 07:03:18.36658+00', '2023-07-07 07:03:18.366609+00', 'AT', 'f', 'f'),
(11, 'SI_STANDARD', 22.00, '2023-07-07 07:07:53.230994+00', '2023-07-07 07:07:53.231015+00', 'SI', 't', 'f'),
(12, 'SI_REDUCED', 9.50, '2023-07-07 07:08:05.540849+00', '2023-07-07 07:08:05.54087+00', 'SI', 'f', 'f'),
(13, 'BE_STANDARD', 21.00, '2023-07-07 07:12:59.055038+00', '2023-07-07 07:12:59.055066+00', 'BE', 't', 'f'),
(14, 'BE_REDUCED', 6.00, '2023-07-07 07:13:08.338184+00', '2023-07-07 07:13:08.338208+00', 'BE', 'f', 'f'),
(15, 'DK', 25.00, '2023-07-07 07:14:14.442632+00', '2023-07-07 07:14:11.928843+00', 'DK', 't', 'f'),
(16, 'EE_STANDARD', 20.00, '2023-07-07 07:15:03.510764+00', '2023-07-07 07:15:03.5108+00', 'EE', 't', 'f'),
(17, 'EE_REDUCED', 9.00, '2023-07-07 07:15:17.560144+00', '2023-07-07 07:15:17.560164+00', 'EE', 'f', 'f'),
(18, 'FI_STANDARD', 24.00, '2023-07-07 07:15:29.896528+00', '2023-07-07 07:15:29.89655+00', 'FI', 't', 'f'),
(19, 'FI_REDUCED', 14.00, '2023-07-07 07:15:41.183339+00', '2023-07-07 07:15:41.183362+00', 'FI', 'f', 'f'),
(20, 'FR_REDUCED', 10.00, '2023-07-07 07:20:46.48122+00', '2023-07-07 07:15:57.645654+00', 'FR', 'f', 'f'),
(21, 'HR_STANDARD', 25.00, '2023-07-07 07:17:29.101042+00', '2023-07-07 07:17:29.101078+00', 'HR', 't', 'f'),
(22, 'HR_REDUCED', 10.00, '2023-07-07 07:18:12.308818+00', '2023-07-07 07:18:12.308859+00', 'HR', 'f', 'f'),
(23, 'NL_STANDARD', 21.00, '2023-07-07 07:21:26.831405+00', '2023-07-07 07:20:36.589869+00', 'NL', 't', 'f'),
(24, 'FR_STANDARD', 20.00, '2023-07-07 07:21:02.706847+00', '2023-07-07 07:21:02.70687+00', 'FR', 't', 'f'),
(25, 'NL_REDUCED', 6.00, '2023-07-07 07:21:30.620663+00', '2023-07-07 07:21:19.729105+00', 'NL', 'f', 'f'),
(26, 'SE_STANDARD', 25.00, '2023-07-07 07:21:43.303598+00', '2023-07-07 07:21:43.303642+00', 'SE', 't', 'f'),
(27, 'SE_STANDARD', 12.00, '2023-07-07 07:22:16.536773+00', '2023-07-07 07:22:16.536802+00', 'SE', 'f', 'f');

INSERT INTO "public"."django_content_type" ("id", "app_label", "model") VALUES
(1, 'admin', 'logentry'),
(2, 'auth', 'permission'),
(3, 'auth', 'group'),
(4, 'authtoken', 'token'),
(5, 'authtoken', 'tokenproxy'),
(6, 'cart', 'shippingmethodtranslation'),
(7, 'cart', 'shippingmethod'),
(8, 'cart', 'shippingmethodcountry'),
(9, 'cart', 'paymentmethodtranslation'),
(10, 'cart', 'paymentmethod'),
(11, 'cart', 'paymentmethodcountry'),
(12, 'cart', 'cart'),
(13, 'cart', 'cartitem'),
(14, 'category', 'categorytranslation'),
(15, 'category', 'category'),
(16, 'cms', 'pagecategorytype'),
(17, 'cms', 'pagecategorytranslation'),
(18, 'cms', 'pagecategory'),
(19, 'cms', 'page'),
(20, 'cms', 'pagecmstranslation'),
(21, 'cms', 'pagecms'),
(22, 'cms', 'pagefrontendtranslation'),
(23, 'cms', 'pagefrontend'),
(24, 'contenttypes', 'contenttype'),
(25, 'country', 'country'),
(26, 'country', 'currency'),
(27, 'country', 'vatgroup'),
(28, 'country', 'billinginfo'),
(29, 'country', 'shippinginfo'),
(30, 'django_rq', 'queue'),
(31, 'order', 'order'),
(32, 'product', 'productvariant'),
(33, 'product', 'producttype'),
(34, 'product', 'producttranslation'),
(35, 'product', 'product'),
(36, 'product', 'attributetypetranslation'),
(37, 'product', 'attributetype'),
(38, 'product', 'baseattributetranslation'),
(39, 'product', 'baseattribute'),
(40, 'product', 'extattributetype'),
(41, 'product', 'extensionattribute'),
(42, 'product', 'pricelist'),
(43, 'product', 'productprice'),
(44, 'product', 'productmedia'),
(45, 'product', 'productvariantmedia'),
(46, 'review', 'review'),
(47, 'roles', 'managerpermission'),
(48, 'roles', 'managergroup'),
(49, 'sessions', 'session'),
(50, 'token_blacklist', 'outstandingtoken'),
(51, 'token_blacklist', 'blacklistedtoken'),
(52, 'user', 'user');

INSERT INTO "public"."django_migrations" ("id", "app", "name", "applied") VALUES
(1, 'product', '0001_initial', '2023-07-06 22:00:34.867343+00'),
(2, 'category', '0001_initial', '2023-07-06 22:00:34.923243+00'),
(3, 'category', '0002_category_create_at_category_published_and_more', '2023-07-06 22:00:34.943469+00'),
(4, 'product', '0002_product_category', '2023-07-06 22:00:34.953509+00'),
(5, 'product', '0003_remove_product_product_variants_and_more', '2023-07-06 22:00:34.959789+00'),
(6, 'product', '0004_productvariant', '2023-07-06 22:00:34.988207+00'),
(7, 'product', '0005_product_product_variants', '2023-07-06 22:00:35.017265+00'),
(8, 'country', '0001_initial', '2023-07-06 22:00:35.027599+00'),
(9, 'cart', '0001_initial', '2023-07-06 22:00:35.076974+00'),
(10, 'user', '0001_initial', '2023-07-06 22:00:35.155012+00'),
(11, 'contenttypes', '0001_initial', '2023-07-06 22:00:35.168892+00'),
(12, 'admin', '0001_initial', '2023-07-06 22:00:35.203974+00'),
(13, 'admin', '0002_logentry_remove_auto_add', '2023-07-06 22:00:35.207298+00'),
(14, 'admin', '0003_logentry_add_action_flag_choices', '2023-07-06 22:00:35.21126+00'),
(15, 'contenttypes', '0002_remove_content_type_name', '2023-07-06 22:00:35.219595+00'),
(16, 'auth', '0001_initial', '2023-07-06 22:00:35.293634+00'),
(17, 'auth', '0002_alter_permission_name_max_length', '2023-07-06 22:00:35.300603+00'),
(18, 'auth', '0003_alter_user_email_max_length', '2023-07-06 22:00:35.303778+00'),
(19, 'auth', '0004_alter_user_username_opts', '2023-07-06 22:00:35.308133+00'),
(20, 'auth', '0005_alter_user_last_login_null', '2023-07-06 22:00:35.312313+00'),
(21, 'auth', '0006_require_contenttypes_0002', '2023-07-06 22:00:35.314001+00'),
(22, 'auth', '0007_alter_validators_add_error_messages', '2023-07-06 22:00:35.317143+00'),
(23, 'auth', '0008_alter_user_username_max_length', '2023-07-06 22:00:35.320005+00'),
(24, 'auth', '0009_alter_user_last_name_max_length', '2023-07-06 22:00:35.322961+00'),
(25, 'auth', '0010_alter_group_name_max_length', '2023-07-06 22:00:35.331633+00'),
(26, 'auth', '0011_update_proxy_permissions', '2023-07-06 22:00:35.338642+00'),
(27, 'auth', '0012_alter_user_first_name_max_length', '2023-07-06 22:00:35.343089+00'),
(28, 'authtoken', '0001_initial', '2023-07-06 22:00:35.369279+00'),
(29, 'authtoken', '0002_auto_20160226_1747', '2023-07-06 22:00:35.382066+00'),
(30, 'authtoken', '0003_tokenproxy', '2023-07-06 22:00:35.384037+00'),
(31, 'product', '0006_attributetype_baseattribute_attributeclothes_and_more', '2023-07-06 22:00:35.444458+00'),
(32, 'product', '0007_extattributetype_extensionattribute_and_more', '2023-07-06 22:00:35.580462+00'),
(33, 'product', '0008_alter_extensionattribute_ext_attributes', '2023-07-06 22:00:35.594004+00'),
(34, 'product', '0009_currency_price_pricelist', '2023-07-06 22:00:35.628623+00'),
(35, 'country', '0002_currency_pricelist', '2023-07-06 22:00:35.661036+00'),
(36, 'product', '0010_productprice_delete_currency_delete_price_and_more', '2023-07-06 22:00:35.717089+00'),
(37, 'country', '0003_remove_pricelist_currency', '2023-07-06 22:00:35.746348+00'),
(38, 'product', '0011_pricelist_alter_productprice_price_list', '2023-07-06 22:00:35.795988+00'),
(39, 'product', '0012_alter_baseattribute_ext_attributes', '2023-07-06 22:00:35.83745+00'),
(40, 'product', '0013_productprice_create_at_productprice_update_at', '2023-07-06 22:00:35.84655+00'),
(41, 'product', '0014_pricelist_create_at_pricelist_update_at', '2023-07-06 22:00:35.851491+00'),
(42, 'product', '0015_productmedia_alter_baseattribute_type_and_more', '2023-07-06 22:00:35.9422+00'),
(43, 'product', '0016_producttype_product_type', '2023-07-06 22:00:36.014115+00'),
(44, 'product', '0017_alter_product_category_and_more', '2023-07-06 22:00:36.042823+00'),
(45, 'product', '0018_alter_producttype_name', '2023-07-06 22:00:36.047882+00'),
(46, 'product', '0016_alter_productmedia_media', '2023-07-06 22:00:36.053529+00'),
(47, 'product', '0017_alter_productmedia_product', '2023-07-06 22:00:36.070443+00'),
(48, 'product', '0019_merge_20230402_0614', '2023-07-06 22:00:36.071978+00'),
(49, 'product', '0020_alter_productmedia_media', '2023-07-06 22:00:36.077835+00'),
(50, 'product', '0021_alter_product_id', '2023-07-06 22:00:36.08889+00'),
(51, 'product', '0022_alter_attributetype_type_name', '2023-07-06 22:00:36.099689+00'),
(52, 'product', '0023_alter_baseattribute_value', '2023-07-06 22:00:36.111136+00'),
(53, 'product', '0024_producttranslation_description_editorjs', '2023-07-06 22:00:36.11684+00'),
(54, 'product', '0025_attributetype_value_type', '2023-07-06 22:00:36.120411+00'),
(55, 'product', '0026_pricelist_is_default', '2023-07-06 22:00:36.129006+00'),
(56, 'product', '0027_alter_pricelist_is_default', '2023-07-06 22:00:36.133703+00'),
(57, 'product', '0028_productvariant_availability', '2023-07-06 22:00:36.141973+00'),
(58, 'product', '0029_rename_availability_productvariant_stock_quantity', '2023-07-06 22:00:36.15314+00'),
(59, 'country', '0004_delete_pricelist', '2023-07-06 22:00:36.155687+00'),
(60, 'country', '0005_currency_create_at_currency_update_at', '2023-07-06 22:00:36.167101+00'),
(61, 'country', '0006_country_default_price_list', '2023-07-06 22:00:36.186726+00'),
(62, 'country', '0007_alter_country_options_alter_currency_options_and_more', '2023-07-06 22:00:36.192252+00'),
(63, 'product', '0030_producttypevatgroup', '2023-07-06 22:00:36.227664+00'),
(64, 'product', '0031_alter_producttypevatgroup_product_type', '2023-07-06 22:00:36.274959+00'),
(65, 'product', '0032_remove_pricelist_includes_vat', '2023-07-06 22:00:36.279202+00'),
(66, 'country', '0008_vatgroup', '2023-07-06 22:00:36.300614+00'),
(67, 'product', '0033_remove_producttypevatgroup_vat_and_more', '2023-07-06 22:00:36.320831+00'),
(68, 'country', '0009_vatgroup_country', '2023-07-06 22:00:36.344877+00'),
(69, 'product', '0034_producttype_vat_groups_delete_producttypevatgroup', '2023-07-06 22:00:36.395465+00'),
(70, 'product', '0035_productprice_discount', '2023-07-06 22:00:36.400721+00'),
(71, 'country', '0010_alter_vatgroup_name', '2023-07-06 22:00:36.414788+00'),
(72, 'country', '0011_alter_vatgroup_rate', '2023-07-06 22:00:36.431774+00'),
(73, 'country', '0012_vatgroup_is_default', '2023-07-06 22:00:36.438581+00'),
(74, 'country', '0013_address', '2023-07-06 22:00:36.4754+00'),
(75, 'cart', '0002_remove_cartitem_create_at_remove_cartitem_product_and_more', '2023-07-06 22:00:36.499321+00'),
(76, 'cart', '0003_cart_user', '2023-07-06 22:00:36.521247+00'),
(77, 'cart', '0004_paymentmethod_shippingmethod_shippingmethodcountry_and_more', '2023-07-06 22:00:36.73585+00'),
(78, 'cart', '0005_rename_name_paymentmethodtranslation_title_and_more', '2023-07-06 22:00:36.742765+00'),
(79, 'cart', '0006_alter_paymentmethod_image_alter_shippingmethod_image', '2023-07-06 22:00:36.757339+00'),
(80, 'cart', '0007_alter_paymentmethod_image_alter_shippingmethod_image', '2023-07-06 22:00:36.772303+00'),
(81, 'cart', '0008_alter_shippingmethod_image', '2023-07-06 22:00:36.777103+00'),
(82, 'cart', '0009_alter_shippingmethod_image', '2023-07-06 22:00:36.817664+00'),
(83, 'cart', '0010_rename_price_gross_paymentmethodcountry_price_and_more', '2023-07-06 22:00:36.828976+00'),
(84, 'cart', '0011_alter_shippingmethodcountry_payment_methods', '2023-07-06 22:00:36.859002+00'),
(85, 'cart', '0012_cart_billing_address', '2023-07-06 22:00:36.879626+00'),
(86, 'cart', '0013_cart_shipping_address_alter_cart_billing_address', '2023-07-06 22:00:36.911955+00'),
(87, 'cart', '0014_alter_cart_billing_address_and_more', '2023-07-06 22:00:36.936826+00'),
(88, 'cart', '0015_cart_payment_method_country_and_more', '2023-07-06 22:00:36.973956+00'),
(89, 'cart', '0016_rename_shippping_method_country_cart_shipping_method_country', '2023-07-06 22:00:36.990348+00'),
(90, 'cart', '0017_alter_cart_token', '2023-07-06 22:00:37.004451+00'),
(91, 'cart', '0018_cartitem_product', '2023-07-06 22:00:37.023639+00'),
(92, 'cart', '0019_cartitem_discount', '2023-07-06 22:00:37.032924+00'),
(93, 'country', '0014_billingaddress_shippingaddress_and_more', '2023-07-06 22:00:37.07822+00'),
(94, 'cart', '0018_alter_cart_billing_address_and_more', '2023-07-06 22:00:37.121039+00'),
(95, 'cart', '0020_merge_20230516_1846', '2023-07-06 22:00:37.122782+00'),
(96, 'cart', '0021_cart_pricelist', '2023-07-06 22:00:37.183183+00'),
(97, 'cart', '0022_rename_billing_address_cart_billing_info_and_more', '2023-07-06 22:00:37.206742+00'),
(98, 'cart', '0023_shippingmethodcountry_api_request', '2023-07-06 22:00:37.213649+00'),
(99, 'cart', '0024_remove_shippingmethodcountry_api_request_and_more', '2023-07-06 22:00:37.223821+00'),
(100, 'cart', '0025_paymentmethod_safe_deleted_and_more', '2023-07-06 22:00:37.240066+00'),
(101, 'cart', '0026_rename_unit_price_gross_cartitem_unit_price_incl_vat_and_more', '2023-07-06 22:00:37.257585+00'),
(102, 'category', '0003_categorytranslation_description_editorjs', '2023-07-06 22:00:37.262195+00'),
(103, 'category', '0004_alter_category_managers_category_safe_deleted', '2023-07-06 22:00:37.268361+00'),
(104, 'cms', '0001_initial', '2023-07-06 22:00:37.509082+00'),
(105, 'cms', '0002_pagefrontend_frontend_path', '2023-07-06 22:00:37.514508+00'),
(106, 'cms', '0003_alter_pagecategory_code', '2023-07-06 22:00:37.530307+00'),
(107, 'cms', '0004_alter_pagecategory_type', '2023-07-06 22:00:37.546579+00'),
(108, 'cms', '0005_alter_pagecategory_code', '2023-07-06 22:00:37.565507+00'),
(109, 'cms', '0006_pagecategory_safe_deleted_and_more', '2023-07-06 22:00:37.578879+00'),
(110, 'cms', '0007_alter_page_options_remove_pagecms_safe_deleted_and_more', '2023-07-06 22:00:37.631437+00'),
(111, 'cms', '0008_alter_page_options_remove_page_safe_deleted', '2023-07-06 22:00:37.639838+00'),
(112, 'cms', '0009_pagecms_safe_deleted_pagefrontend_safe_deleted', '2023-07-06 22:00:37.648092+00'),
(113, 'cms', '0010_remove_pagecms_safe_deleted_and_more', '2023-07-06 22:00:37.659607+00'),
(114, 'country', '0015_delete_address_shippingaddress_country_and_more', '2023-07-06 22:00:37.7621+00'),
(115, 'country', '0016_alter_billingaddress_user_alter_shippingaddress_user', '2023-07-06 22:00:37.807157+00'),
(116, 'country', '0017_rename_billingaddress_billinginfo_and_more', '2023-07-06 22:00:37.863898+00'),
(117, 'country', '0018_billinginfo_safe_deleted_country_safe_deleted_and_more', '2023-07-06 22:00:37.889058+00'),
(118, 'django_rq', '0001_initial', '2023-07-06 22:00:37.891912+00'),
(119, 'order', '0001_initial', '2023-07-06 22:00:37.96167+00'),
(120, 'order', '0002_rename_order_id_order_token', '2023-07-06 22:00:37.968523+00'),
(121, 'order', '0003_remove_order_paid_order_status', '2023-07-06 22:00:37.979265+00'),
(122, 'order', '0004_order_agreed_to_terms_order_marketing_flag', '2023-07-06 22:00:37.992042+00'),
(123, 'order', '0005_order_payment_id', '2023-07-06 22:00:37.999336+00'),
(124, 'product', '0036_translatableattributetype_translatablebaseattribute_and_more', '2023-07-06 22:00:38.083808+00'),
(125, 'product', '0037_remove_baseattribute_ext_attributes_and_more', '2023-07-06 22:00:38.188164+00'),
(126, 'product', '0038_attributetype_baseattribute_and_more', '2023-07-06 22:00:38.514306+00'),
(127, 'product', '0039_testmodel_testmodeltranslation', '2023-07-06 22:00:38.549626+00'),
(128, 'product', '0040_testmodel_safe_deleted', '2023-07-06 22:00:38.552885+00'),
(129, 'product', '0041_alter_testmodel_managers', '2023-07-06 22:00:38.555558+00'),
(130, 'product', '0042_alter_testmodel_managers_delete_testmodeltranslation', '2023-07-06 22:00:38.559174+00'),
(131, 'product', '0043_testmodeltranslation', '2023-07-06 22:00:38.599096+00'),
(132, 'product', '0044_alter_testmodeltranslation_unique_together_and_more', '2023-07-06 22:00:38.609273+00'),
(133, 'product', '0045_attributetype_safe_deleted_and_more', '2023-07-06 22:00:38.687273+00'),
(134, 'review', '0001_initial', '2023-07-06 22:00:38.733485+00'),
(135, 'review', '0002_review_product_variant', '2023-07-06 22:00:38.761437+00'),
(136, 'review', '0003_review_country', '2023-07-06 22:00:38.769222+00'),
(137, 'roles', '0001_initial', '2023-07-06 22:00:38.828594+00'),
(138, 'sessions', '0001_initial', '2023-07-06 22:00:38.850018+00'),
(139, 'token_blacklist', '0001_initial', '2023-07-06 22:00:38.927125+00'),
(140, 'token_blacklist', '0002_outstandingtoken_jti_hex', '2023-07-06 22:00:38.933879+00'),
(141, 'token_blacklist', '0003_auto_20171017_2007', '2023-07-06 22:00:38.996758+00'),
(142, 'token_blacklist', '0004_auto_20171017_2013', '2023-07-06 22:00:39.012219+00'),
(143, 'token_blacklist', '0005_remove_outstandingtoken_jti', '2023-07-06 22:00:39.018427+00'),
(144, 'token_blacklist', '0006_auto_20171017_2113', '2023-07-06 22:00:39.026239+00'),
(145, 'token_blacklist', '0007_auto_20171017_2214', '2023-07-06 22:00:39.056181+00'),
(146, 'token_blacklist', '0008_migrate_to_bigautofield', '2023-07-06 22:00:39.141425+00'),
(147, 'token_blacklist', '0010_fix_migrate_to_bigautofield', '2023-07-06 22:00:39.197877+00'),
(148, 'token_blacklist', '0011_linearizes_history', '2023-07-06 22:00:39.201878+00'),
(149, 'token_blacklist', '0012_alter_outstandingtoken_user', '2023-07-06 22:00:39.221429+00'),
(150, 'user', '0002_auto_20230316_1534', '2023-07-06 22:00:40.269444+00'),
(151, 'user', '0003_remove_permissionrole_permissions_and_more', '2023-07-06 22:00:40.340569+00'),
(152, 'user', '0004_user_groups_user_is_superuser_user_user_permissions', '2023-07-06 22:00:40.458435+00'),
(153, 'user', '0005_alter_user_cart', '2023-07-06 22:00:40.486089+00'),
(154, 'user', '0006_alter_user_cart', '2023-07-06 22:00:40.516693+00'),
(155, 'user', '0007_remove_user_cart', '2023-07-06 22:00:40.538755+00'),
(156, 'user', '0008_user_is_superuser', '2023-07-06 22:00:40.548968+00');

INSERT INTO "public"."product_attributetype" ("id", "type_name", "unit", "value_type", "safe_deleted") VALUES
(1, 'GENRE', NULL, 'TEXT', 'f'),
(2, 'LENGTH', 'm', 'TEXT', 'f'),
(3, 'RESOLUTION', 'p', 'INTEGER', 'f'),
(4, 'LANGUAGE', NULL, 'TEXT', 'f');

INSERT INTO "public"."product_attributetype_translation" ("id", "language_code", "name", "master_id") VALUES
(1, 'en', 'Genre', 1),
(2, 'cs', 'Žánr', 1),
(3, 'en', 'Length', 2),
(4, 'cs', 'Délka', 2),
(5, 'en', 'Resolution', 3),
(6, 'cs', 'Rozlišení', 3),
(7, 'en', 'Language', 4),
(8, 'cs', 'Jazyk', 4);

INSERT INTO "public"."product_baseattribute" ("id", "value", "order", "type_id", "safe_deleted") VALUES
(1, 'SUB60', NULL, 2, 'f'),
(2, '6090', NULL, 2, 'f'),
(3, '90120', NULL, 2, 'f'),
(4, '120PLUS', NULL, 2, 'f'),
(5, '720', NULL, 3, 'f'),
(6, '1080', NULL, 3, 'f'),
(7, 'CS', NULL, 4, 'f'),
(8, 'EN', NULL, 4, 'f');

INSERT INTO "public"."product_baseattribute_translation" ("id", "language_code", "name", "master_id") VALUES
(1, 'en', '< 60', 1),
(2, 'cs', '< 60', 1),
(3, 'en', '60 - 90', 2),
(4, 'cs', '60 - 90', 2),
(5, 'en', '90 - 120', 3),
(6, 'cs', '90 - 120', 3),
(7, 'en', '120+', 4),
(8, 'cs', '120+', 4),
(9, 'en', '', 5),
(10, 'cs', '', 5),
(11, 'en', '', 6),
(12, 'cs', '', 6),
(13, 'en', 'Czech', 7),
(14, 'cs', 'Čeština', 7),
(15, 'en', 'English', 8),
(16, 'cs', 'Angličtina', 8);

INSERT INTO "public"."product_pricelist" ("code", "rounding", "currency_id", "create_at", "update_at", "is_default", "safe_deleted") VALUES
('CZK_retail', 't', 'CZK', '2023-07-07 06:58:38.137769+00', '2023-07-07 06:58:38.137736+00', 't', 'f'),
('EUR_retail', 'f', 'EUR', '2023-07-07 06:58:53.21463+00', '2023-07-07 06:58:53.214601+00', 'f', 'f'),
('PLN_retail', 'f', 'PLN', '2023-07-07 06:59:00.070375+00', '2023-07-07 06:59:00.070352+00', 'f', 'f');

INSERT INTO "public"."product_product" ("id", "published", "update_at", "create_at", "category_id", "type_id", "safe_deleted") VALUES
(1, 't', '2023-07-08 21:09:40.028531+00', '2023-07-08 21:07:24.760882+00', 4, 2, 'f');

INSERT INTO "public"."product_product_product_variants" ("id", "product_id", "productvariant_id") VALUES
(1, 1, '978-80-7390-220-9-en'),
(2, 1, '978-80-7390-220-9-cs');

INSERT INTO "public"."product_product_translation" ("id", "language_code", "title", "meta_title", "meta_description", "short_description", "description", "slug", "master_id", "description_editorjs") VALUES
(1, 'en', 'The Little Prince - Antoine de Saint-Exupéry', 'The Little Prince - Antoine de Saint-Exupéry', 'A pilot stranded in the desert awakes one morning to see, standing before him, the most extraordinary little fellow.', NULL, NULL, 'the-little-prince-antoine-de-saint-exupery', 1, '{"time": 1688850414591, "blocks": [{"id": "DBgKz5qVHq", "data": {"text": "A pilot stranded in the desert awakes one morning to see, standing before him, the most extraordinary little fellow. \"Please,\" asks the stranger, \"draw me a sheep.\" And the pilot realizes that when life''s events are too difficult to understand, there is no choice but to succumb to their mysteries. He pulls out pencil and paper... And thus begins this wise and enchanting fable that, in teaching the secret of what is really important in life, has changed forever the world for its readers."}, "type": "paragraph"}], "version": "2.26.5"}'),
(2, 'cs', 'Malý Princ - Antoine de Saint-Exupéry', 'Malý Princ - Antoine de Saint-Exupéry', 'Havárie letadla donutí vypravěče příběhu, který je zároveň autorovým alter egem, k přistání uprostřed pouště.', NULL, NULL, 'maly-princ-antoine-de-saint-exupery', 1, '{"time": 1688850406876, "blocks": [{"id": "GXo0mbBxE6", "data": {"text": "Havárie letadla donutí vypravěče příběhu, který je zároveň autorovým alter egem, k přistání uprostřed pouště. Má zásobu pitné vody sotva na týden, a proto musí opravit motor pokud možno co nejrychleji. Prvního dne ulehne unaven po celodenní práci a za úsvitu, stále tisíc kilometrů od nejbližšího lidského obydlí, ho probudí zvláštní hlásek, který ho žádá, aby nakreslil beránka... Alegorická pohádka pro děti i pro dospělé, kteří přemýšlí o ztraceném mládí a hledají životní moudrost, patří mezi nejvýznamnější díla svého druhu."}, "type": "paragraph"}], "version": "2.26.5"}');

INSERT INTO "public"."product_productmedia" ("id", "sort_order", "media", "type", "alt", "product_id", "safe_deleted") VALUES
(1, 0, 'product_media/1/image/4845cce1-d75f-48ce-8178-98044562d904.jpg', 'IMAGE', NULL, 1, 'f');

INSERT INTO "public"."product_productprice" ("id", "price", "price_list_id", "product_variant_id", "create_at", "update_at", "discount", "safe_deleted") VALUES
(1, 169.00, 'CZK_retail', '978-80-7390-220-9-en', '2023-07-08 21:09:26.079069+00', '2023-07-08 21:09:39.77352+00', NULL, 'f'),
(2, 6.75, 'EUR_retail', '978-80-7390-220-9-en', '2023-07-08 21:09:26.102378+00', '2023-07-08 21:09:39.78651+00', NULL, 'f'),
(3, 33.80, 'PLN_retail', '978-80-7390-220-9-en', '2023-07-08 21:09:26.123802+00', '2023-07-08 21:09:39.798025+00', NULL, 'f'),
(4, 129.00, 'CZK_retail', '978-80-7390-220-9-cs', '2023-07-08 21:09:26.154529+00', '2023-07-08 21:09:39.820998+00', NULL, 'f'),
(5, 5.70, 'EUR_retail', '978-80-7390-220-9-cs', '2023-07-08 21:09:26.173638+00', '2023-07-08 21:09:39.832397+00', NULL, 'f'),
(6, 25.80, 'PLN_retail', '978-80-7390-220-9-cs', '2023-07-08 21:09:26.192784+00', '2023-07-08 21:09:39.843638+00', NULL, 'f');

INSERT INTO "public"."product_producttype" ("id", "name", "update_at", "create_at", "safe_deleted") VALUES
(1, 'Test', '2023-07-07 06:47:39.880219+00', '2023-07-07 06:47:25.108776+00', 'f'),
(2, 'Book', '2023-07-08 15:38:26.815234+00', '2023-07-08 15:38:04.945991+00', 'f'),
(3, 'Movie', '2023-07-08 15:38:52.345224+00', '2023-07-08 15:38:32.98268+00', 'f');

INSERT INTO "public"."product_producttype_allowed_attribute_types" ("id", "producttype_id", "attributetype_id") VALUES
(1, 2, 1),
(2, 2, 4),
(3, 3, 1),
(4, 3, 2),
(5, 3, 3),
(6, 3, 4);

INSERT INTO "public"."product_producttype_vat_groups" ("id", "producttype_id", "vatgroup_id") VALUES
(1, 2, 1),
(2, 2, 3),
(3, 2, 5),
(4, 2, 7),
(5, 2, 9),
(6, 2, 11),
(7, 2, 13),
(8, 2, 15),
(9, 2, 16),
(10, 2, 18),
(11, 2, 20),
(12, 2, 21),
(13, 2, 23),
(14, 2, 26),
(15, 3, 1),
(16, 3, 3),
(17, 3, 5),
(18, 3, 7),
(19, 3, 9),
(20, 3, 11),
(21, 3, 13),
(22, 3, 15),
(23, 3, 16),
(24, 3, 18),
(25, 3, 20),
(26, 3, 21),
(27, 3, 23),
(28, 3, 26);

INSERT INTO "public"."product_productvariant" ("sku", "ean", "weight", "update_at", "create_at", "stock_quantity", "safe_deleted") VALUES
('978-80-7390-220-9-cs', '', 115.00, '2023-07-08 21:09:39.809647+00', '2023-07-08 21:08:11.892106+00', 140, 'f'),
('978-80-7390-220-9-en', '', 115.00, '2023-07-08 21:09:39.755139+00', '2023-07-08 21:07:50.982518+00', 40, 'f');

INSERT INTO "public"."product_productvariant_attributes" ("id", "productvariant_id", "baseattribute_id") VALUES
(1, '978-80-7390-220-9-en', 8),
(2, '978-80-7390-220-9-cs', 7);

INSERT INTO "public"."roles_managergroup" ("name", "description") VALUES
('Copywriter', 'Copywriter role'),
('Editor', 'Editor role'),
('UserManager', 'User manager role');

INSERT INTO "public"."roles_managergroup_permissions" ("id", "managergroup_id", "managerpermission_id") VALUES
(1, 'Editor', 'cart_change_permission'),
(2, 'Editor', 'order_change_permission'),
(3, 'Editor', 'productprice_change_permission'),
(4, 'Editor', 'productprice_add_permission'),
(5, 'Editor', 'productmedia_change_permission'),
(6, 'Editor', 'productmedia_add_permission'),
(7, 'Editor', 'product_change_permission'),
(8, 'Editor', 'product_add_permission'),
(9, 'Editor', 'category_change_permission'),
(10, 'Editor', 'category_add_permission'),
(11, 'Editor', 'page_change_permission'),
(12, 'Editor', 'page_add_permission'),
(13, 'Editor', 'producttype_change_permission'),
(14, 'Editor', 'producttype_add_permission'),
(15, 'Editor', 'pricelist_change_permission'),
(16, 'Editor', 'pricelist_add_permission'),
(17, 'Editor', 'attributetype_change_permission'),
(18, 'Editor', 'attributetype_add_permission'),
(19, 'Editor', 'baseattribute_change_permission'),
(20, 'Editor', 'baseattribute_add_permission'),
(21, 'Editor', 'review_change_permission'),
(22, 'Copywriter', 'page_change_permission'),
(23, 'Copywriter', 'product_change_permission'),
(24, 'Copywriter', 'productmedia_change_permission'),
(25, 'Copywriter', 'category_change_permission'),
(26, 'UserManager', 'user_add_permission'),
(27, 'UserManager', 'user_change_permission');

INSERT INTO "public"."roles_managerpermission" ("name", "model", "description", "type") VALUES
('attributetype_add_permission', 'attributetype', 'Can add attribute type', 'add'),
('attributetype_change_permission', 'attributetype', 'Can change attribute type', 'change'),
('attributetype_delete_permission', 'attributetype', 'Can delete attribute type', 'delete'),
('attributetype_view_permission', 'attributetype', 'Can view attribute type', 'view'),
('baseattribute_add_permission', 'baseattribute', 'Can add base attribute', 'add'),
('baseattribute_change_permission', 'baseattribute', 'Can change base attribute', 'change'),
('baseattribute_delete_permission', 'baseattribute', 'Can delete base attribute', 'delete'),
('baseattribute_view_permission', 'baseattribute', 'Can view base attribute', 'view'),
('billinginfo_add_permission', 'billinginfo', 'Can add Billing Address', 'add'),
('billinginfo_change_permission', 'billinginfo', 'Can change Billing Address', 'change'),
('billinginfo_delete_permission', 'billinginfo', 'Can delete Billing Address', 'delete'),
('billinginfo_view_permission', 'billinginfo', 'Can view Billing Address', 'view'),
('blacklistedtoken_add_permission', 'blacklistedtoken', 'Can add blacklisted token', 'add'),
('blacklistedtoken_change_permission', 'blacklistedtoken', 'Can change blacklisted token', 'change'),
('blacklistedtoken_delete_permission', 'blacklistedtoken', 'Can delete blacklisted token', 'delete'),
('blacklistedtoken_view_permission', 'blacklistedtoken', 'Can view blacklisted token', 'view'),
('cart_add_permission', 'cart', 'Can add cart', 'add'),
('cart_change_permission', 'cart', 'Can change cart', 'change'),
('cart_delete_permission', 'cart', 'Can delete cart', 'delete'),
('cart_view_permission', 'cart', 'Can view cart', 'view'),
('cartitem_add_permission', 'cartitem', 'Can add cart item', 'add'),
('cartitem_change_permission', 'cartitem', 'Can change cart item', 'change'),
('cartitem_delete_permission', 'cartitem', 'Can delete cart item', 'delete'),
('cartitem_view_permission', 'cartitem', 'Can view cart item', 'view'),
('category_add_permission', 'category', 'Can add category', 'add'),
('category_change_permission', 'category', 'Can change category', 'change'),
('category_delete_permission', 'category', 'Can delete category', 'delete'),
('category_view_permission', 'category', 'Can view category', 'view'),
('contenttype_add_permission', 'contenttype', 'Can add content type', 'add'),
('contenttype_change_permission', 'contenttype', 'Can change content type', 'change'),
('contenttype_delete_permission', 'contenttype', 'Can delete content type', 'delete'),
('contenttype_view_permission', 'contenttype', 'Can view content type', 'view'),
('country_add_permission', 'country', 'Can add Country', 'add'),
('country_change_permission', 'country', 'Can change Country', 'change'),
('country_delete_permission', 'country', 'Can delete Country', 'delete'),
('country_view_permission', 'country', 'Can view Country', 'view'),
('currency_add_permission', 'currency', 'Can add Currency', 'add'),
('currency_change_permission', 'currency', 'Can change Currency', 'change'),
('currency_delete_permission', 'currency', 'Can delete Currency', 'delete'),
('currency_view_permission', 'currency', 'Can view Currency', 'view'),
('extattributetype_add_permission', 'extattributetype', 'Can add ext attribute type', 'add'),
('extattributetype_change_permission', 'extattributetype', 'Can change ext attribute type', 'change'),
('extattributetype_delete_permission', 'extattributetype', 'Can delete ext attribute type', 'delete'),
('extattributetype_view_permission', 'extattributetype', 'Can view ext attribute type', 'view'),
('extensionattribute_add_permission', 'extensionattribute', 'Can add extension attribute', 'add'),
('extensionattribute_change_permission', 'extensionattribute', 'Can change extension attribute', 'change'),
('extensionattribute_delete_permission', 'extensionattribute', 'Can delete extension attribute', 'delete'),
('extensionattribute_view_permission', 'extensionattribute', 'Can view extension attribute', 'view'),
('group_add_permission', 'group', 'Can add group', 'add'),
('group_change_permission', 'group', 'Can change group', 'change'),
('group_delete_permission', 'group', 'Can delete group', 'delete'),
('group_view_permission', 'group', 'Can view group', 'view'),
('logentry_add_permission', 'logentry', 'Can add log entry', 'add'),
('logentry_change_permission', 'logentry', 'Can change log entry', 'change'),
('logentry_delete_permission', 'logentry', 'Can delete log entry', 'delete'),
('logentry_view_permission', 'logentry', 'Can view log entry', 'view'),
('managergroup_add_permission', 'managergroup', 'Can add manager group', 'add'),
('managergroup_change_permission', 'managergroup', 'Can change manager group', 'change'),
('managergroup_delete_permission', 'managergroup', 'Can delete manager group', 'delete'),
('managergroup_view_permission', 'managergroup', 'Can view manager group', 'view'),
('managerpermission_add_permission', 'managerpermission', 'Can add manager permission', 'add'),
('managerpermission_change_permission', 'managerpermission', 'Can change manager permission', 'change'),
('managerpermission_delete_permission', 'managerpermission', 'Can delete manager permission', 'delete'),
('managerpermission_view_permission', 'managerpermission', 'Can view manager permission', 'view'),
('order_add_permission', 'order', 'Can add order', 'add'),
('order_change_permission', 'order', 'Can change order', 'change'),
('order_delete_permission', 'order', 'Can delete order', 'delete'),
('order_view_permission', 'order', 'Can view order', 'view'),
('outstandingtoken_add_permission', 'outstandingtoken', 'Can add outstanding token', 'add'),
('outstandingtoken_change_permission', 'outstandingtoken', 'Can change outstanding token', 'change'),
('outstandingtoken_delete_permission', 'outstandingtoken', 'Can delete outstanding token', 'delete'),
('outstandingtoken_view_permission', 'outstandingtoken', 'Can view outstanding token', 'view'),
('page_add_permission', 'page', 'Can add page', 'add'),
('page_change_permission', 'page', 'Can change page', 'change'),
('page_delete_permission', 'page', 'Can delete page', 'delete'),
('page_view_permission', 'page', 'Can view page', 'view'),
('pagecategory_add_permission', 'pagecategory', 'Can add Page Category', 'add'),
('pagecategory_change_permission', 'pagecategory', 'Can change Page Category', 'change'),
('pagecategory_delete_permission', 'pagecategory', 'Can delete Page Category', 'delete'),
('pagecategory_view_permission', 'pagecategory', 'Can view Page Category', 'view'),
('pagecategorytype_add_permission', 'pagecategorytype', 'Can add Page category type', 'add'),
('pagecategorytype_change_permission', 'pagecategorytype', 'Can change Page category type', 'change'),
('pagecategorytype_delete_permission', 'pagecategorytype', 'Can delete Page category type', 'delete'),
('pagecategorytype_view_permission', 'pagecategorytype', 'Can view Page category type', 'view'),
('pagecms_add_permission', 'pagecms', 'Can add PageCMS', 'add'),
('pagecms_change_permission', 'pagecms', 'Can change PageCMS', 'change'),
('pagecms_delete_permission', 'pagecms', 'Can delete PageCMS', 'delete'),
('pagecms_view_permission', 'pagecms', 'Can view PageCMS', 'view'),
('pagefrontend_add_permission', 'pagefrontend', 'Can add PageFrontend', 'add'),
('pagefrontend_change_permission', 'pagefrontend', 'Can change PageFrontend', 'change'),
('pagefrontend_delete_permission', 'pagefrontend', 'Can delete PageFrontend', 'delete'),
('pagefrontend_view_permission', 'pagefrontend', 'Can view PageFrontend', 'view'),
('paymentmethod_add_permission', 'paymentmethod', 'Can add payment method', 'add'),
('paymentmethod_change_permission', 'paymentmethod', 'Can change payment method', 'change'),
('paymentmethod_delete_permission', 'paymentmethod', 'Can delete payment method', 'delete'),
('paymentmethod_view_permission', 'paymentmethod', 'Can view payment method', 'view'),
('paymentmethodcountry_add_permission', 'paymentmethodcountry', 'Can add payment method country', 'add'),
('paymentmethodcountry_change_permission', 'paymentmethodcountry', 'Can change payment method country', 'change'),
('paymentmethodcountry_delete_permission', 'paymentmethodcountry', 'Can delete payment method country', 'delete'),
('paymentmethodcountry_view_permission', 'paymentmethodcountry', 'Can view payment method country', 'view'),
('permission_add_permission', 'permission', 'Can add permission', 'add'),
('permission_change_permission', 'permission', 'Can change permission', 'change'),
('permission_delete_permission', 'permission', 'Can delete permission', 'delete'),
('permission_view_permission', 'permission', 'Can view permission', 'view'),
('pricelist_add_permission', 'pricelist', 'Can add price list', 'add'),
('pricelist_change_permission', 'pricelist', 'Can change price list', 'change'),
('pricelist_delete_permission', 'pricelist', 'Can delete price list', 'delete'),
('pricelist_view_permission', 'pricelist', 'Can view price list', 'view'),
('product_add_permission', 'product', 'Can add product', 'add'),
('product_change_permission', 'product', 'Can change product', 'change'),
('product_delete_permission', 'product', 'Can delete product', 'delete'),
('product_view_permission', 'product', 'Can view product', 'view'),
('productmedia_add_permission', 'productmedia', 'Can add product media', 'add'),
('productmedia_change_permission', 'productmedia', 'Can change product media', 'change'),
('productmedia_delete_permission', 'productmedia', 'Can delete product media', 'delete'),
('productmedia_view_permission', 'productmedia', 'Can view product media', 'view'),
('productprice_add_permission', 'productprice', 'Can add product price', 'add'),
('productprice_change_permission', 'productprice', 'Can change product price', 'change'),
('productprice_delete_permission', 'productprice', 'Can delete product price', 'delete'),
('productprice_view_permission', 'productprice', 'Can view product price', 'view'),
('producttype_add_permission', 'producttype', 'Can add product type', 'add'),
('producttype_change_permission', 'producttype', 'Can change product type', 'change'),
('producttype_delete_permission', 'producttype', 'Can delete product type', 'delete'),
('producttype_view_permission', 'producttype', 'Can view product type', 'view'),
('productvariant_add_permission', 'productvariant', 'Can add product variant', 'add'),
('productvariant_change_permission', 'productvariant', 'Can change product variant', 'change'),
('productvariant_delete_permission', 'productvariant', 'Can delete product variant', 'delete'),
('productvariant_view_permission', 'productvariant', 'Can view product variant', 'view'),
('productvariantmedia_add_permission', 'productvariantmedia', 'Can add product variant media', 'add'),
('productvariantmedia_change_permission', 'productvariantmedia', 'Can change product variant media', 'change'),
('productvariantmedia_delete_permission', 'productvariantmedia', 'Can delete product variant media', 'delete'),
('productvariantmedia_view_permission', 'productvariantmedia', 'Can view product variant media', 'view'),
('queue_None_permission', 'queue', 'Access admin page', 'None'),
('review_change_permission', 'review', 'Can change review', 'change'),
('review_view_permission', 'review', 'Can add review', 'view'),
('session_add_permission', 'session', 'Can add session', 'add'),
('session_change_permission', 'session', 'Can change session', 'change'),
('session_delete_permission', 'session', 'Can delete session', 'delete'),
('session_view_permission', 'session', 'Can view session', 'view'),
('shippinginfo_add_permission', 'shippinginfo', 'Can add Shipping Address', 'add'),
('shippinginfo_change_permission', 'shippinginfo', 'Can change Shipping Address', 'change'),
('shippinginfo_delete_permission', 'shippinginfo', 'Can delete Shipping Address', 'delete'),
('shippinginfo_view_permission', 'shippinginfo', 'Can view Shipping Address', 'view'),
('shippingmethod_add_permission', 'shippingmethod', 'Can add shipping method', 'add'),
('shippingmethod_change_permission', 'shippingmethod', 'Can change shipping method', 'change'),
('shippingmethod_delete_permission', 'shippingmethod', 'Can delete shipping method', 'delete'),
('shippingmethod_view_permission', 'shippingmethod', 'Can view shipping method', 'view'),
('shippingmethodcountry_add_permission', 'shippingmethodcountry', 'Can add shipping method country', 'add'),
('shippingmethodcountry_change_permission', 'shippingmethodcountry', 'Can change shipping method country', 'change'),
('shippingmethodcountry_delete_permission', 'shippingmethodcountry', 'Can delete shipping method country', 'delete'),
('shippingmethodcountry_view_permission', 'shippingmethodcountry', 'Can view shipping method country', 'view'),
('token_add_permission', 'token', 'Can add Token', 'add'),
('token_change_permission', 'token', 'Can change Token', 'change'),
('token_delete_permission', 'token', 'Can delete Token', 'delete'),
('token_view_permission', 'token', 'Can view Token', 'view'),
('tokenproxy_add_permission', 'tokenproxy', 'Can add token', 'add'),
('tokenproxy_change_permission', 'tokenproxy', 'Can change token', 'change'),
('tokenproxy_delete_permission', 'tokenproxy', 'Can delete token', 'delete'),
('tokenproxy_view_permission', 'tokenproxy', 'Can view token', 'view'),
('user_add_permission', 'user', 'Can add user', 'add'),
('user_change_permission', 'user', 'Can change user', 'change'),
('user_delete_permission', 'user', 'Can delete user', 'delete'),
('user_view_permission', 'user', 'Can view user', 'view'),
('vatgroup_add_permission', 'vatgroup', 'Can add VAT Group', 'add'),
('vatgroup_change_permission', 'vatgroup', 'Can change VAT Group', 'change'),
('vatgroup_delete_permission', 'vatgroup', 'Can delete VAT Group', 'delete'),
('vatgroup_view_permission', 'vatgroup', 'Can view VAT Group', 'view');

INSERT INTO "public"."user_user" ("password", "last_login", "email", "first_name", "last_name", "birth_date", "is_active", "is_admin", "is_staff", "is_superuser") VALUES
('pbkdf2_sha256$320000$8h2X6GJp80TCzVtlv2tvT8$ODbmbEwXV/jOTDcoTnypmf056d7/sWgZBFGaLHfgq8Q=', NULL, 'admin@example.com', 'Test', 'Test', NULL, 't', 't', 't', 'f'),
('pbkdf2_sha256$320000$69UGz2IjZSwpFDGIBbTxLt$mloeqFvhhkLTFVKtbK2N9LzAbw5Ht7OiCvslMCk43s8=', NULL, 'test@example.com', '', '', NULL, 't', 't', 'f', 'f');

INSERT INTO "public"."user_user_groups" ("id", "user_id", "group_id") VALUES
(2, 'test@example.com', 2);

ALTER TABLE "public"."auth_group_permissions" ADD FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id");
ALTER TABLE "public"."auth_group_permissions" ADD FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id");
ALTER TABLE "public"."auth_permission" ADD FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id");
ALTER TABLE "public"."authtoken_token" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
ALTER TABLE "public"."cart_cart" ADD FOREIGN KEY ("shipping_method_country_id") REFERENCES "public"."cart_shippingmethodcountry"("id");
ALTER TABLE "public"."cart_cart" ADD FOREIGN KEY ("billing_info_id") REFERENCES "public"."country_billinginfo"("id");
ALTER TABLE "public"."cart_cart" ADD FOREIGN KEY ("pricelist_id") REFERENCES "public"."product_pricelist"("code");
ALTER TABLE "public"."cart_cart" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
ALTER TABLE "public"."cart_cart" ADD FOREIGN KEY ("payment_method_country_id") REFERENCES "public"."cart_paymentmethodcountry"("id");
ALTER TABLE "public"."cart_cart" ADD FOREIGN KEY ("shipping_info_id") REFERENCES "public"."country_shippinginfo"("id");
ALTER TABLE "public"."cart_cart" ADD FOREIGN KEY ("country_id") REFERENCES "public"."country_country"("code");
ALTER TABLE "public"."cart_cartitem" ADD FOREIGN KEY ("cart_id") REFERENCES "public"."cart_cart"("token");
ALTER TABLE "public"."cart_cartitem" ADD FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_productvariant"("sku");
ALTER TABLE "public"."cart_cartitem" ADD FOREIGN KEY ("product_id") REFERENCES "public"."product_product"("id");
ALTER TABLE "public"."cart_paymentmethod_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."cart_paymentmethod"("id");
ALTER TABLE "public"."cart_paymentmethodcountry" ADD FOREIGN KEY ("currency_id") REFERENCES "public"."country_currency"("code");
ALTER TABLE "public"."cart_paymentmethodcountry" ADD FOREIGN KEY ("payment_method_id") REFERENCES "public"."cart_paymentmethod"("id");
ALTER TABLE "public"."cart_paymentmethodcountry" ADD FOREIGN KEY ("country_id") REFERENCES "public"."country_country"("code");
ALTER TABLE "public"."cart_paymentmethodcountry" ADD FOREIGN KEY ("vat_group_id") REFERENCES "public"."country_vatgroup"("id");
ALTER TABLE "public"."cart_shippingmethod_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."cart_shippingmethod"("id");
ALTER TABLE "public"."cart_shippingmethodcountry" ADD FOREIGN KEY ("vat_group_id") REFERENCES "public"."country_vatgroup"("id");
ALTER TABLE "public"."cart_shippingmethodcountry" ADD FOREIGN KEY ("country_id") REFERENCES "public"."country_country"("code");
ALTER TABLE "public"."cart_shippingmethodcountry" ADD FOREIGN KEY ("currency_id") REFERENCES "public"."country_currency"("code");
ALTER TABLE "public"."cart_shippingmethodcountry" ADD FOREIGN KEY ("shipping_method_id") REFERENCES "public"."cart_shippingmethod"("id");
ALTER TABLE "public"."cart_shippingmethodcountry_payment_methods" ADD FOREIGN KEY ("paymentmethodcountry_id") REFERENCES "public"."cart_paymentmethodcountry"("id");
ALTER TABLE "public"."cart_shippingmethodcountry_payment_methods" ADD FOREIGN KEY ("shippingmethodcountry_id") REFERENCES "public"."cart_shippingmethodcountry"("id");
ALTER TABLE "public"."category_category" ADD FOREIGN KEY ("parent_id") REFERENCES "public"."category_category"("id");
ALTER TABLE "public"."category_category_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."category_category"("id");
ALTER TABLE "public"."cms_page" ADD FOREIGN KEY ("polymorphic_ctype_id") REFERENCES "public"."django_content_type"("id");
ALTER TABLE "public"."cms_page_categories" ADD FOREIGN KEY ("page_id") REFERENCES "public"."cms_page"("id");
ALTER TABLE "public"."cms_page_categories" ADD FOREIGN KEY ("pagecategory_id") REFERENCES "public"."cms_pagecategory"("id");
ALTER TABLE "public"."cms_pagecategory_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."cms_pagecategory"("id");
ALTER TABLE "public"."cms_pagecategory_type" ADD FOREIGN KEY ("pagecategorytype_id") REFERENCES "public"."cms_pagecategorytype"("id");
ALTER TABLE "public"."cms_pagecategory_type" ADD FOREIGN KEY ("pagecategory_id") REFERENCES "public"."cms_pagecategory"("id");
ALTER TABLE "public"."cms_pagecms" ADD FOREIGN KEY ("page_ptr_id") REFERENCES "public"."cms_page"("id");
ALTER TABLE "public"."cms_pagecms_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."cms_pagecms"("page_ptr_id");
ALTER TABLE "public"."cms_pagefrontend" ADD FOREIGN KEY ("page_ptr_id") REFERENCES "public"."cms_page"("id");
ALTER TABLE "public"."cms_pagefrontend_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."cms_pagefrontend"("page_ptr_id");
ALTER TABLE "public"."country_billinginfo" ADD FOREIGN KEY ("country_id") REFERENCES "public"."country_country"("code");
ALTER TABLE "public"."country_billinginfo" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
ALTER TABLE "public"."country_country" ADD FOREIGN KEY ("default_price_list_id") REFERENCES "public"."product_pricelist"("code");
ALTER TABLE "public"."country_shippinginfo" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
ALTER TABLE "public"."country_shippinginfo" ADD FOREIGN KEY ("country_id") REFERENCES "public"."country_country"("code");
ALTER TABLE "public"."country_vatgroup" ADD FOREIGN KEY ("country_id") REFERENCES "public"."country_country"("code");
ALTER TABLE "public"."django_admin_log" ADD FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id");
ALTER TABLE "public"."django_admin_log" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
ALTER TABLE "public"."order_order" ADD FOREIGN KEY ("cart_id") REFERENCES "public"."cart_cart"("token");
ALTER TABLE "public"."product_attributetype_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."product_attributetype"("id");
ALTER TABLE "public"."product_baseattribute" ADD FOREIGN KEY ("type_id") REFERENCES "public"."product_attributetype"("id");
ALTER TABLE "public"."product_baseattribute_ext_attributes" ADD FOREIGN KEY ("baseattribute_id") REFERENCES "public"."product_baseattribute"("id");
ALTER TABLE "public"."product_baseattribute_ext_attributes" ADD FOREIGN KEY ("extensionattribute_id") REFERENCES "public"."product_extensionattribute"("id");
ALTER TABLE "public"."product_baseattribute_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."product_baseattribute"("id");
ALTER TABLE "public"."product_extensionattribute" ADD FOREIGN KEY ("type_id") REFERENCES "public"."product_extattributetype"("id");
ALTER TABLE "public"."product_extensionattribute_ext_attributes" ADD FOREIGN KEY ("to_extensionattribute_id") REFERENCES "public"."product_extensionattribute"("id");
ALTER TABLE "public"."product_extensionattribute_ext_attributes" ADD FOREIGN KEY ("from_extensionattribute_id") REFERENCES "public"."product_extensionattribute"("id");
ALTER TABLE "public"."product_pricelist" ADD FOREIGN KEY ("currency_id") REFERENCES "public"."country_currency"("code");
ALTER TABLE "public"."product_product" ADD FOREIGN KEY ("type_id") REFERENCES "public"."product_producttype"("id");
ALTER TABLE "public"."product_product" ADD FOREIGN KEY ("category_id") REFERENCES "public"."category_category"("id");
ALTER TABLE "public"."product_product_product_variants" ADD FOREIGN KEY ("productvariant_id") REFERENCES "public"."product_productvariant"("sku");
ALTER TABLE "public"."product_product_product_variants" ADD FOREIGN KEY ("product_id") REFERENCES "public"."product_product"("id");
ALTER TABLE "public"."product_product_translation" ADD FOREIGN KEY ("master_id") REFERENCES "public"."product_product"("id");
ALTER TABLE "public"."product_productmedia" ADD FOREIGN KEY ("product_id") REFERENCES "public"."product_product"("id");
ALTER TABLE "public"."product_productprice" ADD FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_productvariant"("sku");
ALTER TABLE "public"."product_productprice" ADD FOREIGN KEY ("price_list_id") REFERENCES "public"."product_pricelist"("code");
ALTER TABLE "public"."product_producttype_allowed_attribute_types" ADD FOREIGN KEY ("producttype_id") REFERENCES "public"."product_producttype"("id");
ALTER TABLE "public"."product_producttype_allowed_attribute_types" ADD FOREIGN KEY ("attributetype_id") REFERENCES "public"."product_attributetype"("id");
ALTER TABLE "public"."product_producttype_vat_groups" ADD FOREIGN KEY ("producttype_id") REFERENCES "public"."product_producttype"("id");
ALTER TABLE "public"."product_producttype_vat_groups" ADD FOREIGN KEY ("vatgroup_id") REFERENCES "public"."country_vatgroup"("id");
ALTER TABLE "public"."product_productvariant_attributes" ADD FOREIGN KEY ("productvariant_id") REFERENCES "public"."product_productvariant"("sku");
ALTER TABLE "public"."product_productvariant_attributes" ADD FOREIGN KEY ("baseattribute_id") REFERENCES "public"."product_baseattribute"("id");
ALTER TABLE "public"."product_productvariantmedia" ADD FOREIGN KEY ("media_id") REFERENCES "public"."product_productmedia"("id");
ALTER TABLE "public"."product_productvariantmedia" ADD FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_productvariant"("sku");
ALTER TABLE "public"."review_review" ADD FOREIGN KEY ("product_id") REFERENCES "public"."product_product"("id");
ALTER TABLE "public"."review_review" ADD FOREIGN KEY ("product_variant_id") REFERENCES "public"."product_productvariant"("sku");
ALTER TABLE "public"."review_review" ADD FOREIGN KEY ("order_id") REFERENCES "public"."order_order"("token");
ALTER TABLE "public"."roles_managergroup_permissions" ADD FOREIGN KEY ("managerpermission_id") REFERENCES "public"."roles_managerpermission"("name");
ALTER TABLE "public"."roles_managergroup_permissions" ADD FOREIGN KEY ("managergroup_id") REFERENCES "public"."roles_managergroup"("name");
ALTER TABLE "public"."token_blacklist_blacklistedtoken" ADD FOREIGN KEY ("token_id") REFERENCES "public"."token_blacklist_outstandingtoken"("id");
ALTER TABLE "public"."token_blacklist_outstandingtoken" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
ALTER TABLE "public"."user_user_groups" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
ALTER TABLE "public"."user_user_groups" ADD FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id");
ALTER TABLE "public"."user_user_user_permissions" ADD FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id");
ALTER TABLE "public"."user_user_user_permissions" ADD FOREIGN KEY ("user_id") REFERENCES "public"."user_user"("email");
