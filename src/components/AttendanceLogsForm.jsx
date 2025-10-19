import { useState } from "react";
import axios from "axios";

export default function AddAttendanceLogForm() {
  const [formData, setFormData] = useState({
    date: "",
    time: "morning",
    workType: "shift",
    userId: "",
    comment: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const employees = [
    { name: "Abraam", id: "68de712e171dfa43b5550e75" },
    { name: "Peter", id: "68de7171171dfa43b5550e77" },
    { name: "Tomas", id: "68de71dc171dfa43b5550e79" },
    { name: "Mena", id: "68de721b171dfa43b5550e7b" },
    { name: "Saif", id: "68de7244171dfa43b5550e7d" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // تحويل التاريخ من "YYYY-MM-DD" إلى "DD/MM/YYYY"
      const [year, month, day] = formData.date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const payload = {
        ...formData,
        date: formattedDate,
      };

      const res = await axios.post(
        "http://localhost:8000/attendance-logs",
        payload
      );

      if (res.status !== 200 && res.status !== 201)
        throw new Error("Failed to add attendance log");

      setMessage("✅ Attendance log added successfully!");
      setFormData({
        date: "",
        time: "morning",
        workType: "shift",
        userId: "",
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
      <h2 style={styles.title}>Add Attendance Log</h2>

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
          <label style={styles.label}>Time:</label>
          <select
            name="time"
            value={formData.time}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
            <option value="midnight">Midnight</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Work Type:</label>
          <select
            name="workType"
            value={formData.workType}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="shift">Shift</option>
            <option value="overtime">Overtime</option>
          </select>
        </div>

        <div>
          <label style={styles.label}>Employee:</label>
          <select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            style={styles.select}
            required
          >
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Comment (optional):</label>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            style={styles.input}
            placeholder="Add a comment..."
          />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Adding..." : "Add Attendance Log"}
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
    maxWidth: "500px",      // أكبر من قبل
    margin: "40px auto",
    background: "#fff",
    padding: "30px",         // زيادة البادينج
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)", // ظل أعمق شوي
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "26px",       // تكبير العنوان
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "24px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",            // زيادة المسافة بين الحقول
  },
  label: {
    display: "block",
    fontWeight: "600",       // خط أثقل
    color: "#555",
    marginBottom: "6px",
    fontSize: "15px",       // تكبير النص
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
    padding: "10px 12px",    // تكبير البادينج
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",        // تكبير النص
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
