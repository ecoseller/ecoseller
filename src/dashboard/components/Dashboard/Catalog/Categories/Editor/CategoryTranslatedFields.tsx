import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import { IProductTranslation } from "@/types/product";
import { getLanguages } from "@/api/country/country";
import { InferGetServerSidePropsType } from "next";
import React, { useEffect, useState } from "react";
import { ILanguage } from "@/types/localization";

const CategoryTranslatedFields = () =>
{
  const [languages, setLanguages] = useState<ILanguage[]>();
  const [defaultLanguageCode, setDefaultLanguageCode] = useState<string>("");

  const handleLanguageChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) =>
  {
    setDefaultLanguageCode(newValue);
  };

  useEffect(() =>
  {
    getLanguages().then((langs) =>
    {
      setLanguages(langs.data);
      
      const defaultLang = langs.data.find((l) => l.default);
      setDefaultLanguageCode(defaultLang?.code || "");
    });
  }, []);

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Translated fields">
        <Box>
          <TabContext value={defaultLanguageCode}>
            <Box>
              <TabList
                onChange={handleLanguageChange}
              >
                {languages?.map((l) => (
                  <Tab
                    key={l.code}
                    label={l.code.toUpperCase()}
                    value={l.code}
                  />
                ))}
              </TabList>
            </Box>
            {languages?.map((l) => (
              <TabPanel
                sx={{ padding: 0 }}
                key={l.code}
                value={l.code}
              >
                {/*<ProductTranslatedFields*/}
                {/*  language={language.code}*/}
                {/*  state={*/}
                {/*    state?.translations*/}
                {/*      ? state?.translations[language.code]*/}
                {/*      : ({} as IProductTranslation)*/}
                {/*  }*/}
                {/*  dispatch={dispatch}*/}
                {/*/>*/}
                <>Dummy text... {l.code}</>
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default CategoryTranslatedFields;
