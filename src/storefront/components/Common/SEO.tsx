"use client";
// utils
import { useTranslation } from "next-i18next";
import Router, { useRouter } from "next/router";
import { Fragment, useEffect } from "react";
import Script from "next/script";
import Head from "next/head";

interface IHeadMeta {
  title: string;
  description: string;
  image?: string;
  robots?: string;
  url: string;
  domain?: string;
  site?: string;
  children?: React.ReactNode;
  jsonLds?: any[];
  queries?: {
    [key: string]: string;
  };
}

const HeadMeta = ({
  title,
  description,
  url,
  image,
  robots,
  domain,
  site,
  children,
  jsonLds,
  queries,
}: IHeadMeta) => {
  const { t } = useTranslation("common");

  const DEFAULT_IMAGE = "";
  const DEFAULT_ROBOTS = "index,follow,snippet";
  const SITE_NAME = "Ecommerce" || `${site} | Ecommerce`;
  const WEBSITE_DOMAIN = "https://ecoseller.io" || domain;
  const WEBSITE_DESCRIPTION = t("meta-description");
  /*"Your satisfaction is our top priority – shop with us and experience the difference."*/ const ORGANIZATION_LD =
    {
      "@context": "http://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: WEBSITE_DOMAIN,
      sameAs: [],
    };

  const DEFAULT_WEBSITE_LD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    title: SITE_NAME,
    name: SITE_NAME,
    url: WEBSITE_DOMAIN,
    description: WEBSITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${WEBSITE_DOMAIN}/search/{search_term_string}/`,
      "query-input": "required name=search_term_string",
    },
  };

  const DEFAULT_WEBPAGE_LD = {
    "@context": "http://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
  };
  const { pathname, query, locale, locales, asPath } = useRouter();

  return (
    <Head>
      <title>{title}</title>
      <meta name="googlebot" key={"googlebot"} content="index,follow,all" />
      <meta name="description" key={"description"} content={description} />
      <meta name="robots" key={"robots"} content={robots || DEFAULT_ROBOTS} />
      <meta property="og:url" key={"og:url"} content={url} />
      <meta
        property="og:image"
        key={"og:image"}
        content={image || DEFAULT_IMAGE}
      />
      <meta itemProp="description" content={description} />
      <meta name="image" key={"image"} content={image || DEFAULT_IMAGE} />

      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        key={"og:description"}
        content={description}
      />
      <meta property="og:type" key={"og:type"} content="website" />

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <script
        key={"organization-json-ld"}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ORGANIZATION_LD),
        }}
      />
      <script
        key={"website-json-ld"}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(DEFAULT_WEBSITE_LD),
        }}
      />
      <script
        key={"webpage-json-ld"}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(DEFAULT_WEBPAGE_LD),
        }}
      />
      {children}
    </Head>
  );
};

export default HeadMeta;
