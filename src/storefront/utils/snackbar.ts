import { useState } from "react";

/**
 * Interface for snackbar content
 */
export interface ISnackbarData {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

/**
 * Returns snackbar state together with set function
 */
export function useSnackbarState() {
  return useState<ISnackbarData | null>(null);
}

/**
 * General error snackbar data containing "Something went wrong" message
 */
export const generalSnackbarError: ISnackbarData = {
  open: true,
  message: "Something went wrong",
  severity: "error",
};
