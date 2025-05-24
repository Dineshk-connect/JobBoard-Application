import React, { useState, useEffect } from "react";
import {
  Container,
  Nav,
  Tab,
  Table,
  Spinner,
  Row,
  Col,
  Card,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin/login");
      return;
    }

    fetchData("candidates", setCandidates);
    fetchData("employers", setEmployers);
    fetchData("jobs", setJobs);
    fetchData("applications", setApplications);
  }, [navigate]);

  const fetchData = async (endpoint, setter) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/admin/${endpoint}`);
      const data = await res.json();
      setter(data);
    } catch (error) {
      console.error(`❌ Failed to fetch ${endpoint}:`, error);
    }
    setLoading(false);
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await fetch(`http://localhost:5001/api/admin/candidates/${id}`, {
        method: "DELETE",
      });
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch (error) {
      alert("Failed to delete candidate.");
    }
  };

  const deleteEmployer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employer?")) return;
    try {
      await fetch(`http://localhost:5001/api/admin/employers/${id}`, {
        method: "DELETE",
      });
      setEmployers((prev) => prev.filter((e) => e._id !== id));
    } catch (error) {
      alert("Failed to delete employer.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const renderTable = (headers, rows, keys, onDelete = null) => (
    <Table striped bordered hover responsive className="shadow-sm rounded">
      <thead className="table-dark">
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
          {onDelete && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <tr key={row._id || idx}>
            {keys.map((key, i) => (
              <td key={i}>{row[key]}</td>
            ))}
            {onDelete && (
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(row._id)}
                >
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Admin Dashboard</h2>
        <Button variant="outline-danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Tab.Container defaultActiveKey="overview">
        <Nav variant="pills" className="justify-content-center gap-2 mb-3">
          <Nav.Item>
            <Nav.Link eventKey="overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="candidates">Candidates</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="employers">Employers</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="jobs">Jobs</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="applications">Applications</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="overview">
            <Row className="g-4">
              <Col md={3}>
                <Card className="shadow text-center border-primary">
                  <Card.Body>
                    <Card.Title>Total Candidates</Card.Title>
                    <h3>{candidates.length}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow text-center border-success">
                  <Card.Body>
                    <Card.Title>Total Employers</Card.Title>
                    <h3>{employers.length}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow text-center border-warning">
                  <Card.Body>
                    <Card.Title>Total Jobs</Card.Title>
                    <h3>{jobs.length}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="shadow text-center border-danger">
                  <Card.Body>
                    <Card.Title>Total Applications</Card.Title>
                    <h3>{applications.length}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          <Tab.Pane eventKey="candidates">
            <h4 className="text-primary mb-3">Candidates</h4>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              renderTable(["Name", "Email"], candidates, ["name", "email"], deleteCandidate)
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="employers">
            <h4 className="text-success mb-3">Employers</h4>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              renderTable(["Company", "Email"], employers, ["company", "email"], deleteEmployer)
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="jobs">
            <h4 className="text-warning mb-3">Jobs</h4>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              renderTable(["Title", "Company", "Location"], jobs, ["title", "company", "location"])
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="applications">
            <h4 className="text-danger mb-3">Applications</h4>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              renderTable(["Candidate ID", "Job ID", "Status"], applications, ["candidateId", "jobId", "status"])
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;
