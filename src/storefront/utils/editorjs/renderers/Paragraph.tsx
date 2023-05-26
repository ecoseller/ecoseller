import { contentGetter } from "../Output";

const ParagraphRenderer = ({ data }: { data: any }) => {
  return <p dangerouslySetInnerHTML={{ __html: contentGetter(data) }} />;
};

export default ParagraphRenderer;
