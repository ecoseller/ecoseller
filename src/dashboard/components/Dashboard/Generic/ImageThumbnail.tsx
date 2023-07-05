interface IImageThumbnailProps {
  imagePath: string;
  alt: string | null;
}

/**
 * Component displaying thumbnail of an image, whose height is 50 px and width is computed automatically
 * @param imagePath path to the image
 * @param alt text description of the image
 * @constructor
 */
const ImageThumbnail = ({ imagePath, alt }: IImageThumbnailProps) => {
  return (
    <img
      src={imagePath}
      alt={alt || ""}
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
