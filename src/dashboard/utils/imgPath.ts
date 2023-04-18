const imgPath = (path: string, relative: boolean = false) => {
  const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const clientApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (relative) {
    return `${clientApiUrl}${path}`;
  }

  if (backendApiUrl && clientApiUrl && path) {
    return path.replace(backendApiUrl, clientApiUrl);
  }

  return path;
};

export default imgPath;
