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

const availableOrderings: { [key: string]: IOrderingType } = {
  priceAsc: {
    sortBy: "price",
    order: "asc",
    description: "Price: Lowest to highest",
  },
  priceDesc: {
    sortBy: "price",
    order: "desc",
    description: "Price: Highest to lowest",
  },
  titleAsc: {
    sortBy: "title",
    order: "asc",
    description: "Title: A - Z",
  },
  titleDesc: {
    sortBy: "title",
    order: "desc",
    description: "Title: Z - A",
  },
};

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
        <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
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
