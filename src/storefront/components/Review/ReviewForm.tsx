// next.js
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Generic/EditorCard";
import { Button, Rating, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IUser } from "@/types/user";
import CollapsableContentWithTitle from "../Generic/CollapsableContentWithTitle";
import { useState } from "react";
import StarIcon from '@mui/icons-material/Star';
import { IItem } from "@/types/review";

interface IReviewProps {
    item: string;
}

const labels: { [index: string]: string } = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function getLabelText(value: number) {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}


const ReviewForm = ({ product_id, product_variant_name }: IItem) => {

    const [reviewText, setReviewText] = useState<string>("")
    const [value, setValue] = useState<number | null>(5);
    const [hover, setHover] = useState(-1);

    const submitReview = () => {
        // submit review
    }

    return (
        <EditorCard>
            <CollapsableContentWithTitle title={product_variant_name}>
                <Box mt={2}>
                    <FormControl fullWidth>
                        <Stack spacing={2}>
                            <Typography component="legend">Rating</Typography>
                            <Box
                                sx={{
                                    width: 200,
                                    display: 'flex',
                                    alignItems: 'center',
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
                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                />
                                {value !== null && (
                                    <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
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
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={submitReview}
                                >
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
