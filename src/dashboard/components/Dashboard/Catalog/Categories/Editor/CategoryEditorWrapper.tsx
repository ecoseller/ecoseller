import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";
import React, { useEffect, useReducer, useState } from "react";
import { getLanguages } from "@/api/country/country";
import { ILanguage } from "@/types/localization";
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import { addCategory } from "@/api/category/category";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { ICategoryCreateUpdate, ICategoryTranslation } from "@/types/category";

export interface Action {
  type: string;
  payload: any;
}

// TODO: use enums & typing
function reducer(
  state: ICategoryCreateUpdate,
  action: Action
): ICategoryCreateUpdate {
  switch (action.type) {
    case "translation": {
      return {
        ...state,
        translations: {
          ...state.translations,
          [action.payload.translation.language]: {
            ...state.translations[action.payload.translation.language],
            ...action.payload.translation.data,
          },
        },
      };
    }
    default:
      return state;
  }
}

const CategoryEditorWrapper = () => {
  // TODO: load dynamically
  const emptyCategory: ICategoryCreateUpdate = {
    published: true,
    translations: {
      en: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        meta_title: "",
      },
      cs: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        meta_title: "",
      },
    },
  };

  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [category, dispatch] = useReducer(reducer, emptyCategory);

  const router = useRouter();

  useEffect(() => {
    getLanguages().then((langs) => {
      setLanguages(langs.data);
    });
  }, []);

  const save = () => {
    addCategory(category).then(() => {
      router.push("/dashboard/catalog/categories");
    });
  };

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
          <CategoryTranslatedFields
            languages={languages}
            category={category}
            dispatch={dispatch}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          {/*<ProductCategorySelect*/}
          {/*  state={productState}*/}
          {/*  dispatch={dispatchProductState}*/}
          {/*/>*/}
          TODO: add published field & Parent category HERE
        </Grid>
      </Grid>
      <Button
        onClick={() => {
          save();
        }}
      >
        Save
      </Button>
    </>
  );
};

export default CategoryEditorWrapper;
