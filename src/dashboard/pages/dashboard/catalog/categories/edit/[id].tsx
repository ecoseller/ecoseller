import React, { ReactElement, useEffect, useState } from "react";
import RootLayout from "@/pages/layout";
import DashboardLayout from "@/pages/dashboard/layout";
import Container from "@mui/material/Container";
import CategoryEditorWrapper from "@/components/Dashboard/Catalog/Categories/Editor/CategoryEditorWrapper";
import { ICategoryDetail } from "@/types/category";
import { deleteCategory, getCategory } from "@/api/category/category";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";

const CategoryEditPage = () => {
  const emptyCategory: ICategoryDetail = {
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
    id: 0,
    create_at: "",
    update_at: "",
  };

  const [category, setCategory] = useState<ICategoryDetail>(emptyCategory);
  const router = useRouter();
  const { id } = router.query;
  const categoryId = id?.toString() || "";

  useEffect(() => {
    getCategory(categoryId).then((c) => {
      setCategory(c.data);
    });
  }, [categoryId]);

  function deleteCat() {
    deleteCategory(categoryId).then(() => {
      router.push("/dashboard/catalog/categories");
    });
  }

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        <CategoryEditorWrapper
          initialCategory={category}
          creatingNew={false}
          title={`Edit category #${id}`}
        />
        <>
          <Button variant="contained" onClick={deleteCat}>
            Delete
          </Button>
        </>
      </Container>
    </DashboardLayout>
  );
};

CategoryEditPage.getLayout = (page: ReactElement) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};

export default CategoryEditPage;
