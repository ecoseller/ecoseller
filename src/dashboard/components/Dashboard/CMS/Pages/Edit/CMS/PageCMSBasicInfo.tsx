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
import { ISetPageCMSStateAction } from "./PageCMSForm";
import {
  ActionSetPageCMS,
  IPageFrontendTranslationFields,
  ISetPageCMSStateData,
} from "@/types/cms";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import PageCategorySetter from "../PageCategorySetter";

interface IPageCMSBasicInfoProps {
  state: ISetPageCMSStateData;
  dispatch: React.Dispatch<ISetPageCMSStateAction>;
}

const PageCMSBasicInfo = ({ state, dispatch }: IPageCMSBasicInfoProps) => {
  return (
    <EditorCard>
      <Typography variant="h6">General information</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            <Box mt={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.published}
                    onClick={() => {
                      dispatch({
                        type: ActionSetPageCMS.SETPUBLISHED,
                        payload: { published: !state.published },
                      });
                    }}
                  />
                }
                label="Published"
              />
              <PageCategorySetter
                state={state?.categories || []}
                set={(categoryIds: number[]) => {
                  dispatch({
                    type: ActionSetPageCMS.SETCATEGORIES,
                    payload: { categories: categoryIds },
                  });
                }}
              />
            </Box>
          </Stack>
        </FormControl>
      </Box>
    </EditorCard>
  );
};
export default PageCMSBasicInfo;
