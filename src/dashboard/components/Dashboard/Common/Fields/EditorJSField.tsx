import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { OutputData as IEditorJSData } from "@editorjs/editorjs";
import editorJSUploadImage, {
  editorJSUploadImageFromUrl,
} from "@/api/cms/editorjs/upload";
const Delimiter = require("@editorjs/delimiter");
const Embed = require("@editorjs/embed");
const Header = require("@editorjs/header");
const Image = require("@editorjs/image");
const Link = require("@editorjs/link");
const List = require("@editorjs/list");
const ImageTool = require("@editorjs/image");
const Marker = require("@editorjs/marker");
const Paragraph = require("@editorjs/paragraph");
const Quote = require("@editorjs/quote");
const Checklist = require("@editorjs/checklist");
const Warning = require("@editorjs/warning");
const Table = require("@editorjs/table");
const Raw = require("@editorjs/raw");

export const EDITOR_TOOLS = {
  header: Header,
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  list: List,
  image: {
    class: ImageTool,
    config: {
      /**
       * Custom uploader
       */
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile: async (file: File) => {
          console.log(file);
          return await editorJSUploadImage(file);
        },

        /**
         * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
         * @param {string} url - pasted image URL
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByUrl: async (url: string) => {
          console.log(url);
          return await editorJSUploadImageFromUrl(url);
        },
      },
    },
  },
  embed: Embed,
  linkTool: Link,
  delimiter: Delimiter,
  marker: Marker,
  quote: Quote,
  checklist: Checklist,
  warning: Warning,
  table: Table,
  raw: Raw,
};

export interface IEditorJSFieldProps {
  data: IEditorJSData;
  onChange: (data: IEditorJSData) => void;
  disabled?: boolean;
  label?: string;
}

const EditorJSField = ({
  data,
  onChange,
  disabled = false,
  label = "Content",
}: IEditorJSFieldProps) => {
  const ejInstance = useRef<any>(null);

  const [active, setActive] = useState<boolean>(true);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",

      onReady: () => {
        // if editorjs should be disabled, we have to hack it a bit
        if (disabled) {
          // @ts-ignore
          editor.readOnly.toggle();
          // make editorjs a bit more transparent to indicate that it's disabled

          let blockElements = document.getElementById("editorjs-wrapper"); // id of editor element
          // @ts-ignore
          blockElements.style.pointerEvents = "none";
          // @ts-ignore
          blockElements.style.opacity = "0.5";
          // @ts-ignore
          blockElements.style.cursor = "not-allowed";
        }
        ejInstance.current = editor;
      },
      data: data,
      onChange: async () => {
        if (disabled) return;
        let content = await editor.saver.save();
        console.log(content);
        onChange(content);
      },
      tools: EDITOR_TOOLS,
    });
  };

  // This will run only once
  useEffect(() => {
    if (ejInstance?.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  return (
    <div
      id={"editorjs-wrapper"}
      style={{
        position: "relative",
      }}
    >
      <span
        style={{
          paddingLeft: "5px",
          paddingRight: "5px",
          marginLeft: "10px",
          marginRight: "10px",
          backgroundColor: "white",
          position: "absolute",
          top: "-10px",
          zIndex: 2,
          color: `${active ? `#8D44AD` : `rgba(0, 0, 0, 0.6)`}`,
          fontSize: "0.855rem",
          fontFamily: "var(--font-base)",
        }}
      >
        {label}
      </span>
      <div
        style={{
          position: "relative",
          border: `${active ? `2px solid #8D44AD` : `1px solid #C4C4C4`}`,
          borderRadius: "4px",
          padding: "16px",
        }}
        id="editorjs"
        onBlur={() => {
          setActive(false);
        }}
        onFocus={() => {
          setActive(true);
        }}
      ></div>
    </div>
  );
};

export default EditorJSField;
