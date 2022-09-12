export const parseFilename = (headers: Headers): string | null => {
  const contentDisposition = headers.get("Content-Disposition");
  if (!contentDisposition) {
    return null;
  }

  return contentDisposition.split("filename=")[1];
};
