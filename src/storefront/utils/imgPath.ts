const imgPath = (path: string, relative: boolean = false) => {
  const backendApiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const clientApiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (relative) {
    return `${clientApiUrl}${path}`;
  } else {
    return `${backendApiUrl}${path}`;
  }

  return path;
};

export default imgPath;
