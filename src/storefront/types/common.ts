export type HTTPMETHOD = "GET" | "POST" | "PUT" | "DELETE";

export interface IValidatedInputField {
  value: string;
  isValid?: boolean;
  setter: (value: string) => void;
  setIsValid?: (value: boolean) => void;
  validator?: (value: string) => boolean;
  isRequired?: boolean;
  errorMessage?: string;
  label?: string;
}
