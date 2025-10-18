import { useState } from "react";
import axios from "axios";

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: [""],
    password: "",
    role: "customer",
    employeeId: "",
    employeePercentage: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // قائمة الموظفين
  const employees = [
    { name: "Abraam", id: "68de712e171dfa43b5550e75" },
    { name: "Peter", id: "68de7171171dfa43b5550e77" },
    { name: "Tomas", id: "68de71dc171dfa43b5550e79" },
    { name: "Mena", id: "68de721b171dfa43b5550e7b" },
    { name: "Saif", id: "68de7244171dfa43b5550e7d" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      setFormData((prev) => ({
        ...prev,
        mobile: [value],
      }));
    } else if (name === "employeePercentage") {
      setFormData((prev) => ({
        ...prev,
        employeePercentage: value === "" ? "" : parseFloat(value), // تحول للرقم
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:8000/users", formData);

      if (res.status !== 200 && res.status !== 201)
        throw new Error("Failed to add user");

      setMessage("✅ User added successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        mobile: [""],
        password: "",
        role: "customer",
        employeeId: "",
        employeePercentage: "",
      });
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New User</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>First Name:</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div>
          <label style={styles.label}>Last Name:</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Mobile:</label>
          <input
            name="mobile"
            value={formData.mobile[0]}
            onChange={handleChange}
            style={styles.input}
            placeholder="01299999999"
            required
          />
        </div>

        <div>
          <label style={styles.label}>Password:</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div>
          <label style={styles.label}>Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="owner">Owner</option>
            <option value="employee">Employee</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {formData.role === "customer" && (
          <>
            <div>
              <label style={styles.label}>Assign Employee:</label>
              <select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Employee (optional)</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={styles.label}>Employee Percentage:</label>
              <input
                name="employeePercentage"
                type="number"
                step="0.01"
                value={formData.employeePercentage}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. 0.1"
              />
            </div>
          </>
        )}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>

      {message && (
        <div
          style={{
            ...styles.message,
            color: message.startsWith("✅") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "40px auto",
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    display: "block",
    fontWeight: "500",
    color: "#555",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  message: {
    textAlign: "center",
    marginTop: "15px",
    fontWeight: "500",
  },
};
