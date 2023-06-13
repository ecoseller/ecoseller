import { ICategoryBase } from "@/types/category";
import { useRouter } from "next/router";

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
    <ul>
      {subCategories.map((c) => (
        <li>{c.title}</li>
      ))}
    </ul>
  );
};

export default SubCategoryList;
