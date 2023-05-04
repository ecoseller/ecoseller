import Image from "next/image";

import styles from '@/styles/Editorjs/Renderers/Image.module.scss';

const ImageRenderer = ({ data }) => {
	let content = null;
	if (data.file && typeof data.file.url === 'string') {
		content = data.file.url;
	}

	return (
        <div className={styles.image_holder}>
			<Image
                alt={`editorjs image`}
                src={content}
                fill
                sizes="100vw"
                style={{
                    objectFit: "cover",
                    objectPosition: "center center"
                }} />
			{data.caption && typeof data.caption === 'string' ? (
				<p>{data.caption}</p>
			) : (
				<></>
			)}
		</div>
    );
};

export default ImageRenderer;
