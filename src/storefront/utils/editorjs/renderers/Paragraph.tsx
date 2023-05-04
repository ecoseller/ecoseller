import { contentGetter } from "../Output";

const ParagraphRenderer = ({data}) => {
	return (
		<p dangerouslySetInnerHTML={{__html:contentGetter(data)}} />
	)
}

export default ParagraphRenderer;