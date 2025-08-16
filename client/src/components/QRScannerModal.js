import React, { useEffect } from 'react';
import './QRScannerModal.css';
// This library is loaded from the CDN in index.html
const Html5QrcodeScanner = window.Html5QrcodeScanner;

const QRScannerModal = ({ onClose, onScanSuccess }) => {

  useEffect(() => {
    let scanner;

    function handleScanSuccess(decodedText, decodedResult) {
      // This function is called when a QR code is successfully scanned.
      console.log(`Scan result: ${decodedText}`, decodedResult);
      // Stop the scanner
      scanner.clear().catch(error => {
        console.error("Failed to clear scanner.", error);
      });
      // Pass the scanned text back to the parent component
      onScanSuccess(decodedText);
    }

    function handleScanError(errorMessage) {
      // This function is called for non-critical errors (e.g., no QR code found)
      // We can ignore it to prevent spamming the console.
    }

    // Create a new scanner instance
    scanner = new Html5QrcodeScanner(
      "qr-reader", // The ID of the div where the scanner will be rendered
      { fps: 10, qrbox: { width: 250, height: 250 } }, // Configuration options
      false // verbose = false
    );
    
    // Start the scanner
    scanner.render(handleScanSuccess, handleScanError);

    // Cleanup function: this is called when the component is unmounted
    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error("Failed to clear scanner on unmount.", error);
        });
      }
    };
  }, [onScanSuccess]); // Dependency array

  return (
    <div className="modal-overlay">
      <div className="modal-content qr-modal-content">
        <h2>Scan QR Code</h2>
        <p>Point your camera at a QR code to automatically add an expense.</p>
        <div id="qr-reader"></div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;