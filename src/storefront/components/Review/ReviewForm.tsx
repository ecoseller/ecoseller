// next.js
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Generic/EditorCard";
import { Alert, Button, Rating, Snackbar, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IUser } from "@/types/user";
import CollapsableContentWithTitle from "../Generic/CollapsableContentWithTitle";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { IItem, getLabelText, labels } from "@/types/review";
import Cookies from "js-cookie";

interface IReviewProps {
  item: IItem;
  order_id: string;
  showSnackbar: (
    res: Response,
    messageSuccess: string,
    messageError: string
  ) => void;
}

const ReviewForm = ({ item, order_id, showSnackbar }: IReviewProps) => {
  const [reviewText, setReviewText] = useState<string>("");
  const [value, setValue] = useState<number | null>(5);
  const [hover, setHover] = useState(-1);

  const submitReview = async () => {
    console.log("SUBMIT REVIEW");
    console.log("review rating", value);
    const country = Cookies.get("country");
    console.log("country", country);
    fetch(`/api/review/create/`, {
      method: "POST",
      body: JSON.stringify({
        order: order_id,
        product_id: item.product_id,
        product_variant_sku: item.product_variant_sku,
        rating: value ? value * 20 : 0,
        comment: reviewText,
        country: country,
      }),
    }).then((res) => {
      showSnackbar(res, "Review submitted", "Error submitting review");
    });
  };

  return (
    <EditorCard>
      <CollapsableContentWithTitle title={item.product_variant_name}>
        <Box mt={2}>
          <FormControl fullWidth>
            <Stack spacing={2}>
              <Typography component="legend">Rating</Typography>
              <Box
                sx={{
                  width: 200,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Rating
                  name="hover-feedback"
                  value={value}
                  precision={0.5}
                  getLabelText={getLabelText}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                />
                {value !== null && (
                  <Box sx={{ ml: 2 }}>
                    {labels[hover !== -1 ? hover : value]}
                  </Box>
                )}
              </Box>
              <Box>
                <TextField
                  label="Review"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="contained" onClick={submitReview}>
                  Submit
                </Button>
              </Box>
            </Stack>
          </FormControl>
        </Box>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default ReviewForm;
