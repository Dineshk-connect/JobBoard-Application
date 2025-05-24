import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';



import Home from './pages/Home';
import BrowseJobs from './pages/Browse';
import Contact from './pages/Contact';
import EmployerDashboard from './pages/EmployerDashboard';
import EmployerProfile from './pages/EmployerProfile'; // Ensure this path is correct
import EmployerAuth from './pages/EmployerAuth';
import CandidateAuth from './pages/CandidateAuth';
import CandidateDashboard from './pages/CandidateDashboard';
import BrowseJobsSection from './pages/BrowseJobs';
import AppliedJobs from './components/AppliedJobs';
import EditCandidateProfile from './components/EditCandidateProfile';
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";





function App() {
  return (
    <Router>
      <Navbar bg="white" expand="lg" className="shadow-sm px-5">
  <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
    CareerHub
  </Navbar.Brand>
  <Navbar.Toggle aria-controls="navbarScroll" />
  <Navbar.Collapse id="navbarScroll">
    <Nav className="ms-auto my-2 my-lg-0 d-flex align-items-center" navbarScroll>
      <Nav.Link as={Link} to="/">Home</Nav.Link>
      <Nav.Link as={Link} to="/browse">BrowseJob</Nav.Link>
      <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

      <div className="d-flex gap-2 ms-3">
        <Button variant="outline-primary" as={Link} to="/employer/login">
          Employer Login
        </Button>
        <Button variant="outline-success" as={Link} to="/candidate/login">
          Candidate Login
        </Button>
        <Button variant="outline-dark" as={Link} to="/admin/login">
          Admin Login
        </Button>
      </div>
    </Nav>
  </Navbar.Collapse>
</Navbar>

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseJobs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/profile" element={<EmployerProfile />} /> {/* ✅ Profile Settings route */}
          <Route path="/employer/login" element={<EmployerAuth />} />
           <Route path="/candidate/login" element={<CandidateAuth />} />
           <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
           <Route path="/browse-jobs" element={<BrowseJobsSection />} />
             <Route path="/applied-jobs" element={<AppliedJobs />} />
             <Route path="/candidate/profile" element={<EditCandidateProfile />} />
             <Route path="/admin/dashboard" element={<AdminDashboard />} />
             <Route path="/admin/login" element={<AdminLogin />} />



        </Routes>
      </Container>
    </Router>
  );
}

export default App;
