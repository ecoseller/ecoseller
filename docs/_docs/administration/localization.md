---
title: Localization
category: Administration documentation
order: 3
---

Table of contents:
* TOC
{:toc}

Ecoseller is designed to be a versatile and comprehensive e-commerce platform that caters to a global audience. With its aim to support multi-country operations, Ecoseller provides extensive localization capabilities across all aspects of user communication. This section of the administration documentation focuses on the localization features and configuration options available within Ecoseller.

However, to understand the localization capabilities of Ecoseller, it is important to first understand the concept of locales and how they are used within the platform. 

We've chosen "country first" approach. Which means, that our main localize unit is a country. For example, if you want to have a store in the US and in the UK - you will have to create two countries, but mostlikely with the same language (English). But they will differ in currency, VAT groups, shipping methods and most likely even in the price list for products (since you might have different prices for stocking, packaging and marketing in different countries).

## Languages
Since languages are loaded on the startup of the backend and storefront, when editing them, it's neccessary to dive into the code a little bit.  

### Backend 
Languages are loaded in the `src/backend/core/core/settings.py` file under the `PARLER_LANGUAGES` variable.
If you want to add a new language, you will have to add a new entry to this variable, under the `None` key.
If you want to set different language as a default, you will have to change the `PARLER_DEFAULT_LANGUAGE_CODE` variable in the same file as well as `LANGUAGE_CODE`.

```python
LANGUAGE_CODE = "en"
PARLER_DEFAULT_LANGUAGE_CODE = "en"
PARLER_LANGUAGES = {
    None: (
        {
            "code": "en",
        },
        {
            "code": "cs",
        },
    ),
    "default": {
        "fallbacks": ["en"],  # defaults to PARLER_DEFAULT_LANGUAGE_CODE
        "hide_untranslated": False,  # the default; let .active_translations() return fallbacks too.
    },
}
```
Backend languages are used for database translation - so for all data stored in the database, like product names, descriptions, categories, etc. and for the e-mails sent from the backend.

If you want to edit translation of the e-mail templates, you will have to go to the container `backend` and run the following command:
```bash
python3 manage.py makemessages -l en -l cs -l other_language ...
```

After that, Django will create or append to the `locale` folder in the `backend` container. There you will find a folder for each language you've specified in the command above. In each folder, there will be a file called `django.po`. This file contains all the strings that are used in the backend and are marked for translation. You can edit the strings in this file and then run the following command to compile the changes:
```bash
python3 manage.py compilemessages
```

Editing data in the database is a little bit more complicated and is fully handled by ecoseller dashboard. Everything is described in the [user documentation](../../user/dashboard).


### Storefront
Since storefront is a Next.js application, for the localization, we use [next-i18next](https://github.com/i18next/next-i18next) package. It's a wrapper around [i18next](https://www.i18next.com/) package, which is a very popular localization package for JavaScript.

Languages are loaded in the `src/storefront/next-i18next.config.js` file under the `i18n.locales` variable (and `i18n.defaultLocale`).

Translations are loaded in the `src/storefront/public/locales` folder. Each language has its own folder and in each folder, there are multiple JSON files representing all i18n namespaces that can be found in the project. This file contains all the strings that are used in the storefront and are marked for translation. You can edit the strings in this file. After you're done, you need to rebuild your container so that changes are applied.

If you add new translations, then run 
```bash
npm run translate
```

to extend the `src/storefront/public/locales` folder with new namespaces and strings.

## Country
The country is the main localization unit in the ecoseller. It's used to define the following:
- Currency
- VAT groups
- locale
- shipping methods

Countries are stored in the database and can be edited in the ecoseller dashboard. Everything is described in the [localization section](../../user/dashboard#localization) of the user documentation.

## Currency

Currency should allow you to make user more comfortable and feel like they're shopping at their local store. 
Currency is binded to the country, so you can have different currencies for different countries. 

Currencies are also stored in the database and you can edit them in the ecoseller dashboard. Everything is described in the [localization section](../../user/dashboard#localization) of the user documentation.

## VAT groups

VAT groups are used to define different VAT rates for different products and countries. With this feature, you can have different VAT rates for different countries as well as different VAT rates for different products (usually there's a standard rate and reduced rate).

VAT groups are also stored in the database and you can edit them in the ecoseller dashboard. Everything is described in the [localization section](../../user/dashboard#localization) of the user documentation.