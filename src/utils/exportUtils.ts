
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Helper function to convert data to CSV format
export const convertToCSV = <T extends Record<string, any>>(
  data: T[],
  columns: { accessor: string; header: string }[]
): string => {
  // Create header row
  const headerRow = columns.map((col) => col.header).join(",");
  
  // Create data rows
  const dataRows = data.map((item) => {
    return columns
      .map((col) => {
        // Handle special cases like formatted dates
        const value = item[col.accessor];
        
        // Format the value and handle commas for CSV
        let formattedValue = value !== null && value !== undefined ? String(value) : "";
        
        // If the value has commas, quotes, or newlines, wrap it in quotes
        if (formattedValue.includes(",") || formattedValue.includes('"') || formattedValue.includes("\n")) {
          // Double any quotes within the value
          formattedValue = formattedValue.replace(/"/g, '""');
          // Wrap in quotes
          formattedValue = `"${formattedValue}"`;
        }
        
        return formattedValue;
      })
      .join(",");
  }).join("\n");
  
  return `${headerRow}\n${dataRows}`;
};

// Helper function to download CSV data
export const downloadCSV = (csvData: string, filename: string): void => {
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  // Create a downloadable link
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to generate and download PDF
export const downloadPDF = <T extends Record<string, any>>(
  data: T[],
  columns: { accessor: string; header: string }[],
  title: string,
  filename: string
): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Prepare data for autoTable
  const headers = columns.map((col) => col.header);
  const dataRows = data.map((item) => 
    columns.map((col) => {
      const value = item[col.accessor];
      // Format date if the value is a valid date string
      if (col.accessor === "created_at" && value) {
        try {
          return new Date(value).toLocaleDateString('pt-BR');
        } catch (e) {
          return String(value || "");
        }
      }
      return String(value !== null && value !== undefined ? value : "");
    })
  );
  
  // Add table
  autoTable(doc, {
    head: [headers],
    body: dataRows,
    startY: 25,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Save document
  doc.save(filename);
};
