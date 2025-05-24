import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaBriefcase,
  FaClipboardList,
  FaUserEdit,
  FaSignOutAlt
} from 'react-icons/fa';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);

  useEffect(() => {
    const storedCandidate = localStorage.getItem('candidate');
    if (storedCandidate) {
      setCandidate(JSON.parse(storedCandidate));
    } else {
      navigate('/candidate/login'); // Redirect if not logged in
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('candidate');
    navigate('/candidate/login');
  };

  if (!candidate) return null;

  return (
    <Container
      fluid
      className="p-4"
      style={{ minHeight: '100vh', backgroundColor: '#f2f4f7' }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Candidate Dashboard</h2>
        <Button
          variant="outline-danger"
          onClick={handleLogout}
          className="d-flex align-items-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </Button>
      </div>

      {/* Welcome Message */}
      <Card className="mb-4 shadow-sm border-0 rounded-3">
        <Card.Body>
          <h4 className="mb-1">
            Welcome back,&nbsp;
            <span className="text-primary fw-semibold">
              {candidate.name || candidate.email}
            </span>
          </h4>
          <p className="text-muted mb-0">
            Manage your profile, applications, and career journey here.
          </p>
        </Card.Body>
      </Card>

      {/* Dashboard Cards */}
      <Row xs={1} sm={2} md={3} className="g-4">
        <Col>
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <FaBriefcase size={48} className="text-primary mb-3" />
              <Card.Title className="fw-bold">Browse Jobs</Card.Title>
              <Card.Text className="text-muted mb-4">
                Discover exciting opportunities and apply today.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => navigate('/browse-jobs')}
              >
                Explore Jobs
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <FaClipboardList size={48} className="text-success mb-3" />
              <Card.Title className="fw-bold">Applied Jobs</Card.Title>
              <Card.Text className="text-muted mb-4">
                Track jobs you’ve applied for and their status.
              </Card.Text>
              <Button
                variant="success"
                onClick={() => navigate('/applied-jobs')}
              >
                View Applications
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="h-100 shadow-sm border-0 hover-card">
            <Card.Body className="text-center d-flex flex-column justify-content-center align-items-center">
              <FaUserEdit size={48} className="text-warning mb-3" />
              <Card.Title className="fw-bold">Edit Profile</Card.Title>
              <Card.Text className="text-muted mb-4">
                Update your resume, contact info, and more.
              </Card.Text>
              <Button
                as={Link}
                to="/candidate/profile"
                variant="warning"
                className="text-white"
              >
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CandidateDashboard;
