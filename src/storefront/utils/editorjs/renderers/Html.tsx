import { contentGetter } from "../EditorJsOutput";

const HtmlRenderer = ({ data }: { data: any }) => {
  return <span dangerouslySetInnerHTML={{ __html: contentGetter(data) }} />;
};

export default HtmlRenderer;
