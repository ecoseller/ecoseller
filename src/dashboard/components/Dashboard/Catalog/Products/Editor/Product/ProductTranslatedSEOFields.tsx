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
import {
  ActionSetProduct,
  IProductTranslation,
  ISetProductStateData,
} from "@/types/product";
import { ISetProductStateAction } from "../ProductEditorWrapper";
import { ILanguage } from "@/types/localization";

interface IProductTranslatedSEOFieldsProps {
  language: string;
  state: IProductTranslation;
  dispatch: React.Dispatch<ISetProductStateAction>;
}
const ProductTranslatedFields = ({
  language,
  state,
  dispatch,
}: IProductTranslatedSEOFieldsProps) => {
  const setMetaTitle = (title: string) => {
    dispatch({
      type: ActionSetProduct.SETTRANSLATION,
      payload: {
        translation: {
          language,
          data: {
            meta_title: title,
          },
        },
      },
    });
  };

  const setMetaDescription = (text: string) => {
    dispatch({
      type: ActionSetProduct.SETTRANSLATION,
      payload: {
        translation: {
          language,
          data: {
            meta_description: text,
          },
        },
      },
    });
  };

  return (
    <FormControl fullWidth margin={"normal"}>
      <Stack spacing={2}>
        <TextField
          label="Meta title"
          value={state?.meta_title || ""}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            setMetaTitle(e.target.value);
          }}
        />
        <TextField
          label="Meta description"
          value={state?.meta_description || ""}
          multiline
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            setMetaDescription(e.target.value);
          }}
        />
      </Stack>
    </FormControl>
  );
};

interface IProductTranslatedSEOFieldsWrapperProps {
  state: ISetProductStateData;
  dispatch: React.Dispatch<ISetProductStateAction>;
}

const ProductTranslatedSEOFieldsWrapper = ({
  state,
  dispatch,
}: IProductTranslatedSEOFieldsWrapperProps) => {
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
      <CollapsableContentWithTitle defaultOpen={false} title="SEO">
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
                <ProductTranslatedFields
                  language={language.code}
                  state={
                    state?.translations
                      ? state?.translations[language.code]
                      : ({} as IProductTranslation)
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
export default ProductTranslatedSEOFieldsWrapper;
