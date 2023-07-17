// /components/dashboard/cart/shippingmethod/shippingmethodimageuploader.tsx
// next.js
// libraries
// layout
//react
import { ChangeEvent, useRef, useState } from "react";
// components
import EditorCard from "@/components/Dashboard/Generic/EditorCard";

// mui
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
// types
import { ISetShippingMethodStateData } from "@/types/cart/methods";
// api
import imgPath from "@/utils/imgPath";
import convertBase64 from "@/utils/base64";

const ShippingPaymentMethodImageUploader = ({
  state,
  uploadPath,
}: {
  state: ISetShippingMethodStateData;
  uploadPath: "/api/cart/shipping-method/" | "/api/cart/payment-method/";
}) => {
  /**
   * Purpose of this component is to upload image for shipping method and display it
   * It should be used in shipping/payment method detail page
   */

  const inputRef = useRef<HTMLInputElement>(null);
  const [methodImage, setMethodImage] = useState<string>(
    state?.image as string
  );

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await convertBase64(file);
    console.log("base64", base64);
    console.log("uploadPath", uploadPath);

    fetch(`${uploadPath}${state?.id}/`, {
      method: "PUT",
      body: JSON.stringify({ image: base64 }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setMethodImage(data.image);
      })

      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleUploadClick = () => {
    if (!inputRef.current) return;

    inputRef.current.click();
  };

  return (
    <EditorCard>
      <Typography variant="h6">Image</Typography>
      <Box mt={2}>
        <>
          <input
            hidden
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/svg+xml"
            onChange={handleFileChange}
            multiple={false}
          />
          <Button variant="text" onClick={handleUploadClick}>
            Upload
          </Button>
        </>
        <div
          style={{
            width: "100%",
            textAlign: "left",
          }}
        >
          {methodImage ? (
            <img
              src={imgPath(methodImage)}
              style={{ width: "100%", height: "auto" }}
            />
          ) : null}
        </div>
      </Box>
    </EditorCard>
  );
};

export default ShippingPaymentMethodImageUploader;
