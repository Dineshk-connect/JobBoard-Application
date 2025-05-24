# Job Board Web Application (MERN Stack)

A full-featured Job Board web application built using the **MERN** stack. Employers can post and manage jobs, while candidates can search, apply, and track their job applications. Admins can manage users and content through a dedicated dashboard.

---

## 📌 Key Features

###  Candidate
- Register/Login
- Browse and search jobs
- Apply to jobs
- View applications and statuses
- Upload resume

###  Employer
- Register/Login
- Post, edit, and delete jobs
- View applications received for each job
- Track number of views per job

###  Admin
- View all candidates, employers, jobs, applications
- Delete any candidate, employer, or job

---

##  Tech Stack

### 🔹 Frontend
- React.js
- React Router DOM
- Axios
- React Bootstrap

###  Backend
- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose

---

##  Installed Dependencies

| Package           | Usage                                                                 |
|------------------|-----------------------------------------------------------------------|
| **express**       | Web framework for creating the API                                    |
| **mongoose**      | ODM for MongoDB, used to define schemas and interact with the DB      |
| **cors**          | Enables cross-origin requests between frontend and backend            |
| **jsonwebtoken**  | Used for generating and verifying JWT tokens for authentication       |
| **bcryptjs**      | Hashes passwords for secure storage                                   |
| **multer**        | Handles file uploads (used for uploading candidate resumes)           |
| **dotenv**        | Loads environment variables from a `.env` file                        |

---

##  Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/Dineshk-connect/JobBoard-Application.git
cd JobBoard-Application
