/**
 * Get full path to the image
 * @param path Image path returned from API
 * @param relative Is the given path relative?
 */

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const imgPath = (path: string, relative: boolean = false) => {
  const backendApiUrl =
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    publicRuntimeConfig.nextPublicBackendApiUrl;
  const clientApiUrl =
    process.env.NEXT_PUBLIC_API_URL || publicRuntimeConfig.nextPublicApiUrl;

  if (relative) {
    return `${clientApiUrl}${path}`;
  }

  if (backendApiUrl && clientApiUrl && path) {
    return path.replace(backendApiUrl, clientApiUrl);
  }
  // return path.replace("http://backend:8000", "http://localhost:8000");

  return path;
};

export default imgPath;
