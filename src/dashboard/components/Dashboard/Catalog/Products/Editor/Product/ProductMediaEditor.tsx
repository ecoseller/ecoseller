import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { IProductMedia, ISetProductStateData } from "@/types/product";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { postProductMedia } from "@/api/product/media";

interface IProductMediaEditorState extends IProductMedia {
  name: string;
  uploading: boolean;
  error: string | null;
}
const ProductMediaHolder = ({ media }: { media: IProductMediaEditorState }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <img
              src={media.media}
              alt={media.name}
              style={{ width: "100px", height: "auto" }}
            />
          </td>
          <td>
            <Typography variant="body1">{media.media}</Typography>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

interface IProductMediaEditorProps {
  disabled: boolean;
  state: ISetProductStateData;
}
const ProductMediaEditor = ({ disabled, state }: IProductMediaEditorProps) => {
  /**
   * This is a self standing component that is not connected to the global state.
   * It is only used in the ProductEditor component.
   * It is responsible for uploading product media to the server.
   * It is also responsible for displaying the media that is already uploaded.
   * It is also responsible for deleting media from the server.
   * It is also responsible for updating the media order.
   *
   * But it doesn't send data back to the ProductEditor component.
   * It only updates the state of this component.
   */

  const inputRef = useRef<HTMLInputElement>(null);
  const [productMedia, setProductMedia] = useState<IProductMediaEditorState[]>(
    (state?.media as IProductMediaEditorState[]) || []
  );

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange", e.target.files);
    if (!e.target.files || !state?.id) {
      return;
    }

    // upload files to server
    // and then update the state with the new media
    for (let i = 0; i < e.target.files.length; i++) {
      if (!e.target.files[i]) continue;
      // create random id which will be replaced with the real id from the server
      const id = Math.floor(Math.random() * 1000000000);
      setProductMedia((prev) => [
        ...prev,
        {
          id: id, // just a placeholder for now until we get the real id from the server below
          name: e.target.files[i].name || "",
          type: e.target.files[i].type || "",
          uploading: true,
          error: null,
        } as IProductMediaEditorState,
      ]);
      const formData = new FormData();
      formData.append(`media`, e.target.files[i], e.target.files[i].name);
      formData.append("product_id", state.id);
      formData.append("type", "IMAGE");
      await postProductMedia(formData)
        .then((res) => {
          const media = res.data;
          setProductMedia((prev) => {
            const newMedia = prev.map((m) => {
              if (m.id === id) {
                return {
                  ...m,
                  id: media.id,
                  media: media.media,
                  name: media.name,
                  type: media.type,
                  uploading: false,
                  error: null,
                };
              }
              return m;
            });
            return newMedia;
          });
        })
        .catch((error) => {
          console.log(error);
          setProductMedia((prev) => {
            const newMedia = prev.map((m) => {
              if (m.id === id) {
                return {
                  ...m,
                  uploading: false,
                  error: error.message,
                };
              }
              return m;
            });
            return newMedia;
          });
        });
    }
  };

  const handleUploadClick = () => {
    if (!inputRef.current) return;

    inputRef.current.click();
  };

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Media">
        {disabled || !state?.id ? (
          <Typography variant="body1" color="textSecondary">
            Adding or editing product media will be available after first save.
          </Typography>
        ) : (
          <>
            <input
              hidden
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              multiple
            />

            <Button variant="text" onClick={handleUploadClick}>
              Upload
            </Button>
            {productMedia.map((file, i) => (
              <ProductMediaHolder key={i} media={file} />
            ))}
          </>
        )}
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ProductMediaEditor;
