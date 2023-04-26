import { OutputData } from "@editorjs/editorjs";

export interface IDispatchWrapper {
  setTitle(language: string, title: string): void;
  setSlug(language: string, slug: string): void;
  setDescription(language: string, description: OutputData): void;
  setMetaDescription(language: string, metaDescription: string): void;
  setMetaTitle(language: string, metaTitle: string): void;
}
