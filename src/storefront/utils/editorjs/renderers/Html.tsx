import { contentGetter } from "../Output";

const HtmlRenderer = ({data}) => {
	return (
		<span dangerouslySetInnerHTML={{__html:contentGetter(data)}} />
	)
}

export default HtmlRenderer;