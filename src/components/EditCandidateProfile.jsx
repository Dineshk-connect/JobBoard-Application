import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditCandidateProfile = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('info');

  useEffect(() => {
    const storedCandidate = localStorage.getItem('candidate');
    if (storedCandidate) {
      const parsedCandidate = JSON.parse(storedCandidate);
      setCandidate(parsedCandidate);
      setFormData({
        name: parsedCandidate.name || '',
        email: parsedCandidate.email || '',
        password: '',
      });
    } else {
      navigate('/candidate/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:5001/api/candidates/${candidate._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Update failed');

      // Update local storage with new candidate info
      localStorage.setItem('candidate', JSON.stringify(data));
      setCandidate(data);
      setVariant('success');
      setMessage('Profile updated successfully!');
    } catch (err) {
      setVariant('danger');
      setMessage(err.message);
    }
  };

  return (
    <Container className="py-5">
       {/* 🔙 Back Button */}
            <Button variant="secondary" className="mb-3" onClick={() => navigate('/candidate/dashboard')}>
              ← Back
            </Button>
      <Card className="p-4 shadow-sm">
        <h2>Edit Profile</h2>
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>New Password (leave blank to keep current)</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">Update Profile</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default EditCandidateProfile;
