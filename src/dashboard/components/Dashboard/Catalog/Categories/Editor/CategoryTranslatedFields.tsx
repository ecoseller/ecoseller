import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
import Box from "@mui/material/Box";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import TabPanel from "@mui/lab/TabPanel";
import React, { useEffect, useState } from "react";
import { ILanguage } from "@/types/localization";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { ICategoryCreateUpdate } from "@/types/category";
import { Action } from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ActionSetProduct } from "@/types/product";

interface ICategoryTranslatedFieldsProps
{
  languages: ILanguage[];
  category: ICategoryCreateUpdate;
  dispatch: React.Dispatch<Action>;
}

const CategoryTranslatedFields = ({ languages, category, dispatch }: ICategoryTranslatedFieldsProps) =>
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

  const setTitle = (title: string) =>
  {
    dispatch({
      type: "translation",
      payload: {
        translation: {
          language: currentLanguage,
          data: {
            title: title
          }
        }
      }
    });
  };

  const setSlug = (slug: string) =>
  {
    dispatch({
      type: "translation",
      payload: {
        translation: {
          language: currentLanguage,
          data: {
            slug: slug
          }
        }
      }
    });
  };

  const setDescription = (description: string) =>
  {
    dispatch({
      type: "translation",
      payload: {
        translation: {
          language: currentLanguage,
          data: {
            description: description
          }
        }
      }
    });
  };

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
                      value={category.translations[l.code].title || ""}
                      onChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                      ) =>
                      {
                        setTitle(e.target.value);
                      }}
                    />
                    <TextField
                      label="Slug"
                      value={category.translations[l.code].slug || ""}
                      onChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                      ) =>
                      {
                        // const slugiffied = slugify(e.target.value, {
                        //   lower: true,
                        //   locale: language,
                        //   strict: true
                        // });
                        setSlug(e.target.value);
                      }}
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
                    <TextField
                      label="Description"
                      value={category.translations[l.code].description || ""}
                      onChange={(
                        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                      ) =>
                      {
                        setDescription(e.target.value);
                      }}
                    />
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
