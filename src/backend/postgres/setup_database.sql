-- -------------------------------------------------------------
-- Generation Time: 2023-07-06 18:32:39.4630
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "auth_group";
CREATE TABLE "auth_group" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(150) NOT NULL UNIQUE);

DROP TABLE IF EXISTS "auth_group_permissions";
CREATE TABLE "auth_group_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "auth_permission";
CREATE TABLE "auth_permission" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "content_type_id" integer NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "codename" varchar(100) NOT NULL, "name" varchar(255) NOT NULL);

DROP TABLE IF EXISTS "authtoken_token";
CREATE TABLE "authtoken_token" ("key" varchar(40) NOT NULL PRIMARY KEY, "created" datetime NOT NULL, "user_id" varchar(40) NOT NULL UNIQUE REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cart_cart";
CREATE TABLE "cart_cart" ("token" char(32) NOT NULL PRIMARY KEY, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "country_id" varchar(2) NULL REFERENCES "country_country" ("code") DEFERRABLE INITIALLY DEFERRED, "user_id" varchar(40) NULL REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED, "payment_method_country_id" bigint NULL REFERENCES "cart_paymentmethodcountry" ("id") DEFERRABLE INITIALLY DEFERRED, "shipping_method_country_id" bigint NULL REFERENCES "cart_shippingmethodcountry" ("id") DEFERRABLE INITIALLY DEFERRED, "pricelist_id" varchar(200) NULL REFERENCES "product_pricelist" ("code") DEFERRABLE INITIALLY DEFERRED, "billing_info_id" bigint NULL REFERENCES "country_billinginfo" ("id") DEFERRABLE INITIALLY DEFERRED, "shipping_info_id" bigint NULL REFERENCES "country_shippinginfo" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cart_cartitem";
CREATE TABLE "cart_cartitem" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "unit_price_incl_vat" decimal NULL, "unit_price_without_vat" decimal NULL, "quantity" integer NOT NULL, "cart_id" char(32) NULL REFERENCES "cart_cart" ("token") DEFERRABLE INITIALLY DEFERRED, "product_variant_id" varchar(255) NULL REFERENCES "product_productvariant" ("sku") DEFERRABLE INITIALLY DEFERRED, "product_id" bigint NULL REFERENCES "product_product" ("id") DEFERRABLE INITIALLY DEFERRED, "discount" decimal NULL);

DROP TABLE IF EXISTS "cart_paymentmethod";
CREATE TABLE "cart_paymentmethod" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "image" varchar(100) NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "cart_paymentmethod_translation";
CREATE TABLE "cart_paymentmethod_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "title" varchar(255) NOT NULL, "description" text NULL, "master_id" bigint NULL REFERENCES "cart_paymentmethod" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cart_paymentmethodcountry";
CREATE TABLE "cart_paymentmethodcountry" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "is_active" bool NOT NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "country_id" varchar(2) NOT NULL REFERENCES "country_country" ("code") DEFERRABLE INITIALLY DEFERRED, "currency_id" varchar(3) NOT NULL REFERENCES "country_currency" ("code") DEFERRABLE INITIALLY DEFERRED, "payment_method_id" bigint NOT NULL REFERENCES "cart_paymentmethod" ("id") DEFERRABLE INITIALLY DEFERRED, "vat_group_id" bigint NOT NULL REFERENCES "country_vatgroup" ("id") DEFERRABLE INITIALLY DEFERRED, "price" decimal NOT NULL, "api_request" varchar(42) NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "cart_shippingmethod";
CREATE TABLE "cart_shippingmethod" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "image" varchar(100) NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "cart_shippingmethod_translation";
CREATE TABLE "cart_shippingmethod_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "title" varchar(255) NOT NULL, "description" text NULL, "master_id" bigint NULL REFERENCES "cart_shippingmethod" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cart_shippingmethodcountry";
CREATE TABLE "cart_shippingmethodcountry" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "is_active" bool NOT NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "country_id" varchar(2) NOT NULL REFERENCES "country_country" ("code") DEFERRABLE INITIALLY DEFERRED, "currency_id" varchar(3) NOT NULL REFERENCES "country_currency" ("code") DEFERRABLE INITIALLY DEFERRED, "shipping_method_id" bigint NOT NULL REFERENCES "cart_shippingmethod" ("id") DEFERRABLE INITIALLY DEFERRED, "vat_group_id" bigint NOT NULL REFERENCES "country_vatgroup" ("id") DEFERRABLE INITIALLY DEFERRED, "price" decimal NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "cart_shippingmethodcountry_payment_methods";
CREATE TABLE "cart_shippingmethodcountry_payment_methods" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "shippingmethodcountry_id" bigint NOT NULL REFERENCES "cart_shippingmethodcountry" ("id") DEFERRABLE INITIALLY DEFERRED, "paymentmethodcountry_id" bigint NOT NULL REFERENCES "cart_paymentmethodcountry" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "category_category";
CREATE TABLE "category_category" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "lft" integer unsigned NOT NULL CHECK ("lft" >= 0), "rght" integer unsigned NOT NULL CHECK ("rght" >= 0), "tree_id" integer unsigned NOT NULL CHECK ("tree_id" >= 0), "level" integer unsigned NOT NULL CHECK ("level" >= 0), "create_at" datetime NOT NULL, "published" bool NOT NULL, "update_at" datetime NOT NULL, "safe_deleted" bool NOT NULL, "parent_id" bigint NULL REFERENCES "category_category" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "category_category_translation";
CREATE TABLE "category_category_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "title" varchar(200) NOT NULL, "meta_title" varchar(200) NOT NULL, "meta_description" text NOT NULL, "description" text NULL, "slug" varchar(200) NOT NULL, "master_id" bigint NULL REFERENCES "category_category" ("id") DEFERRABLE INITIALLY DEFERRED, "description_editorjs" text NULL CHECK ((JSON_VALID("description_editorjs") OR "description_editorjs" IS NULL)));

DROP TABLE IF EXISTS "cms_page";
CREATE TABLE "cms_page" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "published" bool NOT NULL, "ordering" integer NOT NULL, "recommended" bool NOT NULL, "polymorphic_ctype_id" integer NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "cms_page_categories";
CREATE TABLE "cms_page_categories" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "page_id" bigint NOT NULL REFERENCES "cms_page" ("id") DEFERRABLE INITIALLY DEFERRED, "pagecategory_id" bigint NOT NULL REFERENCES "cms_pagecategory" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cms_pagecategory";
CREATE TABLE "cms_pagecategory" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "sort_order" integer NULL, "published" bool NOT NULL, "code" varchar(20) NOT NULL, "ordering" integer NOT NULL, "image" varchar(100) NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "cms_pagecategory_translation";
CREATE TABLE "cms_pagecategory_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "title" varchar(250) NOT NULL, "master_id" bigint NULL REFERENCES "cms_pagecategory" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cms_pagecategory_type";
CREATE TABLE "cms_pagecategory_type" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "pagecategory_id" bigint NOT NULL REFERENCES "cms_pagecategory" ("id") DEFERRABLE INITIALLY DEFERRED, "pagecategorytype_id" bigint NOT NULL REFERENCES "cms_pagecategorytype" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cms_pagecategorytype";
CREATE TABLE "cms_pagecategorytype" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "identifier" varchar(100) NOT NULL UNIQUE, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "cms_pagecms";
CREATE TABLE "cms_pagecms" ("page_ptr_id" bigint NOT NULL PRIMARY KEY REFERENCES "cms_page" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cms_pagecms_translation";
CREATE TABLE "cms_pagecms_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "slug" varchar(255) NOT NULL, "title" varchar(250) NOT NULL, "content" text NULL CHECK ((JSON_VALID("content") OR "content" IS NULL)), "master_id" bigint NULL REFERENCES "cms_pagecms" ("page_ptr_id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "cms_pagefrontend";
CREATE TABLE "cms_pagefrontend" ("page_ptr_id" bigint NOT NULL PRIMARY KEY REFERENCES "cms_page" ("id") DEFERRABLE INITIALLY DEFERRED, "frontend_path" varchar(250) NOT NULL);

DROP TABLE IF EXISTS "cms_pagefrontend_translation";
CREATE TABLE "cms_pagefrontend_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "title" varchar(250) NOT NULL, "master_id" bigint NULL REFERENCES "cms_pagefrontend" ("page_ptr_id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "country_address";
CREATE TABLE "country_address" ("id" integer, PRIMARY KEY (id));

DROP TABLE IF EXISTS "country_billinginfo";
CREATE TABLE "country_billinginfo" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "first_name" varchar(255) NOT NULL, "surname" varchar(255) NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(255) NOT NULL, "postal_code" varchar(255) NOT NULL, "company_name" varchar(255) NULL, "company_id" varchar(255) NULL, "vat_number" varchar(255) NULL, "country_id" varchar(2) NOT NULL REFERENCES "country_country" ("code") DEFERRABLE INITIALLY DEFERRED, "user_id" varchar(40) NULL REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "country_country";
CREATE TABLE "country_country" ("code" varchar(2) NOT NULL PRIMARY KEY, "name" varchar(200) NOT NULL, "locale" varchar(2) NOT NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "default_price_list_id" varchar(200) NULL REFERENCES "product_pricelist" ("code") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "country_currency";
CREATE TABLE "country_currency" ("code" varchar(3) NOT NULL PRIMARY KEY, "symbol" varchar(3) NOT NULL, "symbol_position" varchar(6) NOT NULL, "create_at" datetime NOT NULL, "update_at" datetime NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "country_shippinginfo";
CREATE TABLE "country_shippinginfo" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "first_name" varchar(255) NOT NULL, "surname" varchar(255) NOT NULL, "street" varchar(255) NOT NULL, "city" varchar(255) NOT NULL, "postal_code" varchar(255) NOT NULL, "email" varchar(255) NULL, "phone" varchar(255) NULL, "additional_info" text NULL, "country_id" varchar(2) NOT NULL REFERENCES "country_country" ("code") DEFERRABLE INITIALLY DEFERRED, "user_id" varchar(40) NULL REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "country_vatgroup";
CREATE TABLE "country_vatgroup" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(200) NOT NULL, "rate" decimal NOT NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "country_id" varchar(2) NOT NULL REFERENCES "country_country" ("code") DEFERRABLE INITIALLY DEFERRED, "is_default" bool NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "django_admin_log";
CREATE TABLE "django_admin_log" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "action_time" datetime NOT NULL, "object_id" text NULL, "object_repr" varchar(200) NOT NULL, "change_message" text NOT NULL, "content_type_id" integer NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED, "user_id" varchar(40) NOT NULL REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED, "action_flag" smallint unsigned NOT NULL CHECK ("action_flag" >= 0));

DROP TABLE IF EXISTS "django_content_type";
CREATE TABLE "django_content_type" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app_label" varchar(100) NOT NULL, "model" varchar(100) NOT NULL);

DROP TABLE IF EXISTS "django_migrations";
CREATE TABLE "django_migrations" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "app" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "applied" datetime NOT NULL);

DROP TABLE IF EXISTS "django_session";
CREATE TABLE "django_session" ("session_key" varchar(40) NOT NULL PRIMARY KEY, "session_data" text NOT NULL, "expire_date" datetime NOT NULL);

DROP TABLE IF EXISTS "order_order";
CREATE TABLE "order_order" ("create_at" datetime NOT NULL, "cart_id" char(32) NULL REFERENCES "cart_cart" ("token") DEFERRABLE INITIALLY DEFERRED, "token" char(32) NOT NULL PRIMARY KEY, "status" varchar(10) NOT NULL, "agreed_to_terms" bool NOT NULL, "marketing_flag" bool NOT NULL, "payment_id" varchar(100) NULL);

DROP TABLE IF EXISTS "product_attributetype";
CREATE TABLE "product_attributetype" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "type_name" varchar(200) NULL, "unit" varchar(200) NULL, "value_type" varchar(10) NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_attributetype_translation";
CREATE TABLE "product_attributetype_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "name" varchar(200) NOT NULL, "master_id" bigint NULL REFERENCES "product_attributetype" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_baseattribute";
CREATE TABLE "product_baseattribute" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "value" varchar(200) NULL, "order" integer NULL, "type_id" bigint NOT NULL REFERENCES "product_attributetype" ("id") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_baseattribute_ext_attributes";
CREATE TABLE "product_baseattribute_ext_attributes" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "baseattribute_id" bigint NOT NULL REFERENCES "product_baseattribute" ("id") DEFERRABLE INITIALLY DEFERRED, "extensionattribute_id" bigint NOT NULL REFERENCES "product_extensionattribute" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_baseattribute_translation";
CREATE TABLE "product_baseattribute_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "name" varchar(200) NOT NULL, "master_id" bigint NULL REFERENCES "product_baseattribute" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_extattributetype";
CREATE TABLE "product_extattributetype" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "type_name" varchar(200) NOT NULL, "unit" varchar(200) NULL);

DROP TABLE IF EXISTS "product_extensionattribute";
CREATE TABLE "product_extensionattribute" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "value" varchar(200) NOT NULL, "type_id" bigint NOT NULL REFERENCES "product_extattributetype" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_extensionattribute_ext_attributes";
CREATE TABLE "product_extensionattribute_ext_attributes" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "from_extensionattribute_id" bigint NOT NULL REFERENCES "product_extensionattribute" ("id") DEFERRABLE INITIALLY DEFERRED, "to_extensionattribute_id" bigint NOT NULL REFERENCES "product_extensionattribute" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_pricelist";
CREATE TABLE "product_pricelist" ("code" varchar(200) NOT NULL PRIMARY KEY, "rounding" bool NOT NULL, "currency_id" varchar(3) NOT NULL REFERENCES "country_currency" ("code") DEFERRABLE INITIALLY DEFERRED, "create_at" datetime NOT NULL, "update_at" datetime NOT NULL, "is_default" bool NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_product";
CREATE TABLE "product_product" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "published" bool NOT NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "category_id" bigint NULL REFERENCES "category_category" ("id") DEFERRABLE INITIALLY DEFERRED, "type_id" bigint NULL REFERENCES "product_producttype" ("id") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_product_product_variants";
CREATE TABLE "product_product_product_variants" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "product_id" bigint NOT NULL REFERENCES "product_product" ("id") DEFERRABLE INITIALLY DEFERRED, "productvariant_id" varchar(255) NOT NULL REFERENCES "product_productvariant" ("sku") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_product_translation";
CREATE TABLE "product_product_translation" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "language_code" varchar(15) NOT NULL, "title" varchar(200) NOT NULL, "meta_title" varchar(200) NOT NULL, "meta_description" text NOT NULL, "short_description" text NULL, "description" text NULL, "slug" varchar(200) NOT NULL, "master_id" bigint NULL REFERENCES "product_product" ("id") DEFERRABLE INITIALLY DEFERRED, "description_editorjs" text NULL CHECK ((JSON_VALID("description_editorjs") OR "description_editorjs" IS NULL)));

DROP TABLE IF EXISTS "product_productmedia";
CREATE TABLE "product_productmedia" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "sort_order" integer NULL, "media" varchar(100) NOT NULL, "type" varchar(10) NOT NULL, "alt" varchar(128) NULL, "product_id" bigint NULL REFERENCES "product_product" ("id") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_productprice";
CREATE TABLE "product_productprice" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "price" decimal NOT NULL, "price_list_id" varchar(200) NOT NULL REFERENCES "product_pricelist" ("code") DEFERRABLE INITIALLY DEFERRED, "product_variant_id" varchar(255) NULL REFERENCES "product_productvariant" ("sku") DEFERRABLE INITIALLY DEFERRED, "create_at" datetime NOT NULL, "update_at" datetime NOT NULL, "discount" decimal NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_producttype";
CREATE TABLE "product_producttype" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(200) NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_producttype_allowed_attribute_types";
CREATE TABLE "product_producttype_allowed_attribute_types" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "producttype_id" bigint NOT NULL REFERENCES "product_producttype" ("id") DEFERRABLE INITIALLY DEFERRED, "attributetype_id" bigint NOT NULL REFERENCES "product_attributetype" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_producttype_vat_groups";
CREATE TABLE "product_producttype_vat_groups" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "producttype_id" bigint NOT NULL REFERENCES "product_producttype" ("id") DEFERRABLE INITIALLY DEFERRED, "vatgroup_id" bigint NOT NULL REFERENCES "country_vatgroup" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_productvariant";
CREATE TABLE "product_productvariant" ("sku" varchar(255) NOT NULL PRIMARY KEY, "ean" varchar(13) NOT NULL, "weight" decimal NULL, "update_at" datetime NOT NULL, "create_at" datetime NOT NULL, "stock_quantity" integer NOT NULL, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "product_productvariant_attributes";
CREATE TABLE "product_productvariant_attributes" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "productvariant_id" varchar(255) NOT NULL REFERENCES "product_productvariant" ("sku") DEFERRABLE INITIALLY DEFERRED, "baseattribute_id" bigint NOT NULL REFERENCES "product_baseattribute" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "product_productvariantmedia";
CREATE TABLE "product_productvariantmedia" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "media_id" bigint NOT NULL REFERENCES "product_productmedia" ("id") DEFERRABLE INITIALLY DEFERRED, "product_variant_id" varchar(255) NOT NULL REFERENCES "product_productvariant" ("sku") DEFERRABLE INITIALLY DEFERRED, "safe_deleted" bool NOT NULL);

DROP TABLE IF EXISTS "review_review";
CREATE TABLE "review_review" ("token" char(32) NOT NULL PRIMARY KEY, "create_at" datetime NOT NULL, "rating" integer NOT NULL, "comment" text NOT NULL, "order_id" char(32) NULL REFERENCES "order_order" ("token") DEFERRABLE INITIALLY DEFERRED, "product_id" bigint NULL REFERENCES "product_product" ("id") DEFERRABLE INITIALLY DEFERRED, "product_variant_id" varchar(255) NULL REFERENCES "product_productvariant" ("sku") DEFERRABLE INITIALLY DEFERRED, "country" varchar(255) NULL);

DROP TABLE IF EXISTS "roles_managergroup";
CREATE TABLE "roles_managergroup" ("name" varchar(200) NOT NULL PRIMARY KEY, "description" varchar(200) NOT NULL);

DROP TABLE IF EXISTS "roles_managergroup_permissions";
CREATE TABLE "roles_managergroup_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "managergroup_id" varchar(200) NOT NULL REFERENCES "roles_managergroup" ("name") DEFERRABLE INITIALLY DEFERRED, "managerpermission_id" varchar(200) NOT NULL REFERENCES "roles_managerpermission" ("name") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "roles_managerpermission";
CREATE TABLE "roles_managerpermission" ("name" varchar(200) NOT NULL PRIMARY KEY, "model" varchar(200) NOT NULL, "description" varchar(200) NOT NULL, "type" varchar(200) NOT NULL);

DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE sqlite_sequence(name,seq);

DROP TABLE IF EXISTS "token_blacklist_blacklistedtoken";
CREATE TABLE "token_blacklist_blacklistedtoken" ("blacklisted_at" datetime NOT NULL, "token_id" bigint NOT NULL UNIQUE REFERENCES "token_blacklist_outstandingtoken" ("id") DEFERRABLE INITIALLY DEFERRED, "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT);

DROP TABLE IF EXISTS "token_blacklist_outstandingtoken";
CREATE TABLE "token_blacklist_outstandingtoken" ("token" text NOT NULL, "created_at" datetime NULL, "expires_at" datetime NOT NULL, "user_id" varchar(40) NULL REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED, "jti" varchar(255) NOT NULL UNIQUE, "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT);

DROP TABLE IF EXISTS "user_user";
CREATE TABLE "user_user" ("password" varchar(128) NOT NULL, "last_login" datetime NULL, "email" varchar(40) NOT NULL PRIMARY KEY, "first_name" varchar(40) NOT NULL, "last_name" varchar(40) NOT NULL, "birth_date" date NULL, "is_active" bool NOT NULL, "is_admin" bool NOT NULL, "is_staff" bool NOT NULL);

DROP TABLE IF EXISTS "user_user_groups";
CREATE TABLE "user_user_groups" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" varchar(40) NOT NULL REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED, "group_id" integer NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED);

DROP TABLE IF EXISTS "user_user_user_permissions";
CREATE TABLE "user_user_user_permissions" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "user_id" varchar(40) NOT NULL REFERENCES "user_user" ("email") DEFERRABLE INITIALLY DEFERRED, "permission_id" integer NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED);

INSERT INTO "auth_group" ("id", "name") VALUES
('1', 'Copywriter'),
('2', 'Editor'),
('3', 'UserManager');

INSERT INTO "auth_group_permissions" ("id", "group_id", "permission_id") VALUES
('1', '1', '46'),
('2', '1', '58'),
('3', '1', '106'),
('4', '1', '134'),
('5', '2', '109'),
('6', '2', '110'),
('7', '2', '113'),
('8', '2', '114'),
('9', '2', '37'),
('10', '2', '38'),
('11', '2', '45'),
('12', '2', '46'),
('13', '2', '57'),
('14', '2', '58'),
('15', '2', '125'),
('16', '2', '126'),
('17', '2', '105'),
('18', '2', '106'),
('19', '2', '133'),
('20', '2', '134'),
('21', '2', '129'),
('22', '2', '130'),
('23', '2', '101'),
('24', '2', '102'),
('25', '3', '161'),
('26', '3', '162');

INSERT INTO "auth_permission" ("id", "content_type_id", "codename", "name") VALUES
('1', '1', 'add_logentry', 'Can add log entry'),
('2', '1', 'change_logentry', 'Can change log entry'),
('3', '1', 'delete_logentry', 'Can delete log entry'),
('4', '1', 'view_logentry', 'Can view log entry'),
('5', '2', 'add_permission', 'Can add permission'),
('6', '2', 'change_permission', 'Can change permission'),
('7', '2', 'delete_permission', 'Can delete permission'),
('8', '2', 'view_permission', 'Can view permission'),
('9', '3', 'add_group', 'Can add group'),
('10', '3', 'change_group', 'Can change group'),
('11', '3', 'delete_group', 'Can delete group'),
('12', '3', 'view_group', 'Can view group'),
('13', '4', 'add_token', 'Can add Token'),
('14', '4', 'change_token', 'Can change Token'),
('15', '4', 'delete_token', 'Can delete Token'),
('16', '4', 'view_token', 'Can view Token'),
('17', '5', 'add_tokenproxy', 'Can add token'),
('18', '5', 'change_tokenproxy', 'Can change token'),
('19', '5', 'delete_tokenproxy', 'Can delete token'),
('20', '5', 'view_tokenproxy', 'Can view token'),
('21', '7', 'add_shippingmethod', 'Can add shipping method'),
('22', '7', 'change_shippingmethod', 'Can change shipping method'),
('23', '7', 'delete_shippingmethod', 'Can delete shipping method'),
('24', '7', 'view_shippingmethod', 'Can view shipping method'),
('25', '8', 'add_shippingmethodcountry', 'Can add shipping method country'),
('26', '8', 'change_shippingmethodcountry', 'Can change shipping method country'),
('27', '8', 'delete_shippingmethodcountry', 'Can delete shipping method country'),
('28', '8', 'view_shippingmethodcountry', 'Can view shipping method country'),
('29', '10', 'add_paymentmethod', 'Can add payment method'),
('30', '10', 'change_paymentmethod', 'Can change payment method'),
('31', '10', 'delete_paymentmethod', 'Can delete payment method'),
('32', '10', 'view_paymentmethod', 'Can view payment method'),
('33', '11', 'add_paymentmethodcountry', 'Can add payment method country'),
('34', '11', 'change_paymentmethodcountry', 'Can change payment method country'),
('35', '11', 'delete_paymentmethodcountry', 'Can delete payment method country'),
('36', '11', 'view_paymentmethodcountry', 'Can view payment method country'),
('37', '12', 'add_cart', 'Can add cart'),
('38', '12', 'change_cart', 'Can change cart'),
('39', '12', 'delete_cart', 'Can delete cart'),
('40', '12', 'view_cart', 'Can view cart'),
('41', '13', 'add_cartitem', 'Can add cart item'),
('42', '13', 'change_cartitem', 'Can change cart item'),
('43', '13', 'delete_cartitem', 'Can delete cart item'),
('44', '13', 'view_cartitem', 'Can view cart item'),
('45', '15', 'add_category', 'Can add category'),
('46', '15', 'change_category', 'Can change category'),
('47', '15', 'delete_category', 'Can delete category'),
('48', '15', 'view_category', 'Can view category'),
('49', '16', 'add_pagecategorytype', 'Can add Page category type'),
('50', '16', 'change_pagecategorytype', 'Can change Page category type'),
('51', '16', 'delete_pagecategorytype', 'Can delete Page category type'),
('52', '16', 'view_pagecategorytype', 'Can view Page category type'),
('53', '18', 'add_pagecategory', 'Can add Page Category'),
('54', '18', 'change_pagecategory', 'Can change Page Category'),
('55', '18', 'delete_pagecategory', 'Can delete Page Category'),
('56', '18', 'view_pagecategory', 'Can view Page Category'),
('57', '19', 'add_page', 'Can add page'),
('58', '19', 'change_page', 'Can change page'),
('59', '19', 'delete_page', 'Can delete page'),
('60', '19', 'view_page', 'Can view page'),
('61', '21', 'add_pagecms', 'Can add PageCMS'),
('62', '21', 'change_pagecms', 'Can change PageCMS'),
('63', '21', 'delete_pagecms', 'Can delete PageCMS'),
('64', '21', 'view_pagecms', 'Can view PageCMS'),
('65', '23', 'add_pagefrontend', 'Can add PageFrontend'),
('66', '23', 'change_pagefrontend', 'Can change PageFrontend'),
('67', '23', 'delete_pagefrontend', 'Can delete PageFrontend'),
('68', '23', 'view_pagefrontend', 'Can view PageFrontend'),
('69', '24', 'add_contenttype', 'Can add content type'),
('70', '24', 'change_contenttype', 'Can change content type'),
('71', '24', 'delete_contenttype', 'Can delete content type'),
('72', '24', 'view_contenttype', 'Can view content type'),
('73', '25', 'add_country', 'Can add Country'),
('74', '25', 'change_country', 'Can change Country'),
('75', '25', 'delete_country', 'Can delete Country'),
('76', '25', 'view_country', 'Can view Country'),
('77', '26', 'add_currency', 'Can add Currency'),
('78', '26', 'change_currency', 'Can change Currency'),
('79', '26', 'delete_currency', 'Can delete Currency'),
('80', '26', 'view_currency', 'Can view Currency'),
('81', '27', 'add_vatgroup', 'Can add VAT Group'),
('82', '27', 'change_vatgroup', 'Can change VAT Group'),
('83', '27', 'delete_vatgroup', 'Can delete VAT Group'),
('84', '27', 'view_vatgroup', 'Can view VAT Group'),
('85', '28', 'add_billinginfo', 'Can add Billing Address'),
('86', '28', 'change_billinginfo', 'Can change Billing Address'),
('87', '28', 'delete_billinginfo', 'Can delete Billing Address'),
('88', '28', 'view_billinginfo', 'Can view Billing Address'),
('89', '29', 'add_shippinginfo', 'Can add Shipping Address'),
('90', '29', 'change_shippinginfo', 'Can change Shipping Address'),
('91', '29', 'delete_shippinginfo', 'Can delete Shipping Address'),
('92', '29', 'view_shippinginfo', 'Can view Shipping Address'),
('93', '30', 'add_order', 'Can add order'),
('94', '30', 'change_order', 'Can change order'),
('95', '30', 'delete_order', 'Can delete order'),
('96', '30', 'view_order', 'Can view order'),
('97', '31', 'add_productvariant', 'Can add product variant'),
('98', '31', 'change_productvariant', 'Can change product variant'),
('99', '31', 'delete_productvariant', 'Can delete product variant'),
('100', '31', 'view_productvariant', 'Can view product variant'),
('101', '32', 'add_producttype', 'Can add product type'),
('102', '32', 'change_producttype', 'Can change product type'),
('103', '32', 'delete_producttype', 'Can delete product type'),
('104', '32', 'view_producttype', 'Can view product type'),
('105', '34', 'add_product', 'Can add product'),
('106', '34', 'change_product', 'Can change product'),
('107', '34', 'delete_product', 'Can delete product'),
('108', '34', 'view_product', 'Can view product'),
('109', '35', 'add_attributetype', 'Can add attribute type'),
('110', '35', 'change_attributetype', 'Can change attribute type'),
('111', '35', 'delete_attributetype', 'Can delete attribute type'),
('112', '35', 'view_attributetype', 'Can view attribute type'),
('113', '36', 'add_baseattribute', 'Can add base attribute'),
('114', '36', 'change_baseattribute', 'Can change base attribute'),
('115', '36', 'delete_baseattribute', 'Can delete base attribute'),
('116', '36', 'view_baseattribute', 'Can view base attribute'),
('117', '37', 'add_extattributetype', 'Can add ext attribute type'),
('118', '37', 'change_extattributetype', 'Can change ext attribute type'),
('119', '37', 'delete_extattributetype', 'Can delete ext attribute type'),
('120', '37', 'view_extattributetype', 'Can view ext attribute type'),
('121', '38', 'add_extensionattribute', 'Can add extension attribute'),
('122', '38', 'change_extensionattribute', 'Can change extension attribute'),
('123', '38', 'delete_extensionattribute', 'Can delete extension attribute'),
('124', '38', 'view_extensionattribute', 'Can view extension attribute'),
('125', '39', 'add_pricelist', 'Can add price list'),
('126', '39', 'change_pricelist', 'Can change price list'),
('127', '39', 'delete_pricelist', 'Can delete price list'),
('128', '39', 'view_pricelist', 'Can view price list'),
('129', '40', 'add_productprice', 'Can add product price'),
('130', '40', 'change_productprice', 'Can change product price'),
('131', '40', 'delete_productprice', 'Can delete product price'),
('132', '40', 'view_productprice', 'Can view product price'),
('133', '41', 'add_productmedia', 'Can add product media'),
('134', '41', 'change_productmedia', 'Can change product media'),
('135', '41', 'delete_productmedia', 'Can delete product media'),
('136', '41', 'view_productmedia', 'Can view product media'),
('137', '42', 'add_productvariantmedia', 'Can add product variant media'),
('138', '42', 'change_productvariantmedia', 'Can change product variant media'),
('139', '42', 'delete_productvariantmedia', 'Can delete product variant media'),
('140', '42', 'view_productvariantmedia', 'Can view product variant media'),
('141', '43', 'add_managerpermission', 'Can add manager permission'),
('142', '43', 'change_managerpermission', 'Can change manager permission'),
('143', '43', 'delete_managerpermission', 'Can delete manager permission'),
('144', '43', 'view_managerpermission', 'Can view manager permission'),
('145', '44', 'add_managergroup', 'Can add manager group'),
('146', '44', 'change_managergroup', 'Can change manager group'),
('147', '44', 'delete_managergroup', 'Can delete manager group'),
('148', '44', 'view_managergroup', 'Can view manager group'),
('149', '45', 'add_session', 'Can add session'),
('150', '45', 'change_session', 'Can change session'),
('151', '45', 'delete_session', 'Can delete session'),
('152', '45', 'view_session', 'Can view session'),
('153', '46', 'add_outstandingtoken', 'Can add outstanding token'),
('154', '46', 'change_outstandingtoken', 'Can change outstanding token'),
('155', '46', 'delete_outstandingtoken', 'Can delete outstanding token'),
('156', '46', 'view_outstandingtoken', 'Can view outstanding token'),
('157', '47', 'add_blacklistedtoken', 'Can add blacklisted token'),
('158', '47', 'change_blacklistedtoken', 'Can change blacklisted token'),
('159', '47', 'delete_blacklistedtoken', 'Can delete blacklisted token'),
('160', '47', 'view_blacklistedtoken', 'Can view blacklisted token'),
('161', '48', 'add_user', 'Can add user'),
('162', '48', 'change_user', 'Can change user'),
('163', '48', 'delete_user', 'Can delete user'),
('164', '48', 'view_user', 'Can view user'),
('165', '10', 'add_contenttype', 'Can add content type'),
('166', '10', 'change_contenttype', 'Can change content type'),
('167', '10', 'delete_contenttype', 'Can delete content type'),
('168', '10', 'view_contenttype', 'Can view content type'),
('169', '27', 'add_session', 'Can add session'),
('170', '27', 'change_session', 'Can change session'),
('171', '27', 'delete_session', 'Can delete session'),
('172', '27', 'view_session', 'Can view session'),
('173', '33', 'add_page', 'Can add page'),
('174', '33', 'change_page', 'Can change page'),
('175', '33', 'delete_page', 'Can delete page'),
('176', '33', 'view_page', 'Can view page'),
('177', '31', 'add_pagecategorytype', 'Can add Page category type'),
('178', '31', 'change_pagecategorytype', 'Can change Page category type'),
('179', '31', 'delete_pagecategorytype', 'Can delete Page category type'),
('180', '31', 'view_pagecategorytype', 'Can view Page category type'),
('181', '38', 'add_pagecms', 'Can add PageCMS'),
('182', '38', 'change_pagecms', 'Can change PageCMS'),
('183', '38', 'delete_pagecms', 'Can delete PageCMS'),
('184', '38', 'view_pagecms', 'Can view PageCMS'),
('185', '35', 'add_pagefrontend', 'Can add PageFrontend'),
('186', '35', 'change_pagefrontend', 'Can change PageFrontend'),
('187', '35', 'delete_pagefrontend', 'Can delete PageFrontend'),
('188', '35', 'view_pagefrontend', 'Can view PageFrontend'),
('189', '37', 'add_pagecategory', 'Can add Page Category'),
('190', '37', 'change_pagecategory', 'Can change Page Category'),
('191', '37', 'delete_pagecategory', 'Can delete Page Category'),
('192', '37', 'view_pagecategory', 'Can view Page Category'),
('193', '6', 'add_cart', 'Can add cart'),
('194', '6', 'change_cart', 'Can change cart'),
('195', '6', 'delete_cart', 'Can delete cart'),
('196', '6', 'view_cart', 'Can view cart'),
('197', '7', 'add_cartitem', 'Can add cart item'),
('198', '7', 'change_cartitem', 'Can change cart item'),
('199', '7', 'delete_cartitem', 'Can delete cart item'),
('200', '7', 'view_cartitem', 'Can view cart item'),
('201', '44', 'add_paymentmethod', 'Can add payment method'),
('202', '44', 'change_paymentmethod', 'Can change payment method'),
('203', '44', 'delete_paymentmethod', 'Can delete payment method'),
('204', '44', 'view_paymentmethod', 'Can view payment method'),
('205', '43', 'add_shippingmethod', 'Can add shipping method'),
('206', '43', 'change_shippingmethod', 'Can change shipping method'),
('207', '43', 'delete_shippingmethod', 'Can delete shipping method'),
('208', '43', 'view_shippingmethod', 'Can view shipping method'),
('209', '45', 'add_shippingmethodcountry', 'Can add shipping method country'),
('210', '45', 'change_shippingmethodcountry', 'Can change shipping method country'),
('211', '45', 'delete_shippingmethodcountry', 'Can delete shipping method country'),
('212', '45', 'view_shippingmethodcountry', 'Can view shipping method country'),
('213', '42', 'add_paymentmethodcountry', 'Can add payment method country'),
('214', '42', 'change_paymentmethodcountry', 'Can change payment method country'),
('215', '42', 'delete_paymentmethodcountry', 'Can delete payment method country'),
('216', '42', 'view_paymentmethodcountry', 'Can view payment method country'),
('217', '9', 'add_category', 'Can add category'),
('218', '9', 'change_category', 'Can change category'),
('219', '9', 'delete_category', 'Can delete category'),
('220', '9', 'view_category', 'Can view category'),
('221', '11', 'add_country', 'Can add Country'),
('222', '11', 'change_country', 'Can change Country'),
('223', '11', 'delete_country', 'Can delete Country'),
('224', '11', 'view_country', 'Can view Country'),
('225', '12', 'add_currency', 'Can add Currency'),
('226', '12', 'change_currency', 'Can change Currency'),
('227', '12', 'delete_currency', 'Can delete Currency'),
('228', '12', 'view_currency', 'Can view Currency'),
('229', '40', 'add_vatgroup', 'Can add VAT Group'),
('230', '40', 'change_vatgroup', 'Can change VAT Group'),
('231', '40', 'delete_vatgroup', 'Can delete VAT Group'),
('232', '40', 'view_vatgroup', 'Can view VAT Group'),
('233', '47', 'add_billinginfo', 'Can add Billing Address'),
('234', '47', 'change_billinginfo', 'Can change Billing Address'),
('235', '47', 'delete_billinginfo', 'Can delete Billing Address'),
('236', '47', 'view_billinginfo', 'Can view Billing Address'),
('237', '48', 'add_shippinginfo', 'Can add Shipping Address'),
('238', '48', 'change_shippinginfo', 'Can change Shipping Address'),
('239', '48', 'delete_shippinginfo', 'Can delete Shipping Address'),
('240', '48', 'view_shippinginfo', 'Can view Shipping Address'),
('241', '50', 'add_order', 'Can add order'),
('242', '50', 'change_order', 'Can change order'),
('243', '50', 'delete_order', 'Can delete order'),
('244', '50', 'view_order', 'Can view order'),
('245', '16', 'add_product', 'Can add product'),
('246', '16', 'change_product', 'Can change product'),
('247', '16', 'delete_product', 'Can delete product'),
('248', '16', 'view_product', 'Can view product'),
('249', '13', 'add_productvariant', 'Can add product variant'),
('250', '13', 'change_productvariant', 'Can change product variant'),
('251', '13', 'delete_productvariant', 'Can delete product variant'),
('252', '13', 'view_productvariant', 'Can view product variant'),
('253', '17', 'add_attributetype', 'Can add attribute type'),
('254', '17', 'change_attributetype', 'Can change attribute type'),
('255', '17', 'delete_attributetype', 'Can delete attribute type'),
('256', '17', 'view_attributetype', 'Can view attribute type'),
('257', '18', 'add_baseattribute', 'Can add base attribute'),
('258', '18', 'change_baseattribute', 'Can change base attribute'),
('259', '18', 'delete_baseattribute', 'Can delete base attribute'),
('260', '18', 'view_baseattribute', 'Can view base attribute'),
('261', '19', 'add_extattributetype', 'Can add ext attribute type'),
('262', '19', 'change_extattributetype', 'Can change ext attribute type'),
('263', '19', 'delete_extattributetype', 'Can delete ext attribute type'),
('264', '19', 'view_extattributetype', 'Can view ext attribute type'),
('265', '20', 'add_extensionattribute', 'Can add extension attribute'),
('266', '20', 'change_extensionattribute', 'Can change extension attribute'),
('267', '20', 'delete_extensionattribute', 'Can delete extension attribute'),
('268', '20', 'view_extensionattribute', 'Can view extension attribute'),
('269', '22', 'add_productprice', 'Can add product price'),
('270', '22', 'change_productprice', 'Can change product price'),
('271', '22', 'delete_productprice', 'Can delete product price'),
('272', '22', 'view_productprice', 'Can view product price'),
('273', '21', 'add_pricelist', 'Can add price list'),
('274', '21', 'change_pricelist', 'Can change price list'),
('275', '21', 'delete_pricelist', 'Can delete price list'),
('276', '21', 'view_pricelist', 'Can view price list'),
('277', '23', 'add_productmedia', 'Can add product media'),
('278', '23', 'change_productmedia', 'Can change product media'),
('279', '23', 'delete_productmedia', 'Can delete product media'),
('280', '23', 'view_productmedia', 'Can view product media'),
('281', '24', 'add_productvariantmedia', 'Can add product variant media'),
('282', '24', 'change_productvariantmedia', 'Can change product variant media'),
('283', '24', 'delete_productvariantmedia', 'Can delete product variant media'),
('284', '24', 'view_productvariantmedia', 'Can view product variant media'),
('285', '14', 'add_producttype', 'Can add product type'),
('286', '14', 'change_producttype', 'Can change product type'),
('287', '14', 'delete_producttype', 'Can delete product type'),
('288', '14', 'view_producttype', 'Can view product type'),
('289', '30', 'add_user', 'Can add user'),
('290', '30', 'change_user', 'Can change user'),
('291', '30', 'delete_user', 'Can delete user'),
('292', '30', 'view_user', 'Can view user'),
('293', '25', 'add_managerpermission', 'Can add manager permission'),
('294', '25', 'change_managerpermission', 'Can change manager permission'),
('295', '25', 'delete_managerpermission', 'Can delete manager permission'),
('296', '25', 'view_managerpermission', 'Can view manager permission'),
('297', '26', 'add_managergroup', 'Can add manager group'),
('298', '26', 'change_managergroup', 'Can change manager group'),
('299', '26', 'delete_managergroup', 'Can delete manager group'),
('300', '26', 'view_managergroup', 'Can view manager group'),
('301', '29', 'add_blacklistedtoken', 'Can add blacklisted token'),
('302', '29', 'change_blacklistedtoken', 'Can change blacklisted token'),
('303', '29', 'delete_blacklistedtoken', 'Can delete blacklisted token'),
('304', '29', 'view_blacklistedtoken', 'Can view blacklisted token'),
('305', '28', 'add_outstandingtoken', 'Can add outstanding token'),
('306', '28', 'change_outstandingtoken', 'Can change outstanding token'),
('307', '28', 'delete_outstandingtoken', 'Can delete outstanding token'),
('308', '28', 'view_outstandingtoken', 'Can view outstanding token'),
('309', '51', 'add_translatableattributetype', 'Can add translatable attribute type'),
('310', '51', 'change_translatableattributetype', 'Can change translatable attribute type'),
('311', '51', 'delete_translatableattributetype', 'Can delete translatable attribute type'),
('312', '51', 'view_translatableattributetype', 'Can view translatable attribute type'),
('313', '54', 'add_translatablebaseattribute', 'Can add translatable base attribute'),
('314', '54', 'change_translatablebaseattribute', 'Can change translatable base attribute'),
('315', '54', 'delete_translatablebaseattribute', 'Can delete translatable base attribute'),
('316', '54', 'view_translatablebaseattribute', 'Can view translatable base attribute'),
('317', '57', 'view', 'Access admin page'),
('318', '58', 'add_testmodel', 'Can add test model'),
('319', '58', 'change_testmodel', 'Can change test model'),
('320', '58', 'delete_testmodel', 'Can delete test model'),
('321', '58', 'view_testmodel', 'Can view test model'),
('322', '60', 'add_review', 'Can add review'),
('323', '60', 'change_review', 'Can change review'),
('324', '60', 'delete_review', 'Can delete review'),
('325', '60', 'view_review', 'Can view review');

INSERT INTO "cart_cart" ("token", "update_at", "create_at", "country_id", "user_id", "payment_method_country_id", "shipping_method_country_id", "pricelist_id", "billing_info_id", "shipping_info_id") VALUES
('058b40e2ddb9461b95260b2caaccd9c2', '2023-06-05 07:42:08.929864', '2023-06-05 07:42:08.853979', 'cz', 'admin@example.com', NULL, NULL, 'CZK_maloobchod', NULL, NULL),
('0c2c7f336f9e42cc9f7200c2134dfd35', '2023-06-20 20:03:46.641286', '2023-06-20 20:03:46.558154', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', NULL, NULL),
('16b4af388bde47c39f0055ec6b65ce9e', '2023-06-02 13:56:09.715440', '2023-06-02 13:56:09.715589', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('174e6051d4c84c02916ec2e613d8a71d', '2023-05-16 19:07:35.267623', '2023-05-16 19:07:35.181634', 'cz', NULL, NULL, NULL, NULL, NULL, NULL),
('1e967a680ace4c728cfb7e62afffc36f', '2023-07-03 13:00:18.351941', '2023-07-03 11:50:02.810694', 'cz', 'michal@test.com', '1', '3', 'CZK_maloobchod', '15', '15'),
('2a9e20d16de24f66a4a40427a7196efe', '2023-05-26 09:47:28.106994', '2023-05-26 09:47:27.977510', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', NULL, NULL),
('39999c043b2e4ccebf80c9bc1776a3a4', '2023-05-26 09:46:16.012072', '2023-05-26 09:46:15.953695', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('3ef2baec272f4221a5f83d54effe8fba', '2023-06-02 13:58:46.965111', '2023-06-02 13:58:46.965254', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('3fd6606f225e49f6af1ac2477286409a', '2023-05-24 09:30:48.086812', '2023-05-21 11:40:05.090319', 'cz', NULL, '1', '1', 'CZK_maloobchod', '6', '6'),
('4496d3ddc35444db9812974de2f98b0f', '2023-06-02 13:56:43.842797', '2023-06-02 13:56:43.842952', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('4c2f99f603764574919068dfcc40dbf8', '2023-06-02 13:58:43.920214', '2023-06-02 13:58:43.920358', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('4ea482d4b64c46f88a3b5b8e7df49462', '2023-06-02 13:56:37.239102', '2023-06-02 13:56:37.239242', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('51665362e57b43bd884647f5943eaeb3', '2023-05-26 09:46:22.631477', '2023-05-26 09:46:22.592759', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('6c7c1eadd1364e54898789b16c77b9c0', '2023-05-19 09:06:02.826230', '2023-05-19 09:06:02.708668', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', NULL, NULL),
('6d2796692b2c4f6e957a14d92cbd324c', '2023-06-12 11:52:27.786828', '2023-06-12 09:04:11.621520', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '7', '7'),
('70e25d64c20148559f39047641aaa14b', '2023-06-12 16:03:40.148364', '2023-06-12 16:03:02.629564', 'cz', NULL, '6', '1', 'CZK_maloobchod', '12', '12'),
('8d251ee7469c45c6874fb14983a89cda', '2023-05-19 09:06:48.124104', '2023-05-19 09:06:48.005347', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', NULL, NULL),
('8d69e1c11cd44745bd39ef9882e9a8ef', '2023-06-02 13:58:43.924385', '2023-06-02 13:58:43.924398', 'cz', NULL, '6', '1', 'CZK_maloobchod', '1', '1'),
('a3e78b349288491e864b00598cf7a342', '2023-06-02 13:56:15.899220', '2023-06-02 13:56:15.899385', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('a3fb5406a21040a89ed8515fdcdea4cf', '2023-06-02 13:56:56.598340', '2023-06-02 13:56:56.598503', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('a48e9aa56a9647f99a18a1e99ab4f2f9', '2023-06-05 08:18:34.275076', '2023-06-02 14:01:40.937686', 'cz', NULL, '6', '1', 'CZK_maloobchod', '1', '1'),
('a78815a6d16d4b13a49da246a5026aba', '2023-06-12 15:36:02.028115', '2023-06-12 15:34:52.429503', 'cz', NULL, '6', '1', 'CZK_maloobchod', '8', '8'),
('a7aa553a35b24fdd95dc998dd4f79a93', '2023-06-02 13:55:13.612361', '2023-06-02 13:55:13.612552', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('acb5088e649849619c87d5593f689829', '2023-05-16 19:04:03.775160', '2023-05-16 19:04:03.734424', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('b3352f7a1a72482581b4c1a50449f3d1', '2023-06-13 09:14:32.398582', '2023-06-13 09:14:32.313373', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', NULL, NULL),
('b77677c87a91415e93c781054220fb62', '2023-06-12 15:58:26.405501', '2023-06-12 15:57:05.393878', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '10', '10'),
('ba6e926407d6447e97b3642c166a1fd2', '2023-06-19 12:00:20.943547', '2023-06-16 15:03:39.551614', 'cz', 'admin@example.com', '7', '3', 'CZK_maloobchod', '14', '14'),
('bb354f167cf34e8caf1a282c72157c48', '2023-06-13 07:44:09.162514', '2023-06-13 07:44:09.073727', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', NULL, NULL),
('bbe1dd32c328406ea0427c868aa16230', '2023-05-16 19:07:57.892591', '2023-05-16 19:07:57.828716', 'cz', NULL, NULL, NULL, NULL, NULL, NULL),
('cb46c049687944f8a49c2b7bbe5284a0', '2023-05-16 19:03:02.554743', '2023-05-16 19:03:02.493359', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('cc37ef37b76d4e659bb837e95fd1e2d9', '2023-06-12 16:04:47.335476', '2023-06-12 16:04:27.594061', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '13', '13'),
('d61047de15574b9b9498f6b60af52977', '2023-06-12 15:53:27.982552', '2023-06-12 15:52:51.489668', 'cz', NULL, '6', '1', 'CZK_maloobchod', '9', '9'),
('d9a1deb9d5594d3d841ae0e6c4c9ff8f', '2023-06-02 14:01:40.933941', '2023-06-02 14:01:40.934075', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('e81086b8af914d459c72d31f72e69ae6', '2023-06-02 13:55:43.346333', '2023-06-02 13:55:43.346475', 'cz', NULL, NULL, '1', 'CZK_maloobchod', '1', '1'),
('e8a06e65eada4316a5e4f5a8af6bce90', '2023-06-02 13:58:46.967909', '2023-06-02 13:58:46.967919', 'cz', NULL, '6', '1', 'CZK_maloobchod', '1', '1'),
('ef08624314584302817f1bd86b69a27d', '2023-06-12 15:58:43.602748', '2023-06-12 15:57:31.686152', 'cz', NULL, '6', '1', 'CZK_maloobchod', '11', '11'),
('f35ee6222a3848758eceee93599ff064', '2023-05-20 07:21:51.211791', '2023-05-19 18:41:00.335383', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', '5', '5'),
('f95a7979e68242e2bfd6207782c72290', '2023-05-19 08:16:08.101332', '2023-05-16 19:09:31.198658', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', '3', '3'),
('fa54ced9569945cd92f85cf6b5da402f', '2023-05-19 09:11:10.815154', '2023-05-19 09:09:50.024187', 'cz', NULL, NULL, NULL, 'CZK_maloobchod', '4', '4');

INSERT INTO "cart_cartitem" ("id", "unit_price_incl_vat", "unit_price_without_vat", "quantity", "cart_id", "product_variant_id", "product_id", "discount") VALUES
('33', '175', '211.75', '1', 'bbe1dd32c328406ea0427c868aa16230', 'espresso250', '1', NULL),
('34', '175', '211.75', '1', 'f95a7979e68242e2bfd6207782c72290', 'espresso250', '1', NULL),
('35', '175', '211.75', '1', 'f95a7979e68242e2bfd6207782c72290', 'espresso250', '1', NULL),
('36', '175', '211.75', '1', 'f95a7979e68242e2bfd6207782c72290', 'espresso250', '1', NULL),
('37', '175', '211.75', '1', 'f95a7979e68242e2bfd6207782c72290', 'espresso250', '1', NULL),
('38', '175', '211.75', '1', 'f95a7979e68242e2bfd6207782c72290', 'espresso250', '1', NULL),
('39', '175', '211.75', '1', '6c7c1eadd1364e54898789b16c77b9c0', 'espresso250', '1', NULL),
('40', '175', '211.75', '1', '8d251ee7469c45c6874fb14983a89cda', 'espresso250', '1', NULL),
('41', '175', '211.75', '1', 'fa54ced9569945cd92f85cf6b5da402f', 'espresso250', '1', NULL),
('42', '175', '211.75', '1', 'f35ee6222a3848758eceee93599ff064', 'espresso250', '1', NULL),
('43', '175', '211.75', '1', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('44', '175', '211.75', '1', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('45', '175', '211.75', '1', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('46', '175', '211.75', '1', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('47', '175', '211.75', '3', '2a9e20d16de24f66a4a40427a7196efe', 'espresso250', '1', NULL),
('48', '175', '211.75', '2', '2a9e20d16de24f66a4a40427a7196efe', 'espresso250', '1', NULL),
('49', '175', '211.75', '2', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('50', '175', '211.75', '4', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('51', '175', '211.75', '5', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('52', '175', '211.75', '3', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('53', '175', '211.75', '2', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('54', '175', '211.75', '3', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('55', '175', '211.75', '3', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('56', '175', '211.75', '2', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('57', '250', '302.5', '2', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('58', '250', '302.5', '100', '3fd6606f225e49f6af1ac2477286409a', 'espresso250', '1', NULL),
('59', '475', '574.75', '123', '3fd6606f225e49f6af1ac2477286409a', 'espresso500', '1', NULL),
('60', '250', '302.5', '1', '058b40e2ddb9461b95260b2caaccd9c2', 'espresso250', '1', NULL),
('61', '475', '574.75', '2', '058b40e2ddb9461b95260b2caaccd9c2', 'espresso500', '1', NULL),
('62', '250', '302.5', '1', '6d2796692b2c4f6e957a14d92cbd324c', 'espresso250', '1', NULL),
('63', '250', '302.5', '1', 'a78815a6d16d4b13a49da246a5026aba', 'espresso250', '1', NULL),
('64', '250', '302.5', '1', 'd61047de15574b9b9498f6b60af52977', 'espresso250', '1', NULL),
('65', '250', '302.5', '1', 'b77677c87a91415e93c781054220fb62', 'espresso250', '1', NULL),
('66', '250', '302.5', '1', 'ef08624314584302817f1bd86b69a27d', 'espresso250', '1', NULL),
('67', '250', '302.5', '1', '70e25d64c20148559f39047641aaa14b', 'espresso250', '1', NULL),
('68', '250', '302.5', '1', 'cc37ef37b76d4e659bb837e95fd1e2d9', 'espresso250', '1', NULL),
('69', '250', '302.5', '1', 'bb354f167cf34e8caf1a282c72157c48', 'espresso250', '1', NULL),
('70', '250', '302.5', '1', 'b3352f7a1a72482581b4c1a50449f3d1', 'espresso250', '1', NULL),
('71', '250', '302.5', '1', 'ba6e926407d6447e97b3642c166a1fd2', 'espresso250', '1', NULL),
('72', '200', '242', '1', 'ba6e926407d6447e97b3642c166a1fd2', 't-shirt-2', '4', NULL),
('73', '302.5', '250', '1', '0c2c7f336f9e42cc9f7200c2134dfd35', 'espresso250', '1', NULL),
('74', '302.5', '250', '1', '1e967a680ace4c728cfb7e62afffc36f', 'espresso250', '1', NULL);

INSERT INTO "cart_paymentmethod" ("id", "image", "update_at", "create_at", "safe_deleted") VALUES
('1', 'payment_method/1.png', '2023-05-09 15:22:47.151791', '2023-05-09 13:13:58.403758', '0'),
('3', '', '2023-06-02 13:40:55.347358', '2023-05-09 18:10:22.898747', '0'),
('4', '', '2023-06-05 05:14:29.228873', '2023-06-02 13:41:03.626930', '0');

INSERT INTO "cart_paymentmethod_translation" ("id", "language_code", "title", "description", "master_id") VALUES
('1', 'en', 'Cash on delivery', 'Pay to currier by card or in cash.', '1'),
('2', 'cs', 'Dobírka', 'Platba při převzetí.', '1'),
('5', 'en', 'Bank Transfer', NULL, '3'),
('6', 'cs', 'Platba převodem', NULL, '3'),
('7', 'en', 'Online payment gateway', NULL, '4'),
('8', 'cs', 'Online platba', NULL, '4');

INSERT INTO "cart_paymentmethodcountry" ("id", "is_active", "update_at", "create_at", "country_id", "currency_id", "payment_method_id", "vat_group_id", "price", "api_request", "safe_deleted") VALUES
('1', '1', '2023-05-09 14:45:10.431198', '2023-05-09 14:45:10.431438', 'cz', 'CZK', '1', '1', '40', NULL, '0'),
('3', '1', '2023-05-09 15:22:46.018392', '2023-05-09 15:22:46.018435', 'de', 'EUR', '1', '2', '2', NULL, '0'),
('6', '1', '2023-06-12 11:51:45.714419', '2023-06-02 13:41:42.621797', 'cz', 'CZK', '4', '1', '0', 'TEST_API', '0'),
('7', '1', '2023-06-19 11:59:58.675217', '2023-06-19 11:59:58.675291', 'cz', 'CZK', '3', '1', '0', 'BANKTRANSFER_CZK', '0');

INSERT INTO "cart_shippingmethod" ("id", "image", "update_at", "create_at", "safe_deleted") VALUES
('1', 'shipping_method/1_dqi8mZ1.png', '2023-06-12 11:06:11.551767', '2023-05-09 08:37:04.391633', '0'),
('4', 'shipping_method/4.png', '2023-06-19 12:00:12.899335', '2023-05-09 15:22:20.159284', '0'),
('5', '', '2023-05-09 18:08:16.779782', '2023-05-09 18:07:57.145986', '0');

INSERT INTO "cart_shippingmethod_translation" ("id", "language_code", "title", "description", "master_id") VALUES
('1', 'en', 'DHL701WWWaaaa', 'Fast delivery2', NULL),
('2', 'cs', 'DHL', 'Rychlé doručení', NULL),
('3', 'en', 'DHL', '24 hour shipping', '1'),
('4', 'cs', 'DHL', 'Doručení do 24 hodin.', '1'),
('5', 'en', 'DPD', NULL, '4'),
('6', 'cs', 'DPD', NULL, '4'),
('7', 'en', 'Czech post', NULL, '5'),
('8', 'cs', 'Česká Pošta', NULL, '5');

INSERT INTO "cart_shippingmethodcountry" ("id", "is_active", "update_at", "create_at", "country_id", "currency_id", "shipping_method_id", "vat_group_id", "price", "safe_deleted") VALUES
('1', '1', '2023-06-16 14:05:02.160873', '2023-05-09 14:29:37.212641', 'cz', 'CZK', '1', '1', '150', '1'),
('2', '1', '2023-05-09 15:30:25.389213', '2023-05-09 15:30:25.389253', 'de', 'EUR', '4', '2', '5', '0'),
('3', '1', '2023-06-19 12:00:11.879602', '2023-05-09 15:30:37.225756', 'cz', 'CZK', '4', '1', '100', '0'),
('4', '1', '2023-05-18 08:48:48.611721', '2023-05-09 15:31:10.142287', 'de', 'EUR', '1', '2', '6', '0');

INSERT INTO "cart_shippingmethodcountry_payment_methods" ("id", "shippingmethodcountry_id", "paymentmethodcountry_id") VALUES
('5', '4', '3'),
('10', '1', '6'),
('11', '3', '1'),
('12', '3', '6'),
('13', '3', '7');

INSERT INTO "category_category" ("id", "lft", "rght", "tree_id", "level", "create_at", "published", "update_at", "safe_deleted", "parent_id") VALUES
('1', '1', '12', '1', '0', '2023-04-20 08:44:36.260901', '1', '2023-06-16 12:48:10.287691', '0', NULL),
('2', '2', '9', '1', '1', '2023-04-20 08:45:39.308649', '1', '2023-04-20 08:45:39.308608', '0', '1'),
('3', '1', '4', '2', '0', '2023-04-20 08:46:00.734703', '1', '2023-04-20 08:46:00.734648', '0', NULL),
('4', '2', '3', '2', '1', '2023-04-20 08:46:38.309200', '1', '2023-04-20 08:46:38.309158', '0', '3'),
('5', '10', '11', '1', '1', '2023-04-20 13:16:51.401314', '1', '2023-04-20 13:16:51.401233', '0', '1'),
('6', '3', '8', '1', '2', '2023-04-20 13:17:06.793357', '1', '2023-04-20 13:17:06.793319', '0', '2'),
('7', '4', '5', '1', '3', '2023-04-26 19:16:23.722280', '1', '2023-04-26 19:16:23.722231', '0', '6'),
('8', '6', '7', '1', '3', '2023-04-26 19:16:44.003145', '1', '2023-04-26 19:16:44.003109', '0', '6');

INSERT INTO "category_category_translation" ("id", "language_code", "title", "meta_title", "meta_description", "description", "slug", "master_id", "description_editorjs") VALUES
('1', 'en', 'Coffee1', '', '', '', 'coffee1', '1', NULL),
('2', 'cs', 'Káva', '', '', '', 'kava', '1', NULL),
('3', 'en', 'Beans', '', '', '', 'beans', '2', NULL),
('4', 'cs', 'zrnková káva', '', '', '', 'zrnkova-kava', '2', NULL),
('5', 'en', 'Accessories', '', '', '', 'accessories', '3', NULL),
('6', 'cs', 'Příslušenství', '', '', '', 'prislusenstvi', '3', NULL),
('7', 'en', 'Grinders', '', '', '', 'grinders', '4', NULL),
('8', 'cs', 'Mlýnky na kávu', '', '', '', 'mlynky-na-kavu', '4', NULL),
('9', 'en', 'Grind', '', '', '', 'grind', '5', NULL),
('10', 'cs', 'Mletá', '', '', '', 'mleta', '5', NULL),
('11', 'en', 'Light', '', '', '', 'light', '6', NULL),
('12', 'cs', 'Světlá', '', '', '', 'svetla', '6', NULL),
('13', 'en', 'Blend', '', '', '', 'blend', '7', NULL),
('14', 'cs', 'Blend', '', '', '', 'blend', '7', NULL),
('15', 'en', '100% arabica', '', '', '', '100-arabica', '8', NULL),
('16', 'cs', '100% arabica', '', '', '', '100-arabica', '8', NULL);

INSERT INTO "cms_page" ("id", "published", "ordering", "recommended", "polymorphic_ctype_id", "safe_deleted") VALUES
('4', '0', '0', '0', '35', '1'),
('5', '1', '0', '0', '38', '0'),
('6', '0', '0', '0', '38', '1'),
('7', '0', '0', '0', '38', '1'),
('8', '1', '0', '0', '38', '0'),
('13', '1', '0', '0', '38', '1'),
('14', '1', '0', '0', '38', '0'),
('15', '1', '0', '0', '38', '0'),
('16', '1', '0', '0', '38', '0');

INSERT INTO "cms_page_categories" ("id", "page_id", "pagecategory_id") VALUES
('5', '5', '6'),
('6', '8', '6'),
('7', '14', '8'),
('8', '15', '9'),
('9', '16', '9'),
('10', '14', '11');

INSERT INTO "cms_pagecategory" ("id", "sort_order", "published", "code", "ordering", "image", "safe_deleted") VALUES
('6', '0', '1', 'ABOUT-US', '0', '', '0'),
('7', '0', '0', 'ahoj', '0', '', '1'),
('8', '0', '1', 'CONTACT', '0', '', '0'),
('9', '0', '1', 'ORDER', '0', '', '0'),
('10', '0', '0', '', '0', '', '1'),
('11', '0', '1', 'MAIN-LINKS', '0', '', '0');

INSERT INTO "cms_pagecategory_translation" ("id", "language_code", "title", "master_id") VALUES
('7', 'en', 'mnam', '7'),
('8', 'en', 'About us', '6'),
('9', 'cs', 'O nás', '6'),
('10', 'en', 'Contact', '8'),
('11', 'cs', 'Kontakt', '8'),
('12', 'en', 'Order', '9'),
('13', 'cs', 'Objednávka', '9'),
('14', 'en', 'Main links', '11'),
('15', 'cs', 'Hlavní odkazy', '11');

INSERT INTO "cms_pagecategory_type" ("id", "pagecategory_id", "pagecategorytype_id") VALUES
('5', '6', '2'),
('6', '8', '2'),
('7', '9', '2'),
('9', '11', '3');

INSERT INTO "cms_pagecategorytype" ("id", "identifier", "safe_deleted") VALUES
('2', 'FOOTER', '0'),
('3', 'HEADER', '0'),
('4', 'HOMEPAGE', '0'),
('5', 'TEST', '1');

INSERT INTO "cms_pagecms" ("page_ptr_id") VALUES
('5'),
('6'),
('7'),
('8'),
('13'),
('14'),
('15'),
('16');

INSERT INTO "cms_pagecms_translation" ("id", "language_code", "slug", "title", "content", "master_id") VALUES
('1', 'en', 'terms-and-conditions', 'Terms & conditions', '{"time": 1682362183705, "blocks": [{"id": "ckMlxEyIwT", "type": "header", "data": {"text": "Terms &amp; condition of our stupid corporation", "level": 2}}, {"id": "QcB22KidKQ", "type": "paragraph", "data": {"text": "you pay, we get money"}}, {"id": "2PRkpsUPQ5", "type": "paragraph", "data": {"text": "yep"}}], "version": "2.26.5"}', '5'),
('2', 'en', 'privacy-condition', 'Privacy condition', '{"time": 1687851117661, "blocks": [{"id": "HvBWIh4GOb", "type": "paragraph", "data": {"text": "lol, sure"}}, {"id": "GEIuOZ8HlX", "type": "image", "data": {"file": {"url": "http://localhost:8000/media/editorjs/1682512632.jpg"}, "caption": "", "withBorder": false, "stretched": false, "withBackground": false}}], "version": "2.26.5"}', '8'),
('3', 'cs', 'obchodni-podminky', 'Obchodní podmínky', '{"time": 1682362353699, "blocks": [{"id": "KZFz2YOlX-", "type": "header", "data": {"text": "Obchodn\u00ed podm\u00ednky skv\u011bl\u00e9 korporace", "level": 2}}, {"id": "r6_lZDtXzV", "type": "paragraph", "data": {"text": "Ano"}}, {"id": "pt0Km7ynP9", "type": "paragraph", "data": {"text": "Na\u0161e podm\u00ednky"}}], "version": "2.26.5"}', '5'),
('5', 'en', 'test', 'test', NULL, '13'),
('6', 'en', 'contact', 'Contact', '{"time": 1687861454428, "blocks": [{"id": "qNrlKPbZkQ", "type": "paragraph", "data": {"text": "+420 321 456 789"}}, {"id": "YPjITWvUEr", "type": "paragraph", "data": {"text": "<b>support@ecoseller.io</b>"}}], "version": "2.26.5"}', '14'),
('7', 'cs', 'kontakt', 'Kontakt', '{"time": 1687851153066, "blocks": [{"id": "MFcc7QOdCM", "type": "paragraph", "data": {"text": "+420 123 456 789"}}, {"id": "38lmvxSyT8", "type": "paragraph", "data": {"text": "info@ecoseller.io"}}], "version": "2.26.5"}', '14'),
('8', 'en', 'shipping-and-payment', 'Shipping & payment', '{"time": 1687851197587, "blocks": [{"id": "lYY98u0qxi", "type": "paragraph", "data": {"text": "\u010cesk\u00e1 Po\u0161ta"}}, {"id": "XJMrbMWoBb", "type": "paragraph", "data": {"text": "PPL"}}, {"id": "azQfUYlDRq", "type": "paragraph", "data": {"text": "DHL"}}, {"id": "-mrygV35no", "type": "paragraph", "data": {"text": "DPD"}}], "version": "2.26.5"}', '15'),
('9', 'cs', 'doprava-and-platba', 'Doprava & Platba', '{"time": 1687851194111, "blocks": [{"id": "dP6EolqdB7", "type": "paragraph", "data": {"text": "\u010cesk\u00e1 Po\u0161ta"}}, {"id": "m9iUgG305e", "type": "paragraph", "data": {"text": "PPL"}}, {"id": "mRbdqtKAcR", "type": "paragraph", "data": {"text": "DHL"}}, {"id": "CP5dq9EOi8", "type": "paragraph", "data": {"text": "DPD"}}], "version": "2.26.5"}', '15'),
('10', 'en', 'test', 'Test', NULL, '16'),
('11', 'cs', 'test', 'Test', NULL, '16');

INSERT INTO "cms_pagefrontend" ("page_ptr_id", "frontend_path") VALUES
('4', '/contact');

INSERT INTO "country_billinginfo" ("id", "first_name", "surname", "street", "city", "postal_code", "company_name", "company_id", "vat_number", "country_id", "user_id", "safe_deleted") VALUES
('1', 'Jane', 'Doe', 'Malostranské nám. 25', 'Praha', '11800', 'ExampleCorp Inc.', '1234567', NULL, 'cz', NULL, '0'),
('2', 'Michal', 'Půlpán', 'Vojenova 7', 'Hradec Králové', '50003', NULL, '123456', NULL, 'cz', NULL, '0'),
('3', 'Jan', 'Novák', 'Na Příkopech 1', 'Praha', '11000', '', '', '', 'cz', NULL, '0'),
('4', 'Jan', 'Novák', 'Ulice 1', 'Praha', '1100', '', '', '', 'cz', NULL, '0'),
('5', 'michal', 'pulpan', 'ahoj', 'ads', '11', '', '', '', 'cz', NULL, '0'),
('6', 'michal', 'pulpan', 'Street 1', 'Praha 8', '18000', '', '', '', 'cz', NULL, '0'),
('7', 'Michal', 'Pulpan', 'vojenova 7', 'Praha 8', '18000', '', '', '', 'cz', NULL, '0'),
('8', 'Michal', 'Půlpán', 'Piletická 59/43a', 'Hradec Králové', '50003', '', '', '', 'cz', NULL, '0'),
('9', 'John', 'Doe', 'Test 1', 'Test', '11111', '', '', '', 'cz', NULL, '0'),
('10', 'John', 'Doe', 'Test', 'Test', '1111', '', '', '', 'cz', NULL, '0'),
('11', 'John', 'Doe', 'Test', 'Test', '1111', '', '', '', 'cz', NULL, '0'),
('12', 'John', 'Doe', 'Test', 'Praha', '1111', '', '', '', 'cz', NULL, '0'),
('13', 'j', 'j', 'j', 'j', 'a', '', '', '', 'cz', NULL, '0'),
('14', 'Michal', 'Pulpan', 'Malostranska 25', 'Hradec Kralove', '50003', '', '', '', 'cz', NULL, '0'),
('15', 'Michal', 'Půlpán', 'Aaa', 'BBB', '5555', '', '', '', 'cz', NULL, '0');

INSERT INTO "country_country" ("code", "name", "locale", "update_at", "create_at", "default_price_list_id", "safe_deleted") VALUES
('at', 'Austria', 'de', '2023-06-16 13:24:56.427082', '2023-05-28 14:06:43.803601', 'EUR_maloobchod', '1'),
('bg', 'Bulgaria', 'en', '2023-05-11 12:54:27.153160', '2023-05-11 12:52:44.997285', 'EUR_maloobchod', '0'),
('cz', 'Česká republika', 'cs', '2023-05-28 14:06:33.072237', '2023-05-04 14:35:59.701900', 'CZK_maloobchod', '0'),
('de', 'Deutschland', 'de', '2023-05-04 14:36:16.964231', '2023-05-04 14:36:16.964280', 'EUR_maloobchod', '0');

INSERT INTO "country_currency" ("code", "symbol", "symbol_position", "create_at", "update_at", "safe_deleted") VALUES
('CZK', 'Kč', 'AFTER', '2023-04-06 08:10:21.083351', '2023-06-16 13:31:12.782645', '0'),
('EUR', '€', 'AFTER', '2023-05-03 14:59:26.970206', '2023-06-16 13:31:12.823819', '0'),
('PLN', 'zł', 'AFTER', '2023-05-28 14:44:41.419318', '2023-06-16 13:31:12.786734', '0'),
('TST', 't', 'AFTER', '2023-06-16 13:36:33.129273', '2023-06-16 13:36:39.593164', '1');

INSERT INTO "country_shippinginfo" ("id", "first_name", "surname", "street", "city", "postal_code", "email", "phone", "additional_info", "country_id", "user_id", "safe_deleted") VALUES
('1', 'John', 'Doe2', 'Malostranské nám. 25', 'Praha', '11800', 'me@michalpulpan.eu', '123456789', NULL, 'cz', NULL, '0'),
('2', 'Michal', 'Půlpán', 'Vojenova 7', 'Praha 8', '18000', 'michal@michalpulpan.cz', '721262110', '', 'cz', NULL, '0'),
('3', 'Michal', 'Půlpán', 'Vojenova 7', 'Praha 8', '18000', 'michal@michalpulpan.cz', '721262110', '', 'cz', NULL, '0'),
('4', 'Jan', 'Novák', 'Ulice 1', 'Praha', '1100', 'jnovak@email.cz', '123456789', 'Patro 2', 'cz', NULL, '0'),
('5', 'michal', 'pulpan', 'ahoj', 'ads', '11', 'michal@michalpulpan.eu', '1112344', 'patro', 'cz', NULL, '0'),
('6', 'michal', 'pulpan', 'Street 1', 'Praha 8', '18000', 'michal@michalpulpan.cz', '00420123456789', '', 'cz', NULL, '0'),
('7', 'Michal', 'Pulpan', 'vojenova 7', 'Praha 8', '18000', 'me@michalpulpan.eu', '721262110', '', 'cz', NULL, '0'),
('8', 'Michal', 'Půlpán', 'Piletická 59/43a', 'Hradec Králové', '50003', 'me@michalpulpan.eu', '721262110', '', 'cz', NULL, '0'),
('9', 'John', 'Doe', 'Test 1', 'Test', '11111', 'jdoe@exampl.ecom', '123456789', '', 'cz', NULL, '0'),
('10', 'John', 'Doe', 'Test', 'Test', '1111', 'jdoe@example.com', '123456789', '', 'cz', NULL, '0'),
('11', 'John', 'Doe', 'Test', 'Test', '1111', 'jdoe@example.com', '123456789', '', 'cz', NULL, '0'),
('12', 'John', 'Doe', 'Test', 'Praha', '1111', 'jdoe@example.com', '123456789', '', 'cz', NULL, '0'),
('13', 'j', 'j', 'j', 'j', 'a', 'j@j.cz', '123', '', 'cz', NULL, '0'),
('14', 'Michal', 'Pulpan', 'Malostranska 25', 'Hradec Kralove', '50003', 'me@michalpulpan.eu', '721262110', '', 'cz', NULL, '0'),
('15', 'Michal', 'Půlpán', 'Aaa', 'BBB', '5555', 'michal@michalpulpan.cz', '123456789', '', 'cz', NULL, '0');

INSERT INTO "country_vatgroup" ("id", "name", "rate", "update_at", "create_at", "country_id", "is_default", "safe_deleted") VALUES
('1', 'STANDARD', '21', '2023-05-05 08:15:45.998195', '2023-05-04 19:00:27.896319', 'cz', '1', '0'),
('2', 'standard', '19', '2023-05-28 14:15:51.425612', '2023-05-04 19:45:11.370351', 'de', '1', '0'),
('3', 'Standard', '20', '2023-05-04 19:45:33.939420', '2023-05-04 19:45:33.939466', 'cz', '0', '0'),
('4', 'REDUCED', '15', '2023-05-05 07:43:58.053496', '2023-05-05 07:41:35.089615', 'cz', '0', '0'),
('5', 'REDUCED', '15', '2023-05-05 07:50:22.711930', '2023-05-05 07:50:22.712154', 'de', '0', '0'),
('7', 'Standard', '20', '2023-06-09 14:36:54.638102', '2023-06-09 14:36:54.638201', 'bg', '1', '0'),
('8', 'Reduced', '9', '2023-06-16 13:27:03.140779', '2023-06-09 14:37:04.444688', 'bg', '0', '1');

INSERT INTO "django_admin_log" ("id", "action_time", "object_id", "object_repr", "change_message", "content_type_id", "user_id", "action_flag") VALUES
('1', '2023-05-04 14:35:59.715114', 'cz', 'Country object (cz)', '[{"added": {}}]', '11', 'admin@example.com', '1'),
('2', '2023-05-04 14:36:16.977238', 'de', 'Country object (de)', '[{"added": {}}]', '11', 'admin@example.com', '1');

INSERT INTO "django_content_type" ("id", "app_label", "model") VALUES
('1', 'admin', 'logentry'),
('2', 'auth', 'permission'),
('3', 'auth', 'group'),
('4', 'authtoken', 'token'),
('5', 'authtoken', 'tokenproxy'),
('6', 'cart', 'cart'),
('7', 'cart', 'cartitem'),
('8', 'category', 'categorytranslation'),
('9', 'category', 'category'),
('10', 'contenttypes', 'contenttype'),
('11', 'country', 'country'),
('12', 'country', 'currency'),
('13', 'product', 'productvariant'),
('14', 'product', 'producttype'),
('15', 'product', 'producttranslation'),
('16', 'product', 'product'),
('17', 'product', 'attributetype'),
('18', 'product', 'baseattribute'),
('19', 'product', 'extattributetype'),
('20', 'product', 'extensionattribute'),
('21', 'product', 'pricelist'),
('22', 'product', 'productprice'),
('23', 'product', 'productmedia'),
('24', 'product', 'productvariantmedia'),
('25', 'roles', 'managerpermission'),
('26', 'roles', 'managergroup'),
('27', 'sessions', 'session'),
('28', 'token_blacklist', 'outstandingtoken'),
('29', 'token_blacklist', 'blacklistedtoken'),
('30', 'user', 'user'),
('31', 'cms', 'pagecategorytype'),
('32', 'cms', 'pagecategorytranslation'),
('33', 'cms', 'page'),
('34', 'cms', 'pagecmstranslation'),
('35', 'cms', 'pagefrontend'),
('36', 'cms', 'pagefrontendtranslation'),
('37', 'cms', 'pagecategory'),
('38', 'cms', 'pagecms'),
('39', 'product', 'producttypevatgroup'),
('40', 'country', 'vatgroup'),
('41', 'cart', 'shippingmethodtranslation'),
('42', 'cart', 'paymentmethodcountry'),
('43', 'cart', 'shippingmethod'),
('44', 'cart', 'paymentmethod'),
('45', 'cart', 'shippingmethodcountry'),
('46', 'cart', 'paymentmethodtranslation'),
('47', 'country', 'billinginfo'),
('48', 'country', 'shippinginfo'),
('49', 'country', 'address'),
('50', 'order', 'order'),
('51', 'product', 'translatableattributetype'),
('52', 'product', 'translatablebaseattributetranslation'),
('53', 'product', 'translatableattributetypetranslation'),
('54', 'product', 'translatablebaseattribute'),
('55', 'product', 'attributetypetranslation'),
('56', 'product', 'baseattributetranslation'),
('57', 'django_rq', 'queue'),
('58', 'product', 'testmodel'),
('59', 'product', 'testmodeltranslation'),
('60', 'review', 'review');

INSERT INTO "django_migrations" ("id", "app", "name", "applied") VALUES
('1', 'product', '0001_initial', '2023-04-05 20:27:47.001841'),
('2', 'category', '0001_initial', '2023-04-05 20:27:47.065650'),
('3', 'category', '0002_category_create_at_category_published_and_more', '2023-04-05 20:27:47.136190'),
('4', 'product', '0002_product_category', '2023-04-05 20:27:47.199483'),
('5', 'product', '0003_remove_product_product_variants_and_more', '2023-04-05 20:27:47.261025'),
('6', 'product', '0004_productvariant', '2023-04-05 20:27:47.301774'),
('7', 'product', '0005_product_product_variants', '2023-04-05 20:27:47.400383'),
('8', 'country', '0001_initial', '2023-04-05 20:27:47.444286'),
('9', 'cart', '0001_initial', '2023-04-05 20:27:47.498681'),
('10', 'user', '0001_initial', '2023-04-05 20:27:47.573581'),
('11', 'contenttypes', '0001_initial', '2023-04-05 20:27:47.615382'),
('12', 'admin', '0001_initial', '2023-04-05 20:27:47.693455'),
('13', 'admin', '0002_logentry_remove_auto_add', '2023-04-05 20:27:47.766027'),
('14', 'admin', '0003_logentry_add_action_flag_choices', '2023-04-05 20:27:47.830367'),
('15', 'contenttypes', '0002_remove_content_type_name', '2023-04-05 20:27:47.889604'),
('16', 'auth', '0001_initial', '2023-04-05 20:27:47.972065'),
('17', 'auth', '0002_alter_permission_name_max_length', '2023-04-05 20:27:48.047705'),
('18', 'auth', '0003_alter_user_email_max_length', '2023-04-05 20:27:48.075527'),
('19', 'auth', '0004_alter_user_username_opts', '2023-04-05 20:27:48.121623'),
('20', 'auth', '0005_alter_user_last_login_null', '2023-04-05 20:27:48.157822'),
('21', 'auth', '0006_require_contenttypes_0002', '2023-04-05 20:27:48.185250'),
('22', 'auth', '0007_alter_validators_add_error_messages', '2023-04-05 20:27:48.214210'),
('23', 'auth', '0008_alter_user_username_max_length', '2023-04-05 20:27:48.240423'),
('24', 'auth', '0009_alter_user_last_name_max_length', '2023-04-05 20:27:48.268190'),
('25', 'auth', '0010_alter_group_name_max_length', '2023-04-05 20:27:48.320999'),
('26', 'auth', '0011_update_proxy_permissions', '2023-04-05 20:27:48.343860'),
('27', 'auth', '0012_alter_user_first_name_max_length', '2023-04-05 20:27:48.371662'),
('28', 'authtoken', '0001_initial', '2023-04-05 20:27:48.421090'),
('29', 'authtoken', '0002_auto_20160226_1747', '2023-04-05 20:27:48.462982'),
('30', 'authtoken', '0003_tokenproxy', '2023-04-05 20:27:48.487634'),
('31', 'product', '0006_attributetype_baseattribute_attributeclothes_and_more', '2023-04-05 20:27:48.549965'),
('32', 'product', '0007_extattributetype_extensionattribute_and_more', '2023-04-05 20:27:48.631704'),
('33', 'product', '0008_alter_extensionattribute_ext_attributes', '2023-04-05 20:27:48.692201'),
('34', 'product', '0009_currency_price_pricelist', '2023-04-05 20:27:48.725444'),
('35', 'country', '0002_currency_pricelist', '2023-04-05 20:27:48.773252'),
('36', 'product', '0010_productprice_delete_currency_delete_price_and_more', '2023-04-05 20:27:48.842587'),
('37', 'country', '0003_remove_pricelist_currency', '2023-04-05 20:27:48.896978'),
('38', 'product', '0011_pricelist_alter_productprice_price_list', '2023-04-05 20:27:48.954504'),
('39', 'product', '0012_alter_baseattribute_ext_attributes', '2023-04-05 20:27:48.981012'),
('40', 'product', '0013_productprice_create_at_productprice_update_at', '2023-04-05 20:27:49.033268'),
('41', 'product', '0014_pricelist_create_at_pricelist_update_at', '2023-04-05 20:27:49.075562'),
('42', 'country', '0004_delete_pricelist', '2023-04-05 20:27:49.112440'),
('43', 'country', '0005_currency_create_at_currency_update_at', '2023-04-05 20:27:49.151163'),
('44', 'country', '0006_country_default_price_list', '2023-04-05 20:27:49.200406'),
('45', 'country', '0007_alter_country_options_alter_currency_options_and_more', '2023-04-05 20:27:49.244072'),
('46', 'product', '0015_productmedia_alter_baseattribute_type_and_more', '2023-04-05 20:27:49.374525'),
('47', 'product', '0016_producttype_product_type', '2023-04-05 20:27:49.450920'),
('48', 'product', '0017_alter_product_category_and_more', '2023-04-05 20:27:49.574596'),
('49', 'product', '0018_alter_producttype_name', '2023-04-05 20:27:49.618777'),
('50', 'product', '0016_alter_productmedia_media', '2023-04-05 20:27:49.667131'),
('51', 'product', '0017_alter_productmedia_product', '2023-04-05 20:27:49.720680'),
('52', 'product', '0019_merge_20230402_0614', '2023-04-05 20:27:49.737353'),
('53', 'product', '0020_alter_productmedia_media', '2023-04-05 20:27:49.784976'),
('54', 'product', '0021_alter_product_id', '2023-04-05 20:27:49.896655'),
('55', 'product', '0022_alter_attributetype_type_name', '2023-04-05 20:27:49.961200'),
('56', 'product', '0023_alter_baseattribute_value', '2023-04-05 20:27:50.016448'),
('57', 'roles', '0001_initial', '2023-04-05 20:27:50.070393'),
('58', 'sessions', '0001_initial', '2023-04-05 20:27:50.117089'),
('59', 'token_blacklist', '0001_initial', '2023-04-05 20:27:50.178818'),
('60', 'token_blacklist', '0002_outstandingtoken_jti_hex', '2023-04-05 20:27:50.223039'),
('61', 'token_blacklist', '0003_auto_20171017_2007', '2023-04-05 20:27:50.250728'),
('62', 'token_blacklist', '0004_auto_20171017_2013', '2023-04-05 20:27:50.303329'),
('63', 'token_blacklist', '0005_remove_outstandingtoken_jti', '2023-04-05 20:27:50.351300'),
('64', 'token_blacklist', '0006_auto_20171017_2113', '2023-04-05 20:27:50.383484'),
('65', 'token_blacklist', '0007_auto_20171017_2214', '2023-04-05 20:27:50.440230'),
('66', 'token_blacklist', '0008_migrate_to_bigautofield', '2023-04-05 20:27:50.499542'),
('67', 'token_blacklist', '0010_fix_migrate_to_bigautofield', '2023-04-05 20:27:50.562740'),
('68', 'token_blacklist', '0011_linearizes_history', '2023-04-05 20:27:50.584379'),
('69', 'token_blacklist', '0012_alter_outstandingtoken_user', '2023-04-05 20:27:50.619466'),
('70', 'user', '0002_auto_20230316_1534', '2023-04-05 20:27:50.881019'),
('71', 'user', '0003_remove_permissionrole_permissions_and_more', '2023-04-05 20:27:51.015637'),
('72', 'user', '0004_user_groups_user_is_superuser_user_user_permissions', '2023-04-05 20:27:51.116965'),
('73', 'category', '0003_categorytranslation_description_editorjs', '2023-04-16 20:58:20.632947'),
('74', 'product', '0024_producttranslation_description_editorjs', '2023-04-16 20:58:20.824363'),
('75', 'cms', '0001_initial', '2023-04-23 08:24:55.014203'),
('76', 'cms', '0002_pagefrontend_frontend_path', '2023-04-23 14:20:55.095445'),
('77', 'cms', '0003_alter_pagecategory_code', '2023-04-24 18:43:48.875935'),
('78', 'cms', '0004_alter_pagecategory_type', '2023-04-24 18:48:32.867748'),
('79', 'cms', '0005_alter_pagecategory_code', '2023-04-24 18:48:32.885585'),
('80', 'product', '0025_attributetype_value_type', '2023-05-02 06:53:31.271581'),
('81', 'product', '0026_pricelist_is_default', '2023-05-03 07:32:10.579906'),
('82', 'product', '0027_alter_pricelist_is_default', '2023-05-03 15:02:56.715441'),
('83', 'product', '0028_productvariant_availability', '2023-05-04 07:55:27.908738'),
('84', 'product', '0029_rename_availability_productvariant_stock_quantity', '2023-05-04 08:13:38.570531'),
('85', 'cart', '0002_remove_cartitem_create_at_remove_cartitem_product_and_more', '2023-05-04 13:57:07.774373'),
('86', 'cart', '0003_cart_user', '2023-05-04 13:57:07.810063'),
('87', 'product', '0030_producttypevatgroup', '2023-05-04 13:57:07.823865'),
('88', 'user', '0005_alter_user_cart', '2023-05-04 13:57:07.839063'),
('89', 'user', '0006_alter_user_cart', '2023-05-04 13:57:07.855195'),
('90', 'user', '0007_remove_user_cart', '2023-05-04 13:57:07.871598'),
('91', 'product', '0031_alter_producttypevatgroup_product_type', '2023-05-04 14:17:43.732157'),
('92', 'product', '0032_remove_pricelist_includes_vat', '2023-05-04 15:30:33.587890'),
('93', 'country', '0008_vatgroup', '2023-05-04 18:57:46.290899'),
('94', 'product', '0033_remove_producttypevatgroup_vat_and_more', '2023-05-04 18:57:46.399748'),
('95', 'country', '0009_vatgroup_country', '2023-05-04 19:40:29.032326'),
('96', 'product', '0034_producttype_vat_groups_delete_producttypevatgroup', '2023-05-04 19:51:29.627417'),
('97', 'product', '0035_productprice_discount', '2023-05-04 20:23:18.489181'),
('98', 'country', '0010_alter_vatgroup_name', '2023-05-05 07:45:42.286364'),
('99', 'country', '0011_alter_vatgroup_rate', '2023-05-05 07:49:52.022989'),
('100', 'country', '0012_vatgroup_is_default', '2023-05-05 08:12:34.161086'),
('101', 'cart', '0004_paymentmethod_shippingmethod_shippingmethodcountry_and_more', '2023-05-09 07:50:48.824760'),
('102', 'cart', '0005_rename_name_paymentmethodtranslation_title_and_more', '2023-05-09 09:02:18.366318'),
('103', 'cart', '0006_alter_paymentmethod_image_alter_shippingmethod_image', '2023-05-09 09:27:20.066550'),
('104', 'cart', '0007_alter_paymentmethod_image_alter_shippingmethod_image', '2023-05-09 09:59:00.905441'),
('105', 'cart', '0008_alter_shippingmethod_image', '2023-05-09 11:24:09.555113'),
('106', 'cart', '0009_alter_shippingmethod_image', '2023-05-09 12:34:08.368813'),
('107', 'cart', '0010_rename_price_gross_paymentmethodcountry_price_and_more', '2023-05-09 13:42:45.122046'),
('108', 'cart', '0011_alter_shippingmethodcountry_payment_methods', '2023-05-09 14:53:06.610439'),
('109', 'country', '0013_address', '2023-05-15 07:40:59.057027'),
('110', 'country', '0014_billingaddress_shippingaddress_and_more', '2023-05-15 07:40:59.076756'),
('111', 'cart', '0012_cart_billing_address', '2023-05-15 07:40:59.094915'),
('112', 'cart', '0013_cart_shipping_address_alter_cart_billing_address', '2023-05-15 07:40:59.126689'),
('113', 'cart', '0014_alter_cart_billing_address_and_more', '2023-05-15 07:40:59.155090'),
('114', 'cart', '0015_cart_payment_method_country_and_more', '2023-05-15 07:40:59.189911'),
('115', 'cart', '0016_rename_shippping_method_country_cart_shipping_method_country', '2023-05-15 07:40:59.200367'),
('116', 'cart', '0017_alter_cart_token', '2023-05-15 07:40:59.221609'),
('117', 'cart', '0018_alter_cart_billing_address_and_more', '2023-05-15 07:40:59.257103'),
('118', 'country', '0015_delete_address_shippingaddress_country_and_more', '2023-05-15 07:40:59.352228'),
('119', 'country', '0016_alter_billingaddress_user_alter_shippingaddress_user', '2023-05-15 08:24:26.918704'),
('120', 'cart', '0018_cartitem_product', '2023-05-16 12:57:16.340210'),
('121', 'cart', '0019_cartitem_discount', '2023-05-16 13:45:44.882108'),
('123', 'cart', '0020_cart_pricelist', '2023-05-16 18:14:18.874159'),
('124', 'cart', '0020_merge_20230516_1846', '2023-05-16 18:47:29.156787'),
('125', 'order', '0001_initial', '2023-05-16 19:04:30.181996'),
('126', 'order', '0002_rename_order_id_order_token', '2023-05-16 19:04:30.190201'),
('127', 'order', '0003_remove_order_paid_order_status', '2023-05-16 19:04:30.205171'),
('128', 'cart', '0021_cart_pricelist', '2023-05-16 19:17:54.797425'),
('129', 'cart', '0022_rename_billing_address_cart_billing_info_and_more', '2023-05-17 18:01:30.203095'),
('130', 'country', '0017_rename_billingaddress_billinginfo_and_more', '2023-05-17 18:01:30.558599'),
('131', 'product', '0036_translatableattributetype_translatablebaseattribute_and_more', '2023-05-29 06:13:37.247585'),
('132', 'product', '0037_remove_baseattribute_ext_attributes_and_more', '2023-05-29 13:59:18.017438'),
('133', 'product', '0038_attributetype_baseattribute_and_more', '2023-05-29 14:00:16.028201'),
('134', 'cart', '0023_shippingmethodcountry_api_request', '2023-06-01 09:13:52.064565'),
('135', 'cart', '0024_remove_shippingmethodcountry_api_request_and_more', '2023-06-02 12:55:07.225574'),
('136', 'django_rq', '0001_initial', '2023-06-08 11:04:22.820837'),
('137', 'order', '0004_order_agreed_to_terms_order_marketing_flag', '2023-06-12 08:02:55.907681'),
('138', 'order', '0005_order_payment_id', '2023-06-12 11:00:06.364199'),
('139', 'product', '0039_testmodel_testmodeltranslation', '2023-06-16 09:24:01.682702'),
('140', 'product', '0040_testmodel_safe_deleted', '2023-06-16 09:24:22.908170'),
('141', 'product', '0041_alter_testmodel_managers', '2023-06-16 09:24:45.514031'),
('142', 'product', '0042_alter_testmodel_managers_delete_testmodeltranslation', '2023-06-16 09:34:06.778701'),
('143', 'product', '0043_testmodeltranslation', '2023-06-16 09:38:50.451647'),
('144', 'product', '0044_alter_testmodeltranslation_unique_together_and_more', '2023-06-16 09:39:51.066336'),
('145', 'category', '0004_alter_category_managers_category_safe_deleted', '2023-06-16 12:00:06.478354'),
('146', 'product', '0045_attributetype_safe_deleted_and_more', '2023-06-16 12:04:06.933634'),
('147', 'cms', '0006_pagecategory_safe_deleted_and_more', '2023-06-16 12:06:39.624788'),
('148', 'country', '0018_billinginfo_safe_deleted_country_safe_deleted_and_more', '2023-06-16 12:07:15.168763'),
('149', 'cart', '0025_paymentmethod_safe_deleted_and_more', '2023-06-16 14:02:56.998922'),
('150', 'cms', '0007_alter_page_options_remove_pagecms_safe_deleted_and_more', '2023-06-16 14:03:03.547396'),
('151', 'cms', '0008_alter_page_options_remove_page_safe_deleted', '2023-06-16 14:03:03.560653'),
('152', 'cms', '0009_pagecms_safe_deleted_pagefrontend_safe_deleted', '2023-06-16 14:03:03.573073'),
('153', 'cms', '0010_remove_pagecms_safe_deleted_and_more', '2023-06-16 14:15:02.380065'),
('154', 'cart', '0025_rename_unit_price_gross_cartitem_unit_price_incl_vat_and_more', '2023-06-18 06:23:21.818447'),
('155', 'review', '0001_initial', '2023-06-28 07:56:17.447399'),
('156', 'review', '0002_review_product_variant', '2023-06-28 07:56:17.492389'),
('157', 'review', '0003_review_country', '2023-06-28 07:56:17.525357'),
('158', 'cart', '0026_rename_unit_price_gross_cartitem_unit_price_incl_vat_and_more', '2023-06-28 20:23:37.571373');

INSERT INTO "django_session" ("session_key", "session_data", "expire_date") VALUES
('2r9bruus4u5m0z85v6u2qpihleytzc85', '.eJxVzMsOwiAQheF3YW1I2wECrox7n4EMzGCrLZheEhPjuytJF7o-3_lfwuO29n5bePYDiaNAmoZ84idOj5FlLJM4_JqA8c65QrphvpavyOs8BFmJ3NdFXgrxeN7tX6DHpa_voAAsGKc6bIGgaxza1gbWBjSriA0bRxi1dboxxlLqIKZkAyZIKjrx_gBAoz5R:1pua3d:_NFz8Q5SHfpSETz13J-_EN3CRASvXxe8w-oKeZANsmU', '2023-05-18 14:35:45.763870'),
('5n8y2e1ks5a91qqhinp9tj3eazs3tfkv', '.eJxVzMsOwiAQheF3YW1I2wECrox7n4EMzGCrLZheEhPjuytJF7o-3_lfwuO29n5bePYDiaNAmoZ84idOj5FlLJM4_JqA8c65QrphvpavyOs8BFmJ3NdFXgrxeN7tX6DHpa_voAAsGKc6bIGgaxza1gbWBjSriA0bRxi1dboxxlLqIKZkAyZIKjrx_gBAoz5R:1poPLY:fWtJQLIldpt8CDYpj4HAfkqhBvQgdFHJabUmJXp4zTI', '2023-05-01 13:56:44.400872'),
('c59bq5uytctag8j62uhxyemxmxpxbzr5', '.eJxVzMsOwiAQheF3YW0ITMEWV8a9z0AGZrDVFkwviYnx3W2TLnR9vvO_hcdlbv0y8eg7EieBNHT5zC8cnj3LWAZx-DUB44PzBumO-VZWkeexC3Ijcl8neS3E_WW3f4EWp3Z9K1RBE2kOCYBTAqoUEhhw1jhO5gi6dkZHjQ1W1nETKRES17UltMmIzxdzDz8p:1q7DSQ:EJxeTDs5r8YS-01XgpqpFWGnC8hvIEkZSu514VzpX0Y', '2023-06-22 11:05:34.739994'),
('hh8b1pfooc32jp9fic4itx3rzjhn3d6a', '.eJxVzMsOwiAQheF3YW1I2wECrox7n4EMzGCrLZheEhPjuytJF7o-3_lfwuO29n5bePYDiaNAmoZ84idOj5FlLJM4_JqA8c65QrphvpavyOs8BFmJ3NdFXgrxeN7tX6DHpa_voAAsGKc6bIGgaxza1gbWBjSriA0bRxi1dboxxlLqIKZkAyZIKjrx_gBAoz5R:1px6HX:oCqkftMzpukZcx7XWp36tkdaLrQjXI9ul0ioDw78skw', '2023-05-25 13:24:31.302717'),
('pprszebcsv7c5km88gtcfkux8ku36mhg', '.eJxVzMsOwiAQheF3YW0ITMEWV8a9z0AGZrDVFkwviYnx3W2TLnR9vvO_hcdlbv0y8eg7EieBNHT5zC8cnj3LWAZx-DUB44PzBumO-VZWkeexC3Ijcl8neS3E_WW3f4EWp3Z9K1RBE2kOCYBTAqoUEhhw1jhO5gi6dkZHjQ1W1nETKRES17UltMmIzxdzDz8p:1qBDjR:GYGE63hGnfa1NULTLxmOB3kOzBwBsIjsdgLIOyH6_Ew', '2023-07-03 12:11:41.905228');

INSERT INTO "order_order" ("create_at", "cart_id", "token", "status", "agreed_to_terms", "marketing_flag", "payment_id") VALUES
('2023-06-12 15:56:30.584656', 'd61047de15574b9b9498f6b60af52977', '01d8ad40932a4cc38b5913ac1060a6c7', 'PENDING', '1', '1', '1234567890'),
('2023-06-12 15:36:05.641498', 'a78815a6d16d4b13a49da246a5026aba', '0e2d642e6c0a4aea86293f9a9c46bbef', 'PENDING', '1', '1', '1234567890'),
('2023-06-12 15:55:04.453895', 'd61047de15574b9b9498f6b60af52977', '291b869f3d4a4840bd3e9cfb1294c614', 'PENDING', '1', '1', NULL),
('2023-06-12 10:39:42.722199', '6d2796692b2c4f6e957a14d92cbd324c', '3021868a23274ec3915e4b0a6bfe810e', 'PENDING', '0', '0', NULL),
('2023-06-19 12:00:26.874538', 'ba6e926407d6447e97b3642c166a1fd2', '3117204449334e83a6e38a6b8515008f', 'PENDING', '1', '1', '123456789'),
('2023-06-12 16:03:43.163453', '70e25d64c20148559f39047641aaa14b', '33aa381d5e764d768d58431cabcf168d', 'PENDING', '1', '0', '1234567890'),
('2023-06-02 14:01:40.935457', 'd9a1deb9d5594d3d841ae0e6c4c9ff8f', '3544f4b81b684a999b7165cfbda8dd42', 'PENDING', '0', '0', NULL),
('2023-06-02 13:58:46.966087', '3ef2baec272f4221a5f83d54effe8fba', '35bf27dab3ca477ea6b16428f2db31b8', 'PENDING', '0', '0', NULL),
('2023-07-03 13:00:26.938445', '1e967a680ace4c728cfb7e62afffc36f', '3fe2e725abf54e78a7d1f3715f0cd755', 'PENDING', '1', '1', NULL),
('2023-06-02 13:56:43.845814', '4496d3ddc35444db9812974de2f98b0f', '43d585243bf44f7eb2e0cfcdaa3c068b', 'PENDING', '0', '0', NULL),
('2023-06-02 13:58:43.925730', '8d69e1c11cd44745bd39ef9882e9a8ef', '528b1a92181f4a809f0e761080e12775', 'PENDING', '0', '0', NULL),
('2023-06-02 13:56:37.241316', '4ea482d4b64c46f88a3b5b8e7df49462', '634a623c004f45e8a85a9867cb3070e1', 'PENDING', '0', '0', NULL),
('2023-06-02 13:56:15.900538', 'a3e78b349288491e864b00598cf7a342', '73fd57da12324dcfa581856cf3ce0c8b', 'PENDING', '0', '0', NULL),
('2023-06-02 13:55:13.614544', 'a7aa553a35b24fdd95dc998dd4f79a93', '8327d7018f7b481291a96057034886a2', 'PENDING', '0', '0', NULL),
('2023-06-12 15:58:45.668899', 'ef08624314584302817f1bd86b69a27d', '925cc09a7f4c42e5a5079e5fa29cfe12', 'PENDING', '1', '1', '1234567890'),
('2023-06-12 15:55:28.804686', 'd61047de15574b9b9498f6b60af52977', '9423c27feb3945f888b1dbd627416fac', 'PENDING', '1', '1', NULL),
('2023-07-03 13:00:21.259011', '1e967a680ace4c728cfb7e62afffc36f', '9b1eb752701e4de88c4c476781f28e61', 'PENDING', '1', '0', NULL),
('2023-06-02 13:58:46.968502', 'e8a06e65eada4316a5e4f5a8af6bce90', '9f73c8ddbd224a9cb99326fbccfbe62f', 'PENDING', '0', '0', NULL),
('2023-06-12 10:45:28.049450', '6d2796692b2c4f6e957a14d92cbd324c', 'a0cd453ba698452697a4d2e39b569deb', 'PENDING', '1', '1', NULL),
('2023-06-02 13:56:09.716442', '16b4af388bde47c39f0055ec6b65ce9e', 'a80ae5a60c98469193a80e0469cd31c5', 'PENDING', '0', '0', NULL),
('2023-06-02 14:01:40.938445', 'a48e9aa56a9647f99a18a1e99ab4f2f9', 'af715bdba0584cb8a07585d0e9f7894e', 'SHIPPED', '0', '0', NULL),
('2023-06-12 15:53:31.184864', 'd61047de15574b9b9498f6b60af52977', 'afa1d025962347079119136966a4d6f1', 'PENDING', '1', '1', NULL),
('2023-06-02 13:58:43.921978', '4c2f99f603764574919068dfcc40dbf8', 'b0d1f68484f54963a93dfcf1725c4853', 'PENDING', '0', '0', NULL),
('2023-06-12 12:04:14.945810', '6d2796692b2c4f6e957a14d92cbd324c', 'b5f0d70b88b54d48829b4ee7ead3a0a4', 'PENDING', '1', '1', '123456789'),
('2023-06-12 10:43:46.690922', '6d2796692b2c4f6e957a14d92cbd324c', 'b71be46f77e04652aef103a1d2a3e10a', 'PENDING', '1', '1', NULL),
('2023-06-12 15:58:29.844136', 'b77677c87a91415e93c781054220fb62', 'cd489cbc4de74386871d7e3ba7c1d727', 'PENDING', '1', '1', '123456789'),
('2023-06-12 16:04:51.743728', 'cc37ef37b76d4e659bb837e95fd1e2d9', 'ce97cbb177ae4914ada585481d483eee', 'PENDING', '1', '1', NULL),
('2023-06-12 10:43:58.136305', '6d2796692b2c4f6e957a14d92cbd324c', 'e2024c20d479432c97bbe85f6ac10597', 'PENDING', '1', '1', NULL),
('2023-06-02 13:55:43.347441', 'e81086b8af914d459c72d31f72e69ae6', 'e499413e625b4859bac3248742d82045', 'PENDING', '0', '0', NULL),
('2023-06-12 16:05:17.555147', 'cc37ef37b76d4e659bb837e95fd1e2d9', 'eb6b7e0be7d54158a71f941f206d9f24', 'PENDING', '1', '1', '123456789'),
('2023-06-02 13:56:56.599516', 'a3fb5406a21040a89ed8515fdcdea4cf', 'f436ab2c5aca44bbba6978ae984bf9c8', 'PENDING', '0', '0', NULL);

INSERT INTO "product_attributetype" ("id", "type_name", "unit", "value_type", "safe_deleted") VALUES
('1', 'weight', 'g', 'INTEGER', '0'),
('2', 'color', NULL, 'TEXT', '0');

INSERT INTO "product_attributetype_translation" ("id", "language_code", "name", "master_id") VALUES
('1', 'en', 'Weight', '1'),
('2', 'cs', 'Váha', '1'),
('3', 'en', 'Color', '2'),
('4', 'cs', 'Barva', '2');

INSERT INTO "product_baseattribute" ("id", "value", "order", "type_id", "safe_deleted") VALUES
('1', '250', NULL, '1', '0'),
('2', '500', NULL, '1', '0'),
('3', 'black', NULL, '2', '0'),
('4', 'white', NULL, '2', '0'),
('5', 'neco', NULL, '2', '0');

INSERT INTO "product_baseattribute_translation" ("id", "language_code", "name", "master_id") VALUES
('1', 'en', '', '1'),
('2', 'cs', '', '1'),
('3', 'en', '', '2'),
('4', 'cs', '', '2'),
('5', 'en', 'Black', '3'),
('6', 'cs', 'Černá', '3'),
('7', 'en', 'White', '4'),
('8', 'cs', 'Bílá', '4');

INSERT INTO "product_pricelist" ("code", "rounding", "currency_id", "create_at", "update_at", "is_default", "safe_deleted") VALUES
('CZK_maloobchod', '1', 'CZK', '2023-05-03 07:42:10.896285', '2023-05-03 07:53:08.906853', '1', '0'),
('CZK_velkoobchod', '1', 'CZK', '2023-05-03 07:53:24.964316', '2023-05-03 07:53:24.964253', '0', '0'),
('EUR_maloobchod', '0', 'EUR', '2023-05-03 15:05:55.251018', '2023-05-28 14:24:39.850810', '0', '0'),
('test', '1', 'CZK', '2023-06-16 13:29:36.765331', '2023-06-16 13:29:51.502920', '0', '1');

INSERT INTO "product_product" ("id", "published", "update_at", "create_at", "category_id", "type_id", "safe_deleted") VALUES
('1', '1', '2023-05-29 08:07:35.961459', '2023-04-05 20:32:29.786979', '2', '1', '0'),
('2', '1', '2023-06-16 15:03:10.010891', '2023-04-15 08:58:19.593744', '2', '1', '0'),
('4', '1', '2023-06-16 15:06:25.279535', '2023-05-29 14:10:58.171163', '3', '2', '0');

INSERT INTO "product_product_product_variants" ("id", "product_id", "productvariant_id") VALUES
('1', '1', 'espresso250'),
('2', '1', 'espresso500'),
('3', '2', 'rock-spot-espresso'),
('10', '4', 't-shirt-1'),
('11', '4', 't-shirt-2');

INSERT INTO "product_product_translation" ("id", "language_code", "title", "meta_title", "meta_description", "short_description", "description", "slug", "master_id", "description_editorjs") VALUES
('1', 'en', 'Top Spot Espresso', 'Top Spot Espresso | Free shipping | Czech brand', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.', NULL, NULL, 'top-spot-espresso', '1', '{"time": 1685347649291, "blocks": [{"id": "CuL8jOZowm", "type": "header", "data": {"text": "Our best espresso", "level": 2}}, {"id": "D1YvfA39fN", "type": "paragraph", "data": {"text": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci. In enim a arcu imperdiet malesuada. Aliquam id dolor. Donec quis nibh at felis congue commodo. Integer in sapien. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. <b>Fusce dui leo, imperdiet in, aliquam sit amet, feugiat eu, orci.</b> <a href=\"https://google.com\">Praesent</a> vitae arcu tempor neque lacinia pretium. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Nullam rhoncus aliquam metus. Maecenas sollicitudin. Pellentesque ipsum. Curabitur vitae diam non enim vestibulum interdum. Nullam dapibus fermentum ipsum. Integer tempor."}}, {"id": "sEkzwOTizM", "type": "table", "data": {"withHeadings": false, "content": []}}, {"id": "o-vOQIvZ7e", "type": "image", "data": {"file": {"url": "http://localhost:8000/media/editorjs/1681734025.jpg"}, "caption": "The Office wall", "withBorder": false, "stretched": false, "withBackground": false}}], "version": "2.26.5"}'),
('2', 'cs', 'Top Spot Espresso', '', '', NULL, NULL, 'top-spot-espresso', '1', NULL),
('3', 'en', 'Rock Spot Espresso', '', '', NULL, NULL, 'rock-spot-espresso', '2', '{"time": 1681975219989, "blocks": [{"id": "U01X2Ut35O", "type": "header", "data": {"text": "Rock Spot Espresso", "level": 2}}, {"id": "o_yRNVILAK", "type": "paragraph", "data": {"text": "Lorem ipsum"}}], "version": "2.26.5"}'),
('11', 'en', 'T-shirt', '', '', NULL, NULL, 't-shirt', '4', NULL),
('12', 'cs', 'Tričko', '', '', NULL, NULL, 'tricko', '4', NULL);

INSERT INTO "product_productmedia" ("id", "sort_order", "media", "type", "alt", "product_id", "safe_deleted") VALUES
('8', '1', 'product_media/1/image/172_top-spot-espresso_IzSaqyC.jpg', 'IMAGE', NULL, '1', '0'),
('9', '0', 'product_media/1/image/172-1_espresso1.jpg', 'IMAGE', NULL, '1', '0'),
('11', '0', 'product_media/2/image/220_rock-spot-espresso.jpg', 'IMAGE', NULL, '2', '0'),
('17', '2', 'product_media/1/image/8bfb9abd-4aa4-48d7-aa89-b8ed17317823.jpg', 'IMAGE', NULL, '1', '0'),
('18', '3', 'product_media/1/image/88bb66e6-9df5-4bce-b219-407cee53bc64.jpg', 'IMAGE', NULL, '1', '1');

INSERT INTO "product_productprice" ("id", "price", "price_list_id", "product_variant_id", "create_at", "update_at", "discount", "safe_deleted") VALUES
('2', '250', 'CZK_maloobchod', 'espresso250', '2023-05-03 11:51:13.951163', '2023-05-29 08:07:35.781903', '0', '0'),
('3', '500', 'CZK_maloobchod', 'espresso500', '2023-05-03 11:51:14.017730', '2023-05-29 08:07:35.873449', '5', '0'),
('4', '100', 'CZK_velkoobchod', 'espresso250', '2023-05-04 21:03:59.827699', '2023-05-29 08:07:35.808090', '10', '0'),
('5', '10', 'EUR_maloobchod', 'espresso250', '2023-05-05 07:56:41.983462', '2023-05-29 08:07:35.832576', '5', '0'),
('6', '400', 'CZK_velkoobchod', 'espresso500', '2023-05-19 06:11:15.040656', '2023-05-29 08:07:35.897135', '10', '0'),
('7', '5', 'EUR_maloobchod', 'espresso500', '2023-05-19 06:11:28.452402', '2023-05-29 08:07:35.918649', NULL, '0'),
('8', '100', 'CZK_maloobchod', 'rock-spot-espresso', '2023-06-16 15:03:09.864201', '2023-06-16 15:03:09.885145', NULL, '0'),
('9', '100', 'CZK_velkoobchod', 'rock-spot-espresso', '2023-06-16 15:03:09.907795', '2023-06-16 15:03:09.926799', NULL, '0'),
('10', '5', 'EUR_maloobchod', 'rock-spot-espresso', '2023-06-16 15:03:09.947801', '2023-06-16 15:03:09.965366', NULL, '0'),
('11', '200', 'CZK_maloobchod', 't-shirt-2', '2023-06-16 15:06:25.138340', '2023-06-16 15:06:25.157450', NULL, '0'),
('12', '200', 'CZK_velkoobchod', 't-shirt-2', '2023-06-16 15:06:25.179118', '2023-06-16 15:06:25.196587', NULL, '0'),
('13', '10', 'EUR_maloobchod', 't-shirt-2', '2023-06-16 15:06:25.218925', '2023-06-16 15:06:25.236896', NULL, '0');

INSERT INTO "product_producttype" ("id", "name", "update_at", "create_at", "safe_deleted") VALUES
('1', 'Coffee', '2023-05-29 14:09:49.992055', '2023-04-06 08:04:06.063687', '0'),
('2', 'Fashion', '2023-05-29 14:10:42.890859', '2023-04-06 08:04:14.894212', '0'),
('3', 'Cup', '2023-04-06 08:06:46.408775', '2023-04-06 08:06:34.221750', '0'),
('8', 'testovací type ahoj cau ahoj', '2023-06-16 12:13:53.783115', '2023-05-04 15:56:22.641021', '1'),
('9', 'Food', '2023-06-16 13:21:54.575979', '2023-05-05 07:50:34.672837', '1');

INSERT INTO "product_producttype_allowed_attribute_types" ("id", "producttype_id", "attributetype_id") VALUES
('1', '1', '1'),
('2', '2', '2');

INSERT INTO "product_producttype_vat_groups" ("id", "producttype_id", "vatgroup_id") VALUES
('1', '1', '2'),
('3', '1', '1'),
('4', '9', '4'),
('5', '9', '5'),
('6', '2', '1'),
('7', '2', '2');

INSERT INTO "product_productvariant" ("sku", "ean", "weight", "update_at", "create_at", "stock_quantity", "safe_deleted") VALUES
('espresso250', '', '350', '2023-07-03 13:00:26.954525', '2023-04-06 08:17:49.355523', '116', '0'),
('espresso500', '', '500', '2023-05-29 08:07:35.855246', '2023-04-06 10:26:28.607734', '200', '0'),
('rock-spot-espresso', '', '0', '2023-06-16 15:03:09.844004', '2023-04-15 08:58:19.547613', '0', '0'),
('sracka1', '', '0', '2023-05-28 16:17:45.096340', '2023-05-28 16:17:44.982990', '1900', '0'),
('t-shirt-1', '', '250', '2023-06-16 13:16:14.283945', '2023-05-29 14:11:11.174765', '10', '1'),
('t-shirt-2', '', '100', '2023-06-19 12:00:27.064283', '2023-06-16 13:12:17.524106', '19', '0');

INSERT INTO "product_productvariant_attributes" ("id", "productvariant_id", "baseattribute_id") VALUES
('1', 't-shirt-1', '3'),
('2', 't-shirt-2', '4');

INSERT INTO "roles_managergroup" ("name", "description") VALUES
('Copywriter', 'Copywriter role'),
('Editor', 'Editor role'),
('UserManager', 'User manager role');

INSERT INTO "roles_managergroup_permissions" ("id", "managergroup_id", "managerpermission_id") VALUES
('1', 'Editor', 'cart_change_permission'),
('2', 'Editor', 'cart_add_permission'),
('3', 'Editor', 'productprice_change_permission'),
('4', 'Editor', 'productprice_add_permission'),
('5', 'Editor', 'productmedia_change_permission'),
('6', 'Editor', 'productmedia_add_permission'),
('7', 'Editor', 'product_change_permission'),
('8', 'Editor', 'product_add_permission'),
('9', 'Editor', 'category_change_permission'),
('10', 'Editor', 'category_add_permission'),
('11', 'Editor', 'page_change_permission'),
('12', 'Editor', 'page_add_permission'),
('13', 'Editor', 'producttype_change_permission'),
('14', 'Editor', 'producttype_add_permission'),
('15', 'Editor', 'pricelist_change_permission'),
('16', 'Editor', 'pricelist_add_permission'),
('17', 'Editor', 'attributetype_change_permission'),
('18', 'Editor', 'attributetype_add_permission'),
('19', 'Editor', 'baseattribute_change_permission'),
('20', 'Editor', 'baseattribute_add_permission'),
('21', 'Copywriter', 'page_change_permission'),
('22', 'Copywriter', 'product_change_permission'),
('23', 'Copywriter', 'productmedia_change_permission'),
('24', 'Copywriter', 'category_change_permission'),
('25', 'UserManager', 'user_add_permission'),
('26', 'UserManager', 'user_change_permission');

INSERT INTO "roles_managerpermission" ("name", "model", "description", "type") VALUES
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

INSERT INTO "sqlite_sequence" ("name", "seq") VALUES
('django_migrations', '158'),
('django_admin_log', '2'),
('django_content_type', '60'),
('product_extensionattribute_ext_attributes', '0'),
('product_product_product_variants', '11'),
('category_category_translation', '16'),
('product_product_translation', '12'),
('cms_pagefrontend_translation', '6'),
('cms_pagecms_translation', '11'),
('cms_page_categories', '10'),
('cms_pagecategory_translation', '15'),
('cms_pagecategory_type', '9'),
('product_producttype_vat_groups', '7'),
('cart_shippingmethod_translation', '10'),
('cart_paymentmethod_translation', '8'),
('cart_shippingmethodcountry_payment_methods', '13'),
('cart_cartitem', '74'),
('auth_group', '3'),
('auth_group_permissions', '26'),
('auth_permission', '325'),
('roles_managergroup_permissions', '26'),
('token_blacklist_blacklistedtoken', '12'),
('token_blacklist_outstandingtoken', '188'),
('user_user_groups', '1'),
('product_attributetype_translation', '4'),
('product_baseattribute_translation', '8'),
('product_producttype_allowed_attribute_types', '2'),
('product_productvariant_attributes', '2'),
('category_category', '8'),
('product_attributetype', '2'),
('product_baseattribute', '5'),
('product_product', '4'),
('product_productmedia', '18'),
('product_productprice', '13'),
('product_producttype', '9'),
('product_productvariantmedia', '0'),
('cms_pagecategory', '11'),
('cms_pagecategorytype', '5'),
('country_billinginfo', '15'),
('country_shippinginfo', '15'),
('country_vatgroup', '8'),
('cart_paymentmethod', '4'),
('cart_paymentmethodcountry', '7'),
('cart_shippingmethod', '5'),
('cart_shippingmethodcountry', '4'),
('cms_page', '16');

INSERT INTO "token_blacklist_blacklistedtoken" ("blacklisted_at", "token_id", "id") VALUES
('2023-05-17 20:47:01.516201', '6', '1'),
('2023-05-18 12:26:58.512003', '14', '2'),
('2023-05-18 12:27:39.823055', '18', '3'),
('2023-05-28 12:54:02.959309', '38', '4'),
('2023-05-28 12:54:12.369364', '42', '5'),
('2023-05-28 12:55:31.573382', '50', '6'),
('2023-05-28 14:06:14.801366', '54', '7'),
('2023-05-29 05:59:41.528442', '62', '8'),
('2023-05-29 05:59:57.197058', '66', '9'),
('2023-05-29 06:00:16.942466', '70', '10'),
('2023-05-29 06:01:19.107213', '74', '11'),
('2023-06-19 13:22:59.165068', '174', '12');

INSERT INTO "token_blacklist_outstandingtoken" ("token", "created_at", "expires_at", "user_id", "jti", "id") VALUES
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQyNDQ4OCwiaWF0IjoxNjg0MzM4MDg4LCJqdGkiOiJlN2QwMWQ2ZGEzMjM0ZWUzYmI3NTM5MWMyY2RlOWJjOCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.6Bdx6l9mfFeSnV_Pk0KmPe8G6ULrZfFJsk3V6J2WgjI', '2023-05-17 15:41:28.550071', '2023-05-18 15:41:28', 'admin@example.com', 'e7d01d6da3234ee3bb75391c2cde9bc8', '1'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQyNDQ4OCwiaWF0IjoxNjg0MzM4MDg4LCJqdGkiOiJmMjJkNWI3MjNhYzQ0NzU1OGJhMTFlZTVhODA0N2YzNiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ofFuAJlfBeO2RschoKOEr45SXyCxf49AmpArrQVHKsM', '2023-05-17 15:41:28.553294', '2023-05-18 15:41:28', 'admin@example.com', 'f22d5b723ac447558ba11ee5a8047f36', '2'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQyNDQ4OCwiaWF0IjoxNjg0MzM4MDg4LCJqdGkiOiIyMmI0NjVlNGQ4MjE0ODcwOTA4ZjNmOWEwN2ZhN2Q0MSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.maYMSGC7CXv9o-CVD0iQKdvRtF1T-5Q9U5wKVvWFWv0', '2023-05-17 15:41:28.641828', '2023-05-18 15:41:28', 'admin@example.com', '22b465e4d8214870908f3f9a07fa7d41', '3'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQyNDQ4OCwiaWF0IjoxNjg0MzM4MDg4LCJqdGkiOiIzZmU2OWNjMGU4MGU0OWE2OTcwZTQ5NmQ5NjFlMmZmZiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.DvJa_zKwJVpEfMxmRolHSryGPmSxDwb7ny2baC72jqY', '2023-05-17 15:41:28.643824', '2023-05-18 15:41:28', 'admin@example.com', '3fe69cc0e80e49a6970e496d961e2fff', '4'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0MjQyMSwiaWF0IjoxNjg0MzU2MDIxLCJqdGkiOiI1NjlhZTIyYmQxMDE0MDYwODAwNmE4M2M4YTQ5NDg3YiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.F39QfuIeAf1q62pdP-pXcNiDDB5sm5eAeJfb8d0Tf0Q', '2023-05-17 20:40:21.326497', '2023-05-18 20:40:21', 'admin@example.com', '569ae22bd10140608006a83c8a49487b', '5'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0MjQyMSwiaWF0IjoxNjg0MzU2MDIxLCJqdGkiOiJmZGZkMDMyMWQ4ZjU0NDA2OGZhZGFmMzIxMDgxYzQyOCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.rPc4NfOC96rTsE0DimxMzuBmJXv3-ScQ2ncKeUDzR24', '2023-05-17 20:40:21.329689', '2023-05-18 20:40:21', 'admin@example.com', 'fdfd0321d8f544068fadaf321081c428', '6'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0MjQyMSwiaWF0IjoxNjg0MzU2MDIxLCJqdGkiOiIzNDFhMTZhNmQ1MTA0NDI0OTBmZjM3ZmRmYjQxNzUyNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.bTBorXtgxpkrIbesc2UuDED0dXrRQulpkjZzAgncEcA', '2023-05-17 20:40:21.384012', '2023-05-18 20:40:21', 'admin@example.com', '341a16a6d510442490ff37fdfb417524', '7'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0MjQyMSwiaWF0IjoxNjg0MzU2MDIxLCJqdGkiOiJmOWQ1YzA1YmZkYmU0NDg4YWMyNjg0MTVjNDkxMDZlNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.a__utheal0SnI5-uT0nsDaqC9gI-sWhpPCIb7YLVxYU', '2023-05-17 20:40:21.385330', '2023-05-18 20:40:21', 'admin@example.com', 'f9d5c05bfdbe4488ac268415c49106e7', '8'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0Mjg1OCwiaWF0IjoxNjg0MzU2NDU4LCJqdGkiOiIzMjE1YWQ4ZTNkMzg0NDUyYTYyZDM2Y2MwNTMxNDU1NiIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.-t0I-SwYCJdky0D2zUfEBzY5c-VHhOZacFpT0XbUMC4', '2023-05-17 20:47:38.546341', '2023-05-18 20:47:38', 'regTest@gmail.com', '3215ad8e3d384452a62d36cc05314556', '9'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0Mjg1OCwiaWF0IjoxNjg0MzU2NDU4LCJqdGkiOiJhZDkzNTc2MDE1YmQ0NDU5YTlhZDFiYjRhNThjYWM0OCIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.X2Vup0izuGulM9yQUXbkK6sklbxSwdBQoGuD48qtLRc', '2023-05-17 20:47:38.548362', '2023-05-18 20:47:38', 'regTest@gmail.com', 'ad93576015bd4459a9ad1bb4a58cac48', '10'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0Mjg1OCwiaWF0IjoxNjg0MzU2NDU4LCJqdGkiOiJkMjhmZTIyZWQyNTE0ZmZkOTJkZDU5ZmIxZTRjYTAxYiIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.bu8-SjwN1CTMZaXlY07GcD7pwZOjqVoWefD0cJW50Ug', '2023-05-17 20:47:38.602721', '2023-05-18 20:47:38', 'regTest@gmail.com', 'd28fe22ed2514ffd92dd59fb1e4ca01b', '11'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ0Mjg1OCwiaWF0IjoxNjg0MzU2NDU4LCJqdGkiOiI5ZTVlZDk0MjFmZmQ0ZGM1YjAxYjljZDQxZDQyMzAzMCIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.qsHbAmEiJZUvzc3Ceu3x0Z4cB442vb1gAZ_1BJy_f0s', '2023-05-17 20:47:38.603943', '2023-05-18 20:47:38', 'regTest@gmail.com', '9e5ed9421ffd4dc5b01b9cd41d423030', '12'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIwMSwiaWF0IjoxNjg0NDEyODAxLCJqdGkiOiJhNjJmZjFjMmU0NjY0NjYzOGNiNTllNmIxZjlhNDk2YSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.Oh1UZsQiBv6zN1fG_TwBtc8HcF_KCnRwtJNfm0GTz4k', '2023-05-18 12:26:41.051211', '2023-05-19 12:26:41', 'admin@example.com', 'a62ff1c2e46646638cb59e6b1f9a496a', '13'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIwMSwiaWF0IjoxNjg0NDEyODAxLCJqdGkiOiJjMzNmYWJjY2ZmYWU0ZjdiOGI0MmY5ZjFlMGM1YjJkZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.xo4kuUFR7J6lTy0BfkQZUNtnRW-qa95G-kZItQee_N8', '2023-05-18 12:26:41.069653', '2023-05-19 12:26:41', 'admin@example.com', 'c33fabccffae4f7b8b42f9f1e0c5b2de', '14'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIwMSwiaWF0IjoxNjg0NDEyODAxLCJqdGkiOiI5ZjQ5NDJhOGQwODM0YTg2OWFhZWNkYjk2YmNhMGZhYyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.cqqBgB2uZqrdrpYEKvIN5KtjpldUq7ik0ly_4wLYmLU', '2023-05-18 12:26:41.151389', '2023-05-19 12:26:41', 'admin@example.com', '9f4942a8d0834a869aaecdb96bca0fac', '15'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIwMSwiaWF0IjoxNjg0NDEyODAxLCJqdGkiOiIxZWQ5MTRmYjRiMzY0NjhjODllY2Y2ZDQyMzkxNDViYSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.q6zf3w5_ch1Qv_WtiA4k6aItV0IRcyk2SU_eIy1k_4M', '2023-05-18 12:26:41.163972', '2023-05-19 12:26:41', 'admin@example.com', '1ed914fb4b36468c89ecf6d4239145ba', '16'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIyMywiaWF0IjoxNjg0NDEyODIzLCJqdGkiOiIyZWRjN2EwMTU0Zjk0Mjk0ODE5NTQ5ZDgyY2YyNmEzYyIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.Zl3HbvQnXkYm6CI3d7V7j9xeOJy2xDlmrUqhK99pv0Y', '2023-05-18 12:27:03.424450', '2023-05-19 12:27:03', 'regTest@gmail.com', '2edc7a0154f94294819549d82cf26a3c', '17'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIyMywiaWF0IjoxNjg0NDEyODIzLCJqdGkiOiJkNDdjYTBmMTY5ZjA0Mjk5Yjk2OWZiYjNlOTAzMjc0MSIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.B1Bmb4MhYn09aBLeldiw230pE-mkw8DUmFXNtOnTcYk', '2023-05-18 12:27:03.439997', '2023-05-19 12:27:03', 'regTest@gmail.com', 'd47ca0f169f04299b969fbb3e9032741', '18'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIyMywiaWF0IjoxNjg0NDEyODIzLCJqdGkiOiI5OWQyMDkxYTYzNjU0N2QxYTFlZjg2ODY1NGU5NmU5NSIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.uZuBr86AdJ6tuzzGA9jfy2evcUev9xVC2b4c9340LW4', '2023-05-18 12:27:03.511059', '2023-05-19 12:27:03', 'regTest@gmail.com', '99d2091a636547d1a1ef868654e96e95', '19'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDQ5OTIyMywiaWF0IjoxNjg0NDEyODIzLCJqdGkiOiIwZmQyYzhjNDgxNjc0NDE5YTFmNDA2YzJkMjI5NzI0MyIsInVzZXJfaWQiOiJyZWdUZXN0QGdtYWlsLmNvbSJ9.Pavfkvo6km20hT3XwJ-yEkwS2qIc0_dooh-GTUmMrO0', '2023-05-18 12:27:03.524349', '2023-05-19 12:27:03', 'regTest@gmail.com', '0fd2c8c481674419a1f406c2d2297243', '20'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDU2MjQxNiwiaWF0IjoxNjg0NDc2MDE2LCJqdGkiOiI4ZTk0MWIyYzFjZTk0YWJlOGVhYjE0NTFkMTM3NmYwYiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.O-d3h2uZktkqhKlNf6_CTAhcMAFgFztXdbaJ6waIcp0', '2023-05-19 06:00:16.311528', '2023-05-20 06:00:16', 'admin@example.com', '8e941b2c1ce94abe8eab1451d1376f0b', '21'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDU2MjQxNiwiaWF0IjoxNjg0NDc2MDE2LCJqdGkiOiJjYmJkNWQwZWRlZTA0MGVjODU0M2JiZGE4ODg0NDgxMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.PVOg7-TudIGVcaaJv0XFza2NOAXg9ghIUzMru_bza6Q', '2023-05-19 06:00:16.339357', '2023-05-20 06:00:16', 'admin@example.com', 'cbbd5d0edee040ec8543bbda88844812', '22'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDU2MjQxNiwiaWF0IjoxNjg0NDc2MDE2LCJqdGkiOiJmMGExZDk0ZGM0MGU0NzY1ODFiMDAyOThkZGE3NDEyMCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.5RB_stTBiDYobeobqogeYRJSJ2RKUMYSOD0b0hnvz-0', '2023-05-19 06:00:16.427957', '2023-05-20 06:00:16', 'admin@example.com', 'f0a1d94dc40e476581b00298dda74120', '23'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NDU2MjQxNiwiaWF0IjoxNjg0NDc2MDE2LCJqdGkiOiJkNWRhMDM5MmFjZDc0NGY5YmVjNDJiNDE0OTBkMDU5NSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ImWSnfpRkDp7hz8nA1RzPAupOnI6h62K_iM6OtSOCw0', '2023-05-19 06:00:16.442573', '2023-05-20 06:00:16', 'admin@example.com', 'd5da0392acd744f9bec42b41490d0595', '24'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTAwNjMyOSwiaWF0IjoxNjg0OTE5OTI5LCJqdGkiOiIwZmNjOTcxYzFlZTg0ZWU1YTZkMmJiNjMyMjRkZTM4NCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.IWTxiTPaJ-942tT7e6pwE9P5vh1opnwNvORlqWcyErE', '2023-05-24 09:18:49.011605', '2023-05-25 09:18:49', 'admin@example.com', '0fcc971c1ee84ee5a6d2bb63224de384', '25'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTAwNjMyOSwiaWF0IjoxNjg0OTE5OTI5LCJqdGkiOiJjY2FlNGI3ZWY2MjU0ZjUzYTM1MzQwNzRjZmQ3NzhiNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.FCRbHh-XxTnIBjXWCEL8SrEeloWTf7aY5wjpZvk3HkM', '2023-05-24 09:18:49.029363', '2023-05-25 09:18:49', 'admin@example.com', 'ccae4b7ef6254f53a3534074cfd778b4', '26'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTAwNjMyOSwiaWF0IjoxNjg0OTE5OTI5LCJqdGkiOiJkZTQ5MGY3MzYxZGY0MjBiOTg2NzhlY2I2OGQzMmIxMSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.5aXobXpzGHPyQel0UlTEIMn6Wk59RgACh7twYjs9dP8', '2023-05-24 09:18:49.099190', '2023-05-25 09:18:49', 'admin@example.com', 'de490f7361df420b98678ecb68d32b11', '27'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTAwNjMyOSwiaWF0IjoxNjg0OTE5OTI5LCJqdGkiOiIxZWJjNWQ0YjIwOWY0YWNlYjk4YTMzZjJmODgzYzI5NCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.U4e7iLluyHHzGBdqquzS9AF-furD6HOE0QC_OcLjGUk', '2023-05-24 09:18:49.118225', '2023-05-25 09:18:49', 'admin@example.com', '1ebc5d4b209f4aceb98a33f2f883c294', '28'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4NjUyNSwiaWF0IjoxNjg1MTAwMTI1LCJqdGkiOiIzY2RiMDFiYTY1YjU0M2ZiYTM0NzQwNTQzM2I1MWYzNSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.NY403oZaA52R5j9egTUHKonu0uBdosZIl-J_pj6aYQs', '2023-05-26 11:22:05.244834', '2023-05-27 11:22:05', 'admin@example.com', '3cdb01ba65b543fba347405433b51f35', '29'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4NjUyNSwiaWF0IjoxNjg1MTAwMTI1LCJqdGkiOiJmZmEwMmYwZTU1NjY0ZTZhOTAyMGM2Yzg5YTAzOWIxNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.wIONR3nt5AEVZGa6o1SBnx7LfD_0Ql-I0GmE-W2m-AY', '2023-05-26 11:22:05.261408', '2023-05-27 11:22:05', 'admin@example.com', 'ffa02f0e55664e6a9020c6c89a039b14', '30'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4NjUyNSwiaWF0IjoxNjg1MTAwMTI1LCJqdGkiOiJjZTE0NmQyMTc1YWE0Zjc1OTdmMjUzODk0MGI1M2YwOSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ph172r_PCo46kNbKtIqC2auNBBdDRoKgwp65PpX5mxY', '2023-05-26 11:22:05.333650', '2023-05-27 11:22:05', 'admin@example.com', 'ce146d2175aa4f7597f2538940b53f09', '31'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4NjUyNSwiaWF0IjoxNjg1MTAwMTI1LCJqdGkiOiI4MWU2NWQ4Y2I0MmI0MWYyODIwNTExMDZhOWM0YWNhYiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.4ATINbWIbq184_vic9TQp3iBiLuz9CE9HunZrxnmqeQ', '2023-05-26 11:22:05.348584', '2023-05-27 11:22:05', 'admin@example.com', '81e65d8cb42b41f282051106a9c4acab', '32'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4ODIxOCwiaWF0IjoxNjg1MTAxODE4LCJqdGkiOiI3NzJiYmMwMGU2YTQ0MGVkOWM0MTAyN2Y3ZDNmNjRiMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.8yFnGGKJbOtTbwn0-cT_yNf00IGDrJacuCCujWmpCFI', '2023-05-26 11:50:18.752826', '2023-05-27 11:50:18', 'admin@example.com', '772bbc00e6a440ed9c41027f7d3f64b2', '33'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4ODIxOCwiaWF0IjoxNjg1MTAxODE4LCJqdGkiOiI5MzM0NzdmNDkxZDE0MTQ0OTdkZmQyODY2YjNjZWQwYyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.VpZyqtRTK7kI6tQPuH_kimItm_7nSQHL_uYr70leQ04', '2023-05-26 11:50:18.768057', '2023-05-27 11:50:18', 'admin@example.com', '933477f491d1414497dfd2866b3ced0c', '34'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4ODIxOCwiaWF0IjoxNjg1MTAxODE4LCJqdGkiOiI0Yzc3NjE3M2Q5N2E0Zjg3ODY0ODMwNTgwODhlYzFlYSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.FOkZXPY8LVUZL6v09qsrjKBqtNV1F3wiWtsJPlLxlkw', '2023-05-26 11:50:18.839282', '2023-05-27 11:50:18', 'admin@example.com', '4c776173d97a4f8786483058088ec1ea', '35'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTE4ODIxOCwiaWF0IjoxNjg1MTAxODE4LCJqdGkiOiJlY2YyN2Q3Njg1OGI0ZWVlODJjOThkMDdmYjEyZWRhNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.-UiyO4uFJAwUglucThDFF6amDCXGkmopKVbXaiJPgfc', '2023-05-26 11:50:18.851854', '2023-05-27 11:50:18', 'admin@example.com', 'ecf27d76858b4eee82c98d07fb12eda4', '36'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDgwNSwiaWF0IjoxNjg1Mjc4NDA1LCJqdGkiOiIyNDVjZjdmMjdmZTY0MGYxYTU4ODYyMWE3NWMxMGY0NCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.RwJtqUpbANnIkYxXpK1pVgxkhquP_CsoiLVWUhL2cIE', '2023-05-28 12:53:25.603099', '2023-05-29 12:53:25', 'admin@example.com', '245cf7f27fe640f1a588621a75c10f44', '37'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDgwNSwiaWF0IjoxNjg1Mjc4NDA1LCJqdGkiOiI4YjYwMzdlYzdiYmI0MGVjOTRmNmUyZjcwMTUyNjg0NyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.WBkX1dvFjvF7kEqVNfCQ4E8aUroKUE8SK-R4i3vtqYU', '2023-05-28 12:53:25.620423', '2023-05-29 12:53:25', 'admin@example.com', '8b6037ec7bbb40ec94f6e2f701526847', '38'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDgwNSwiaWF0IjoxNjg1Mjc4NDA1LCJqdGkiOiI5NzNiY2QyNTJmNWU0YzQ5YjU2YTJhZGIzNDQxZTMxZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.Rtc926SdwJ8TDT3qVs6-ltbA4SvKHhfepavE9VRoMq4', '2023-05-28 12:53:25.689560', '2023-05-29 12:53:25', 'admin@example.com', '973bcd252f5e4c49b56a2adb3441e31d', '39'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDgwNSwiaWF0IjoxNjg1Mjc4NDA1LCJqdGkiOiI2ODNlOWIxZDFkYzk0ODFjYWFjMzhiNDkyZDNjY2VhZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.KphLVSz0y965yF2qgSpTpIg7h8bYz8e1ptNdeAt5Ln8', '2023-05-28 12:53:25.701860', '2023-05-29 12:53:25', 'admin@example.com', '683e9b1d1dc9481caac38b492d3ccead', '40'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg0NCwiaWF0IjoxNjg1Mjc4NDQ0LCJqdGkiOiJhOGEzM2RlMWM2OTQ0MGMyYTFlOGM2ZTIzZDliNWM3MyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.DhraDLwVWq_DoX0Nm8C4Fhd5qjEGsTVJ8rlrABEp8HY', '2023-05-28 12:54:04.988814', '2023-05-29 12:54:04', 'admin@example.com', 'a8a33de1c69440c2a1e8c6e23d9b5c73', '41'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg0NSwiaWF0IjoxNjg1Mjc4NDQ1LCJqdGkiOiJmYzZiZjhjODIxMjc0MzRjOTkzODIxYzNlNzEwZDM2NiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.TfUIejHQ1hNvfKdMO8ee9ZfkRkpu8G7H43qJohC6n14', '2023-05-28 12:54:05.005473', '2023-05-29 12:54:05', 'admin@example.com', 'fc6bf8c82127434c993821c3e710d366', '42'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg0NSwiaWF0IjoxNjg1Mjc4NDQ1LCJqdGkiOiIyM2M4MWQzNThmZjQ0ZGQxODFlODk1ZDlkMmFjOGVhZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.D8B9wKKGy0eMAxxrtuAx_TAX1K6FXF95yrLcsjygLTg', '2023-05-28 12:54:05.082985', '2023-05-29 12:54:05', 'admin@example.com', '23c81d358ff44dd181e895d9d2ac8eae', '43'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg0NSwiaWF0IjoxNjg1Mjc4NDQ1LCJqdGkiOiJiZTBiMzNkODY3MmI0ZjgxOTJiODUwZWU2MTY5NTYxOSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.wS-3zNPlA7UsY_j6-KWey9HkDa85QIR82QK2_N_jQBI', '2023-05-28 12:54:05.094742', '2023-05-29 12:54:05', 'admin@example.com', 'be0b33d8672b4f8192b850ee61695619', '44'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg2OCwiaWF0IjoxNjg1Mjc4NDY4LCJqdGkiOiI1NjY4MDFkZTlhMTI0NjJlODk1MzQ1NzdlOGUyNTI3ZCIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.gwowhVcVfBgWFQe8BGVHkJyvQW4p0u0_yw6Rk7xlKUQ', '2023-05-28 12:54:28.050903', '2023-05-29 12:54:28', 'non_is_staff_user@example.com', '566801de9a12462e89534577e8e2527d', '45'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg2OCwiaWF0IjoxNjg1Mjc4NDY4LCJqdGkiOiIyMWEzMDFhMDhiYTA0Zjg5YmM3NTVlMzk2OGM1NzgwYiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.c9mIczkJCCU-OBwHjZc6UuIw_qonC8BIV8kKyt1nzpk', '2023-05-28 12:54:28.073858', '2023-05-29 12:54:28', 'non_is_staff_user@example.com', '21a301a08ba04f89bc755e3968c5780b', '46'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg2OCwiaWF0IjoxNjg1Mjc4NDY4LCJqdGkiOiI3MTg5YmEwOWQ1NDQ0NDM5OGQ5NDlhZGM5OTYyNzU0NSIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.asLIWHgppGyyPKFqZFMXGNxOZyjYsi8HsbOPge4b8Yk', '2023-05-28 12:54:28.176877', '2023-05-29 12:54:28', 'non_is_staff_user@example.com', '7189ba09d54444398d949adc99627545', '47'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDg2OCwiaWF0IjoxNjg1Mjc4NDY4LCJqdGkiOiIzODJjOThjMTY1YWU0OWI2YTFkMDdhMmEwYjMyNjEyYiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.fEyL-6ZwNQFdY5reOSgTFv7I5Y2Rb08etymxQR9JNRY', '2023-05-28 12:54:28.187622', '2023-05-29 12:54:28', 'non_is_staff_user@example.com', '382c98c165ae49b6a1d07a2a0b32612b', '48'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkyMSwiaWF0IjoxNjg1Mjc4NTIxLCJqdGkiOiJmMGQxZjgyMmYwNWY0OWNiOWFkYWIzMDA3NmRlYjJlNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.g24jN-Ywzc7n_4wYtTGPC3M_2mEybINPTxr4TJy1Zpc', '2023-05-28 12:55:21.071220', '2023-05-29 12:55:21', 'admin@example.com', 'f0d1f822f05f49cb9adab30076deb2e4', '49'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkyMSwiaWF0IjoxNjg1Mjc4NTIxLCJqdGkiOiI2NTQ4M2U0MTQ4ZjI0ZDc2OTBiOTkyZWIxOGIxYWJmZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.As2vf6-OvqtP8Ew9Rn4CqGBN6Zk4PWnn2hn-7nJLcls', '2023-05-28 12:55:21.093723', '2023-05-29 12:55:21', 'admin@example.com', '65483e4148f24d7690b992eb18b1abfe', '50'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkyMSwiaWF0IjoxNjg1Mjc4NTIxLCJqdGkiOiI2YjUwODkyZTMzZGI0NzlhYjBmZDllNjI1YWVhMzk2MyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.MWl6zdNkgzkMv32TFHJgtRUzj3G1LnZ7Wt4DeES3p54', '2023-05-28 12:55:21.169877', '2023-05-29 12:55:21', 'admin@example.com', '6b50892e33db479ab0fd9e625aea3963', '51'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkyMSwiaWF0IjoxNjg1Mjc4NTIxLCJqdGkiOiJmOTZiNTg4ZWE1NzA0ZjJhYTBjZjg5N2NlYjUwNmUzNiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.c3ToG5eVxML6yK5GUsgADNB94JuacYSyvMpNFucKn4M', '2023-05-28 12:55:21.181371', '2023-05-29 12:55:21', 'admin@example.com', 'f96b588ea5704f2aa0cf897ceb506e36', '52'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkzOCwiaWF0IjoxNjg1Mjc4NTM4LCJqdGkiOiI1NTYyZjg4NTJlMjg0NzNjOGIxOWJlNzMxNjljNmFlNSIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.xQ_xQAw6OMlg_3Kf25nrM-cn4z7IZ6NzWjVY-14w6K4', '2023-05-28 12:55:38.604394', '2023-05-29 12:55:38', 'non_is_staff_user@example.com', '5562f8852e28473c8b19be73169c6ae5', '53'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkzOCwiaWF0IjoxNjg1Mjc4NTM4LCJqdGkiOiI1NWE2Y2FiMjI3MGI0NzQ0ODM0ZGExZjdmYzdkOThiNyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.4E5P-00FYP49MOyNc4n2699N5ETZsFWEdvrEsqflbEA', '2023-05-28 12:55:38.618692', '2023-05-29 12:55:38', 'non_is_staff_user@example.com', '55a6cab2270b4744834da1f7fc7d98b7', '54'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkzOCwiaWF0IjoxNjg1Mjc4NTM4LCJqdGkiOiJiZWI5ZjY0YWIyNmM0YzRiYjk1YjVjMTgwZTc3NDQyYSIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.9IPO46bGq_7z9pR14mgQRVJdsxiaENsz5GXgy_0ugK4', '2023-05-28 12:55:38.687602', '2023-05-29 12:55:38', 'non_is_staff_user@example.com', 'beb9f64ab26c4c4bb95b5c180e77442a', '55'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2NDkzOCwiaWF0IjoxNjg1Mjc4NTM4LCJqdGkiOiIzZTIwNWU5MzhiY2E0NGYwOGRjZjEwOGJlOTkwOTE1NCIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.Lc7Uz-GtPEgVtK9mO5P_TI3xDThrl45XxmL11vLe_7I', '2023-05-28 12:55:38.705127', '2023-05-29 12:55:38', 'non_is_staff_user@example.com', '3e205e938bca44f08dcf108be9909154', '56'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2OTE3NywiaWF0IjoxNjg1MjgyNzc3LCJqdGkiOiJiYzQwNzVjNGY2Y2I0ZDhkYWYwZjYzZjA3OTZjYTQ4NiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.8xGPuA_F1tcO9Kq-76EcfJlS4gCVGj7HG2AOPJFjbFk', '2023-05-28 14:06:17.512796', '2023-05-29 14:06:17', 'admin@example.com', 'bc4075c4f6cb4d8daf0f63f0796ca486', '57'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2OTE3NywiaWF0IjoxNjg1MjgyNzc3LCJqdGkiOiIxYmY3YjYyZTRjMDY0MzBkYmM2OTE2NGRkNGNjNGY4MyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.oeyuNAYdhc_z0zLTI72oJaDKy-NGO9HeIV8qAf4I2z0', '2023-05-28 14:06:17.526723', '2023-05-29 14:06:17', 'admin@example.com', '1bf7b62e4c06430dbc69164dd4cc4f83', '58'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2OTE3NywiaWF0IjoxNjg1MjgyNzc3LCJqdGkiOiI3NjgyY2Y2NjQ0MmE0MmMxODRjOTViNGU5ZmE1MWY1YyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.6OOkGggNzAl8BRwh9pcjM-6pfgHqCrZzqgqP8noIaR8', '2023-05-28 14:06:17.595094', '2023-05-29 14:06:17', 'admin@example.com', '7682cf66442a42c184c95b4e9fa51f5c', '59'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTM2OTE3NywiaWF0IjoxNjg1MjgyNzc3LCJqdGkiOiIwMjA2ZmI3NWZjNTU0ODU4YTM3ZTIwOTJhMjNlODZhNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.S_qq-J-K0sNRWZFhh6nKnqCfw9Q3Fxp5_tCCwsqwvyo', '2023-05-28 14:06:17.606905', '2023-05-29 14:06:17', 'admin@example.com', '0206fb75fc554858a37e2092a23e86a7', '60'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM3MCwiaWF0IjoxNjg1MzM5OTcwLCJqdGkiOiJjMmE0YjQwOTYzOTE0YmFkODNlYzZiMmMzYmFhMWQxZiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.JMmwZGl14IAfXgr2ufivLPN7GTnKnOtNRfu7-XuRI10', '2023-05-29 05:59:30.419559', '2023-05-30 05:59:30', 'admin@example.com', 'c2a4b40963914bad83ec6b2c3baa1d1f', '61'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM3MCwiaWF0IjoxNjg1MzM5OTcwLCJqdGkiOiI5OTkxYzg2Nzk0MmE0ZmE2OTVmMzkyMTMyNzE0ZTA3OCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.DrWV_RStIP1rhv-mN2hjuA4uOaQlnPNWpHtIM57u9Pc', '2023-05-29 05:59:30.436847', '2023-05-30 05:59:30', 'admin@example.com', '9991c867942a4fa695f392132714e078', '62'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM3MCwiaWF0IjoxNjg1MzM5OTcwLCJqdGkiOiI1OTZiYTU1YTM2MmM0YTAxYWQxMjVkMTg5NDlhODUyMCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.u-L1J467Dc-Wo3NlvnW6MkpB_yNbr9hn-sZYJjXDHaM', '2023-05-29 05:59:30.509549', '2023-05-30 05:59:30', 'admin@example.com', '596ba55a362c4a01ad125d18949a8520', '63'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM3MCwiaWF0IjoxNjg1MzM5OTcwLCJqdGkiOiI1NTUwNWE3ZmJkZTM0OTkyODc5NWZkNTg4NjZiOTA5OCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.-7svoAYWQAx_XPWsWuA5_eKio7jbWnTzhvEr4zgh2hk', '2023-05-29 05:59:30.520680', '2023-05-30 05:59:30', 'admin@example.com', '55505a7fbde349928795fd58866b9098', '64'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM5MCwiaWF0IjoxNjg1MzM5OTkwLCJqdGkiOiIyNTViMTdkZmE5Yzk0ODNkODExMjk5ZjZjZWZjNDY0MyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.VV3r6GGHQ867g-cAUuLkeYfBqe9hddIDtEJdVclpbsM', '2023-05-29 05:59:50.600374', '2023-05-30 05:59:50', 'non_is_staff_user@example.com', '255b17dfa9c9483d811299f6cefc4643', '65'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM5MCwiaWF0IjoxNjg1MzM5OTkwLCJqdGkiOiJmMzhiNzVhZjcwZmQ0Y2ZjYjY3OTQzYTM1ZGViYjEyNCIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.xm1IrOHnP8tUrvBR4Bt4WHeCFQXKXCobwvcGiOo2gUw', '2023-05-29 05:59:50.618416', '2023-05-30 05:59:50', 'non_is_staff_user@example.com', 'f38b75af70fd4cfcb67943a35debb124', '66'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM5MCwiaWF0IjoxNjg1MzM5OTkwLCJqdGkiOiJlZmNmYWY4ZjUzOWE0ZjZkOTM0MzJkYjBmMzFiNzUwMCIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.1306RyyYaaYfAqgk_lxXrHYYXIoqvWUmI0CIg-XE2Fk', '2023-05-29 05:59:50.687502', '2023-05-30 05:59:50', 'non_is_staff_user@example.com', 'efcfaf8f539a4f6d93432db0f31b7500', '67'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjM5MCwiaWF0IjoxNjg1MzM5OTkwLCJqdGkiOiJhMzFkYWE2Y2IzOTk0NTQ0YTQzMTA0OGU2YzI2MDY5ZiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.MpmWH2OHOiGxKxGztgzE8ADnuez_tplYQThYRH8vuYg', '2023-05-29 05:59:50.698619', '2023-05-30 05:59:50', 'non_is_staff_user@example.com', 'a31daa6cb3994544a431048e6c26069f', '68'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxMywiaWF0IjoxNjg1MzQwMDEzLCJqdGkiOiI4ZTkxY2ViODY0MGE0Nzg4YmM0MjA5YzBhYTg3ODU3NSIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.QK5MQSotblQYFbKfkdUrIouuOhZqcgYfQF8MrYJovJk', '2023-05-29 06:00:13.278351', '2023-05-30 06:00:13', 'non_is_staff_user@example.com', '8e91ceb8640a4788bc4209c0aa878575', '69'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxMywiaWF0IjoxNjg1MzQwMDEzLCJqdGkiOiI4MTgzY2ZhODg3NTI0YTVhYTczNTQ0MjUyZDlhZGU5YyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.EDnp85tHCC8wPUKtiqtSrUGcbBlEaHWQJMVApQ3OV8A', '2023-05-29 06:00:13.293578', '2023-05-30 06:00:13', 'non_is_staff_user@example.com', '8183cfa887524a5aa73544252d9ade9c', '70'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxMywiaWF0IjoxNjg1MzQwMDEzLCJqdGkiOiI2ZTFmMjk4OTY2YTc0NzhiOWQ3NGZmODJmM2RlNjkwZCIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.tJh8AYK71tp0D0KYHuA8Vi_Kc7IMOkHXxh8VPd-B-bA', '2023-05-29 06:00:13.362274', '2023-05-30 06:00:13', 'non_is_staff_user@example.com', '6e1f298966a7478b9d74ff82f3de690d', '71'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxMywiaWF0IjoxNjg1MzQwMDEzLCJqdGkiOiI4ZjU2NDM5M2JjMmU0OGFkOTBmNWY3YjIyZmZjYTY4MiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.IQAltbbUFJcx3LkHIWYt2f4vOrS3W7RO7y-IJHS1yEU', '2023-05-29 06:00:13.373826', '2023-05-30 06:00:13', 'non_is_staff_user@example.com', '8f564393bc2e48ad90f5f7b22ffca682', '72'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxOSwiaWF0IjoxNjg1MzQwMDE5LCJqdGkiOiJhMDJlMmYzZGI1ZmM0YTY3YjM4MzQ1MGRmZGEzZWVmZiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.mwJZPZQycgfrsAcgguk2wcCgs62USuhWyTj7wSjHf3w', '2023-05-29 06:00:19.348642', '2023-05-30 06:00:19', 'admin@example.com', 'a02e2f3db5fc4a67b383450dfda3eeff', '73'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxOSwiaWF0IjoxNjg1MzQwMDE5LCJqdGkiOiJlOWIxYWRiYzk1NzU0NWZhYjExODcwOTliYjE4ZDY0MiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.bYK5aw6HniswOIZwPaGt0dWwW0q0nvch_neyJ8L-0qk', '2023-05-29 06:00:19.362333', '2023-05-30 06:00:19', 'admin@example.com', 'e9b1adbc957545fab1187099bb18d642', '74'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxOSwiaWF0IjoxNjg1MzQwMDE5LCJqdGkiOiIwMWVhNzI4MDI2NmM0MWI5YWQ3MmQwMWYwOTI2OGZjYSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.6Z7AkYt48-M6ZNRVMd7yaiMGiaa03BWyDpM1j98JqV4', '2023-05-29 06:00:19.430035', '2023-05-30 06:00:19', 'admin@example.com', '01ea7280266c41b9ad72d01f09268fca', '75'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQxOSwiaWF0IjoxNjg1MzQwMDE5LCJqdGkiOiJkZmNiNmM2ZDc1YTI0NTVjOTBhZWRjMTM5MzUzM2ViZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.eY_9af3K1o2erqUJAN5vfbFdh04EG8uhsztt6IPBhCw', '2023-05-29 06:00:19.440999', '2023-05-30 06:00:19', 'admin@example.com', 'dfcb6c6d75a2455c90aedc1393533ebd', '76'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NSwiaWF0IjoxNjg1MzQwMDg1LCJqdGkiOiJjZjY0YTBmZWRiYzQ0ZjkyYTgzOTI5ODQyZGU3ZWVjNiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.RChz-uMwc2HlxmfzOn4JVJHosNP6o5RWmz53mp7JOo0', '2023-05-29 06:01:25.233720', '2023-05-30 06:01:25', 'non_is_staff_user@example.com', 'cf64a0fedbc44f92a83929842de7eec6', '77'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NSwiaWF0IjoxNjg1MzQwMDg1LCJqdGkiOiI5OGJmYzYwMjgzZjQ0MDYxYWQ4NDczNWQ2MTM5ODlmZSIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.VSnt16pYTkYLSHpim58a-cd1ZDAuU_08xsqv1KotecM', '2023-05-29 06:01:25.248973', '2023-05-30 06:01:25', 'non_is_staff_user@example.com', '98bfc60283f44061ad84735d613989fe', '78'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NSwiaWF0IjoxNjg1MzQwMDg1LCJqdGkiOiJiYjNlMmE2ZmFjZDQ0OTk5OTU1MWYyOTg2NWMyOWQ2NiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.IION1ZTBv9f5AdYoGq5_MESLKqs4AcYFgztNudNZbvs', '2023-05-29 06:01:25.318471', '2023-05-30 06:01:25', 'non_is_staff_user@example.com', 'bb3e2a6facd449999551f29865c29d66', '79'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NSwiaWF0IjoxNjg1MzQwMDg1LCJqdGkiOiJmZDYwYzBiOGE0Mzg0ZWMyYmVlNzEzNDE4NGJjMmFiMSIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.YKIp3lCscrPfjnf0mcMcfeVAlKjF1WmnaCJpWE_W-Q0', '2023-05-29 06:01:25.330936', '2023-05-30 06:01:25', 'non_is_staff_user@example.com', 'fd60c0b8a4384ec2bee7134184bc2ab1', '80'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NiwiaWF0IjoxNjg1MzQwMDg2LCJqdGkiOiJlNGIzZWQ0NjU3OWU0MjVhYmFjNDUwNDVmODY4Mjk3YyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.aYKyoW_Ivtj58ONVHYidWGS6WRLFP-xUlhy8HDKLoMQ', '2023-05-29 06:01:26.860443', '2023-05-30 06:01:26', 'non_is_staff_user@example.com', 'e4b3ed46579e425abac45045f868297c', '81'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NiwiaWF0IjoxNjg1MzQwMDg2LCJqdGkiOiI5MGY0ZDhhNjQzN2U0MGRlOTkyMzE3NmRjZDJlNDA1NiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.IdNO5IOKyarEc3ybGwk1I4c665zelkPUwhICXYGoVko', '2023-05-29 06:01:26.877813', '2023-05-30 06:01:26', 'non_is_staff_user@example.com', '90f4d8a6437e40de9923176dcd2e4056', '82'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NiwiaWF0IjoxNjg1MzQwMDg2LCJqdGkiOiIwNDc4NzlmNWRlMTk0NjFjYjFlZDIwMDY5MDhkMWNjZSIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.yQnWvnFwrW94k9z0tRXSOjSIuJYnvlr9xdQ_79wh3p8', '2023-05-29 06:01:26.947402', '2023-05-30 06:01:26', 'non_is_staff_user@example.com', '047879f5de19461cb1ed2006908d1cce', '83'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NiwiaWF0IjoxNjg1MzQwMDg2LCJqdGkiOiJiYTZkM2EwOGQwMmM0ZmNiOWE4MTg0MGVhMjMxN2Y5MiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.bgWeV1bo9c57K2RKzF5KXeUQdoYMIEGcPuBvzqfVfYU', '2023-05-29 06:01:26.959306', '2023-05-30 06:01:26', 'non_is_staff_user@example.com', 'ba6d3a08d02c4fcb9a81840ea2317f92', '84'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NywiaWF0IjoxNjg1MzQwMDg3LCJqdGkiOiIzYmRmNmJlYzBmZmE0MWUxOGMwZGVmNjYyNTZmZGU2YyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.3ZlrJaVrvsLqRmgLLWOlSL6kVzDAGZqRWs22_i-EAZU', '2023-05-29 06:01:27.560069', '2023-05-30 06:01:27', 'non_is_staff_user@example.com', '3bdf6bec0ffa41e18c0def66256fde6c', '85'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NywiaWF0IjoxNjg1MzQwMDg3LCJqdGkiOiJmYmU4YmNjNjRjMDc0NjcxODA0MzE1YjQ1ODhkNWM5MiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.SDwD3u3nGxPb2c6nHPFbpNtWZzk0UGyhXgyvrpuMSHk', '2023-05-29 06:01:27.574471', '2023-05-30 06:01:27', 'non_is_staff_user@example.com', 'fbe8bcc64c074671804315b4588d5c92', '86'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NywiaWF0IjoxNjg1MzQwMDg3LCJqdGkiOiJiZTIyYzMwY2E1OTU0NzBlODY2MzE0NmVjMjVmMTgzMyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.j5JhdEMPmZM8eTorMDO45YTCj8mcOmquCnHEtpYG3Ew', '2023-05-29 06:01:27.645841', '2023-05-30 06:01:27', 'non_is_staff_user@example.com', 'be22c30ca595470e8663146ec25f1833', '87'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ4NywiaWF0IjoxNjg1MzQwMDg3LCJqdGkiOiI4YjdlODQ2OWY3ZmY0ZmExYjgzZGQ4MTAyNDA3NmIyNCIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.2JGkr9pwRfHDwoPsCUgk_myOXwiay-NrgSLtBi-m5Po', '2023-05-29 06:01:27.664055', '2023-05-30 06:01:27', 'non_is_staff_user@example.com', '8b7e8469f7ff4fa1b83dd81024076b24', '88'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ5MywiaWF0IjoxNjg1MzQwMDkzLCJqdGkiOiJlYmZlM2RmNjU3MTk0NzY3ODRkYjQ2MDBkNTkxODE0YyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.tV-O3kUpkO58Fvm6Ftyl7Jhhe_ARYkQXFX-BBYFhJ5o', '2023-05-29 06:01:33.767243', '2023-05-30 06:01:33', 'non_is_staff_user@example.com', 'ebfe3df65719476784db4600d591814c', '89'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ5MywiaWF0IjoxNjg1MzQwMDkzLCJqdGkiOiJkNDAxYTliN2RlZjQ0ZmIzOThmM2U3ZDczNThjMmQ2YiIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.m0xhkDt-Ppm4-L_1f8nr8Ilj3uhLOYNX-hAigtlvGM8', '2023-05-29 06:01:33.780760', '2023-05-30 06:01:33', 'non_is_staff_user@example.com', 'd401a9b7def44fb398f3e7d7358c2d6b', '90'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ5MywiaWF0IjoxNjg1MzQwMDkzLCJqdGkiOiIxYTgwOWEyODljYTM0NTFhYjFjNzM0YjhhMzY5OTIwOCIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.MrbEfxjq9Ou_zgfcWcQwm37WxcxhST1gK2OOYd1U5oc', '2023-05-29 06:01:33.849169', '2023-05-30 06:01:33', 'non_is_staff_user@example.com', '1a809a289ca3451ab1c734b8a3699208', '91'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjQ5MywiaWF0IjoxNjg1MzQwMDkzLCJqdGkiOiI4MTgwNmE3ZjM5YzU0ZmFhOWMwMDU4ZTI5M2E5N2FjMyIsInVzZXJfaWQiOiJub25faXNfc3RhZmZfdXNlckBleGFtcGxlLmNvbSJ9.DmGWJoBvdqP3YCJT74eJ3ok_3Z5VtXoY0H33CUQY8A4', '2023-05-29 06:01:33.862725', '2023-05-30 06:01:33', 'non_is_staff_user@example.com', '81806a7f39c54faa9c0058e293a97ac3', '92'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjUzNSwiaWF0IjoxNjg1MzQwMTM1LCJqdGkiOiJhYTIwODIzMDU2YTc0MmZjYmQ1YWMzY2QyNDQ0N2FmNSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.6kJ2knMaNnurxxb7f-77tM8LtQy3R_Bd89mLHV2ewZU', '2023-05-29 06:02:15.554740', '2023-05-30 06:02:15', 'admin@example.com', 'aa20823056a742fcbd5ac3cd24447af5', '93'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjUzNSwiaWF0IjoxNjg1MzQwMTM1LCJqdGkiOiJkYzAwODE1NzgwYWY0NWE0OTQ5MWJiN2Q1YjZiOWJlMyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.OmOgpiyP76d6zI0ygKUKsi7N5yiqiu0488qZSxiSA4A', '2023-05-29 06:02:15.572300', '2023-05-30 06:02:15', 'admin@example.com', 'dc00815780af45a49491bb7d5b6b9be3', '94'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjUzNSwiaWF0IjoxNjg1MzQwMTM1LCJqdGkiOiIzNGJjZmJmOGQ2ZTU0NDI0YjRlM2ZhMzY0ODQ4NmNlMCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.88qO-WMf1550HtzCYnbkvrtZDG-dbc4TwfXwn_8fInE', '2023-05-29 06:02:15.640729', '2023-05-30 06:02:15', 'admin@example.com', '34bcfbf8d6e54424b4e3fa3648486ce0', '95'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNjUzNSwiaWF0IjoxNjg1MzQwMTM1LCJqdGkiOiI2OTdkYWFiMWRhOTA0MzVlODQ4NmQyNmRhMmFiODczMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.18wR9sNtmvBJQ7yYv16Zv36GkCJoHaV9zUt6_ZrD63U', '2023-05-29 06:02:15.652331', '2023-05-30 06:02:15', 'admin@example.com', '697daab1da90435e8486d26da2ab8732', '96'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNzk5NSwiaWF0IjoxNjg1MzQxNTk1LCJqdGkiOiIwNWJkYTQwNmQxOGM0YjRhYTgyNDc1MmQ3ZWE4ODhlNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.mZJ_OritPr1BLH_lmaEcUPu9rMkHimRbbmK2MwfLfn0', '2023-05-29 06:26:35.307297', '2023-05-30 06:26:35', 'admin@example.com', '05bda406d18c4b4aa824752d7ea888e4', '97'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNzk5NSwiaWF0IjoxNjg1MzQxNTk1LCJqdGkiOiI2ZWYwZjk5OWI5M2E0MWUwODg3NWU5NTRjZDJiNjkxOSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.2GTo99HihyZ6nuuv14ifyExoChLuA0u-ynlhMDB4Lzo', '2023-05-29 06:26:35.328251', '2023-05-30 06:26:35', 'admin@example.com', '6ef0f999b93a41e08875e954cd2b6919', '98'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNzk5NSwiaWF0IjoxNjg1MzQxNTk1LCJqdGkiOiJiODUyZGY4MGIwNzc0MjdlOTYwYmExZWY1Y2U0ZjUxMyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.NGCAP-DazxzkNnj0fJj7kf91g_hEOTyftcDJwygE6HU', '2023-05-29 06:26:35.407139', '2023-05-30 06:26:35', 'admin@example.com', 'b852df80b077427e960ba1ef5ce4f513', '99'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQyNzk5NSwiaWF0IjoxNjg1MzQxNTk1LCJqdGkiOiI2NWMwMGQxYWVhM2U0NDM3ODk3OTY4NDFhOTQzNDI2OSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.zMwYarohDgf-fM4y-S6FeTyGMX1XQYYVPhYuBZCI3vU', '2023-05-29 06:26:35.419980', '2023-05-30 06:26:35', 'admin@example.com', '65c00d1aea3e443789796841a9434269', '100'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQzNTczNSwiaWF0IjoxNjg1MzQ5MzM1LCJqdGkiOiJkMDc1Njc4MGJmZDA0YWQxODU2NzVlMGE2OGI5NGJhZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.45v0g2bKfWcryzcAvlBQcBKlNaEnFeIz1R3Nks_mnD4', '2023-05-29 08:35:35.735887', '2023-05-30 08:35:35', 'admin@example.com', 'd0756780bfd04ad185675e0a68b94bad', '101'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQzNTczNSwiaWF0IjoxNjg1MzQ5MzM1LCJqdGkiOiI0MjJjN2U2NmI3MDg0ZDViOTk1YWI0NTQyODY4NjlmOCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.VWY4YP79TdU8KTv6Avqsmpc1clwzYaIzH8Z89HiAj14', '2023-05-29 08:35:35.766003', '2023-05-30 08:35:35', 'admin@example.com', '422c7e66b7084d5b995ab454286869f8', '102'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQzNTczNSwiaWF0IjoxNjg1MzQ5MzM1LCJqdGkiOiIzYzVjYjJlNDZlNTE0Yzc3ODkzOTNhNGYzZTI3NjU4YSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.hAJA8ks9XJGSIHh6HogoPuLcJboa5fmxelp-VsIhQBw', '2023-05-29 08:35:35.838962', '2023-05-30 08:35:35', 'admin@example.com', '3c5cb2e46e514c7789393a4f3e27658a', '103'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQzNTczNSwiaWF0IjoxNjg1MzQ5MzM1LCJqdGkiOiI0NGI3NmJjYWZhYjc0ZjRkOTY5OTM5ZmUwODE2MWY1ZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.cmfNhmDTYZjPwax_6SoiUZeZg5KjAetPMKy82hNY-wk', '2023-05-29 08:35:35.855356', '2023-05-30 08:35:35', 'admin@example.com', '44b76bcafab74f4d969939fe08161f5e', '104'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQ1NTQwNSwiaWF0IjoxNjg1MzY5MDA1LCJqdGkiOiJlNWU5MzgyZjdhY2I0ZjNkOGQzNmUyN2UzMmJmZDJhZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.8uVg1tutFZTiWO_aqhSqIum03A9cXBVMUwLJoU0iXDo', '2023-05-29 14:03:25.773982', '2023-05-30 14:03:25', 'admin@example.com', 'e5e9382f7acb4f3d8d36e27e32bfd2ad', '105'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQ1NTQwNSwiaWF0IjoxNjg1MzY5MDA1LCJqdGkiOiIyZDc4MGNiMTE5Zjg0MDgwODQ5MmI5YjFjNmM4YjdmZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.SabEF2BIOo3BaSSMKJ9Yquu0cfuy-vNTCshMbBSyxO8', '2023-05-29 14:03:25.789772', '2023-05-30 14:03:25', 'admin@example.com', '2d780cb119f840808492b9b1c6c8b7fe', '106'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQ1NTQwNSwiaWF0IjoxNjg1MzY5MDA1LCJqdGkiOiJjMGI0NTI3ZjliZWE0Y2JiYjc2ODBhNjQ1YzBiYzE1YiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.VLVfINdv7MrwZwHF0xkNvmDSYWOst4jtPr0oeuI2__8', '2023-05-29 14:03:25.857957', '2023-05-30 14:03:25', 'admin@example.com', 'c0b4527f9bea4cbbb7680a645c0bc15b', '107'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTQ1NTQwNSwiaWF0IjoxNjg1MzY5MDA1LCJqdGkiOiJiN2U3YzE3ODEwZjc0MTE1YmNkNGE1NTEyNzJjZmIxZiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.G_Gg_Gq_d9IfUbMotIs0KFQ3g2Q2JNoz7LhWpjcXVpE', '2023-05-29 14:03:25.871796', '2023-05-30 14:03:25', 'admin@example.com', 'b7e7c17810f74115bcd4a551272cfb1f', '108'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTcxMDM0OSwiaWF0IjoxNjg1NjIzOTQ5LCJqdGkiOiIwYWNhMGMzZGMxNTU0MmExODE3OWYzZmZjYmRmOWY3YyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.eJfAhS5eegcwWSFNnF2xfR03W1xYr4T5STvb0XgI-7E', '2023-06-01 12:52:29.724899', '2023-06-02 12:52:29', 'admin@example.com', '0aca0c3dc15542a18179f3ffcbdf9f7c', '109'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTcxMDM0OSwiaWF0IjoxNjg1NjIzOTQ5LCJqdGkiOiJkYTk1OGE3MDRlZWU0NjEzYmY1YWEwYjkyODM1ZWEzMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.5ihKoMKz7zymlZNi1GtzjVzsPANu2lpvenodOzCogFA', '2023-06-01 12:52:29.743185', '2023-06-02 12:52:29', 'admin@example.com', 'da958a704eee4613bf5aa0b92835ea32', '110'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTcxMDM0OSwiaWF0IjoxNjg1NjIzOTQ5LCJqdGkiOiIyMjJmYjVkNWZkYWQ0MTdlYWNlMzE2MmMxYjEwYWVkNSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.HyDGIoKGMKeWfaJf6dh9jbzrl2T7Rk_h4wqZONqjulQ', '2023-06-01 12:52:29.814421', '2023-06-02 12:52:29', 'admin@example.com', '222fb5d5fdad417eace3162c1b10aed5', '111'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTcxMDM0OSwiaWF0IjoxNjg1NjIzOTQ5LCJqdGkiOiI1NzM5ZjY3MTA2OGE0ZGU3YjdjYTEyYmY0NDFmM2M2MiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.rbYK2M5W8-90NwvcTacWiQahQ0UZ_CyHiy7fyYabTKQ', '2023-06-01 12:52:29.826018', '2023-06-02 12:52:29', 'admin@example.com', '5739f671068a4de7b7ca12bf441f3c62', '112'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzIyMCwiaWF0IjoxNjg1NzAwODIwLCJqdGkiOiIxODY3ZGMxNmM5Njg0NWFmOTcxNmJlMzUxNzI0Yzg4ZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.NQoaDL8CRZXBXn72eoGyEBBWNXruyZm-3QKvmUzpWa0', '2023-06-02 10:13:40.995275', '2023-06-03 10:13:40', 'admin@example.com', '1867dc16c96845af9716be351724c88e', '113'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzIyMSwiaWF0IjoxNjg1NzAwODIxLCJqdGkiOiI2MTA2YTlkYmQxYTI0ZjM0OTAwMDkwZjZlOTdhZTE2NyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZhbI52aB5vpMh1NbjqKFjOAhDVkNKflPuRPCxMxjsBs', '2023-06-02 10:13:41.010415', '2023-06-03 10:13:41', 'admin@example.com', '6106a9dbd1a24f34900090f6e97ae167', '114'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzIyMSwiaWF0IjoxNjg1NzAwODIxLCJqdGkiOiJiNzdmYzkzMjcyY2U0MTQzOWQ2Yjk1YjVkOGU3YTY1MyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ByfVxCipb0K_na3Wrpz4guXaL1km-Ifi1_MFw4aRxzI', '2023-06-02 10:13:41.080355', '2023-06-03 10:13:41', 'admin@example.com', 'b77fc93272ce41439d6b95b5d8e7a653', '115'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzIyMSwiaWF0IjoxNjg1NzAwODIxLCJqdGkiOiI3MDhmZGJiOGI4ODc0MGUzYmVmOTU2OTZhY2IwOTNlMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.7U_tGcIIFnXNAx2dQDVfffcvUJZA4ydG0GwnAqb_QNI', '2023-06-02 10:13:41.096438', '2023-06-03 10:13:41', 'admin@example.com', '708fdbb8b88740e3bef95696acb093e2', '116'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzI4NiwiaWF0IjoxNjg1NzAwODg2LCJqdGkiOiJmMjFhNWU1YjA4NmQ0MWIwYjRhNTZkMmUxZjk5M2NlZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.KNlf0d5837f7f-wWqO5XSRuU27crM7XdjZ5WN7yz2Hs', '2023-06-02 10:14:46.853811', '2023-06-03 10:14:46', 'admin@example.com', 'f21a5e5b086d41b0b4a56d2e1f993cee', '117'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzI4NiwiaWF0IjoxNjg1NzAwODg2LCJqdGkiOiJmY2FkNDZjMWMwNWM0NDlmYTZkZTc4ODg3ZTY1NWI2NSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.4gw5PHU-J24DsSRClAWeYoMRenKWBrwmXj3zCNVZrHw', '2023-06-02 10:14:46.867317', '2023-06-03 10:14:46', 'admin@example.com', 'fcad46c1c05c449fa6de78887e655b65', '118'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzI4NiwiaWF0IjoxNjg1NzAwODg2LCJqdGkiOiI2NTEyMGYwZGNkY2E0NmE2YmQxNGNkYWYxY2E4OWEzMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.8IUrwzgFN6oQBci4Qg8T-DtVrT-mHBaZhESh50IKY0U', '2023-06-02 10:14:46.959878', '2023-06-03 10:14:46', 'admin@example.com', '65120f0dcdca46a6bd14cdaf1ca89a32', '119'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzI4NiwiaWF0IjoxNjg1NzAwODg2LCJqdGkiOiIxMDQ4YmEyMzYyZDk0NzFlYjI5ZmU5MTBlZjFlOWMyMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ckYhGJsDXggwg1kIIK9kymHMJOsaUpN8i6rltEmhFjk', '2023-06-02 10:14:46.970792', '2023-06-03 10:14:46', 'admin@example.com', '1048ba2362d9471eb29fe910ef1e9c22', '120'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzUzMCwiaWF0IjoxNjg1NzAxMTMwLCJqdGkiOiI2ZDhlZDEwNmM2MzE0ZmNjYjcyOWIxODVmZDUwYWU4YSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.B5Dbd298A-VMProoJGoVkwirrSejQ1xKH1rOsNqMHo0', '2023-06-02 10:18:50.228922', '2023-06-03 10:18:50', 'admin@example.com', '6d8ed106c6314fccb729b185fd50ae8a', '121'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzUzMCwiaWF0IjoxNjg1NzAxMTMwLCJqdGkiOiIwMjhlOWMzZTE4MTQ0OTQ2OTVkNWU5YmI2MjU0Y2MyMyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.4TatG0R_LwhOlYLOonX357BYcpzkzjuSedLNlSvZsm4', '2023-06-02 10:18:50.244524', '2023-06-03 10:18:50', 'admin@example.com', '028e9c3e1814494695d5e9bb6254cc23', '122'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzUzMCwiaWF0IjoxNjg1NzAxMTMwLCJqdGkiOiJlYmM2MzMxNDJhMzk0NTM2YWRmM2JmNDEwZjMzMDdiZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.O_Z_Iiv0m96KzBPj5u_c1RQ4ufDE9G7p-j6JHU6SQfo', '2023-06-02 10:18:50.313610', '2023-06-03 10:18:50', 'admin@example.com', 'ebc633142a394536adf3bf410f3307bd', '123'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc4NzUzMCwiaWF0IjoxNjg1NzAxMTMwLCJqdGkiOiI1ZWM0OWIxNjI5MmI0NjFmOTJkZmYzOTQ0Zjc2Njc5YiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.T31120ZuW_wbuB3U0PONOKwsNicv5mwGXP63bkUlPPk', '2023-06-02 10:18:50.325983', '2023-06-03 10:18:50', 'admin@example.com', '5ec49b16292b461f92dff3944f76679b', '124'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc5OTI4OCwiaWF0IjoxNjg1NzEyODg4LCJqdGkiOiI3OWE1Y2NkODBhMGM0NDNjYTI0MTczYmY0NDY3OTJhNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.2CkdusTA4yWRroNKf4W6Yln3TJyoF5gehf0N-iaDOwA', '2023-06-02 13:34:48.714676', '2023-06-03 13:34:48', 'admin@example.com', '79a5ccd80a0c443ca24173bf446792a7', '125'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc5OTI4OCwiaWF0IjoxNjg1NzEyODg4LCJqdGkiOiJiMTAyYjUzODdhMzQ0M2Q0YjhkYWI4YTIyNWU0ZWYxMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.UtVoBR5I5JCAonp0F5ZGmT8D539jxcriin0yBekog0g', '2023-06-02 13:34:48.731722', '2023-06-03 13:34:48', 'admin@example.com', 'b102b5387a3443d4b8dab8a225e4ef12', '126'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc5OTI4OCwiaWF0IjoxNjg1NzEyODg4LCJqdGkiOiI1NzMzYmI3YWUzMGU0YWYwYmJkNGNiZjFjOTk2ZDA0MyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.FBDp2D2FQ8GFs6hH1zMzsmgKXjQr0lTXLtWRoBaYx7E', '2023-06-02 13:34:48.802686', '2023-06-03 13:34:48', 'admin@example.com', '5733bb7ae30e4af0bbd4cbf1c996d043', '127'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NTc5OTI4OCwiaWF0IjoxNjg1NzEyODg4LCJqdGkiOiJmMTQwNmVkZjA2NzI0N2Y4YTQ1ZmY2MWU3ZDdlODU2ZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.KPa3SRRoqxGauYdt63X4VckVem9sad05f8kgJV5jCTU', '2023-06-02 13:34:48.815059', '2023-06-03 13:34:48', 'admin@example.com', 'f1406edf067247f8a45ff61e7d7e856d', '128'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAyODQzNSwiaWF0IjoxNjg1OTQyMDM1LCJqdGkiOiI1Njc2MjFlMzA2ZDI0NjRmYTg2YjY0NmI2OTYxYTk5OCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.fwwUDlXuvCpQ1iIbZB49uBV9hFkJlfqyrjePbjbXRqo', '2023-06-05 05:13:55.092048', '2023-06-06 05:13:55', 'admin@example.com', '567621e306d2464fa86b646b6961a998', '129'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAyODQzNSwiaWF0IjoxNjg1OTQyMDM1LCJqdGkiOiI4YmE4NGQ5YjgzNjE0MjZmYjY0YjEwYjViNzQ1YWQ4YSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.b_KP3WZD61F6wiTjCv_HxF6JXOUUgzuf2r3XZSS38tw', '2023-06-05 05:13:55.111467', '2023-06-06 05:13:55', 'admin@example.com', '8ba84d9b8361426fb64b10b5b745ad8a', '130'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAyODQzNSwiaWF0IjoxNjg1OTQyMDM1LCJqdGkiOiI1YTllNThlZjBlNjE0ZWRmOGQ3ZTQ4MzMyM2E0MWI5OCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.B-FaeK2W89lNtNXZz_Zsr5n11QUFC7iKdE82BvCzMx0', '2023-06-05 05:13:55.182508', '2023-06-06 05:13:55', 'admin@example.com', '5a9e58ef0e614edf8d7e483323a41b98', '131'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAyODQzNSwiaWF0IjoxNjg1OTQyMDM1LCJqdGkiOiIzMzFmOTZiOWFjODY0Y2EzOGRmOTYwZTIzODc5Yzg0MiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.3dO90jrtqEs4cH53W-0gANGmlDV4qh-78l7hNlDgRk0', '2023-06-05 05:13:55.195198', '2023-06-06 05:13:55', 'admin@example.com', '331f96b9ac864ca38df960e23879c842', '132'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzMTkwMywiaWF0IjoxNjg1OTQ1NTAzLCJqdGkiOiJhNjM0MDY2ZTRiNzA0NjEwOTQ1YzNkNWM3MGE4OTAwZiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.yuzcFItZhamIT3fuMjrm5Od1mceG-VeBydi0rkNV85c', '2023-06-05 06:11:43.156693', '2023-06-06 06:11:43', 'admin@example.com', 'a634066e4b704610945c3d5c70a8900f', '133'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzMTkwMywiaWF0IjoxNjg1OTQ1NTAzLCJqdGkiOiJhNWM4ZDNjMGY3ZWY0NjE2YjZjODBmMDU4NjI3ZDc3MCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.atQwxK2rKgKACvM4foGGcWFliwGkj5LwwxwNMOC-dBo', '2023-06-05 06:11:43.172861', '2023-06-06 06:11:43', 'admin@example.com', 'a5c8d3c0f7ef4616b6c80f058627d770', '134'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzMTkwMywiaWF0IjoxNjg1OTQ1NTAzLCJqdGkiOiIxNGE4MGM1ZDhlMzU0NjkwYWQ3OWZmMGM1YWNhYjQ4NyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.aqp5LMQpFzXCjVaGIx3GW5VjgKz2PXpsnYs8J2WvVEY', '2023-06-05 06:11:43.252033', '2023-06-06 06:11:43', 'admin@example.com', '14a80c5d8e354690ad79ff0c5acab487', '135'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzMTkwMywiaWF0IjoxNjg1OTQ1NTAzLCJqdGkiOiJiYWZlYjI0OTQzMjk0YmYyYTkxMWU3OTEwMzQ4ZTBkNSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.MlUrW7-SAuerxROoBlWmwtS-g-ebyUi0Le0jvIry1zs', '2023-06-05 06:11:43.270722', '2023-06-06 06:11:43', 'admin@example.com', 'bafeb24943294bf2a911e7910348e0d5', '136'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzNjcwOCwiaWF0IjoxNjg1OTUwMzA4LCJqdGkiOiI5OTZkZmNhMjU3NWM0ZTgwODQxMDc3ZDhlMzk2NTQyNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ZXc0DT0L_zmz5uekDf5vov_A_GnHvfKAnKmGKb0jUaQ', '2023-06-05 07:31:48.239511', '2023-06-06 07:31:48', 'admin@example.com', '996dfca2575c4e80841077d8e3965427', '137'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzNjcwOCwiaWF0IjoxNjg1OTUwMzA4LCJqdGkiOiI5NDVhYWEwZTA4YmY0ODZhOTcyZTUwZjNiNDdmNTc4NyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.UL382njo0USH4ubPltjBtIYzFW_sz1ziTsc8VQJ3Ms0', '2023-06-05 07:31:48.258922', '2023-06-06 07:31:48', 'admin@example.com', '945aaa0e08bf486a972e50f3b47f5787', '138'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzNjcwOCwiaWF0IjoxNjg1OTUwMzA4LCJqdGkiOiI0YzY4OWFjMGFkZjY0NDk2OTUyM2RiMzU1ZTk5MThkYiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.Sl_TFpJ7_QO5vIS-Z5RU6Md-bGXbxXCGxV8sRukGpBk', '2023-06-05 07:31:48.346491', '2023-06-06 07:31:48', 'admin@example.com', '4c689ac0adf644969523db355e9918db', '139'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjAzNjcwOCwiaWF0IjoxNjg1OTUwMzA4LCJqdGkiOiI2MmE3ZjBiNTk5OWY0ZjIwYjY3MTRiOTAwMWNlZTMwNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.vZvbl_BcD5f1gB_xQdre-y5mQqT3cDpd3albR_VOtxQ', '2023-06-05 07:31:48.382925', '2023-06-06 07:31:48', 'admin@example.com', '62a7f0b5999f4f20b6714b9001cee304', '140'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjQwNzQ4MCwiaWF0IjoxNjg2MzIxMDgwLCJqdGkiOiJiMGIyODVjN2I5ZTY0MTM5YWI5ODkxZTVkN2U0OWVjYiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.s6EG09cZcakitq_sMfUUCUxGQ9t2O6kwDsQqZMrQgsU', '2023-06-09 14:31:20.280259', '2023-06-10 14:31:20', 'admin@example.com', 'b0b285c7b9e64139ab9891e5d7e49ecb', '141'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjQwNzQ4MCwiaWF0IjoxNjg2MzIxMDgwLCJqdGkiOiIyZTliMTcwNTQ4YTc0NWVmODhkYjE5N2JhMDc1ZjczNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.53d32RqHaN6qIwNL4K5viB0zXmOnpiZJ90L0EPgmS4g', '2023-06-09 14:31:20.309091', '2023-06-10 14:31:20', 'admin@example.com', '2e9b170548a745ef88db197ba075f737', '142'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjQwNzQ4MCwiaWF0IjoxNjg2MzIxMDgwLCJqdGkiOiI2MTVmZDg1OWJkNmU0NzI3YjVlNDFlZDI2YTk3YTQzYyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.p9eMIliA90j9iZsKa_M0tJ7ZGSS-j3YPCYmFB_QzQik', '2023-06-09 14:31:20.403613', '2023-06-10 14:31:20', 'admin@example.com', '615fd859bd6e4727b5e41ed26a97a43c', '143'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjQwNzQ4MCwiaWF0IjoxNjg2MzIxMDgwLCJqdGkiOiI0MThmZjI3ZmMzNGE0NjYxODMxNDU4ZTUyZTIwNTdhNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ozfsTl4przPsaok0Q8esI6JZGeToFh1xDq0dJlv0FO8', '2023-06-09 14:31:20.415710', '2023-06-10 14:31:20', 'admin@example.com', '418ff27fc34a4661831458e52e2057a7', '144'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjY1NDMxNSwiaWF0IjoxNjg2NTY3OTE1LCJqdGkiOiI2MDk1ZDBlYjg2OTE0NjAzODNlZGU4M2VjNWQxZDIxNiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.XbpLHF_v4O8TYTU9e86OQfs8ia6BHcZ0u15bKVylEIQ', '2023-06-12 11:05:15.875265', '2023-06-13 11:05:15', 'admin@example.com', '6095d0eb8691460383ede83ec5d1d216', '145'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjY1NDMxNSwiaWF0IjoxNjg2NTY3OTE1LCJqdGkiOiJjYzViN2JjODFmMzA0NzMxODFmOWM5OGE4MDZhNWQ4ZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.4pJor6xPBnJFqVfEf2ftiKuIt2TyF6ihLNaHuXzgafk', '2023-06-12 11:05:15.893331', '2023-06-13 11:05:15', 'admin@example.com', 'cc5b7bc81f30473181f9c98a806a5d8e', '146'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjY1NDMxNSwiaWF0IjoxNjg2NTY3OTE1LCJqdGkiOiJkMzYyZjcyMWUxNjQ0NDAyODRjMGQxMGRlM2Y1ZTk4YyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.k13-i-_n5vEO3dy76OrVoBMjPORu7qD0nToTwqP9-mU', '2023-06-12 11:05:15.964584', '2023-06-13 11:05:15', 'admin@example.com', 'd362f721e164440284c0d10de3f5e98c', '147'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NjY1NDMxNSwiaWF0IjoxNjg2NTY3OTE1LCJqdGkiOiI0ZDQyMGQ5NWFjNzE0YmVhYmI0NWQzZjE1ODhmOTNmYiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.EIazAzXl9aL2-xebDGwTfVT6ccus-Me3Ij7CewZpzIs', '2023-06-12 11:05:15.977089', '2023-06-13 11:05:15', 'admin@example.com', '4d420d95ac714beabb45d3f1588f93fb', '148'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAwNDAwNSwiaWF0IjoxNjg2OTE3NjA1LCJqdGkiOiIzNzMzNGY5OTA4M2M0MjQxYjNmYTY1M2QxNDU5NjAxMiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.HOxOjOX2UZpp08hWEB0uB_KCi2BXf0wbGGzUyPdHvzo', '2023-06-16 12:13:25.019059', '2023-06-17 12:13:25', 'admin@example.com', '37334f99083c4241b3fa653d14596012', '149'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAwNDAwNSwiaWF0IjoxNjg2OTE3NjA1LCJqdGkiOiI4YzM1ZDEzNGVkY2Q0ZjMzOTAwYjE2YmIzODk4MmRiNiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.mpvvC7IV-QBcC75QXwF5aqjGZ5YWc6PI_fMalZ-UQS8', '2023-06-16 12:13:25.037162', '2023-06-17 12:13:25', 'admin@example.com', '8c35d134edcd4f33900b16bb38982db6', '150'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAwNDAwNSwiaWF0IjoxNjg2OTE3NjA1LCJqdGkiOiI0ZWQ1ZWFiOWUyN2M0Y2NkYTM5ODk2MTIxODI1NjU5MyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9._B5j16GlEHT20gp-0kVhs_E5fT1fbVSLhU4uFMyHQ2o', '2023-06-16 12:13:25.127637', '2023-06-17 12:13:25', 'admin@example.com', '4ed5eab9e27c4ccda398961218256593', '151'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAwNDAwNSwiaWF0IjoxNjg2OTE3NjA1LCJqdGkiOiJiMzcxMzY2Y2ExODI0ZDRkYjZkNDllMWUxMWRjMmU4NiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.2QOxduteaokf460E1aWA72Yg_Y_5oLx-o8wXdo16pjM', '2023-06-16 12:13:25.142539', '2023-06-17 12:13:25', 'admin@example.com', 'b371366ca1824d4db6d49e1e11dc2e86', '152'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxMTU4NCwiaWF0IjoxNjg2OTI1MTg0LCJqdGkiOiIwMGMyNTk2NmNlYmQ0ZWQxYTQxOWNhZmE2ZTg0YmEzNSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.wCY04kYWAOmJFPOQlB0BQuStGKEa-XpIohtKfV8oQhQ', '2023-06-16 14:19:44.517164', '2023-06-17 14:19:44', 'admin@example.com', '00c25966cebd4ed1a419cafa6e84ba35', '153'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxMTU4NCwiaWF0IjoxNjg2OTI1MTg0LCJqdGkiOiI5N2RmYTg5YTgyNWY0NjhkOGU2NDAxM2IzZDAxYzI1OCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.I5K3mbVFfazr9TE4HQeILSAjmQ2ZD-_Eo4Q4AHRaq_k', '2023-06-16 14:19:44.533558', '2023-06-17 14:19:44', 'admin@example.com', '97dfa89a825f468d8e64013b3d01c258', '154'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxMTU4NCwiaWF0IjoxNjg2OTI1MTg0LCJqdGkiOiI3ODNhMDc4YzA4NTQ0ZmM0YTg0NDhiZGFiYTA4MmFiYyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.TuP5N-cz7GpM3S5_I7dnv_ZDcOZ0F_Sn9vzLbNZEkI0', '2023-06-16 14:19:44.618964', '2023-06-17 14:19:44', 'admin@example.com', '783a078c08544fc4a8448bdaba082abc', '155'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxMTU4NCwiaWF0IjoxNjg2OTI1MTg0LCJqdGkiOiI5YWI4YzgyM2I0ZGQ0NjdhYmMwZDJlODQ1ODAzOTFhNiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.kBQvoC5r1oOtWi-E-HDljXWaxaVsNz57LTxBnCztoOk', '2023-06-16 14:19:44.631587', '2023-06-17 14:19:44', 'admin@example.com', '9ab8c823b4dd467abc0d2e84580391a6', '156'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxNDE0MCwiaWF0IjoxNjg2OTI3NzQwLCJqdGkiOiJkYjU0YWQ0NDI4MWI0N2UyOTRkMTExODE3ZGI5ZWM4NCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.a83S_Gyb-vJycS16Lz4i2fzU3MRXJKgk-rO_Cq6IrW4', '2023-06-16 15:02:20.361865', '2023-06-17 15:02:20', 'admin@example.com', 'db54ad44281b47e294d111817db9ec84', '157'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxNDE0MCwiaWF0IjoxNjg2OTI3NzQwLCJqdGkiOiI5MmZhMTVjZjY1NmQ0NDViODBjYjBmNGY4ZGRjNmRkOSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.eOAhiZ_OBIOM8I-xyoA-jXcVsvkqt69DShd6FXNjud0', '2023-06-16 15:02:20.380794', '2023-06-17 15:02:20', 'admin@example.com', '92fa15cf656d445b80cb0f4f8ddc6dd9', '158'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxNDE0MCwiaWF0IjoxNjg2OTI3NzQwLCJqdGkiOiJlNmEwYmNlNjg1Mzk0OGM0OGU0YmFhMjg1NjViYTg1NSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.9mXesJfgtTe-WigGrWn2IZovFfnVQFoLdMmBCl19YwY', '2023-06-16 15:02:20.471490', '2023-06-17 15:02:20', 'admin@example.com', 'e6a0bce6853948c48e4baa28565ba855', '159'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzAxNDE0MCwiaWF0IjoxNjg2OTI3NzQwLCJqdGkiOiIwZGRkNzk2MGY4ZmI0ZjQ4Yjc1ODA3OWY4N2UyMjRiOCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ibKiSY-TIgUKI3PYWMQ6ao2JA20CcbNUmxsWFPF0Lu0', '2023-06-16 15:02:20.486170', '2023-06-17 15:02:20', 'admin@example.com', '0ddd7960f8fb4f48b758079f87e224b8', '160'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzA2OTQ5NywiaWF0IjoxNjg2OTgzMDk3LCJqdGkiOiJiYWE4OWVkYjA5NzY0NzhkOTA4ZmNjMjNmNjBmYzJmNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.KNx1Vy6G5A50Ytxrf62zLK4uNEQwWWd-KC5GPunzW_w', '2023-06-17 06:24:57.302886', '2023-06-18 06:24:57', 'admin@example.com', 'baa89edb0976478d908fcc23f60fc2f7', '161'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzA2OTQ5NywiaWF0IjoxNjg2OTgzMDk3LCJqdGkiOiJjNjJjNjEwMmZmNGE0ZDEyYTFjZTcwMDU1MzUzZWY2ZSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.M_WAgtx1nE1jgjsuvvBVGfGOKbRD9LobU639suRSejQ', '2023-06-17 06:24:57.317686', '2023-06-18 06:24:57', 'admin@example.com', 'c62c6102ff4a4d12a1ce70055353ef6e', '162'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzA2OTQ5NywiaWF0IjoxNjg2OTgzMDk3LCJqdGkiOiI2NjRmNDU0NDRmZjA0MWQ4OGE0ODlhYTQxMzY4ZmE2ZCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.wc4P__FKmw7GROWnKkUcDNZOXHOwOxgok-vAyUQ5M9c', '2023-06-17 06:24:57.411690', '2023-06-18 06:24:57', 'admin@example.com', '664f45444ff041d88a489aa41368fa6d', '163'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzA2OTQ5NywiaWF0IjoxNjg2OTgzMDk3LCJqdGkiOiJiYTQ0MmE1YWNhYWI0Zjc3YTc4MTE3ZDljM2E1OTg2MiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.hWk3lLdWQAMNhaEJKdvnmUoY4Fyc1JmKaJunRszJJPc', '2023-06-17 06:24:57.424723', '2023-06-18 06:24:57', 'admin@example.com', 'ba442a5acaab4f77a78117d9c3a59862', '164'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2MjI4MiwiaWF0IjoxNjg3MTc1ODgyLCJqdGkiOiI0NjA5YzE1ODkwMDk0ZmQ5YWQ3OTM1ZmM1YWM3MmY0MiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.Urfp58oBdPznb84w9u6ZNbKg7PqgyXtJnNPwyYR64XA', '2023-06-19 11:58:02.843670', '2023-06-20 11:58:02', 'admin@example.com', '4609c15890094fd9ad7935fc5ac72f42', '165'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2MjI4MiwiaWF0IjoxNjg3MTc1ODgyLCJqdGkiOiI2MzM3MmVkOTJmYjg0MTYzOTJkOWJmNzdiMDdkZmE4YSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.sRklbeZRFT5jMYldkXysH0jYXeDRpb2PaY7j4Kh5MJg', '2023-06-19 11:58:02.869691', '2023-06-20 11:58:02', 'admin@example.com', '63372ed92fb8416392d9bf77b07dfa8a', '166'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2MjI4MiwiaWF0IjoxNjg3MTc1ODgyLCJqdGkiOiJkN2NlMDk4NjllZjY0MGE4YTQ1NjhlN2Y1OWNjYzBhMyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.Oiq_StfnfeCgRNgJsaHsfuCuNJjPELqy4oW-bCAY6mA', '2023-06-19 11:58:02.956646', '2023-06-20 11:58:02', 'admin@example.com', 'd7ce09869ef640a8a4568e7f59ccc0a3', '167'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2MjI4MiwiaWF0IjoxNjg3MTc1ODgyLCJqdGkiOiI1MGQxOGRhYjg1NmM0NWZkYjlkZjg4Nzg4ZGRkMzg3MiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.vLFlUXwAghPAdnpUJ3V2HuDoMy_E20JXrrP6B5RDh0M', '2023-06-19 11:58:02.974419', '2023-06-20 11:58:02', 'admin@example.com', '50d18dab856c45fdb9df88788ddd3872', '168'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NDkzMiwiaWF0IjoxNjg3MTc4NTMyLCJqdGkiOiI2MDZhMzc5NzBkZjE0Yjc4OGZmZTdiYjhlMjQzNjBkMSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.3-U6109X4yYTriae8grukOmpe_XR_uO99nK3lS6U7s8', '2023-06-19 12:42:12.115629', '2023-06-20 12:42:12', 'admin@example.com', '606a37970df14b788ffe7bb8e24360d1', '169'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NDkzMiwiaWF0IjoxNjg3MTc4NTMyLCJqdGkiOiI0ZTJjNGE0MDRjNjY0OWMzYjIwYTgyNDEzOGQyZWQwYyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.XT562Ew2i3ENAPI4Qjctn1BJGvrclKLMDjrsLklRXEM', '2023-06-19 12:42:12.139137', '2023-06-20 12:42:12', 'admin@example.com', '4e2c4a404c6649c3b20a824138d2ed0c', '170'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NDkzMiwiaWF0IjoxNjg3MTc4NTMyLCJqdGkiOiI4ZjlkZWVjMThhNzg0OTFmOTg5N2U2OGRlZmYyOThmYyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.YbuaXn1kb_XQdIGbzavXKxNPWVaARDV7yaCIBwX9jW4', '2023-06-19 12:42:12.224353', '2023-06-20 12:42:12', 'admin@example.com', '8f9deec18a78491f9897e68deff298fc', '171'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NDkzMiwiaWF0IjoxNjg3MTc4NTMyLCJqdGkiOiJmNDk1ZjA2ZmZkMmE0NTUwOTkyYTNhZDNhYjJmOTk2OSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.Z_IRdRof7OXq9GHgYvfpUkegswRc4vY6G5EyJprtbv0', '2023-06-19 12:42:12.236063', '2023-06-20 12:42:12', 'admin@example.com', 'f495f06ffd2a4550992a3ad3ab2f9969', '172'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NzMzMCwiaWF0IjoxNjg3MTgwOTMwLCJqdGkiOiI5NmEzMTQzYjZjZGU0MzlmODRmMjY1ZGU2ZTk2ODUzYSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.VPNTrDL1umckVqFcnktCk7x9D2Toak-KfnXCHxatfko', '2023-06-19 13:22:10.630081', '2023-06-20 13:22:10', 'admin@example.com', '96a3143b6cde439f84f265de6e96853a', '173'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NzMzMCwiaWF0IjoxNjg3MTgwOTMwLCJqdGkiOiIwZTdmZDMxMDRkMGQ0MWMxYTliMmQzYTMyZTg5NGY5ZiIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.ciMkhoYTKmcdENJSCvgBeGsMTWo8IkNtqix0_PZ_-rM', '2023-06-19 13:22:10.648476', '2023-06-20 13:22:10', 'admin@example.com', '0e7fd3104d0d41c1a9b2d3a32e894f9f', '174'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NzMzMCwiaWF0IjoxNjg3MTgwOTMwLCJqdGkiOiJjNDEyYzA2ODE2NmQ0NzEwYTk2ZTc1Yzc5ZmU1NTg5NSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.dDpAh12FAg3rRK1jZ9gRVL7o3GdRsB0x5VvpL2J6Y3o', '2023-06-19 13:22:10.733902', '2023-06-20 13:22:10', 'admin@example.com', 'c412c068166d4710a96e75c79fe55895', '175'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzI2NzMzMCwiaWF0IjoxNjg3MTgwOTMwLCJqdGkiOiI3MjMwMmE5ODUxNmY0MzlmYTc5YjNlNjQ3NjY3NWMyNyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.7kp8RLm8dGWqN2rzbO9wsJHebwLj6g0R7NP8j-QR0Cs', '2023-06-19 13:22:10.746922', '2023-06-20 13:22:10', 'admin@example.com', '72302a98516f439fa79b3e6476675c27', '176'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzkzNzEyMCwiaWF0IjoxNjg3ODUwNzIwLCJqdGkiOiI1YTkzNzEzMzczZDM0Yzc0YWFjMjNmNjY5YTRlN2VmOSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.Zl3w4xQjaX6-wKdXrCHspHaCude3wxf7b1apccuRqWA', '2023-06-27 07:25:20.847947', '2023-06-28 07:25:20', 'admin@example.com', '5a93713373d34c74aac23f669a4e7ef9', '177'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzkzNzEyMCwiaWF0IjoxNjg3ODUwNzIwLCJqdGkiOiJmNzAyODI3Y2RkMTQ0OWNjOTFiNTM2NmM3ZWM1Nzc5OCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.baQLz2A9JD99vR1jiN4rezR6H2q-ewlGH3X4ogrTpFM', '2023-06-27 07:25:20.871534', '2023-06-28 07:25:20', 'admin@example.com', 'f702827cdd1449cc91b5366c7ec57798', '178'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzkzNzEyMCwiaWF0IjoxNjg3ODUwNzIwLCJqdGkiOiIxMjZjOTFlNzk0ZDQ0NWM2OWMwZTQ1MDVjZTBhODM3MyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.9Rt5O7rlCJ4PAQfnNnLn8gsVh-kHNsD5IRNN7-dm1PY', '2023-06-27 07:25:20.962518', '2023-06-28 07:25:20', 'admin@example.com', '126c91e794d445c69c0e4505ce0a8373', '179'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4NzkzNzEyMCwiaWF0IjoxNjg3ODUwNzIwLCJqdGkiOiJiNjIyZGEwNzBhOTE0NzViOGEwYzM4NDJkY2JkODYwYyIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.K2UPkPFHfXRgkpimGG93lSfZbnZrsrySX2-96giRyIc', '2023-06-27 07:25:20.975805', '2023-06-28 07:25:20', 'admin@example.com', 'b622da070a91475b8a0c3842dcbd860c', '180'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4Nzk0Nzc5OSwiaWF0IjoxNjg3ODYxMzk5LCJqdGkiOiI0ZTA5MmUwMTY5ZDk0YmI1YTcwNDVlNjA5MjIzYTM5NCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.8DgBDEGXt2pyo38Onv1F3TLUzKaKexzOyRY4FV4u-yA', '2023-06-27 10:23:19.613670', '2023-06-28 10:23:19', 'admin@example.com', '4e092e0169d94bb5a7045e609223a394', '181'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4Nzk0Nzc5OSwiaWF0IjoxNjg3ODYxMzk5LCJqdGkiOiI3MTgxOTAzMGVhZGU0ODBjOGY3YjBjYmIxMTBjNmFmNSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.wBIbq-OMPmyqG40sgBzpZZxhVNMOE-YyxaYkSLNk_2o', '2023-06-27 10:23:19.635437', '2023-06-28 10:23:19', 'admin@example.com', '71819030eade480c8f7b0cbb110c6af5', '182'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4Nzk0Nzc5OSwiaWF0IjoxNjg3ODYxMzk5LCJqdGkiOiJiMjc4ODk5N2VkNTk0MWRjOTQyMzk0NTc4MGY0YmEyNCIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.kKEo6lSrHO1FfB7aii2_qUK_TzHOiPjmLJQrWGDmvws', '2023-06-27 10:23:19.723827', '2023-06-28 10:23:19', 'admin@example.com', 'b2788997ed5941dc9423945780f4ba24', '183'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4Nzk0Nzc5OSwiaWF0IjoxNjg3ODYxMzk5LCJqdGkiOiI4ZDIyZWFmODZkYmE0MmZiYmQyNTRmMTgwMWZmZmIzYSIsInVzZXJfaWQiOiJhZG1pbkBleGFtcGxlLmNvbSJ9.tVAKRV4hr9qTbvTYqnUSqvObtbna4ZgYSVPjwwppoAQ', '2023-06-27 10:23:19.736786', '2023-06-28 10:23:19', 'admin@example.com', '8d22eaf86dba42fbbd254f1801fffb3a', '184'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4ODQ3MDkyMSwiaWF0IjoxNjg4Mzg0NTIxLCJqdGkiOiIwMzQxODBjMTdjYjE0MjlkYWM1Mjg0ZTMwYzdkZDMzZCIsInVzZXJfaWQiOiJtaWNoYWxAdGVzdC5jb20ifQ.lLzjKiAYUKXWl2c-qW7M6WFC5fxfeeVwJrTjaFw19uE', '2023-07-03 11:42:01.742932', '2023-07-04 11:42:01', 'michal@test.com', '034180c17cb1429dac5284e30c7dd33d', '185'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4ODQ3MDkyMSwiaWF0IjoxNjg4Mzg0NTIxLCJqdGkiOiI0MzQyMjY2NGUxNGY0Mjk0ODM1MGE0ZjYxZmM4YTk5NSIsInVzZXJfaWQiOiJtaWNoYWxAdGVzdC5jb20ifQ.3wVgYVcip3Y6FU5RlA2tjji_8i27FWJSZweYgpp0lCo', '2023-07-03 11:42:01.763516', '2023-07-04 11:42:01', 'michal@test.com', '43422664e14f42948350a4f61fc8a995', '186'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4ODQ3MDkyMSwiaWF0IjoxNjg4Mzg0NTIxLCJqdGkiOiJkYjUwNzJhZWRhNGM0NmNkYjU1NWU3MTE3OWJkOWNjNSIsInVzZXJfaWQiOiJtaWNoYWxAdGVzdC5jb20ifQ.CuENmv5Iidj_JKz8g4UPd0fOUyjG3F8x3lTx8Gqig6I', '2023-07-03 11:42:01.852060', '2023-07-04 11:42:01', 'michal@test.com', 'db5072aeda4c46cdb555e71179bd9cc5', '187'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4ODQ3MDkyMSwiaWF0IjoxNjg4Mzg0NTIxLCJqdGkiOiJlNmU3MmMyYjRhMmE0YWQ0YWQ5ODhmZjFjMjlkMjk5OCIsInVzZXJfaWQiOiJtaWNoYWxAdGVzdC5jb20ifQ.AFETx1EDqERzroevnzfUE5waSt-aiDdsjQ8oV5M63cE', '2023-07-03 11:42:01.864912', '2023-07-04 11:42:01', 'michal@test.com', 'e6e72c2b4a2a4ad4ad988ff1c29d2998', '188');

INSERT INTO "user_user" ("password", "last_login", "email", "first_name", "last_name", "birth_date", "is_active", "is_admin", "is_staff", "is_superuser") VALUES
('pbkdf2_sha256$320000$gzcwTPFLkBqn6APrbnSUQ1$iz5NYRJG+nqWBcqLkUuwLSLrAwgYsnNxHQaHkEkFvLI=', '2023-06-19 12:11:41.895477', 'admin@example.com', '', '', NULL, '1', '1', '1', '0'),
('pbkdf2_sha256$320000$w2HxOZjdURMRBYuGtr2tVj$5W00t4P11xHIT0guG1QP1+eAKH5gQq2XXsS2/iPPGBc=', NULL, 'michal@test.com', '', '', NULL, '1', '0', '0', '0'),
('pbkdf2_sha256$320000$OG0rQF65MKVffKV3yrQ4Y0$CvMTw/5ekQ6iY7D1IsFSgybkfTsOP3B+R2Yj8NmQYNc=', NULL, 'non_is_staff_user@example.com', '', '', NULL, '1', '0', '0', '0'),
('pbkdf2_sha256$320000$kkbgPhDaVKA9aPN43RPyuM$eyZBfA59D6I6aB0nYvEtGm8a1IqssF7Vphu7IaCzWx4=', NULL, 'regTest@gmail.com', '', '', NULL, '1', '0', '1', '0');

INSERT INTO "user_user_groups" ("id", "user_id", "group_id") VALUES
('1', 'regTest@gmail.com', '2');

