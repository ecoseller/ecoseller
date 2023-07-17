// utils
import { useTranslation } from "next-i18next";
import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

interface IProductSortSelectProps {
  defaultOrdering: {
    sortBy: string | null;
    order: string | null;
  };
  sortProducts: (sortBy: string, order: string) => void;
}

interface IOrderingType {
  sortBy: string;
  order: string;
  description: string;
}

/**
 * Component displaying `select` for ordering products
 * @param sortProducts function that sorts products by the selected criteria
 * @param defaultOrdering
 * @constructor
 */
const ProductSortSelect = ({
  defaultOrdering,
  sortProducts,
}: IProductSortSelectProps) => {
  const router = useRouter();
  const { id } = router.query;

  const { t } = useTranslation("category");

  const [selectedOrderingName, setSelectedOrderingName] = useState("");

  useEffect(() => {
    for (const [orderingName, ordering] of Object.entries(availableOrderings)) {
      if (
        ordering.sortBy == defaultOrdering.sortBy &&
        ordering.order == defaultOrdering.sortBy
      ) {
        setSelectedOrderingName(orderingName);
        return;
      }
    }

    setSelectedOrderingName("");
  }, [id]);

  const availableOrderings: { [key: string]: IOrderingType } = {
    recommended: {
      sortBy: "recommended",
      order: "asc",
      description: t("order-by-recommended"), //"Recommended",
    },
    priceAsc: {
      sortBy: "price",
      order: "asc",
      description: t("order-by-price-asc"), //"Price: Lowest to highest",
    },
    priceDesc: {
      sortBy: "price",
      order: "desc",
      description: t("order-by-price-desc"),
      // description: "Price: Highest to lowest",
    },
    titleAsc: {
      sortBy: "title",
      order: "asc",
      description: t("order-by-title-asc"),
      // description: "Title: A - Z",
    },
    titleDesc: {
      sortBy: "title",
      order: "desc",
      description: t("order-by-title-desc"),
      // description: "Title: Z - A",
    },
  };

  const handleChange = (event: SelectChangeEvent) => {
    const orderingName = event.target.value;

    if (orderingName in availableOrderings) {
      const selectedOrdering = availableOrderings[orderingName];

      sortProducts(selectedOrdering.sortBy, selectedOrdering.order);
      setSelectedOrderingName(orderingName);
    }
  };

  return (
    <Box sx={{ maxWidth: 300, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t("sort-by") /**Sort by*/}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedOrderingName || ""}
          label="Sort by"
          onChange={handleChange}
        >
          {Object.entries(availableOrderings).map(
            ([orderingName, ordering]) => (
              <MenuItem key={orderingName} value={orderingName}>
                {ordering.description}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ProductSortSelect;
