import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UsersTable from "./components/UsersTable";
import AttendanceLogsTable from "./components/AttendanceLogsTable";
import MovementsTable from "./components/MovementsTable";
import TransactionsTable from "./components/TransactionsTable";
import Report from "./components/Report";
import UsersForm from "./components/UsersForm";
import AttendanceLogsForm from "./components/AttendanceLogsForm";
import TransactionsForm from "./components/TransactionsForm";
import MovementsForm from "./components/MovementsForm";

export default function App() {
  return (
    <Router>
      <div style={styles.container}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Mr Print Dashboard</h2>
          <nav style={styles.nav}>
            <Link style={styles.navLink} to="/">
              🏠 Home
            </Link>
            <Link style={styles.navLink} to="/users">
              👥 Users
            </Link>
            <Link style={styles.navLink} to="/attendance-logs">
              📋 Attendance Logs
            </Link>
            <Link style={styles.navLink} to="/movements">
              💰 Movements
            </Link>
            <Link style={styles.navLink} to="/transactions">
              📝 Transactions
            </Link>
            <Link style={styles.navLink} to="/report">
              📊 Report
            </Link>
            <hr style={{ margin: "20px 0", borderColor: "#ccc" }} />
            <h3 style={{ marginLeft: 10 }}>Add New</h3>
            <Link style={styles.navLink} to="/create-user">
              ➕ Add User
            </Link>
            <Link style={styles.navLink} to="/create-attendance-log">
              ➕ Add Attendance Log
            </Link>
            <Link style={styles.navLink} to="/create-movement">
              ➕ Add Movement
            </Link>
            <Link style={styles.navLink} to="/create-transaction">
              ➕ Add Transaction
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main style={styles.main}>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <h2>Welcome to Mr Print Dashboard</h2>
                  <Report />
                  <div style={styles.quickButtons}>
                    <Link to="/users" style={styles.quickButton}>
                      👥 Users
                    </Link>
                    <Link to="/attendance-logs" style={styles.quickButton}>
                      📋 Attendance Logs
                    </Link>
                    <Link to="/movements" style={styles.quickButton}>
                      💰 Movements
                    </Link>
                    <Link to="/transactions" style={styles.quickButton}>
                      📝 Transactions
                    </Link>
                    <Link to="/create-user" style={styles.quickButton}>
                      ➕ Add User
                    </Link>
                    <Link to="/create-attendance-log" style={styles.quickButton}>
                      ➕ Add Attendance Log
                    </Link>
                    <Link to="/create-movement" style={styles.quickButton}>
                      ➕ Add Movement
                    </Link>
                    <Link to="/create-transaction" style={styles.quickButton}>
                      ➕ Add Transaction
                    </Link>
                  </div>
                </div>
              }
            />
            <Route path="/create-user" element={<UsersForm />} />
            <Route path="/users" element={<UsersTable />} />
            <Route path="/create-attendance-log" element={<AttendanceLogsForm />} />
            <Route path="/attendance-logs" element={<AttendanceLogsTable />} />
            <Route path="/create-movement" element={<MovementsForm />} />
            <Route path="/movements" element={<MovementsTable />} />
            <Route path="/create-transaction" element={<TransactionsForm />} />
            <Route path="/transactions" element={<TransactionsTable />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    background: "#f0f2f5",
  },
  sidebar: {
    width: 220,
    background: "#4f46e5",
    color: "#fff",
    padding: "20px 10px",
  },
  sidebarTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: 6,
    transition: "0.3s",
  },
  main: {
    flex: 1,
    padding: 30,
  },
  quickButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: 20,
  },
  quickButton: {
    background: "#4338ca",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: "bold",
  },
};
