import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

const EmployerProfile = () => {
  const [profileData, setProfileData] = useState({
    companyName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    description: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulating save
    console.log('Profile updated:', profileData);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-4">Employer Profile Settings</h4>

          {success && <Alert variant="success">Profile updated successfully!</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="companyName">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="location">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="website">
                  <Form.Label>Website</Form.Label>
                  <Form.Control
                    type="url"
                    name="website"
                    value={profileData.website}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}></Col>
            </Row>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Company Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={profileData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmployerProfile;
