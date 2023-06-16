const DEFAULT_LOCALE = "en";

/**
 * Get locale info (language code) from Next API request.
 * If there's no locale in the request, return the default one
 * @param req
 */
// export function extractLocale(object) {
//   const { locale } = object;
//
//   return Array.isArray(locale) ? locale[0] : locale || DEFAULT_LOCALE;
// }

/**
 * Get `Accept-Language` HTTP header with the given language
 * @param language
 */
export function getLanguageHeader(language: string) {
  return { "Accept-Language": language };
}
