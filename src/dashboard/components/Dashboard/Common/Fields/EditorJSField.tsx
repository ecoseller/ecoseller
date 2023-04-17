import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
// import { IEditorJSData } from "@/types/common";
import { OutputData as IEditorJSData } from "@editorjs/editorjs";

interface IEditorJSFieldProps {
  data: IEditorJSData;
  onChange: (data: IEditorJSData) => void;
  readOnly?: boolean;
}

const EditorJSField = ({
  data,
  onChange,
  readOnly = false,
}: IEditorJSFieldProps) => {
  const ejInstance = useRef<any>();

  const [active, setActive] = useState<boolean>(false);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ejInstance.current = editor;
      },
      autofocus: true,
      data: data,
      onChange: async () => {
        let content = await editor.saver.save();
        console.log(content);
        onChange(content);
      },
      tools: {
        // header: Header,
      },
    });
  };

  // This will run only once
  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  return (
    <div
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
        Label
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
