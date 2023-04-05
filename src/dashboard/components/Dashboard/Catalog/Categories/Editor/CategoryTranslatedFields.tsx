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
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import slugify from "slugify";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";
import SyncIcon from "@mui/icons-material/Sync";
import FormControl from "@mui/material/FormControl";

interface ICategoryTranslatedFieldsProps
{
  languages: ILanguage[];
}

const CategoryTranslatedFields = ({ languages }: ICategoryTranslatedFieldsProps) =>
{
  const [currentLanguage, setCurrentLanguage] = useState<string>("");

  const handleLanguageChange = (
    event: React.SyntheticEvent,
    newValue: string
  ) =>
  {
    setCurrentLanguage(newValue);
  };

  useEffect(() =>
  {
    const defaultLang = languages.find((l) => l.default);
    setCurrentLanguage(defaultLang?.code || "");
  }, [languages]);

  return (
    <EditorCard>
      <CollapsableContentWithTitle title="Translated fields">
        <Box>
          <TabContext value={currentLanguage}>
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
                <FormControl fullWidth margin={"normal"}>
                  <Stack spacing={2}>
                    <TextField
                      label="Title"
                      // value={state?.title || ""}
                      // onChange={(
                      //   e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                      // ) =>
                      // {
                      //   setTitle(e.target.value);
                      // }}
                    />
                    <TextField
                      label="Slug"
                      // value={state?.slug || ""}
                      // disabled={!editSlug}
                      // onChange={(
                      //   e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                      // ) =>
                      // {
                      //   const slugiffied = slugify(e.target.value, {
                      //     lower: true,
                      //     locale: language,
                      //     strict: true
                      //   });
                      //   setSlug(slugiffied);
                      // }}
                      // InputProps={{
                      //   endAdornment: (
                      //     <InputAdornment position="end">
                      //       <IconButton onClick={() => setEditSlug(!editSlug)}>
                      //         {!editSlug ? (
                      //           <Tooltip title={"Don't synchronize slug with title"}>
                      //             <SyncDisabledIcon />
                      //           </Tooltip>
                      //         ) : (
                      //           <Tooltip title={"Synchronize slug with title"}>
                      //             <SyncIcon />
                      //           </Tooltip>
                      //         )}
                      //       </IconButton>
                      //     </InputAdornment>
                      //   )
                      // }}
                    />
                    <TextField label="Description" />
                  </Stack>
                </FormControl>
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};

export default CategoryTranslatedFields;
