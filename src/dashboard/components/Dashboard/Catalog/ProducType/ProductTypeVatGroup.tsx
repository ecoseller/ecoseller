// next.js
// react
import { ChangeEvent, useState } from "react";
// mui
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditorCard from "@/components/Dashboard/Generic/EditorCard";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridRowModes,
  GridRowModesModel,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowParams,
  MuiEvent,
  GridCellParams,
} from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { randomId } from "@mui/x-data-grid-generator";

// types
import { IProductType, ISetProductStateData } from "@/types/product";
import { ICountry, IVatGroup } from "@/types/country";
import { useSnackbarState } from "@/utils/snackbar";

interface IProductTypeVatGroupProps {
  state: IProductType;
  setState: (data: IProductType) => void;
  vatGroups: IVatGroup[];
  countries: ICountry[];
}

interface ICountryVatGroupMap {
  [key: string]: number;
}

const ProductTypeVatGroup = ({
  state,
  setState,
  vatGroups,
  countries,
}: IProductTypeVatGroupProps) => {
  // this is a very simple groupping of selected vat groups by country code
  let selectedCountryVatGroups: ICountryVatGroupMap = {};
  countries?.forEach((country: ICountry) => {
    // get the vat group for the given country
    const vatGroupForCountry = vatGroups.find((vatGroup: IVatGroup) => {
      return (
        vatGroup.country === country.code &&
        state?.vat_groups?.includes(vatGroup.id)
      );
    });
    if (vatGroupForCountry) {
      selectedCountryVatGroups[country.code] = vatGroupForCountry.id;
    }
  });

  // here we use precalculated value to initialize the state
  const [selectedVatGroups, setSelectedVatGroups] =
    useState<ICountryVatGroupMap>(selectedCountryVatGroups || {});

  console.log("selectedVatGroups", selectedVatGroups);

  const [snackbar, setSnackbar] = useSnackbarState();

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar(null);
  };

  return (
    <EditorCard>
      <Typography variant="h6">Vat groups</Typography>
      <Box mt={2}>
        <FormControl fullWidth>
          <Stack spacing={2}>
            {countries?.map((country: ICountry) => {
              const vatGroupsForCountry = vatGroups.filter(
                (vatGroup: IVatGroup) => {
                  return vatGroup.country === country.code;
                }
              );
              return (
                <FormControl fullWidth key={country.code}>
                  <FormLabel>{country.name}</FormLabel>
                  <RadioGroup
                    aria-label="vat-group"
                    name="vat-group"
                    value={selectedVatGroups[country.code] || ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const id = Number(event.target.value);
                      const newState: ICountryVatGroupMap = {
                        ...selectedVatGroups,
                        [country.code]: id,
                      };
                      setSelectedVatGroups(newState);

                      // update the main ProductType state
                      // flatten the "newState" object into an array of ids
                      const vatGroupIds = Object.values(newState);
                      setState({
                        ...state,
                        vat_groups: vatGroupIds,
                      });
                    }}
                  >
                    {vatGroupsForCountry.map((vatGroup: IVatGroup) => {
                      return (
                        <FormControlLabel
                          key={vatGroup.id}
                          value={vatGroup.id}
                          control={<Radio />}
                          label={`${vatGroup.name} (${vatGroup.rate}%)`}
                        />
                      );
                    })}
                  </RadioGroup>
                </FormControl>
              );
            })}
          </Stack>
          {snackbar ? (
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleSnackbarClose}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          ) : null}
        </FormControl>
      </Box>
    </EditorCard>
  );
};

export default ProductTypeVatGroup;
