import { useState } from "react";
import axios from "axios";

export default function AddTransactionForm() {
  const [formData, setFormData] = useState({
    date: "",
    customerId: "",
    numberOfPapers: "",
    paperType: "A4",
    paperSales: "",
    expectedPaid: "",
    status: "pending",
    comment: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const customers = [
    { name: "Mena Morid", id: "68dec11622d4f491df224107" },
    { name: "Fol", id: "68dec14022d4f491df22412d" },
    { name: "Yasmin", id: "68e38218aadb41ef5da0f461" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const [year, month, day] = formData.date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const payload = {
        ...formData,
        date: formattedDate,
        numberOfPapers: Number(formData.numberOfPapers),
        paperSales: Number(formData.paperSales),
        expectedPaid: formData.expectedPaid
          ? Number(formData.expectedPaid)
          : undefined,
      };

      const res = await axios.post(
        "http://localhost:8000/transactions",
        payload
      );

      setMessage("✅ Transaction added successfully!");
      setFormData({
        date: "",
        customerId: "",
        numberOfPapers: "",
        paperType: "A4",
        paperSales: "",
        expectedPaid: "",
        status: "pending",
        comment: "",
      });
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Transaction</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div>
          <label style={styles.label}>Customer:</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Number of Papers:</label>
          <input
            type="number"
            name="numberOfPapers"
            value={formData.numberOfPapers}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div>
          <label style={styles.label}>Paper Type:</label>
          <select
            name="paperType"
            value={formData.paperType}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Paper Sales (per paper):</label>
          <input
            type="number"
            name="paperSales"
            value={formData.paperSales}
            onChange={handleChange}
            style={styles.input}
            step="0.01"
            required
          />
        </div>

        <div>
          <label style={styles.label}>Expected Paid (optional):</label>
          <input
            type="number"
            name="expectedPaid"
            value={formData.expectedPaid}
            onChange={handleChange}
            style={styles.input}
            step="0.01"
          />
        </div>

        <div>
          <label style={styles.label}>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="finished">Finished</option>
            <option value="cancelled">Cancelled</option>
            <option value="received">Received</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Comment:</label>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Adding..." : "Add Transaction"}
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
    maxWidth: "550px",       // أكبر شوي
    margin: "40px auto",
    background: "#fff",
    padding: "30px",         // زيادة البادينج
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "26px",        // تكبير العنوان
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",             // مسافة أكبر بين الحقول
  },
  label: {
    display: "block",
    fontWeight: "600",
    color: "#555",
    marginBottom: "6px",
    fontSize: "15px",        // تكبير النص
  },
  input: {
    width: "100%",
    padding: "10px 12px",    // تكبير البادينج
    borderRadius: "8px",     // حواف أكبر
    border: "1px solid #ccc",
    fontSize: "16px",        // تكبير النص
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",         // تكبير الزر
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "16px",        // تكبير نص الزر
    transition: "0.3s",
  },
  message: {
    textAlign: "center",
    marginTop: "18px",
    fontWeight: "600",
    fontSize: "15px",        // تكبير رسالة النجاح/الفشل
  },
};

