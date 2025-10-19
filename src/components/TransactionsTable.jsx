import React, { useEffect, useState } from "react";
import axios from "axios";

const TransactionsCards = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState("");
  const [deletingIds, setDeletingIds] = useState([]); // لمتابعة الحذف

  const customers = [
    { id: "68dec11622d4f491df224107", name: "Mena Morid" },
    { id: "68dec14022d4f491df22412d", name: "Fol" },
    { id: "68e38218aadb41ef5da0f461", name: "Yasmin" },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/transactions`;
      if (customerId) url += `?customerId=${customerId}`;
      const res = await axios.get(url);
      setTransactions(res.data);
    } catch (err) {
      console.error("Error loading transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customerId]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه العملية؟")) return;
    try {
      setDeletingIds((prev) => [...prev, id]);
      await axios.delete(`http://localhost:8000/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("فشل الحذف: " + err.message);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  // 🔹 Group by date
  const groupedByDate = transactions.reduce((acc, t) => {
    const date = t.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {});

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "24px",
          border: "1px solid #e0e7ff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "30px",
            fontWeight: "bold",
            color: "#4338ca",
            marginBottom: "24px",
          }}
        >
          Transactions
        </h2>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button onClick={loadData} style={buttonStyle}>
            🔄 Reload
          </button>
        </div>

        {/* Cards */}
        {loading ? (
          <p style={loadingStyle}>Loading transactions...</p>
        ) : Object.keys(groupedByDate).length > 0 ? (
          Object.entries(groupedByDate).map(([date, dailyTransactions]) => (
            <div key={date} style={{ marginBottom: "32px" }}>
              {/* 🗓️ Day header */}
              <h3
                style={{
                  fontSize: "26px",
                  fontWeight: "bold",
                  color: "#1e3a8a",
                  borderBottom: "2px solid #e0e7ff",
                  marginBottom: "16px",
                  paddingBottom: "4px",
                }}
              >
                {date}
              </h3>

              {/* Daily cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "20px",
                }}
              >
                {dailyTransactions.map((t) => (
                  <div key={t._id} style={cardStyle}>
                    <div style={cardHeader}>
                      <span style={{ fontWeight: "600", color: "#4338ca" }}>
                        {t.dayOfWeek}
                      </span>
                      <span
                        style={{
                          background: "#e0e7ff",
                          color: "#4338ca",
                          padding: "2px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                      <strong>Customer:</strong> {t.customerName}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Employee:</strong> {t.employeeName} (
                      {t.employeePercentage * 100}%)
                    </div>

                    <div style={divider}></div>

                    <div style={infoRow}>
                      <div>
                        <strong>Paper:</strong> {t.numberOfPapers} (
                        {t.paperType})
                      </div>
                      <div>
                        <strong>Cost:</strong> {t.totalCost} EGP
                      </div>
                    </div>

                    <div style={infoRow}>
                      <div>
                        <strong>Sales:</strong> {t.totalPapersSales} EGP
                      </div>
                      <div>
                        <strong>Expected Paid:</strong>{" "}
                        <span style={{ color: "#16a34a", fontWeight: "600" }}>
                          {t.expectedPaid} EGP
                        </span>
                      </div>
                    </div>

                    {t.comment && (
                      <div
                        style={{
                          marginTop: "8px",
                          padding: "6px 8px",
                          background: "#f9fafb",
                          borderRadius: "6px",
                          fontStyle: "italic",
                          color: "#555",
                        }}
                      >
                        💬 {t.comment}
                      </div>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(t._id)}
                      disabled={deletingIds.includes(t._id)}
                      style={{ ...deleteButtonStyle, marginTop: "auto" }} // هذا هو المهم
                    >
                      {deletingIds.includes(t._id) ? "Deleting..." : "🗑 Delete"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p style={noDataStyle}>No transactions found</p>
        )}
      </div>
    </div>
  );
};

// 🎨 Styles
const selectStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
};

const buttonStyle = {
  background: "#4f46e5",
  color: "white",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
};

const divider = {
  height: "1px",
  background: "#e5e7eb",
  margin: "10px 0",
};

const noDataStyle = {
  textAlign: "center",
  padding: "16px",
  color: "#9ca3af",
  fontStyle: "italic",
};

const loadingStyle = {
  textAlign: "center",
  color: "#6b7280",
  fontStyle: "italic",
};

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  padding: "24px",
  border: "1px solid #e5e7eb",
  fontSize: "16px",
  lineHeight: "1.6",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  minHeight: "220px", // ارتفاع افتراضي للكارت
};

const cardHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px", // بدل 12px
  fontSize: "18px",
  fontWeight: "600",
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px", // بدل 6px
  fontSize: "16px",
};

const deleteButtonStyle = {
  marginTop: "14px", // بدل 10px
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "10px 16px", // بدل 6px 12px
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

export default TransactionsCards;
