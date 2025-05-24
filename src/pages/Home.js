import React, { useState } from 'react';
import {
  Container,
  Button,
  Form,
  Row,
  Col,
  Card,
  Modal,
} from 'react-bootstrap';
import {
  FaSearch,
  FaMapMarkerAlt,
  FaArrowRight,
  FaCloudUploadAlt,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState({
    keyword: '',
    location: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(search).toString();
    navigate(`/browse?${query}`);
  };

  const handleInputChange = (field, value) => {
    setSearch((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="bg-dark text-white d-flex align-items-center"
        style={{
          height: '90vh',
          background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
        }}
      >
        <Container className="text-center">
          <h5 className="text-warning mb-3">4,536+ Jobs Available</h5>
          <h1 className="display-3 fw-bold mb-3">Find Your Dream Job</h1>
          <p className="lead mb-4">
            The best opportunities are waiting for you. Upload your resume and get noticed by top companies!
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              variant="warning"
              className="fw-bold d-flex align-items-center gap-2"
              onClick={() => {
                const candidate = localStorage.getItem('candidate');
                if (candidate) {
                  navigate('/candidate/login');
                } else {
                  navigate('/candidate/login');
                }
              }}
            >
              <FaCloudUploadAlt /> Upload Resume
            </Button>
            <Button
              variant="outline-light"
              className="fw-bold d-flex align-items-center gap-2"
              onClick={() => {
                const candidate = localStorage.getItem('candidate');
                if (candidate) {
                  navigate('/browse');
                } else {
                  navigate('/candidate/login');
                }
              }}
            >
              Explore Jobs <FaArrowRight />
            </Button>
          </div>
        </Container>
      </div>

      {/* Search Section */}
      <Container
        className="bg-white p-4 shadow rounded-3 position-relative z-2"
        style={{ marginTop: '-60px' }}
      >
        <Form onSubmit={handleSearch}>
          <Row className="g-3 align-items-center">
            <Col md={5}>
              <div className="position-relative">
                <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Job title, keywords..."
                  className="ps-5"
                  value={search.keyword}
                  onChange={(e) => handleInputChange('keyword', e.target.value)}
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="position-relative">
                <FaMapMarkerAlt className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  type="text"
                  placeholder="Location"
                  className="ps-5"
                  value={search.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </Col>
            <Col md={3}>
              <Button type="submit" variant="success" className="w-100">
                Find Job
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      {/* Highlights / Benefits Section */}
      <Container className="my-5">
        <Row className="text-center g-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold">Personalized Matches</h5>
                <p className="text-muted">We match your resume with the most relevant jobs instantly.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold">Trusted Companies</h5>
                <p className="text-muted">Work with top-rated employers across industries and regions.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <h5 className="fw-bold">Easy Application</h5>
                <p className="text-muted">Apply with one click and track your progress with ease.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Call to Action Footer */}
      <div className="bg-light py-5 mt-5">
        <Container className="text-center">
          <h2 className="fw-bold mb-3">Ready to Get Hired?</h2>
          <p className="mb-4">Create your profile and let companies find you.</p>
          <Button
            variant="primary"
            size="lg"
            className="fw-bold px-4"
            onClick={() => setShowModal(true)}
          >
            Get Started
          </Button>
        </Container>
      </div>

      {/* Role Selection Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Your Role</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p className="mb-4">Are you joining as a Candidate or an Employer?</p>
          <div className="d-flex justify-content-center gap-4">
            <Button
              variant="success"
              onClick={() => {
                setShowModal(false);
                navigate('/candidate/login');
              }}
            >
              I'm a Candidate
            </Button>
            <Button
              variant="info"
              onClick={() => {
                setShowModal(false);
                navigate('/employer/login');
              }}
            >
              I'm an Employer
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Home;
