import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { usePermission } from "@/utils/context/permission";

interface IDeleteEntityButtonProps {
  onDelete: () => void;
}

/**
 * Component containing `Delete` button for entity deletion
 * @param onDelete function executed when the button is clicked
 * @constructor
 */
const DeleteEntityButton = ({ onDelete }: IDeleteEntityButtonProps) => {
  const { hasPermission } = usePermission();

  return (
    <Grid container spacing={2}>
      <Grid item md={8} xs={12}>
        <EditorCard>
          <Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              disabled={!hasPermission} // TODO: add permission
            >
              Delete
            </Button>
          </Box>
        </EditorCard>
      </Grid>
    </Grid>
  );
};

export default DeleteEntityButton;
