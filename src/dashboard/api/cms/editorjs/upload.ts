import { axiosPrivate } from "@/utils/axiosPrivate";
import imgPath from "@/utils/imgPath";

const editorJSUploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosPrivate.post(
    "/editorjs/upload/image/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const data = await response.data;
  console.log("editorJSUpload", data);
  return {
    success: 1,
    file: {
      url: imgPath(data.file, true),
    },
  };
};

export const editorJSUploadImageFromUrl = async (url: string) => {
  const formData = new FormData();
  formData.append("url", url);

  const response = await axiosPrivate.post("/editorjs/upload/url/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  const data = await response.data;
  console.log("editorJSUpload", data);
  return {
    success: 1,
    file: {
      url: imgPath(data.file, true),
    },
  };
};

export default editorJSUploadImage;
