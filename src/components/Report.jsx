import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const loadData = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:8000/report?month=${month}&year=${year}`;
      const res = await axios.get(url);
      setReport(res.data);
    } catch (err) {
      console.error("Error loading report:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  if (loading)
    return (
      <div style={centerBox}>
        <p style={{ color: "#6b7280", fontStyle: "italic" }}>
          Loading report...
        </p>
      </div>
    );

  if (!report)
    return (
      <div style={centerBox}>
        <p style={{ color: "#9ca3af" }}>No report data found.</p>
      </div>
    );

  const expenseEntries = Object.entries(report.expensesSummary || {});

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
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#4338ca",
            marginBottom: "24px",
          }}
        >
          Monthly Report
        </h2>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={selectStyle}
          >
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {new Date(0, m).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={selectStyle}
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button onClick={loadData} style={buttonStyle}>
            🔄 Reload
          </button>
        </div>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {renderCard("Total Customers In", report.totalCustomersIn, "#6366f1")}
          {renderCard("Total Shop In", report.totalShopIn, "#6366f1")}
          {renderCard("Total Income", report.totalIncome, "#16a34a")}
          {renderCard("Total Expenses", report.totalExpenses, "#dc2626")}
          {renderCard("Expected Paid", report.expectedPaid, "#4f46e5")}
          {renderCard("Paid Difference", report.paidDifference, "#f59e0b")}
          {renderCard(
            "Expected Difference",
            report.expectedDifference,
            "#f97316"
          )}
          {renderCard("Gross Profit", report.grossProfit, "#0ea5e9")}
          {renderCard("Given", report.given, "#9333ea")}
          {renderCard("Net Profit", report.netProfit, "#10b981")}
        </div>

        {/* Expenses Summary */}
        <div>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#1e3a8a",
              borderBottom: "2px solid #e0e7ff",
              marginBottom: "12px",
              paddingBottom: "4px",
            }}
          >
            Expenses Breakdown
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fafafa",
            }}
          >
            <thead>
              <tr style={{ background: "#e0e7ff" }}>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Amount (EGP)</th>
              </tr>
            </thead>
            <tbody>
              {expenseEntries.map(([key, val]) => (
                <tr key={key}>
                  <td style={tdStyle}>{key}</td>
                  <td style={{ ...tdStyle, color: "#dc2626" }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 🔹 Reusable Card Component
const renderCard = (title, value, color) => (
  <div
    style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      padding: "16px",
      borderLeft: `6px solid ${color}`,
    }}
  >
    <div style={{ color: "#6b7280", fontSize: "14px", marginBottom: "6px" }}>
      {title}
    </div>
    <div style={{ fontSize: "20px", fontWeight: "bold", color }}>{value}</div>
  </div>
);

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

const centerBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
};

const thStyle = {
  padding: "10px",
  textAlign: "left",
  fontWeight: "600",
  borderBottom: "1px solid #ddd",
};

const tdStyle = {
  padding: "8px 10px",
  borderBottom: "1px solid #eee",
};

export default ReportPage;
