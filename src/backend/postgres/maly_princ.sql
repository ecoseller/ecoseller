-- -------------------------------------------------------------
-- TablePlus 4.6.4(414)
--
-- https://tableplus.com/
--
-- Database: ecoseller
-- Generation Time: 2023-07-09 16:40:46.1890
-- -------------------------------------------------------------


INSERT INTO "public"."product_product" ("id", "published", "update_at", "create_at", "category_id", "type_id", "safe_deleted") VALUES
(190184, 't', '2023-07-09 10:01:07.047632+00', '2023-07-08 21:07:24.760882+00', 4, 2, 'f');

INSERT INTO "public"."product_product_product_variants" ("id", "product_id", "productvariant_id") VALUES
(1, 190184, '978-80-7390-220-9-en'),
(2, 190184, '978-80-7390-220-9-cs');

INSERT INTO "public"."product_product_translation" ("id", "language_code", "title", "meta_title", "meta_description", "short_description", "description", "slug", "master_id", "description_editorjs") VALUES
(1, 'en', 'The Little Prince - Antoine de Saint-Exupéry', 'The Little Prince - Antoine de Saint-Exupéry', 'A pilot stranded in the desert awakes one morning to see, standing before him, the most extraordinary little fellow.', NULL, NULL, 'the-little-prince-antoine-de-saint-exupery', 190184, '{"time": 1688850414591, "blocks": [{"id": "DBgKz5qVHq", "data": {"text": "A pilot stranded in the desert awakes one morning to see, standing before him, the most extraordinary little fellow. \"Please,\" asks the stranger, \"draw me a sheep.\" And the pilot realizes that when life''s events are too difficult to understand, there is no choice but to succumb to their mysteries. He pulls out pencil and paper... And thus begins this wise and enchanting fable that, in teaching the secret of what is really important in life, has changed forever the world for its readers."}, "type": "paragraph"}], "version": "2.26.5"}'),
(2, 'cs', 'Malý Princ - Antoine de Saint-Exupéry', 'Malý Princ - Antoine de Saint-Exupéry', 'Havárie letadla donutí vypravěče příběhu, který je zároveň autorovým alter egem, k přistání uprostřed pouště.', NULL, NULL, 'maly-princ-antoine-de-saint-exupery', 190184, '{"time": 1688850406876, "blocks": [{"id": "GXo0mbBxE6", "data": {"text": "Havárie letadla donutí vypravěče příběhu, který je zároveň autorovým alter egem, k přistání uprostřed pouště. Má zásobu pitné vody sotva na týden, a proto musí opravit motor pokud možno co nejrychleji. Prvního dne ulehne unaven po celodenní práci a za úsvitu, stále tisíc kilometrů od nejbližšího lidského obydlí, ho probudí zvláštní hlásek, který ho žádá, aby nakreslil beránka... Alegorická pohádka pro děti i pro dospělé, kteří přemýšlí o ztraceném mládí a hledají životní moudrost, patří mezi nejvýznamnější díla svého druhu."}, "type": "paragraph"}], "version": "2.26.5"}');

INSERT INTO "public"."product_productmedia" ("id", "sort_order", "media", "type", "alt", "product_id", "safe_deleted") VALUES
(1, 0, 'product_media/1/image/4845cce1-d75f-48ce-8178-98044562d904.jpg', 'IMAGE', NULL, 1, 'f');

INSERT INTO "public"."product_productprice" ("id", "price", "price_list_id", "product_variant_id", "create_at", "update_at", "discount", "safe_deleted") VALUES
(1, 169.00, 'CZK_retail', '978-80-7390-220-9-en', '2023-07-08 21:09:26.079069+00', '2023-07-09 10:01:06.823428+00', NULL, 'f'),
(2, 6.75, 'EUR_retail', '978-80-7390-220-9-en', '2023-07-08 21:09:26.102378+00', '2023-07-09 10:01:06.83728+00', NULL, 'f'),
(3, 33.80, 'PLN_retail', '978-80-7390-220-9-en', '2023-07-08 21:09:26.123802+00', '2023-07-09 10:01:06.859184+00', NULL, 'f'),
(4, 129.00, 'CZK_retail', '978-80-7390-220-9-cs', '2023-07-08 21:09:26.154529+00', '2023-07-09 10:01:06.886732+00', NULL, 'f'),
(5, 5.70, 'EUR_retail', '978-80-7390-220-9-cs', '2023-07-08 21:09:26.173638+00', '2023-07-09 10:01:06.900981+00', NULL, 'f'),
(6, 25.80, 'PLN_retail', '978-80-7390-220-9-cs', '2023-07-08 21:09:26.192784+00', '2023-07-09 10:01:06.914929+00', NULL, 'f');

