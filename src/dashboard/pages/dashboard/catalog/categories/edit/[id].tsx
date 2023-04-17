import React, { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import TopLineWithReturn from "@/components/Dashboard/Generic/TopLineWithReturn";
import Grid from "@mui/material/Grid";
import CategoryTranslatedFields from "@/components/Dashboard/Catalog/Categories/Editor/CategoryTranslatedFields";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ILanguage } from "@/types/localization";
import { ICategoryCreateUpdate, ICategoryDetail } from "@/types/category";
import { getCategory } from "@/api/category/category";
import { useRouter } from "next/router";

const CategoryEditPage = () =>
{
  const emptyCategory: ICategoryDetail = {
    published: true,
    translations: {
      en: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        meta_title: ""
      },
      cs: {
        slug: "",
        title: "",
        description: "",
        meta_description: "",
        meta_title: ""
      }
    },
    id: 0,
    create_at: "",
    update_at: ""
  };

  const [category, setCategory] = useState<ICategoryDetail>(emptyCategory);
  const router = useRouter();
  const { id } = router.query;
  const categoryId = id?.toString() || "";


  useEffect(() =>
  {
    getCategory(categoryId)
      .then((c) =>
      {
        setCategory(c.data);
      });
  }, [categoryId]);

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <CategoryEditorWrapper initialCategory={category} creatingNew={false} />
      </Container>
    </DashboardLayout>
  );
};

CategoryEditPage.getLayout = (page: ReactElement) =>
{
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CategoryEditPage;
