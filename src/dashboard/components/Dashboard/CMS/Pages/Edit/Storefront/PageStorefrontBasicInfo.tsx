// next.js
// react
import { ChangeEvent, useEffect, useState } from "react";
// libs
import slugify from "slugify";
import useSWRImmutable from "swr/immutable";

// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
// mui
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import SyncIcon from "@mui/icons-material/Sync";
import { ISetProductStateData } from "@/types/product";
import { ILanguage } from "@/types/localization";
import dynamic from "next/dynamic";
import { OutputData as IEditorJSData } from "@editorjs/editorjs";
import { ISetPageStorefrontStateAction } from "./PageStorefrontForm";
import {
  ActionSetPageStorefront,
  IPageFrontendTranslationFields,
  ISetPageStorefrontStateData,
} from "@/types/cms";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

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
              // disabled={true}
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
            {/* <TextField label="Name" /> */}
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default PageStorefrontBasicInfo;
