import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceLogsTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(10);
  const [year, setYear] = useState(2025);
  const [userId, setUserId] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);

  const employees = [
    { name: "All Employees", id: "" },
    { name: "Abraam", id: "68de712e171dfa43b5550e75" },
    { name: "Peter", id: "68de7171171dfa43b5550e77" },
    { name: "Tomas", id: "68de71dc171dfa43b5550e79" },
    { name: "Mena", id: "68de721b171dfa43b5550e7b" },
    { name: "Saif", id: "68de7244171dfa43b5550e7d" },
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:8000/attendance-logs?month=${month}&year=${year}`;
      if (userId) url += `&userId=${userId}`;
      const res = await axios.get(url);
      setLogs(res.data);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year, userId]);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا السجل؟")) return;
    try {
      setDeletingIds((prev) => [...prev, id]);
      await axios.delete(`http://localhost:8000/attendance-logs/${id}`);
      setLogs((prev) => prev.filter((log) => log._id !== id));
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
          maxWidth: "1100px",
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
            fontSize: "24px",
            fontWeight: "bold",
            color: "#4338ca",
            marginBottom: "24px",
          }}
        >
          Attendance Logs
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
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={selectStyle}
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
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

          <button onClick={loadData} style={buttonStyle}>
            🔄 Reload
          </button>
        </div>

        {loading ? (
          <p style={loadingStyle}>Loading attendance logs...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead style={{ background: "#e0e7ff", color: "#4338ca" }}>
                <tr>
                  <th style={thStyle}>User Name</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Day</th>
                  <th style={thStyle}>Time</th>
                  <th style={thStyle}>Work Type</th>
                  <th style={thStyle}>Holiday</th>
                  <th style={thStyle}>Comment</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log._id} style={{ textAlign: "center" }}>
                      <td style={tdStyle}>{log.userName}</td>
                      <td style={tdStyle}>{log.date}</td>
                      <td style={tdStyle}>{log.dayOfWeek}</td>
                      <td style={tdStyle}>{log.time}</td>
                      <td style={{ ...tdStyle, color: "#4f46e5" }}>
                        {log.workType}
                      </td>
                      <td
                        style={{
                          ...tdStyle,
                          color: log.isHoliday ? "green" : "#6b7280",
                          fontWeight: "bold",
                        }}
                      >
                        {log.isHoliday ? "✅ Yes" : "❌ No"}
                      </td>
                      <td style={{ ...tdStyle, fontStyle: "italic" }}>
                        {log.comment || "-"}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleDelete(log._id)}
                          disabled={deletingIds.includes(log._id)}
                          style={deleteButtonStyle}
                        >
                          {deletingIds.includes(log._id)
                            ? "Deleting..."
                            : "🗑 Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={noDataStyle}>
                      No attendance logs found
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

// 💅 Styles
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
  padding: "10px",
  border: "1px solid #ddd",
  fontWeight: "600",
};

const tdStyle = {
  padding: "8px",
  border: "1px solid #ddd",
};

const deleteButtonStyle = {
  backgroundColor: "#dc3545",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
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

export default AttendanceLogsTable;
