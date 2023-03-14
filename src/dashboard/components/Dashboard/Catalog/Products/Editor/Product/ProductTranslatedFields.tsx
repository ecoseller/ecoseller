// next.js
// react
import { useEffect, useState } from "react";
// libs
import slugify from "slugify";
import useSWRImmutable from "swr/immutable";

// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import CollapsableContentWithTitle from "@/components/Dashboard/Generic/CollapsableContentWithTitle";
// mui
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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

interface IProductTranslatedFieldsProps {
  language: string;
}
const ProductTranslatedFields = ({
  language,
}: IProductTranslatedFieldsProps) => {
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [editSlug, setEditSlug] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (!editSlug) {
      // set slug from title
      // but only if slug is empty
      setSlug(slugify(title));
    }
  }, [title]);

  return (
    <FormControl fullWidth margin={"normal"}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={title}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            setTitle(e.target.value);
          }}
        />
        <TextField
          label="Slug"
          value={slug}
          // disabled={!editSlug}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
          ) => {
            const slugiffied = slugify(e.target.value);
            setSlug(slugiffied);
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
        <TextField label="Description" />
      </Stack>
    </FormControl>
  );
};

const ProductTranslatedFieldsWrapper = () => {
  const { data: languages } = useSWRImmutable<
    { code: string; default: boolean }[]
  >("/country/languages/");

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

  console.log("languages", languages);

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
              <TabPanel sx={{ padding: 0 }} value={language.code}>
                <ProductTranslatedFields language={language.code} />
              </TabPanel>
            ))}
          </TabContext>
        </Box>
      </CollapsableContentWithTitle>
    </EditorCard>
  );
};
export default ProductTranslatedFieldsWrapper;
