/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
  },
  publicRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:8000",
  },
  // output: "standalone",
};

module.exports = nextConfig;
