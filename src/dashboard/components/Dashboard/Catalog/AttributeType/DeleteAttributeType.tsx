// next.js
import { useRouter } from "next/router";
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteAttribtueType } from "@/api/product/attributes";

interface IDeleteAttributeTypeProps {
  id: number;
}

const DeleteAttributeType = ({ id }: IDeleteAttributeTypeProps) => {
  const router = useRouter();
  return (
    <EditorCard>
      <Typography variant="h6">Delete</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="error"
              style={{
                maxWidth: "200px",
              }}
              startIcon={<DeleteIcon />}
              onClick={() => {
                console.log("delete");
                deleteAttribtueType(id)
                  .then((res) => {
                    console.log(res);
                    router.push("/dashboard/catalog/attribute/type");
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
            >
              Delete
            </Button>
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default DeleteAttributeType;
