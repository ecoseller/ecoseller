import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";
import React, { useEffect, useReducer, useState } from "react";
import { getLanguages } from "@/api/country/country";
import { ILanguage } from "@/types/localization";
import DashboardContentWithSaveFooter from "@/components/Dashboard/Generic/EditableContent";
import { addCategory, updateCategory } from "@/api/category/category";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { ICategoryEditable, ICategoryTranslation } from "@/types/category";
import EntityVisibilityForm from "@/components/Dashboard/Generic/EntityVisibilityForm";
import CategorySelectForm from "@/components/Dashboard/Generic/CategorySelectForm";
import { ActionSetProduct } from "@/types/product";

export enum SetCategoryAction {
  SetTranslation,
  RecreateInitState,
  SetPublished,
  SetParentCategory
}

export interface Action {
  type: SetCategoryAction;
  payload: any;
}

// TODO: use enums & typing
function reducer(
  state: ICategoryEditable,
  action: Action
): ICategoryEditable {
  switch (action.type) {
    case SetCategoryAction.SetTranslation: {
      return {
        ...state, // use the previous state as a base
        translations: { // update `translations` field
          ...state.translations, // use the previous `translations` state as a base
          [action.payload.translation.language]: { // update `translations[language]` field
            ...state.translations[action.payload.translation.language], // use the previous `translations[language]` state as a base
            ...action.payload.translation.data, // use the data from payload
          },
        },
      };
    }
    case SetCategoryAction.RecreateInitState:
      return action.payload;
    case SetCategoryAction.SetPublished:
      return { ...state, published: action.payload.published };
    case SetCategoryAction.SetParentCategory:
      return { ...state, parent: action.payload.parent };
    default:
      return state;
  }
}

interface ICategoryEditorWrapperProps {
  initialCategory: ICategoryEditable;
  creatingNew: boolean;
  title: string;
  categoryId?: string;
}

const CategoryEditorWrapper = ({
  initialCategory,
  creatingNew,
  title,
  categoryId = "",
}: ICategoryEditorWrapperProps) => {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [category, dispatch] = useReducer(reducer, initialCategory);

  const router = useRouter();

  useEffect(() => {
    getLanguages().then((langs) => {
      setLanguages(langs.data);
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: SetCategoryAction.RecreateInitState,
      payload: initialCategory,
    });
  }, [initialCategory]);

  const save = () => {
    if (creatingNew) {
      addCategory(category).then(() => {
        router.push("/dashboard/catalog/categories");
      });
    } else {
      updateCategory(categoryId, category).then(() => {
        router.push("/dashboard/catalog/categories");
      });
    }
  };

  const setPublished = (published: boolean) => {
    dispatch({
      type: SetCategoryAction.SetPublished,
      payload: { published: published },
    });
  };

  const setParentCategory = (categoryId: number) => {
    dispatch({
      type: SetCategoryAction.SetParentCategory,
      payload: { parent: categoryId },
    });
  };

  return (
    <>
      <TopLineWithReturn
        title={title}
        returnPath="/dashboard/catalog/categories"
      />
      <Grid container spacing={2}>
        <Grid item md={8} xs={12}>
          <CategoryTranslatedFields
            languages={languages}
            category={category}
            dispatch={dispatch}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <CategorySelectForm
            categoryId={category.parent}
            setCategoryId={setParentCategory}
            title="Parent category"
          />
          <EntityVisibilityForm
            isPublished={category.published}
            setValue={setPublished}
          />
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
