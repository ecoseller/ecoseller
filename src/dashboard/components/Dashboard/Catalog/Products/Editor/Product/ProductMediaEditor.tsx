// next.js

// react
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// api
import {
  deleteProductMedia,
  postProductMedia,
  putProductMedia,
} from "@/api/product/media";

// lib
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";

// components
import ProductMediaCard from "./ProductMedia/ProductMediaCard";

// mui
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";

// types
import { IProductMedia, ISetProductStateData } from "@/types/product";
import { usePermission } from "@/utils/context/permission";
import convertBase64 from "@/utils/base64";

export interface IProductMediaEditorState extends IProductMedia {
  name: string;
  uploading: boolean;
  error: string | null;
  updated: boolean;
}

const ProductMediaHolder = ({
  media,
  setMedia,
}: {
  media: IProductMediaEditorState[];
  setMedia: Dispatch<SetStateAction<IProductMediaEditorState[]>>;
}) => {
  const [updateMedia, setUpdateMedia] = useState(false);

  const removeCard = async (id: number) => {
    await deleteProductMedia(id);
    setMedia((prevMedia: IProductMediaEditorState[]) => {
      return prevMedia.filter(
        (card: IProductMediaEditorState) => card.id !== id
      );
    });
  };

  console.log("media", media);

  const { hasPermission } = usePermission();

  const moveCard = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      if (!hasPermission) return;
      const [newDragSortOrder, newHoverSortOrder] = [
        media[hoverIndex].sort_order,
        media[dragIndex].sort_order,
      ]; // performs simple swap of sort orders for the server. New sort_order of dragged card is the sort_order of the card it is hovering over, and vice versa

      console.log("mediaMoveCard", media);
      setMedia((prevMedia: IProductMediaEditorState[]) => {
        prevMedia[dragIndex].sort_order = newDragSortOrder;
        prevMedia[hoverIndex].sort_order = newHoverSortOrder;
        prevMedia[dragIndex].updated = true;
        prevMedia[hoverIndex].updated = true;

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

  useEffect(() => {
    if (!media || !updateMedia) return;

    const updatedMedia = media.filter((item) => item.updated);
    updatedMedia.forEach(async (item) => {
      await putProductMedia(item.id, {
        id: item.id,
        sort_order: item.sort_order,
      });
    });
    setUpdateMedia(false);
  }, [updateMedia]);

  const renderCard = useCallback(
    (item: IProductMediaEditorState, index: number) => {
      return (
        <ProductMediaCard
          key={item.id}
          index={index}
          id={item.id}
          url={item.media}
          moveCard={moveCard}
          updateCard={() => setUpdateMedia(true)}
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

  const { hasPermission } = usePermission();

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
      console.log("about to convert base64");
      const file = e.target.files?.[i];
      if (!file) return;
      const base64 = await convertBase64(file);
      console.log("base64", base64);

      await postProductMedia({
        media: base64,
        product_id: state.id,
        type: "IMAGE",
      })
        .then((res) => {
          const media = res;
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
          setProductMedia([
            ...productMedia,
            {
              uploading: false,
              error: error.message,
            } as IProductMediaEditorState,
          ]);
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
            <Button
              variant="text"
              onClick={handleUploadClick}
              disabled={!hasPermission}
            >
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
