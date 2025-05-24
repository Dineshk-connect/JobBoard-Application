import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Alert,
  Form,
  Badge,
  Spinner,
} from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyJob, setApplyJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [applyMsg, setApplyMsg] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword')?.toLowerCase() || '';
  const locationParam = searchParams.get('location')?.toLowerCase() || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/jobs');
        const data = await res.json();
        setJobs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const results = jobs.filter((job) => {
      const matchesKeyword =
        !keyword ||
        job.title?.toLowerCase().includes(keyword) ||
        job.description?.toLowerCase().includes(keyword);

      const matchesLocation =
        !locationParam ||
        job.location?.toLowerCase().includes(locationParam);

      const matchesCategory =
        !category || job.category === category;

      return matchesKeyword && matchesLocation && matchesCategory;
    });

    setFilteredJobs(results);
  }, [jobs, keyword, locationParam, category]);

  const handleViewDetails = async (job) => {
    try {
      await axios.post(`http://localhost:5001/api/jobs/${job._id}/view`);
    } catch (error) {
      console.error('Failed to increment job views', error);
    }

    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const handleApplyClick = (job) => {
    const candidate = JSON.parse(localStorage.getItem('candidate'));
    if (!candidate || !candidate._id) {
      alert('Please log in as a candidate to apply.');
      return;
    }

    setApplyJob(job);
    setShowApplyModal(true);
    setApplyMsg('');
    setResume(null);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();

    const candidate = JSON.parse(localStorage.getItem('candidate'));
    if (!candidate || !candidate._id) {
      alert('Please log in as a candidate to apply.');
      return;
    }

    if (!resume) {
      setApplyMsg('Please upload your resume.');
      return;
    }

    const formData = new FormData();
    formData.append('candidateId', candidate._id);
    formData.append('jobId', applyJob._id);
    formData.append('resume', resume);

    try {
      const res = await fetch('http://localhost:5001/api/applications/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to apply');

      setApplyMsg('Application submitted successfully!');
      setTimeout(() => setShowApplyModal(false), 2000);
    } catch (err) {
      setApplyMsg(err.message);
    }
  };

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <h2 className="text-center flex-grow-1 fw-bold"> Browse Available Jobs</h2>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Alert variant="info" className="text-center">
          No jobs match your search criteria.
        </Alert>
      ) : (
        <Row>
          {filteredJobs.map((job) => (
            <Col key={job._id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm hover-card border-0">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <Card.Title className="fw-semibold mb-0">{job.title}</Card.Title>
                      <Badge bg="light" text="dark">
                        {job.location}
                      </Badge>
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
                    <Button variant="success" size="sm" onClick={() => handleApplyClick(job)}>
                      Apply
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

      {/* Apply Form Modal */}
      <Modal show={showApplyModal} onHide={() => setShowApplyModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply for {applyJob?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleApplySubmit}>
            <Form.Group controlId="formResume" className="mb-3">
              <Form.Label>Upload Your Resume</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Accepted formats: PDF, DOC, DOCX
              </Form.Text>
            </Form.Group>
            {applyMsg && (
              <Alert variant={applyMsg.includes('successfully') ? 'success' : 'danger'}>
                {applyMsg}
              </Alert>
            )}
            <div className="text-end">
              <Button variant="primary" type="submit">
                Submit Application
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BrowseJobs;
