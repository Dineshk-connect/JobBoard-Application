import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // For demo, simulate submission success
    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });

    // In a real app, here you would send the data to backend API
  };

  return (
    <Container className="my-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">Contact Us</h2>

      {submitStatus === 'success' && (
        <Alert variant="success" onClose={() => setSubmitStatus(null)} dismissible>
          Your message has been sent successfully. We will get back to you soon!
        </Alert>
      )}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3" controlId="contactName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            isInvalid={!!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contactEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            isInvalid={!!errors.email}
          />
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="contactSubject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Subject of your message"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            isInvalid={!!errors.subject}
          />
          <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4" controlId="contactMessage">
          <Form.Label>Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Write your message here..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            isInvalid={!!errors.message}
          />
          <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
        </Form.Group>

        <div className="d-grid">
          <Button type="submit" variant="primary" size="lg">
            Send Message
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Contact;
