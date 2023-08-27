// next.js
// react
import { ChangeEvent, useEffect, useState } from "react";
// libs

// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
// mui
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// types
import {
  ActionSetPageStorefront,
  ISetPageStorefrontStateData,
} from "@/types/cms";
import { ISetPageStorefrontStateAction } from "./PageStorefrontForm";
import PageCategorySetter from "../PageCategorySetter";
interface IPageStorefrontBasicInfoProps {
  state: ISetPageStorefrontStateData;
  dispatch: React.Dispatch<ISetPageStorefrontStateAction>;
}

const PageStorefrontBasicInfo = ({
  state,
  dispatch,
}: IPageStorefrontBasicInfoProps) => {
  // simple select with categories

  return (
    <EditorCard>
      <Typography variant="h6">General information</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <TextField
              label="Storefront path"
              value={state.frontend_path}
              onChange={(
                event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                dispatch({
                  type: ActionSetPageStorefront.SETFRONTENDPATH,
                  payload: { frontend_path: event.target.value },
                });
              }}
              InputLabelProps={{
                shrink: Boolean(state.id),
              }}
            />
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.published}
                    onClick={() => {
                      dispatch({
                        type: ActionSetPageStorefront.SETPUBLISHED,
                        payload: { published: !state.published },
                      });
                    }}
                  />
                }
                label="Published"
              />
            </Box>
            <PageCategorySetter
              state={state?.categories || []}
              set={(categoryIds: number[]) => {
                dispatch({
                  type: ActionSetPageStorefront.SETCATEGORIES,
                  payload: { categories: categoryIds },
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
export default PageStorefrontBasicInfo;
