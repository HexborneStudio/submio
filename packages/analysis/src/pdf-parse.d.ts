declare module "pdf-parse" {
  interface PdfParseData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown> | null;
    text: string;
    version: string;
  }

  interface PdfParseOptions {
    pagerender?: (pageData: { getTextContent: () => Promise<unknown> }) => Promise<string>;
    max?: number;
    version?: string;
  }

  function pdfParse(
    dataBuffer: Buffer | ArrayBuffer,
    options?: PdfParseOptions
  ): Promise<PdfParseData>;

  export = pdfParse;
}
