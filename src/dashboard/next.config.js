/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false,
  },
  modularizeImports: {
    "@mui/material": {
      transform: "@mui/material/{{member}}",
    },
    "@mui/lab": {
      transform: "@mui/lab/{{member}}",
    },
    "@mui/icons-material/?(((\\w*)?/?)*)": {
      transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
    },
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: process.env.API_URL || "http://127.0.0.1:8000",
    commoni18NameSpaces: ["common", "header", "footer", "cookie"],
  },
  publicRuntimeConfig: {
    // Will only be available on the server side
    nextPublicApiUrl:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    nextPublicBackendApiUrl:
      process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000",
    apiUrl: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8000",
  },
  images: {
    domains: ["localhost", "127.0.0.1"],
  },
  // output: "standalone",
};

module.exports = nextConfig;
