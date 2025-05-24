import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CandidateAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const url = isLogin
    ? 'http://localhost:5001/api/candidates/login'
    : 'http://localhost:5001/api/candidates/register';

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Something went wrong');

    localStorage.setItem('candidate', JSON.stringify(data));
    setSuccess(isLogin ? 'Login successful!' : 'Registered successfully!');

    if (isLogin) {
      // If it's a login, navigate to the dashboard
      navigate('/candidate/dashboard');
    } else {
      // If it's a registration, navigate to the login page
      setTimeout(() => {
        navigate('/candidate/login'); // This will go to the login page after registration
      }, 1500); // Optionally add a delay for a smooth transition
    }
  } catch (err) {
    setError(err.message || 'Error occurred');
  }
};


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
        <h3 className="text-center mb-3">{isLogin ? 'Candidate Login' : 'Candidate Register'}</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
          </Form.Group>
          <Button type="submit" className="w-100 mb-2">{isLogin ? 'Login' : 'Register'}</Button>
          <Button variant="link" className="w-100 text-center" onClick={handleToggle}>
            {isLogin ? 'Don’t have an account? Register' : 'Already have an account? Login'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CandidateAuth;
