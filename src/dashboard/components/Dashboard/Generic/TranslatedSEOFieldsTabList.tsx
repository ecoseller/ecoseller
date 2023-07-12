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
import { ISetProductStateAction } from "../Catalog/Products/Editor/ProductEditorWrapper";
import { ILanguage } from "@/types/localization";
import { IDispatchWrapper } from "@/components/Dashboard/Common/IDispatchWrapper";
import { IEntityTranslation, IEntityTranslations } from "@/types/common";
import { usePermission } from "@/utils/context/permission";

interface ITranslatedSEOFieldsTabProps {
  language: string;
  state: IEntityTranslation;
  dispatchWrapper: IDispatchWrapper;
}

const TranslatedSEOFieldsTab = ({
  language,
  state,
  dispatchWrapper,
}: ITranslatedSEOFieldsTabProps) => {
  const { hasPermission } = usePermission();

  return dispatchWrapper?.setMetaTitle &&
    dispatchWrapper?.setMetaDescription ? (
    <FormControl fullWidth margin={"normal"}>
      <Stack spacing={2}>
        <TextField
          label="Meta title"
          value={state?.meta_title || ""}
          disabled={!hasPermission}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            dispatchWrapper?.setMetaTitle
              ? dispatchWrapper.setMetaTitle(language, e.target.value)
              : null;
          }}
        />
        {}
        <TextField
          label="Meta description"
          value={state?.meta_description || ""}
          disabled={!hasPermission}
          multiline
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            dispatchWrapper?.setMetaDescription
              ? dispatchWrapper.setMetaDescription(language, e.target.value)
              : null;
          }}
        />
      </Stack>
    </FormControl>
  ) : null;
};

interface ITranslatedSEOFieldsTabListProps {
  state: IEntityTranslations;
  dispatchWrapper: IDispatchWrapper;
}

/**
 * Tab list containing SEO fields form for each language
 * @param state state of the translated SEO fields
 * @param dispatchWrapper wrapper around `dispatch` function that allows us to call setXXX methods
 * @constructor
 */
const TranslatedSEOFieldsTabList = ({
  state,
  dispatchWrapper,
}: ITranslatedSEOFieldsTabListProps) => {
  const { data: languages } = useSWRImmutable<ILanguage[]>(
    "/api/country/language/"
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
                <TranslatedSEOFieldsTab
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
export default TranslatedSEOFieldsTabList;
