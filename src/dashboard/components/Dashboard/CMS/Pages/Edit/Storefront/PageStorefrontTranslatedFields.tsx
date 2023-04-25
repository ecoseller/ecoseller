// next.js
// react
import { useEffect, useState } from "react";
// libs
import useSWRImmutable from "swr/immutable";

// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
// mui
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
// types
import { ILanguage } from "@/types/localization";
import { ISetPageStorefrontStateAction } from "./PageStorefrontForm";
import {
  ActionSetPageStorefront,
  IPageFrontendTranslationFields,
  ISetPageStorefrontStateData,
} from "@/types/cms";

interface IPageStorefrontTranslatedFieldsProps {
  language: string;
  state: IPageFrontendTranslationFields;
  dispatch: React.Dispatch<ISetPageStorefrontStateAction>;
}
const PageStorefrontTranslatedFields = ({
  language,
  state,
  dispatch,
}: IPageStorefrontTranslatedFieldsProps) => {
  // const [title, setTitle] = useState<string>("");
  // const [slug, setSlug] = useState<string>("");
  const [editSlug, setEditSlug] = useState<boolean>(false);

  const setTitle = (title: string) => {
    dispatch({
      type: ActionSetPageStorefront.SETTRANSLATION,
      payload: {
        translation: {
          language,
          data: {
            title: title,
          },
        },
      },
    });
  };

  console.log("state", state);

  return (
    <FormControl fullWidth margin={"normal"}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={state?.title || ""}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            setTitle(e.target.value);
          }}
        />
      </Stack>
    </FormControl>
  );
};

interface IPageStorefrontTranslatedFieldsWrapperProps {
  state: ISetPageStorefrontStateData;
  dispatch: React.Dispatch<ISetPageStorefrontStateAction>;
}

const PageStorefrontTranslatedFieldsWrapper = ({
  state,
  dispatch,
}: IPageStorefrontTranslatedFieldsWrapperProps) => {
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
                <PageStorefrontTranslatedFields
                  language={language.code}
                  state={
                    state?.translations
                      ? state?.translations[language.code]
                      : ({} as IPageFrontendTranslationFields)
                  }
                  dispatch={dispatch}
                />
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};
export default PageStorefrontTranslatedFieldsWrapper;
