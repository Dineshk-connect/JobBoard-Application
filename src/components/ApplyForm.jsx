import React, { useState } from 'react';
import axios from 'axios';

const ApplyForm = ({ jobId, candidateId, onClose }) => {
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!candidateId || !jobId || !resume) {
    setMessage('All required fields must be filled');
    return;
  }

  const formData = new FormData();
  formData.append('candidateId', candidateId);
  formData.append('jobId', jobId);
  formData.append('resume', resume);

  try {
    const response = await axios.post('http://localhost:5001/api/applications/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    setMessage(response.data.message);
  } catch (error) {
    setMessage(error.response?.data?.message || 'Failed to apply');
  }
};


  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h2>Apply for Job</h2>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResume(e.target.files[0])}
          required
        />
        <textarea
          placeholder="Cover Letter / Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Submit Application</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default ApplyForm;
