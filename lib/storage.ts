export type StorageKind = "doc" | "sheet" | "image" | "pdf" | "slide";

export type StorageSummary = {
  documentsKb: number;
  imagesKb: number;
  totalKb: number;
};

export function summarizeStorage(files: Array<{ kind: StorageKind; sizeKb: number }>): StorageSummary {
  const documentsKb = files.reduce((total, file) => {
    if (file.kind === "doc" || file.kind === "pdf" || file.kind === "sheet" || file.kind === "slide") {
      return total + file.sizeKb;
    }
    return total;
  }, 0);

  const imagesKb = files.reduce((total, file) => {
    if (file.kind === "image") {
      return total + file.sizeKb;
    }
    return total;
  }, 0);

  return {
    documentsKb,
    imagesKb,
    totalKb: documentsKb + imagesKb,
  };
}
