import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UsersCards() {
  const [users, setUsers] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:8000/users?month=${month}&year=${year}`;
      const res = await axios.get(url);
      setUsers(res.data);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  const handleDeleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  if (!users || users.length === 0) {
    return <p style={{ textAlign: "center" }}>No users found</p>;
  }

  const owners = users.filter((u) => u.role === "owner");
  const employees = users.filter((u) => u.role === "employee");
  const customers = users.filter((u) => u.role === "customer");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>All Users</h2>

      {/* Filters */}
      <div style={styles.filters}>
        <div>
          <label style={styles.label}>Month:</label>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={styles.select}
          >
            <option value="">Select Month</option>
            {[...Array(12).keys()].map((m) => (
              <option key={m + 1} value={m + 1}>
                {new Date(0, m).toLocaleString("en-US", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={styles.select}
          >
            <option value="">Select Year</option>
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button onClick={loadData} style={styles.button}>
          🔄 Refresh
        </button>
      </div>

      <Section
        title="🏢 Owners"
        color="#007bff"
        users={owners}
        onDelete={handleDeleteUser}
      />
      <Section
        title="👔 Employees"
        color="#28a745"
        users={employees}
        onDelete={handleDeleteUser}
      />
      <Section
        title="🧾 Customers"
        color="#ff9800"
        users={customers}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}

function Section({ title, color, users, onDelete }) {
  if (!users.length) return null;
  return (
    <div style={{ marginBottom: "40px" }}>
      <h3 style={{ ...styles.sectionTitle, color }}>{title}</h3>
      <div style={styles.grid}>
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            color={color}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

function UserCard({ user, color, onDelete }) {
  const handleDelete = async () => {
    if (!window.confirm(`هل أنت متأكد من حذف ${user.firstName}?`)) return;

    try {
      await axios.delete(`http://localhost:8000/users/${user._id}`);
      onDelete(user._id);
    } catch (err) {
      alert("فشل الحذف: " + err.message);
    }
  };

  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <h3 style={styles.name}>
        {user.firstName} {user.lastName || ""}
      </h3>
      <p style={{ ...styles.role, color }}>{user.role.toUpperCase()}</p>

      {user.mobile && user.mobile.length > 0 && (
        <p style={styles.mobile}>📞 {user.mobile.join(", ")}</p>
      )}

      {user.employeeName && (
        <p style={styles.text}>👔 Employee: {user.employeeName}</p>
      )}

      {user.employeePercentage != null && (
        <p style={styles.text}>
          💰 Commission %: {user.employeePercentage * 100}%
        </p>
      )}

      <div style={styles.section}>
        <h4 style={{ ...styles.subTitle, color }}>Totals</h4>
        {renderTotals(user.totals, user.role)}
      </div>

      <button onClick={handleDelete} style={styles.deleteButton}>
        🗑 Delete
      </button>
    </div>
  );
}

function renderTotals(totals, role) {
  if (!totals) return <p style={{ color: "#777" }}>No totals</p>;

  let items = [];

  if (role === "owner") {
    items = [
      ["Shifts", totals.shifts, 0],
      ["Overtime", totals.overtime, 0],
      ["Holidays Shifts", totals.holidaysShifts, 0],
      ["Holidays Overtime", totals.holidaysOvertime, 0],
      ["Shifts Cost", totals.shiftsCost, 2, "EGP"],
      ["Overtime Cost", totals.overtimeCost, 2, "EGP"],
      ["Holidays Shifts Cost", totals.holidaysShiftsCost, 2, "EGP"],
      ["Holidays Overtime Cost", totals.holidaysOvertimeCost, 2, "EGP"],
      ["Salary", totals.salary, 2, "EGP"],
      ["Commission", totals.commission, 2, "EGP"],
      ["Total Salary", totals.totalSalary, 2, "EGP"],
      ["Paid", totals.paid, 2, "EGP"],
      ["Difference", totals.difference, 2, "EGP"],
      ["Expenses", totals.expenses, 2, "EGP"],
      ["Income", totals.income, 2, "EGP"],
      ["Profit", totals.profit, 2, "EGP"],
    ];
  } else if (role === "employee") {
    items = [
      ["Shifts", totals.shifts, 0],
      ["Overtime", totals.overtime, 0],
      ["Holidays Shifts", totals.holidaysShifts, 0],
      ["Holidays Overtime", totals.holidaysOvertime, 0],
      ["Shifts Cost", totals.shiftsCost, 2, "EGP"],
      ["Overtime Cost", totals.overtimeCost, 2, "EGP"],
      ["Holidays Shifts Cost", totals.holidaysShiftsCost, 2, "EGP"],
      ["Holidays Overtime Cost", totals.holidaysOvertimeCost, 2, "EGP"],
      ["Salary", totals.salary, 2, "EGP"],
      ["Commission", totals.commission, 2, "EGP"],
      ["Paid", totals.paid, 2, "EGP"],
      ["Difference", totals.difference, 2, "EGP"],
    ];
  } else if (role === "customer") {
    items = [
      ["Expected Paid", totals.totalExpectedPaid, 2, "EGP"],
      ["Actual Paid", totals.totalActualPaid, 2, "EGP"],
      ["Difference", totals.difference, 2, "EGP"],
      ["Total Papers", totals.totalPapers, 0],
      ["Papers Cost", totals.totalPapersCost, 2, "EGP"],
      ["Papers Sales", totals.totalPapersSales, 2, "EGP"],
      ["Total Profit", totals.totalProfit, 2, "EGP"],
      ["Employee Commission", totals.employeeCommission, 2, "EGP"],
      ["Net Profit", totals.netProfit, 2, "EGP"],
    ];
  }

  const formatNumber = (value, decimals = 2, unit = "") => {
    if (value === undefined || value === null || isNaN(value)) return "-";
    const formatted = Number(value).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return unit ? `${formatted} ${unit}` : formatted;
  };

  return (
    <ul style={styles.list}>
      {items.map(([label, value, decimals, unit]) => (
        <li
          key={label}
          style={{
            ...styles.listItem,
            color:
              label.toLowerCase().includes("profit") && Number(value) < 0
                ? "red"
                : label.toLowerCase().includes("profit") && Number(value) > 0
                ? "green"
                : "#555",
          }}
        >
          <b>{label}:</b> {formatNumber(value, decimals, unit)}
        </li>
      ))}
    </ul>
  );
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f4f6f8",
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "25px",
    fontSize: "32px", // زودت من 26px
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
  },
  label: {
    marginRight: "8px",
    fontWeight: "bold",
    color: "#333",
    fontSize: "16px", // زودت من 14px
  },
  select: {
    padding: "8px 12px", // زودت البادينج
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px", // زودت من 14px
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "10px 16px", // زودت
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px", // زودت من 14px
  },
  sectionTitle: {
    marginBottom: "15px",
    fontSize: "25px", // زودت من 20px
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "25px", // زودت البادينج
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  name: {
    fontSize: "25px", // زودت من 18px
    fontWeight: "bold",
    marginBottom: "6px",
  },
  role: {
    fontSize: "20px", // زودت من 14px
    fontWeight: "bold",
    marginBottom: "12px",
  },
  mobile: { fontSize: "16px", color: "#333", marginBottom: "10px" },
  text: { fontSize: "20px", color: "#444", margin: "5px 0" },
  section: {
    marginTop: "12px",
    paddingTop: "10px",
    borderTop: "1px solid #ddd",
  },
  list: { listStyle: "none", padding: 0, margin: 0 },
  listItem: { fontSize: "20px", color: "#555", marginBottom: "5px" },
  deleteButton: {
    marginTop: "12px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 14px", // زودت
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "20px", // زودت
  },
};
