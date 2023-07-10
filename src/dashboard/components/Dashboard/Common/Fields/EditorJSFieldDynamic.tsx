import dynamic from "next/dynamic";

export default dynamic(() => import("./EditorJSField"), { ssr: false });
