// nextjs
// react
// libs
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
// mui
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import imgPath from "@/utils/imgPath";
import { usePermission } from "@/utils/context/permission";
import DeleteDialog from "@/components/Dashboard/Generic/DeleteDialog";
// types

export interface CardProps {
  id: any;
  url: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  removeCard: () => void;
  updateCard: () => void;
}

const ItemTypes = {
  CARD: "card",
};

const style = {
  cursor: "move",
  "&:hover": {
    // on hover for drag and drop make make the shadow purple and increase the size of the card
    transition: "all 0.1s ease-in-out",
    // boxShadow: "0 0 0 0.2rem #F6F1F9",
    transform: "scale(1.01)",
  },
};

interface DragItem {
  index: number;
  id: string;
  type: string;
  sort_ordering: number;
}

const ProductMediaItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ProductMediaCard = ({
  id,
  url,
  index,
  moveCard,
  updateCard,
  removeCard,
}: CardProps) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  // this code is highly inspired by official react-dnd example
  const ref = useRef<HTMLDivElement>(null);
  const [previousIndex, setPreviousIndex] = useState<number | undefined>(index);
  const { hasPermission } = usePermission();
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    drop(item, monitor) {
      // obtain info about ID of dragged item and drop target
      updateCard();
    },
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <ProductMediaItem
      sx={{
        my: 1,
        mx: "auto",
        p: 2,
        opacity,
        ...style,
      }}
      ref={ref}
    >
      <Stack spacing={1} direction="row" alignItems="center">
        <div
          style={{
            width: "100%",
            textAlign: "left",
          }}
        >
          <img src={imgPath(url)} style={{ width: "auto", height: "125px" }} />
        </div>
        <div>
          <Button
            onClick={() => {
              setOpenDeleteDialog(true);
            }}
            disabled={!hasPermission}
          >
            Delete
          </Button>
        </div>
      </Stack>
      <DeleteDialog
        open={openDeleteDialog}
        setOpen={() => setOpenDeleteDialog(false)}
        onDelete={() => {
          removeCard();
        }}
        text="this payment method"
      />
    </ProductMediaItem>
  );
};

export default ProductMediaCard;
