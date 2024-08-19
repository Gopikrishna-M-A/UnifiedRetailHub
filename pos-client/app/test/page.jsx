'use client'
import React, { useCallback } from 'react';

const PrintPdfButton = () => {
  const handlePrint = useCallback(async () => {
    try {
      // Fetch the PDF from your API endpoint
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // You can pass any necessary data in the body
        body: JSON.stringify({ /* your data here */ }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }

      // Get the PDF as a Blob
      const pdfBlob = await response.blob();

      // Create a Blob URL
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      // Wait for the iframe to load
      iframe.onload = () => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      };

      // Clean up
      iframe.onafterprint = () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(pdfUrl);
      };
    } catch (error) {
      console.error('Error printing PDF:', error);
      alert('Failed to print receipt');
    }
  }, []);

  return (
    <button onClick={handlePrint}>Print Receipt</button>
  );
};

export default PrintPdfButton;