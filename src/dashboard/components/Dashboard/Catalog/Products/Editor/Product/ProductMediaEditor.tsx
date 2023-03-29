import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import { IProductMedia, ISetProductStateData } from "@/types/product";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import update from "immutability-helper";
import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  deleteProductMedia,
  postProductMedia,
  putProductMedia,
} from "@/api/product/media";
import ProductMediaCard from "./Media/ProductMediaCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export interface IProductMediaEditorState extends IProductMedia {
  name: string;
  uploading: boolean;
  error: string | null;
}

const ProductMediaHolder = ({
  media,
  setMedia,
}: {
  media: IProductMediaEditorState[];
  setMedia: Dispatch<SetStateAction<IProductMediaEditorState[]>>;
}) => {
  const removeCard = async (id: number) => {
    await deleteProductMedia(id);
    setMedia((prevMedia: IProductMediaEditorState[]) => {
      return prevMedia.filter(
        (card: IProductMediaEditorState) => card.id !== id
      );
    });
  };

  const moveCard = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      const [newDragSortOrder, newHoverSortOrder] = [
        media[hoverIndex].sort_order,
        media[dragIndex].sort_order,
      ]; // performs simple swap of sort orders for the server. New sort_order of dragged card is the sort_order of the card it is hovering over, and vice versa

      // TODO: this will need debouncing implemented
      await putProductMedia(media[dragIndex].id, {
        id: media[dragIndex].id,
        sort_order: media[dragIndex].sort_order,
      } as IProductMedia);
      await putProductMedia(media[hoverIndex].id, {
        id: media[dragIndex].id,
        sort_order: media[dragIndex].sort_order,
      } as IProductMedia);

      setMedia((prevMedia: IProductMediaEditorState[]) => {
        prevMedia[dragIndex].sort_order = newDragSortOrder;
        prevMedia[hoverIndex].sort_order = newHoverSortOrder;
        return update(prevMedia, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevMedia[dragIndex] as IProductMediaEditorState],
          ],
        });
      });
    },
    [media]
  );

  const renderCard = useCallback(
    (item: IProductMediaEditorState, index: number) => {
      return (
        <ProductMediaCard
          key={item.id}
          index={index}
          id={item.id}
          url={item.media}
          moveCard={moveCard}
          removeCard={async () => await removeCard(item.id)}
        />
      );
    },
    [media]
  );

  return <div>{media.map((item, i) => renderCard(item, i))}</div>;
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
      if (!e.target.files || (e.target.files && !e.target.files[i])) continue;
      const formData = new FormData();
      formData.append(`media`, e.target.files[i], e.target.files[i].name);
      formData.append("product_id", state.id);
      formData.append("type", "IMAGE");
      await postProductMedia(formData)
        .then((res) => {
          const media = res.data;
          setProductMedia([
            ...productMedia,
            {
              id: media.id,
              media: media.media,
              name: media.name,
              type: media.type,
              uploading: false,
              error: null,
              sort_order: media.sort_order,
            } as IProductMediaEditorState,
          ]);
        })
        .catch((error) => {
          console.log(error);
          // setProductMedia((prev) => {
          //   const newMedia = prev.map((m) => {
          //     if (m.id === id) {
          //       return {
          //         ...m,
          //         uploading: false,
          //         error: error.message,
          //       };
          //     }
          //     return m;
          //   });
          //   return newMedia;
          // });
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
            <DndProvider backend={HTML5Backend}>
              <ProductMediaHolder
                media={productMedia}
                setMedia={setProductMedia}
              />
            </DndProvider>
          </>
        )}
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ProductMediaEditor;
