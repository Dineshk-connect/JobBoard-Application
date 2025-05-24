import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Spinner, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // 🧭 Step 1: Import useNavigate

const AppliedJobs = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 🧭 Step 2: Get navigate function

  const fetchAppliedJobs = async () => {
    try {
      const candidate = JSON.parse(localStorage.getItem('candidate'));
      if (!candidate || !candidate._id) {
        setError('Please log in as a candidate to view applied jobs.');
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:5001/api/applications/candidate/${candidate._id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch applied jobs');
      }

      const validApplications = data.filter(app => app.jobId && app.jobId.title);
      setApplications(validApplications);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const handleDelete = async (applicationId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const res = await fetch(`http://localhost:5001/api/applications/${applicationId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete application');
      }

      setApplications(applications.filter(app => app._id !== applicationId));
    } catch (err) {
      console.error('Error deleting application:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
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

  return (
    <Container className="my-5">
      {/* 🔙 Back Button */}
      <Button variant="secondary" className="mb-3" onClick={() => navigate('/candidate/dashboard')}>
        ← Back
      </Button>

      <h2 className="mb-4 fw-bold">📄 Jobs You've Applied For</h2>
      {applications.length === 0 ? (
        <Alert variant="info">You have not applied for any jobs yet.</Alert>
      ) : (
        <Table striped bordered hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company</th>
              <th>Location</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => {
              const job = app.jobId || {};
              const appliedDate = app.appliedAt
                ? new Date(app.appliedAt).toLocaleDateString()
                : 'N/A';
              const resumeURL = app.resumePath ? `http://localhost:5001/${app.resumePath}` : null;

              return (
                <tr key={app._id}>
                  <td>{job.title || 'N/A'}</td>
                  <td>{job.company || 'N/A'}</td>
                  <td>{job.location || 'N/A'}</td>
                  <td>{appliedDate}</td>
                  <td>
                    <Badge
                      bg={
                        app.status === 'Accepted'
                          ? 'success'
                          : app.status === 'Rejected'
                          ? 'danger'
                          : 'secondary'
                      }
                    >
                      {app.status || 'Pending'}
                    </Badge>
                  </td>
                  <td>
                    {resumeURL ? (
                      <>
                        <a
                          href={resumeURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="d-block"
                        >
                          View
                        </a>
                        <a href={resumeURL} download className="text-muted small">
                          Download
                        </a>
                      </>
                    ) : (
                      'No Resume'
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(app._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AppliedJobs;
