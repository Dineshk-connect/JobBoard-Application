import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Table,
  Container,
  Row,
  Col,
  Form,
  Alert,
  Nav,
  Modal,
  Badge,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ApplicationsReceived from "../components/ApplicationsReceived";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

import {
  FaClipboardList,
  FaEnvelopeOpenText,
  FaBell,
  FaEye,
  FaPlusCircle,
  FaSignOutAlt,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";




const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
  });
  const [editFormData, setEditFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
 // const [activeTab, setActiveTab] = useState("overview");
 const location = useLocation();
const [activeTab, setActiveTab] = useState(location.state?.tab || "overview");


  useEffect(() => {
    
    const stored = localStorage.getItem("employer");
    if (!stored) {
      navigate("/employer/login");
      return;
    }

    try {
      const parsedEmployer = JSON.parse(stored);
      const normalizedEmployer = {
        ...parsedEmployer,
        _id: parsedEmployer._id || parsedEmployer.id,
      };
      setEmployer(normalizedEmployer);
      fetchJobs(normalizedEmployer._id);
      fetchApplicationsCount(normalizedEmployer._id);
      fetchViewsCount(normalizedEmployer._id);
      fetchNotifications(normalizedEmployer._id);
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      navigate("/employer/login");
    }
  }, [navigate]);

  useEffect(() => {
  setActiveTab(location.state?.tab || "overview");
}, [location.state]);

  const fetchJobs = (employerId) => {
    fetch(`http://localhost:5001/api/jobs?createdBy=${employerId}`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch(() => setError("Error fetching jobs."));
  };

  const fetchApplicationsCount = (employerId) => {
    fetch(
      `http://localhost:5001/api/applications/employer/${employerId}/applications-count`
    )
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") {
          setApplicationsCount(data.count);
        }
      })
      .catch(() => setApplicationsCount(0));
  };

  const fetchViewsCount = (employerId) => {
    fetch(`http://localhost:5001/api/jobs/employer/${employerId}/views-count`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.views === "number") {
          setViewsCount(data.views);
        }
      })
      .catch(() => setViewsCount(0));
  };

  const fetchNotifications = async (employerId) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/employer/${employerId}/notifications`
      );
      if (Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const storedEmployer = JSON.parse(localStorage.getItem("employer"));
    if (!storedEmployer || !storedEmployer._id) {
      window.alert("Employer not authenticated");
      return;
    }

    const employerId = storedEmployer._id;

    const jobData = {
      ...formData,
      createdBy: employerId,
      salary: Number(formData.salary),
    };

    try {
      const response = await fetch("http://localhost:5001/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post job");
      }

      await response.json();

      window.alert("Job posted successfully!");
     

      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
      });

      fetchJobs(employerId);
      fetchViewsCount(employerId);
      setShowForm(false);
       navigate("/employer/dashboard", { state: { tab: "overview" } });
    } catch (err) {
      console.error("Error posting job:", err.message);
      window.alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      fetch(`http://localhost:5001/api/jobs/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchJobs(employer._id);
          fetchViewsCount(employer._id);
        })
        .catch(() => alert("Failed to delete job"));
    }
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setEditFormData({ ...job });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...editFormData,
      salary: Number(editFormData.salary),
    };

    fetch(`http://localhost:5001/api/jobs/${selectedJob._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update job");
        return res.json();
      })
      .then(() => {
        setShowEditModal(false);
        fetchJobs(employer._id);
        fetchViewsCount(employer._id);
      })
      .catch(() => alert("Failed to update job"));
  };

  const handleLogout = () => {
    localStorage.removeItem("employer");
    navigate("/");
  };

  if (!employer) return <p>Loading...</p>;

  return (
    <Container
      fluid
      className="py-4"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <Row>
        <Col
          md={2}
          className="bg-white vh-100 p-3 border-end shadow-sm d-flex flex-column"
        >
          <h4
            className="fw-bold mb-4 text-primary text-center"
            style={{ letterSpacing: "1.2px" }}
          >
            Employer Dashboard
          </h4>
          <Nav className="flex-column flex-grow-1">
            <Nav.Link
              onClick={() => {
                setActiveTab("overview");
                setShowForm(false);
              }}
              active={activeTab === "overview"}
              className="d-flex align-items-center gap-2"
            >
              <FaClipboardList /> Overview
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setShowForm(true);
                setActiveTab("post");
              }}
              active={activeTab === "post"}
              className="d-flex align-items-center gap-2"
            >
              <FaPlusCircle /> Post Job
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveTab("applications");
                setShowForm(false);
              }}
              active={activeTab === "applications"}
              className="d-flex align-items-center gap-2"
            >
              <FaEnvelopeOpenText /> Applications Received
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setActiveTab("notifications");
                setShowForm(false);
              }}
              active={activeTab === "notifications"}
              className="d-flex align-items-center gap-2"
            >
              <FaBell /> Notifications
              {notifications.length > 0 && (
                <Badge bg="danger" pill className="ms-auto">
                  {notifications.filter((n) => !n.isRead).length}
                </Badge>
              )}
            </Nav.Link>
            <Nav.Link
              onClick={handleLogout}
              className="d-flex align-items-center gap-2 text-danger mt-auto"
              style={{ cursor: "pointer" }}
            >
              <FaSignOutAlt /> Logout
            </Nav.Link>
          </Nav>
        </Col>

        <Col md={10} className="px-4">
          {activeTab === "overview" && (
            <>
              <h3 className="mb-1 text-secondary">
                Welcome, <span className="text-primary">{employer.name}</span>!
              </h3>
              <p className="text-muted mb-4">{employer.email}</p>

              {successMessage && (
                <Alert
                  variant="success"
                  onClose={() => setSuccessMessage("")}
                  dismissible
                >
                  {successMessage} <FaCheckCircle />
                </Alert>
              )}
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError(null)}
                  dismissible
                >
                  {error}
                </Alert>
              )}

              <Row className="mb-4 g-4">
                <Col md={3}>
                  <Card className="text-white bg-primary shadow-sm border-0 rounded-3">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                      <FaClipboardList size={36} className="mb-2" />
                      <Card.Title className="text-center fs-5 fw-semibold">
                        Jobs Posted
                      </Card.Title>
                      <h2 className="text-center">{jobs.length}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-white bg-success shadow-sm border-0 rounded-3">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                      <FaEnvelopeOpenText size={36} className="mb-2" />
                      <Card.Title className="text-center fs-5 fw-semibold">
                        App Received
                      </Card.Title>
                      <h2 className="text-center">{applicationsCount}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-white bg-warning shadow-sm border-0 rounded-3">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                      <FaEye size={36} className="mb-2" />
                      <Card.Title className="text-center fs-5 fw-semibold">
                        Views
                      </Card.Title>
                      <h2 className="text-center">{viewsCount}</h2>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="text-white bg-info shadow-sm border-0 rounded-3">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
                      <FaBell size={36} className="mb-2" />
                      <Card.Title className="text-center fs-5 fw-semibold">
                        Notifications
                      </Card.Title>
                      <h2 className="text-center">{notifications.length}</h2>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="shadow-sm rounded-3">
                <Card.Body>
                  <h5 className="mb-3 text-primary fw-bold">
                    Your Job Listings
                  </h5>
                  <Table
                    striped
                    bordered
                    hover
                    responsive
                    className="align-middle"
                  >
                    <thead className="table-primary">
                      <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Salary</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job._id}>
                          <td>{job.title}</td>
                          <td>{job.company}</td>
                          <td>{job.location}</td>
                          <td>${job.salary.toLocaleString()}</td>
                          <td className="text-center">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              className="me-2 d-inline-flex align-items-center gap-1"
                              onClick={() => openEditModal(job)}
                              title="Edit Job"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              className="d-inline-flex align-items-center gap-1"
                              onClick={() => handleDelete(job._id)}
                              title="Delete Job"
                            >
                              <FaTrashAlt />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {jobs.length === 0 && (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center text-muted py-4"
                          >
                            No jobs posted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}

          {activeTab === "applications" && <ApplicationsReceived />}

          {activeTab === "notifications" && (
            <Card className="shadow-sm rounded-3">
              <Card.Body>
                <h5 className="mb-4 text-primary fw-bold">
                  Recent Notifications
                </h5>
                {notifications.length === 0 ? (
                  <p className="text-muted">
                    You don’t have any new notifications.
                  </p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {notifications.map((note, idx) => (
                      <li
                        key={idx}
                        className={`list-group-item d-flex justify-content-between align-items-start ${
                          !note.isRead ? "bg-light" : ""
                        }`}
                        style={{
                          cursor: "pointer",
                          borderRadius: "0.3rem",
                          marginBottom: "0.3rem",
                        }}
                        onClick={async () => {
                          try {
                            await axios.patch(
                              `http://localhost:5001/api/employer/notifications/${note._id}/read`
                            );
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n._id === note._id ? { ...n, isRead: true } : n
                              )
                            );
                          } catch (err) {
                            console.error(
                              "Failed to mark notification as read:",
                              err
                            );
                          }
                        }}
                      >
                        <div
                          className="ms-2
me-auto"
                        >
                          <div className="fw-bold">{note.title}</div>
                          <small className="text-muted">{note.message}</small>
                        </div>
                        <Badge bg={note.isRead ? "secondary" : "primary"} pill>
                          {formatDistanceToNow(new Date(note.createdAt), {
                            addSuffix: true,
                          })}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </Card.Body>
            </Card>
          )}
          {showForm && (
            <Card className="shadow-sm rounded-3 mt-4">
              <Card.Body>
                <h5 className="mb-4 text-success fw-bold d-flex align-items-center gap-2">
                  <FaPlusCircle /> Post New Job
                </h5>
                {/* 🔔 Success & Error Alerts go here */}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="formTitle">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter job title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="formCompany">
                      <Form.Label>Company</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Company name"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="formLocation">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Job location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="6" controlId="formSalary">
                      <Form.Label>Salary ($)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="e.g., 60000"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        min={0}
                        required
                      />
                    </Form.Group>
                  </Row>

                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Describe the job..."
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="d-flex align-items-center gap-2"
                  >
                    <FaPlusCircle /> Post Job
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="ms-3"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {/* Edit Job Modal */}
          <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Edit Job</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditSubmit}>
                <Form.Group className="mb-3" controlId="editTitle">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={editFormData.title || ""}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editCompany">
                  <Form.Label>Company</Form.Label>
                  <Form.Control
                    type="text"
                    name="company"
                    value={editFormData.company || ""}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={editFormData.location || ""}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editSalary">
                  <Form.Label>Salary ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="salary"
                    value={editFormData.salary || ""}
                    onChange={handleEditChange}
                    min={0}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="editDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={editFormData.description || ""}
                    onChange={handleEditChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default EmployerDashboard;
