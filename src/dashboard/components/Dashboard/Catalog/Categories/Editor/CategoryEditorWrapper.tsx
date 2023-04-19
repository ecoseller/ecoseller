import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";
import React, { useEffect, useReducer, useState } from "react";
import { getLanguages } from "@/api/country/country";
import { ILanguage } from "@/types/localization";
import EditableContentWrapper, { PrimaryButtonAction } from "@/components/Dashboard/Generic/EditableContentWrapper";
import { addCategory, updateCategory } from "@/api/category/category";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { ICategoryEditable } from "@/types/category";
import EntityVisibilityForm from "@/components/Dashboard/Generic/EntityVisibilityForm";
import CategorySelectForm from "@/components/Dashboard/Generic/CategorySelectForm";

interface ICategoryEditorWrapperProps {
  initialCategory: ICategoryEditable;
  creatingNew: boolean;
  title: string;
  categoryId?: string;
}

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

const CategoryEditorWrapper = ({
  initialCategory,
  creatingNew,
  title,
  categoryId = "",
}: ICategoryEditorWrapperProps) => {

  function reducer(
    state: ICategoryEditable,
    action: Action
  ): ICategoryEditable {
    switch (action.type) {
      case SetCategoryAction.SetTranslation:
        setPreventNavigation(true);
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
      case SetCategoryAction.SetPublished:
        setPreventNavigation(true);
        return { ...state, published: action.payload.published };
      case SetCategoryAction.SetParentCategory:
        setPreventNavigation(true);
        return { ...state, parent: action.payload.parent };
      case SetCategoryAction.RecreateInitState:
        return action.payload;
      default:
        return state;
    }
  }
  
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
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

  const save = async () => {
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
    <EditableContentWrapper
      primaryButtonTitle={creatingNew ? PrimaryButtonAction.Create : PrimaryButtonAction.Save} // To distinguish between create and update actions
      preventNavigation={preventNavigation}
      setPreventNavigation={setPreventNavigation}
      onButtonClick={async () => {
        await save();
      }}
      returnPath={"/dashboard/catalog/categories"}
    >
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
    </EditableContentWrapper>
  );
};

export default CategoryEditorWrapper;
