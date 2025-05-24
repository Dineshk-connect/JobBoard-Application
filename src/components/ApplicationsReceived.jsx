import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert, Table, Button, Badge } from 'react-bootstrap';
import axios from 'axios';

const ApplicationsReceived = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const employer = JSON.parse(localStorage.getItem('employer'));
        if (!employer || !employer._id) {
          setError('Please log in as an employer.');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5001/api/applications/employer/${employer._id}/applications`
        );

        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError('Failed to fetch applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/applications/${applicationId}/status`, {
        status: newStatus,
      });

      // Update application in local state
      setApplications((prevApps) =>
        prevApps.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error(`Error updating status for ${applicationId}:`, error);
      alert('Failed to update status.');
    }
  };

  const getResumeUrl = (path) => {
    if (!path) return null;
    return `http://localhost:5001/${path.replace(/\\/g, '/')}`;
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p>Loading applications...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (applications.length === 0) {
    return (
      <Container className="my-5">
        <Alert variant="info">No applications received yet.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h3 className="mb-4">Applications Received</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Candidate Email</th>
            <th>Job Title</th>
            <th>Company</th>
            <th>Applied On</th>
            <th>Resume</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => {
            const resumeUrl = getResumeUrl(app.resumePath);
            const status = app.status || 'Pending';

            return (
              <tr key={app._id}>
                <td>{app.candidateId?.name || 'N/A'}</td>
                <td>{app.candidateId?.email || 'N/A'}</td>
                <td>{app.jobId?.title || 'N/A'}</td>
                <td>{app.jobId?.company || 'N/A'}</td>
                <td>{new Date(app.appliedAt || app.createdAt || Date.now()).toLocaleString()}</td>
                <td>
                  {resumeUrl ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => window.open(resumeUrl, '_blank')}
                    >
                      View Resume
                    </Button>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  {status === 'Pending' ? (
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => updateStatus(app._id, 'Accepted')}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateStatus(app._id, 'Rejected')}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Badge bg={status === 'Accepted' ? 'success' : 'danger'}>{status}</Badge>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default ApplicationsReceived;
