import { PDFDocument } from "pdf-lib";

export const getMetadata = async (fileObject) => {
  const metadata = {
    fileType: fileObject.ContentType,
    fileSize: fileObject.ContentLength,
  };

  // check file type and extract metadata
  if (metadata.fileType === "application/pdf") {
    const pdfDoc = await PDFDocument.load(
      await fileObject.Body.transformToByteArray()
    );
    metadata.pdfPageCount = pdfDoc.getPageCount();
  }

  return metadata;
};
