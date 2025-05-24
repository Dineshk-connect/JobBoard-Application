// EmployerAuth.js
import { useState } from 'react';
import { Container, Row, Col, Form, Button, Tab, Nav, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployerAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', name: '', company: '' });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5001/api/employer/login', formData);
    const data = res.data;
    setMessage(data.message);
    setVariant('success');

    // Store only the employer object in localStorage
    localStorage.setItem('employer', JSON.stringify(data.employer));

    navigate('/employer/dashboard');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Login failed');
    setVariant('danger');
  }
};


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/employer/register', registerData);
      setMessage(res.data.message);
      setVariant('success');
      setActiveTab('login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
      setVariant('danger');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="tabs" className="mb-4 justify-content-center">
              <Nav.Item>
                <Nav.Link eventKey="login">Login</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="register">Create Account</Nav.Link>
              </Nav.Item>
            </Nav>

            {message && <Alert variant={variant}>{message}</Alert>}

            <Tab.Content>
              <Tab.Pane eventKey="login">
                <Form onSubmit={handleLogin} className="p-4 border rounded shadow-sm">
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">Login</Button>
                </Form>
              </Tab.Pane>

              <Tab.Pane eventKey="register">
                <Form onSubmit={handleRegister} className="p-4 border rounded shadow-sm">
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Company</Form.Label>
                    <Form.Control
                      type="text"
                      value={registerData.company}
                      onChange={(e) => setRegisterData({ ...registerData, company: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" variant="success" className="w-100">Create Account</Button>
                </Form>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
}

export default EmployerAuth;
