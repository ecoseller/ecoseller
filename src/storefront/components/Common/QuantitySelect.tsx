// next
import { useRouter } from "next/router";

// react
import {
  ChangeEvent,
  ChangeEventHandler,
  use,
  useEffect,
  useState,
} from "react";

// libs
import { useCart } from "@/utils/context/cart";

// components

// mui
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
// types
import { IProductVariant } from "@/types/product";
import Grid from "@mui/material/Grid";
import { Typography, useMediaQuery, useTheme } from "@mui/material";
import { serializeAttributes } from "@/utils/attributes";
// styles
import styles from "@/styles/Common/QuantitySelect.module.scss";
const QuantitySelect = ({
  quantity,
  setQuantity,
  maxQuantity,
}: {
  quantity: number;
  setQuantity: (value: number) => void;
  maxQuantity: number;
}) => {
  /**
   * Component containing number input and buttons to increase/decrease the quantity.
   */

  const [inputValue, setInputValue] = useState<string>(`${quantity}`);

  useEffect(() => {
    setInputValue(`${quantity}`);
  }, [quantity]);

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increment = () => {
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const setTextQuantity = (value: string) => {
    if (value === "") {
      setQuantity(1);
      setInputValue("");
      return;
    }
    const parsedValue = parseInt(value);
    if (parsedValue > 0 && parsedValue <= maxQuantity) {
      setQuantity(parsedValue);
      setInputValue(value);
    } else {
      setInputValue("");
    }
  };

  return (
    <div className={styles.quantity_input}>
      <button
        className={`${styles.quantity_input__modifier} ${
          styles.quantity_input__modifier__left
        } ${quantity === 1 && styles.quantity_input__modifier__disabled}`}
        onClick={() => decrement()}
      >
        &mdash;
      </button>
      <input
        className={styles.quantity_input__screen}
        type="text"
        value={inputValue}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setTextQuantity(event.target.value);
        }}
      />
      <button
        className={`${styles.quantity_input__modifier} ${
          styles.quantityinput__modifier__right
        } ${
          quantity === maxQuantity && styles.quantity_input__modifier__disabled
        }}`}
        onClick={() => increment()}
      >
        &#xff0b;
      </button>
    </div>
  );
};

export default QuantitySelect;
