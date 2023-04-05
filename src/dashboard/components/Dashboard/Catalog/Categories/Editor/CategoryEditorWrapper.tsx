import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";
import React, { useEffect, useState } from "react";
import { getLanguages } from "@/api/country/country";
import { ILanguage } from "@/types/localization";

const CategoryEditorWrapper = () =>
{
  const [languages, setLanguages] = useState<ILanguage[]>([]);

  useEffect(() =>
  {
    getLanguages().then((langs) =>
    {
      setLanguages(langs.data);
    });
  }, []);

  return (
    <>
      <TopLineWithReturn
        title="Add category"
        returnPath="/dashboard/catalog/categories"
      />
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          {/*<ProductTranslatedFieldsWrapper*/}
          {/*  state={productState}*/}
          {/*  dispatch={dispatchProductState}*/}
          {/*/>*/}
          <CategoryTranslatedFields languages={languages} />
        </Grid>
        <Grid item md={4} xs={12}>
          {/*<ProductCategorySelect*/}
          {/*  state={productState}*/}
          {/*  dispatch={dispatchProductState}*/}
          {/*/>*/}
          yyy
        </Grid>
      </Grid>
    </>
  );
};

export default CategoryEditorWrapper;