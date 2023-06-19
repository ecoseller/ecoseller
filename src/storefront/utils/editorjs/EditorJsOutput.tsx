import DelimeterRenderer from "./renderers/Delimiter";
import HeadingRenderer from "./renderers/Heading";
import ChecklistRenderer from "./renderers/Checklist";
import ImageRenderer from "./renderers/Image";
import ListRenderer from "./renderers/List";
import ParagraphRenderer from "./renderers/Paragraph";
import TableRenderer from "./renderers/Table";
import WarningRenderer from "./renderers/Warning";
import HtmlRenderer from "./renderers/Html";

export type RendererType =
  | "quote"
  | "delimiter"
  | "header"
  | "checklist"
  | "list"
  | "image"
  | "paragraph"
  | "table";

export interface Block {
  id?: string;
  type: RendererType;
  data: Record<string, any>;
}

export interface IEditorJsField {
  time: number;
  version: string;
  blocks: Block[];
}
interface IOutput {
  data: IEditorJsField;
  renderers?: IRenderers[];
}

interface IRenderers {
  [key: string]: Object;
}

const EditorJsOutput = ({ data, renderers }: IOutput) => {
  let availableRenderers: any = {
    quote: DelimeterRenderer,
    delimiter: DelimeterRenderer,
    header: HeadingRenderer,
    checklist: ChecklistRenderer,
    list: ListRenderer,
    image: ImageRenderer,
    paragraph: ParagraphRenderer,
    table: TableRenderer,
    warning: WarningRenderer,
    raw: HtmlRenderer,
  };

  if (renderers && Array.isArray(renderers)) {
    renderers.map((renderer: any) => {
      const rendererKey: any = Object.keys(renderer)[0];
      availableRenderers[rendererKey] = renderer[rendererKey];
    });
  }

  return data && Array.isArray(data.blocks) ? (
    <>
      {data.blocks.map((block: Block, index: number) => {
        const elementToBeRendered = block.type.toLowerCase();
        if (Object.keys(availableRenderers).includes(elementToBeRendered)) {
          const Renderer = availableRenderers[elementToBeRendered];
          console.log("renderer", Renderer);
          return <Renderer data={block.data} key={index} />;
        } else {
          console.warn("missing renderer", elementToBeRendered);
        }
        return null;
      })}
    </>
  ) : null;
};

export function contentGetter(data: any) {
  let content = null;
  if (typeof data === "string") {
    content = data;
  } else if (
    typeof data === "object" &&
    data.text &&
    typeof data.text === "string"
  ) {
    content = data.text;
  } else if (
    typeof data === "object" &&
    data.html &&
    typeof data.html === "string"
  ) {
    content = data.html;
  }
  return content;
}

export default EditorJsOutput;
