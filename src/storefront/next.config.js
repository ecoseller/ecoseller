/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false,
  },
  modularizeImports: {
    "react-bootstrap": {
      transform: "react-bootstrap/{{member}}",
    },
    lodash: {
      transform: "lodash/{{member}}",
    },
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
    apiUrl: process.env.BACKEND_API || "http://127.0.0.1:8000",
    commoni18NameSpaces: ["common", "header", "footer", "cookie"],
  },
  publicRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8000",
  },
  // output: "standalone",
  images: {
    domains: ["127.0.0.1", "localhost", "backend"],
  },
  i18n,
};

module.exports = nextConfig;
