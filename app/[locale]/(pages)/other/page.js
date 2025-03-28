"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function pdf() {
  const [numPages, setNumPages] = useState(null);
  const [pages, setPages] = useState([]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPages(
      Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          style={{ display: "block" }}
        />
      ))
    );
  }

  return (
    <div
      style={{
        height: "500px",
        overflow: "auto",
      }}
    >
      <Document
        file="/pdf/Catalog_PM6_2025 PDF.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {pages}
      </Document>
    </div>
  );
}

export default pdf;