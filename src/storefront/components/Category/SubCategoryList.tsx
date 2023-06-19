import { ICategoryBase } from "@/types/category";
import { useRouter } from "next/router";
import React from "react";
import { Grid } from "@mui/material";
import PaperItem from "@/components/Generic/PaperItem";
import CollapsableContentWithTitle from "@/components/Generic/CollapsableContentWithTitle";
import NextLink from "next/link";

interface ISubCategoryListProps {
  subCategories: ICategoryBase[];
}

/**
 * Component displaying list of subcategories
 * @constructor
 */
const SubCategoryList = ({ subCategories }: ISubCategoryListProps) => {
  const router = useRouter();

  return (
    <CollapsableContentWithTitle title="Subcategories" defaultOpen={true}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {subCategories.map((c) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
            <NextLink href={`/category/${c.id}/${c.slug}`}>
              <PaperItem>{c.title}</PaperItem>
            </NextLink>
          </Grid>
        ))}
      </Grid>
    </CollapsableContentWithTitle>
  );
};

export default SubCategoryList;
