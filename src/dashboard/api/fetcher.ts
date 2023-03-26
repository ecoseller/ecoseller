import { axiosPrivate } from "@/utils/axiosPrivate";

const axiosFetcher = (url: string, locale: string | undefined) => {
  return axiosPrivate.get(url, {
    withCredentials: true,
    headers: {
      "Accept-Language": locale || "en",
    },
  });
};

export default axiosFetcher;
