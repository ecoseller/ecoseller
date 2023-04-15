const imgPath = (path: string) => {
  const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const clientApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (backendApiUrl && clientApiUrl && path) {
    return path.replace(backendApiUrl, clientApiUrl);
  }

  return path;
};

export default imgPath;
