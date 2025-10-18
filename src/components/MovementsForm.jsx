import { useState } from "react";
import axios from "axios";

export default function AddMovementForm() {
  const [formData, setFormData] = useState({
    date: "",
    type: "expense",
    category: "",
    ownerId: "",
    isShop: false,
    isCustomer: false,
    userId: "",
    amount: "",
    comment: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const owners = [
    { name: "Abraam", id: "68de712e171dfa43b5550e75" },
    { name: "Peter", id: "68de7171171dfa43b5550e77" },
    { name: "Tomas", id: "68de71dc171dfa43b5550e79" },
  ];

  const users = [
    { name: "Abraam", id: "68de712e171dfa43b5550e75" },
    { name: "Peter", id: "68de7171171dfa43b5550e77" },
    { name: "Tomas", id: "68de71dc171dfa43b5550e79" },
    { name: "Mena", id: "68de721b171dfa43b5550e7b" },
    { name: "Saif", id: "68de7244171dfa43b5550e7d" },
    { name: "Mena Morid", id: "68dec11622d4f491df224107" },
    { name: "Fol", id: "68dec14022d4f491df22412d" },
    { name: "Yasmin", id: "68e38218aadb41ef5da0f461" },
  ];

  const expenseCategories = [
    "salary",
    "food and coffee",
    "papers",
    "ink",
    "maintenance",
    "rent",
    "internet",
    "electricity",
    "water",
    "new machine",
    "transportations",
    "shop",
    "motaheda",
    "clothing",
    "other",
  ];

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    if (inputType === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate category only if expense
    if (
      formData.type === "expense" &&
      !expenseCategories.includes(formData.category)
    ) {
      setMessage("❌ Error: Please select a valid category for expense");
      setLoading(false);
      return;
    }

    try {
      // تحويل التاريخ من "YYYY-MM-DD" إلى "DD/MM/YYYY"
      const [year, month, day] = formData.date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const payload = {
        ...formData,
        date: formattedDate,
        amount: Number(formData.amount), // مهم: تحويل الرقم
        category: formData.type === "expense" ? formData.category : undefined,
      };

      const res = await axios.post("http://localhost:8000/movements", payload);
      if (res.status !== 200 && res.status !== 201)
        throw new Error("Failed to add movement");

      setMessage("✅ Movement added successfully!");
      setFormData({
        date: "",
        type: "expense",
        category: "",
        ownerId: "",
        isShop: false,
        isCustomer: false,
        userId: "",
        amount: "",
        comment: "",
      });
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const categoriesList = formData.type === "expense" ? expenseCategories : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add New Movement</h2>

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
          <label style={styles.label}>Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {formData.type === "expense" && (
          <div>
            <label style={styles.label}>Category:</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select Category</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label style={styles.label}>Owner:</label>
          <select
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Select Owner</option>
            {owners.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>
            <input
              type="checkbox"
              name="isShop"
              checked={formData.isShop}
              onChange={handleChange}
            />{" "}
            Is Shop
          </label>
        </div>

        <div>
          <label style={styles.label}>
            <input
              type="checkbox"
              name="isCustomer"
              checked={formData.isCustomer}
              onChange={handleChange}
            />{" "}
            Is Customer
          </label>
        </div>

        <div>
          <label style={styles.label}>User:</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Select User (optional)</option>
            {users.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Amount:</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            style={styles.input}
            required
          />
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
          {loading ? "Adding..." : "Add Movement"}
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
    maxWidth: "450px",
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
