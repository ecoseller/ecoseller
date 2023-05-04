import { contentGetter } from "../Output";

const HeadingRenderer = ({data}) => {

	const styles = {};
	const className = ``;

	let content = contentGetter(data);

	if (!content) return <></>;
	if (typeof data === 'object' && data.level && typeof data.level === 'number') {
		switch (data.level) {
			case 1: return <h1 style={styles} className={className}>{content}</h1>;
			case 2: return <h2 style={styles} className={className}>{content}</h2>;
			case 3: return <h3 style={styles} className={className}>{content}</h3>;
			case 4: return <h4 style={styles} className={className}>{content}</h4>;
			case 5: return <h5 style={styles} className={className}>{content}</h5>;
			case 6: return <h6 style={styles} className={className}>{content}</h6>;
			default: return <h4 style={styles} className={className}>{content}</h4>;
		}
	}

	return <h4 style={styles} className={className}>{content}</h4>;
}

export default HeadingRenderer;