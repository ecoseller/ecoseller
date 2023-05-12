import { useState } from "react";

/**
 * Returns snackbar state together with set function
 */
export function useSnackbarState()
{
  return useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  } | null>(null);
}