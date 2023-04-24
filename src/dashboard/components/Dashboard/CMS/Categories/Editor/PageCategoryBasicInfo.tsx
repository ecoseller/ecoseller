// next.js
// react
import { ChangeEvent, useEffect, useState } from "react";
// libs

// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import PageCategoryTypeSetter from "./CategoryTypeSetter";
// mui
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// types
import { ActionSetPageCategory, ISetPageCategoryStateData } from "@/types/cms";
import { ISetPageCategoryStateAction } from "./Form";
interface IPageCategoryBasicInfoProps {
  state: ISetPageCategoryStateData;
  dispatch: React.Dispatch<ISetPageCategoryStateAction>;
}

const PageCategoryBasicInfo = ({
  state,
  dispatch,
}: IPageCategoryBasicInfoProps) => {
  // simple select with categories

  return (
    <EditorCard>
      <Typography variant="h6">General information</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              label="Code"
              value={state.code}
              error={!Boolean(state.code)}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                dispatch({
                  type: ActionSetPageCategory.SETCODE,
                  payload: { code: event.target.value },
                });
              }}
              InputLabelProps={{
                shrink: Boolean(state.id),
              }}
              helperText="Code is used for internal purposes and should be unique. It is used in the URL for fetching list of pages under this category."
            />
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.published}
                    onClick={() => {
                      dispatch({
                        type: ActionSetPageCategory.SETPUBLISHED,
                        payload: { published: !state.published },
                      });
                    }}
                  />
                }
                label="Published"
              />
            </Box>
            <PageCategoryTypeSetter
              state={state?.type || []}
              set={(typeIds: number[]) => {
                dispatch({
                  type: ActionSetPageCategory.SETTYPE,
                  payload: { type: typeIds },
                });
              }}
            />
            {/* <TextField label="Name" /> */}
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default PageCategoryBasicInfo;
