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
import { usePermission } from "@/utils/context/permission";

let EditorJSField = dynamic(
  () => import("@/components/Dashboard/Common/Fields/EditorJSField"),
  {
    ssr: false,
  }
);

interface ITranslatedFieldsTabProps {
  language: string;
  state: IEntityTranslation;
  dispatchWrapper: IDispatchWrapper;
}

const TranslatedFieldsTab = ({
  language,
  state,
  dispatchWrapper,
}: ITranslatedFieldsTabProps) => {
  // const [title, setTitle] = useState<string>("");
  // const [slug, setSlug] = useState<string>("");
  const [editSlug, setEditSlug] = useState<boolean>(false);
  const { hasPermission } = usePermission();

  useEffect(() => {
    if (!editSlug && state?.title != undefined && dispatchWrapper?.setSlug) {
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
  }, [state?.title]);

  console.log("Tab rendered", hasPermission);

  return (
    <FormControl fullWidth margin={"normal"}>
      <Stack spacing={2}>
        {dispatchWrapper && dispatchWrapper?.setTitle ? (
          <TextField
            disabled={!hasPermission}
            label="Title"
            value={state?.title || ""}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              dispatchWrapper?.setTitle
                ? dispatchWrapper.setTitle(language, e.target.value)
                : null;
            }}
          />
        ) : null}
        {dispatchWrapper && dispatchWrapper?.setSlug ? (
          <TextField
            label="Slug"
            value={state?.slug || ""}
            disabled={!editSlug || !hasPermission}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              const slugiffied = slugify(e.target.value, {
                lower: true,
                locale: language,
                strict: true,
              });
              dispatchWrapper?.setSlug
                ? dispatchWrapper.setSlug(language, slugiffied)
                : null;
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
        ) : null}
        {dispatchWrapper && dispatchWrapper?.setDescription ? (
          <EditorJSField
            data={state?.description_editorjs || ({} as IEditorJSData)}
            label={"Description"}
            disabled={!hasPermission}
            onChange={(data: IEditorJSData) => {
              dispatchWrapper?.setDescription
                ? dispatchWrapper.setDescription(language, data)
                : null;
            }}
          />
        ) : null}
        {dispatchWrapper && dispatchWrapper?.setDescriptionPlain ? (
          <TextField
            label="Description"
            value={state?.description || ""}
            disabled={!hasPermission}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              dispatchWrapper?.setDescriptionPlain
                ? dispatchWrapper.setDescriptionPlain(language, e.target.value)
                : null;
            }}
          />
        ) : null}
      </Stack>
    </FormControl>
  );
};

interface ITranslatedFieldsTabListProps {
  state: IEntityTranslations;
  dispatchWrapper: IDispatchWrapper;
}

/**
 * Tab list containing translated fields form for each language
 * @param state state of the translated fields
 * @param dispatchWrapper wrapper around `dispatch` function that allows us to call setXXX methods
 * @constructor
 */
const TranslatedFieldsTabList = ({
  state,
  dispatchWrapper,
}: ITranslatedFieldsTabListProps) => {
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
                <TranslatedFieldsTab
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
export default TranslatedFieldsTabList;
