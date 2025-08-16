import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';
import AddTransactionModal from '../components/AddTransactionModal';
import QRScannerModal from '../components/QRScannerModal';

const Transactions = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const fetchTransactions = () => {
    if (!userId) return;
    setIsLoading(true);
    axios.get(`http://127.0.0.1:5000/api/transactions?userId=${userId}`)
      .then(response => {
        setTransactions(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching transactions:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  const handleDelete = (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      axios.delete(`http://127.0.0.1:5000/api/transactions/${transactionId}`)
        .then(() => fetchTransactions())
        .catch(error => console.error("Error deleting transaction:", error));
    }
  };

  // This function is now upgraded to parse UPI QR code strings
  const handleScanSuccess = (scannedText) => {
    console.log("Handling scanned text:", scannedText);
    try {
      // Check if it's a UPI string
      if (scannedText.startsWith('upi://')) {
        const urlParams = new URLSearchParams(scannedText.split('?')[1]);
        const recipientName = urlParams.get('pn');
        const amount = urlParams.get('am');

        if (recipientName && amount) {
          setPrefillData({
            amount: parseFloat(amount).toFixed(2),
            description: decodeURIComponent(recipientName) // Decode URL-encoded name
          });
          setIsScanModalOpen(false);
          setIsAddModalOpen(true);
        } else {
          alert("UPI QR code is missing recipient name or amount.");
        }
      } else {
        // Fallback for simple number QR codes
        const amount = parseFloat(scannedText);
        if (!isNaN(amount)) {
          setPrefillData({ amount: amount.toFixed(2), description: "Scanned Expense" });
          setIsScanModalOpen(false);
          setIsAddModalOpen(true);
        } else {
          alert("Scanned QR code is not a valid UPI code or a simple number.");
        }
      }
    } catch (e) {
      console.error("Error parsing QR code:", e);
      alert("Could not parse data from QR code.");
    }
  };

  return (
    <main className="transactions-page">
      {isAddModalOpen && <AddTransactionModal 
        userId={userId}
        onClose={() => {
          setIsAddModalOpen(false);
          setPrefillData(null);
        }} 
        onTransactionAdded={fetchTransactions}
        initialData={prefillData}
      />}
      
      {isScanModalOpen && <QRScannerModal 
        onClose={() => setIsScanModalOpen(false)}
        onScanSuccess={handleScanSuccess}
      />}

      <header className="transactions-header">
        <h1>All Transactions</h1>
        <div className="header-buttons">
          <button className="scan-qr-btn" onClick={() => setIsScanModalOpen(true)}>Scan QR Code</button>
          <button className="add-transaction-btn" onClick={() => setIsAddModalOpen(true)}>
            Add New Transaction
          </button>
        </div>
      </header>
      
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <div className="transactions-table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th className="amount-header">Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>
                    <span className={transaction.amount > 0 ? 'income' : 'expense'}>
                      {transaction.amount > 0 ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                    </span>
                  </td>
                  <td>
                    <button className="btn-delete-transaction" onClick={() => handleDelete(transaction.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default Transactions;