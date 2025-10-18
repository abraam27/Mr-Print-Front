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
      <div style={{ padding: 20 }}>
        <nav
          style={{
            marginBottom: 20,
            display: "flex",
            gap: "20px",
            borderBottom: "1px solid #ddd",
            paddingBottom: 10,
          }}
        >
          <Link to="/">🏠 Home</Link>
          <Link to="/create-user">👥 Add User</Link>
          <Link to="/users">👥 Users</Link>
          <Link to="/create-attendance-log">👥 Add Attendance Log</Link>
          <Link to="/attendance-logs">👥 Attendance Logs</Link>
          <Link to="/create-movement">💰 Add Movement</Link>
          <Link to="/movements">💰 Movements</Link>
          <Link to="/create-transaction">💰 Add Transaction</Link>
          <Link to="/transactions">💰 Transactions</Link>
          <Link to="/report">💰 Report</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h2>Welcome to Dashboard</h2>} />
          <Route path="/create-user" element={<UsersForm />} />
          <Route path="/users" element={<UsersTable />} />
          <Route
            path="/create-attendance-log"
            element={<AttendanceLogsForm />}
          />
          <Route path="/attendance-logs" element={<AttendanceLogsTable />} />
          <Route path="/create-movement" element={<MovementsForm />} />
          <Route path="/movements" element={<MovementsTable />} />
          <Route path="/create-transaction" element={<TransactionsForm />} />
          <Route path="/transactions" element={<TransactionsTable />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </div>
    </Router>
  );
}
