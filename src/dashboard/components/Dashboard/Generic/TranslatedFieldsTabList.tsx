import { useEffect, useState } from "react";
import slugify from "slugify";
import useSWRImmutable from "swr/immutable";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
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
import { ILanguage } from "@/types/localization";
import dynamic from "next/dynamic";
import { OutputData as IEditorJSData } from "@editorjs/editorjs";
import { IEntityTranslation, IEntityTranslations } from "@/types/common";
import { IDispatchWrapper } from "@/components/Dashboard/Common/IDispatchWrapper";

let EditorJSField = dynamic(
  () => import("@/components/Dashboard/Common/Fields/EditorJSField"),
  {
    ssr: false,
  }
);

interface IProductTranslatedFieldsProps {
  language: string;
  state: IEntityTranslation;
  dispatchWrapper: IDispatchWrapper;
}

const TranslatedFieldsTabList = ({
  language,
  state,
  dispatchWrapper,
}: IProductTranslatedFieldsProps) => {
  // const [title, setTitle] = useState<string>("");
  // const [slug, setSlug] = useState<string>("");
  const [editSlug, setEditSlug] = useState<boolean>(false);

  useEffect(() => {
    if (!editSlug && state?.title != undefined) {
      // set slug from title
      // but only if slug is empty
      dispatchWrapper.setSlug(
        language,
        slugify(state?.title || "", {
          lower: true,
          strict: true,
          locale: language,
        })
      );
    }
  }, [dispatchWrapper, editSlug, language, state?.title]);

  return (
    <FormControl fullWidth margin={"normal"}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={state?.title || ""}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            dispatchWrapper.setTitle(language, e.target.value);
          }}
        />
        <TextField
          label="Slug"
          value={state?.slug || ""}
          disabled={!editSlug}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const slugiffied = slugify(e.target.value, {
              lower: true,
              locale: language,
              strict: true,
            });
            dispatchWrapper.setSlug(language, slugiffied);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setEditSlug(!editSlug)}>
                  {!editSlug ? (
                    <Tooltip title={"Don't synchronize slug with title"}>
                      <SyncDisabledIcon />
                    </Tooltip>
                  ) : (
                    <Tooltip title={"Synchronize slug with title"}>
                      <SyncIcon />
                    </Tooltip>
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {/*<EditorJSField*/}
        {/*  data={state?.description_editorjs || ({} as IEditorJSData)}*/}
        {/*  onChange={(data: IEditorJSData) =>*/}
        {/*  {*/}
        {/*    dispatchWrapper.setDescription(language, data);*/}
        {/*  }}*/}
        {/*/>*/}
      </Stack>
    </FormControl>
  );
};

interface IProductTranslatedFieldsWrapperProps {
  state: IEntityTranslations;
  dispatchWrapper: IDispatchWrapper;
}

const ProductTranslatedFieldsWrapper = ({
  state,
  dispatchWrapper,
}: IProductTranslatedFieldsWrapperProps) => {
  const { data: languages } = useSWRImmutable<ILanguage[]>(
    "/country/languages/"
  );

  const [language, setLanguage] = useState<string>("");

  const handleLanguageChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setLanguage(newValue);
  };

  useEffect(() => {
    setLanguage(languages?.find((language) => language.default)?.code || "");
  }, [languages]);

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Translated fields">
        <Box>
          <TabContext value={language}>
            <Box>
              <TabList
                onChange={handleLanguageChange}
                aria-label="lab API tabs example"
              >
                {languages?.map((language) => (
                  <Tab
                    key={language.code}
                    label={language.code.toUpperCase()}
                    value={language.code}
                  />
                ))}
              </TabList>
            </Box>
            {languages?.map((language) => (
              <TabPanel
                sx={{ padding: 0 }}
                key={language.code}
                value={language.code}
              >
                <TranslatedFieldsTabList
                  language={language.code}
                  state={state[language.code]}
                  dispatchWrapper={dispatchWrapper}
                />
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};
export default ProductTranslatedFieldsWrapper;
