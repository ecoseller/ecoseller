interface IImageThumbanilProps {
  imagePath: string;
  alt: string;
}

/**
 * Component displaying thumbnail of an image, whose height is 50 px and width is computed automatically
 * @param imagePath path to the image
 * @param alt text description of the image
 * @constructor
 */
const ImageThumbnail = ({ imagePath, alt }: IImageThumbanilProps) => {
  return (
    <img
      src={imagePath}
      alt={alt}
      style={{
        objectFit: "contain",
        position: "relative",
        height: "50px",
        width: "auto",
      }}
    />
  );
};

export default ImageThumbnail;
