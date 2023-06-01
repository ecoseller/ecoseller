import { OutputData } from "@editorjs/editorjs";

export interface IDispatchWrapper {
  setTitle?: (language: string, title: string) => void;
  setName?: (language: string, name: string) => void;
  setSlug?: (language: string, slug: string) => void;
  setDescription?: (language: string, description: OutputData) => void;
  setDescriptionPlain?: (language: string, description: string) => void;
  setMetaDescription?: (language: string, metaDescription: string) => void;
  setMetaTitle?: (language: string, metaTitle: string) => void;
}
