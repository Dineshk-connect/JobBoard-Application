import React, { useState } from 'react';

const PostJob = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobDeadline, setJobDeadline] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here, send the job data to the backend (replace with your API call)
        const response = await fetch('/api/employer/post-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jobTitle, jobDescription, jobDeadline }),
        });

        if (response.ok) {
            alert('Job posted successfully');
        } else {
            alert('Failed to post job');
        }
    };

    return (
        <div className="post-job">
            <h2>Post a New Job</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Job Title:</label>
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Job Description:</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <label>Application Deadline:</label>
                    <input
                        type="date"
                        value={jobDeadline}
                        onChange={(e) => setJobDeadline(e.target.value)}
                    />
                </div>
                <button type="submit">Post Job</button>
            </form>
        </div>
    );
};

export default PostJob;
