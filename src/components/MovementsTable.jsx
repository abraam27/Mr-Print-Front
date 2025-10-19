import React, { useEffect, useState } from "react";
import axios from "axios";

const MovementsTable = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2025);
  const [type, setType] = useState(""); // expense / income / all
  const [isCustomer, setIsCustomer] = useState(""); // true / false / all
  const [isShop, setIsShop] = useState(""); // true / false / all
  const [deletingIds, setDeletingIds] = useState([]); // لمتابعة الحذف

  const loadData = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/movements?month=${month}&year=${year}`;
      if (type) url += `&type=${type}`;
      if (isCustomer) url += `&isCustomer=${isCustomer}`;
      if (isShop) url += `&isShop=${isShop}`;

      const res = await axios.get(url);
      setMovements(res.data);
    } catch (err) {
      console.error("Error loading movements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year, type, isCustomer, isShop]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الحركة؟")) return;
    try {
      setDeletingIds((prev) => [...prev, id]);
      await axios.delete(`http://localhost:8000/movements/${id}`);
      setMovements((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("فشل الحذف: " + err.message);
    } finally {
      setDeletingIds((prev) => prev.filter((delId) => delId !== id));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #e0e7ff)",
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
          Movements
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
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={selectStyle}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Month {i + 1}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={selectStyle}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={isCustomer}
            onChange={(e) => setIsCustomer(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Customers</option>
            <option value="true">Customer</option>
            <option value="false">Not Customer</option>
          </select>

          <select
            value={isShop}
            onChange={(e) => setIsShop(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Shops</option>
            <option value="true">Shop</option>
            <option value="false">Not Shop</option>
          </select>

          <button onClick={loadData} style={buttonStyle}>
            🔄 Reload
          </button>
        </div>

        {loading ? (
          <p style={loadingStyle}>Loading movements...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead style={{ background: "#e0e7ff", color: "#4338ca" }}>
                <tr>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Day</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Owner</th>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Shop</th>
                  <th style={thStyle}>Comment</th>
                  <th style={thStyle}>Actions</th> {/* Column for Delete */}
                </tr>
              </thead>
              <tbody>
                {movements.length > 0 ? (
                  movements.map((m) => (
                    <tr key={m._id} style={{ textAlign: "center" }}>
                      <td style={tdStyle}>{m.date}</td>
                      <td style={tdStyle}>{m.dayOfWeek}</td>
                      <td
                        style={{
                          ...tdStyle,
                          color: m.type === "expense" ? "red" : "green",
                          fontWeight: "600",
                        }}
                      >
                        {m.type}
                      </td>
                      <td style={tdStyle}>{m.category}</td>
                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: "bold",
                          color: m.type === "expense" ? "#dc2626" : "#16a34a",
                        }}
                      >
                        {m.amount} EGP
                      </td>
                      <td style={tdStyle}>{m.ownerName || "-"}</td>
                      <td style={tdStyle}>{m.userName || "-"}</td>
                      <td style={tdStyle}>{m.isShop ? "✔️" : "❌"}</td>
                      <td style={tdStyle}>{m.comment || "-"}</td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDelete(m._id)}
                          disabled={deletingIds.includes(m._id)}
                          style={deleteButtonStyle}
                        >
                          {deletingIds.includes(m._id)
                            ? "Deleting..."
                            : "🗑 Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={noDataStyle}>
                      No movements found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
};

const thStyle = {
  padding: "14px 12px", // زيادة البادينج
  border: "1px solid #ddd",
  fontWeight: "700",
  fontSize: "20px", // تكبير الخط
  textAlign: "center",
};

const tdStyle = {
  padding: "12px 10px", // زيادة البادينج
  border: "1px solid #ddd",
  fontSize: "18px", // تكبير الخط
  textAlign: "center",
};

const deleteButtonStyle = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "8px 14px", // زيادة البادينج
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px", // تكبير الخط
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

export default MovementsTable;
