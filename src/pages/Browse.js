import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Alert,
  Badge,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Browse = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/jobs');
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleViewDetails = async (job) => {
    try {
      await axios.post(`http://localhost:5001/api/jobs/${job._id}/view`);
    } catch (error) {
      console.error('Failed to increment job views', error);
    }

    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleLoginRedirect = () => {
    navigate('/candidate/login');
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <h2 className="text-center flex-grow-1 fw-bold"> Browse Jobs</h2>
      </div>

      {jobs.length === 0 ? (
        <Alert variant="info" className="text-center">
          No jobs available at the moment. Please check back later.
        </Alert>
      ) : (
        <Row>
          {jobs.map((job) => (
            <Col key={job._id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-card border-0">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title className="fw-semibold mb-0">{job.title}</Card.Title>
                      <Badge bg="light" text="dark">{job.location}</Badge>
                    </div>
                    <Card.Subtitle className="mb-2 text-muted">{job.company}</Card.Subtitle>
                    <Card.Text className="text-muted small">
                      {job.salary ? `💰 ${job.salary}` : 'Salary not disclosed'}
                    </Card.Text>
                  </div>
                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="outline-primary" size="sm" onClick={() => handleViewDetails(job)}>
                      View Details
                    </Button>
                    <Button variant="warning" size="sm" onClick={handleLoginRedirect}>
                      Login to Apply
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Job Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Company:</strong> {selectedJob?.company}</p>
          <p><strong>Location:</strong> {selectedJob?.location}</p>
          <p><strong>Salary:</strong> {selectedJob?.salary || 'Not disclosed'}</p>
          <hr />
          <p><strong>Description:</strong></p>
          <p>{selectedJob?.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Browse;
