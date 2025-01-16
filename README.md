# CV-builder

Live site: https://cv-builder-04.vercel.app/

![image](https://github.com/vincentanu04/CV-builder/assets/121442433/942b90a5-3863-4e74-a2d8-1170e63830c8)

Enter your personal details in order to get a personalized CV printed as a PDF! Supports export and import as JSON.

# Design Document

## Core Features

### 1. User Accounts and Resume Storage

- **User Registration**: Enable new users to create an account with email and password.
- **User Login**: Authenticate users using email and password.
- **Resume Management**:
  - **Save**: Allow users to upload or create resumes and store them securely.
  - **Retrieve**: Provide access to previously saved resumes.
  - **Update**: Allow edits to existing resumes.
  - **Delete**: Enable users to remove resumes they no longer need.

---

### 2. Resume Templates

- **Template Selection**: Offer a variety of pre-designed templates.
  - **Resume Creation**: Allow template selection when creating a resume.
  - **Resume Editing**: Allow template selection when editing a resume.

---

### 3. Resume Review Service

#### **AI-Powered Resume Suggestions**

- **Grammar and ATS Compliance Checks**: Integrate language processing tools to check grammar and suggest ATS-friendly formats.
- **Enhanced Suggestions**: Provide actionable feedback on resumes such as suggesting better phrasing, metrics, weak action verbs and structure for resume entries.
- **Highlight Missing Sections**: High light missing or incomplete sections of the resume (e.g., experience, education).

#### **Peer Review System**

- **Resume Sharing**:
  - Allow users to share their resumes with others for feedback.
- **Reviewer Feedback**:
  - Allow reviewers to add comments and give structured feedback on specific sections.
  - Include options for ratings (e.g., 1-5 stars for each section).
- **History Tracking**:
  - Maintain a record of feedback history for users to revisit.

---

## Architecture

### 1. Backend

- **Language**: Go
- **Database**: MySQL

  - **Users Table**:

  ```sql
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
  );
  ```

  - **Resume Metadata Table**:

  ```sql
  CREATE TABLE resume_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    resume_id INT NOT NULL,
    user_id INT NOT NULL,
    thumbnail_url VARCHAR(1024), -- S3 URL for the thumbnail image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resume_id) REFERENCES resumes (id) ON DELETE CASCADE
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );
  ```

  - **Resumes Table**:

  ```sql
  CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  );
  ```

  - **Feedback Table** (for Peer Review): `id`, `resume_id`, `reviewer_id`, `comments (JSON)`, `ratings (JSON)`, `created_at`

- **AI Service**: Python-based microservice integrated using REST/gRPC for grammar checks and ATS analysis.

### 2. Frontend

- **Framework**: React
- **Key Components**:

  - **Form Component**: For creating/updating resumes.
  - **Template Selector**: Displays available templates.
  - **User Resumes**: Displays a user's resumes.
  - **Review Feedback**: Interface for peer review and AI suggestions.

- **Template Storage**:

  - Resume templates are stored in the frontend as stylesheets and CV components.

- **Thumbnail Generation**:
  - When a user saves a resume, the frontend generates a PDF using the selected template.
  - The PDF is sent to the backend, which converts it into an image and uploads it to S3 for use as a thumbnail.

---

## API Endpoints

### User Management

- **POST** `/register`: Register a new user.
- **POST** `/login`: Authenticate user and issue a token.

### Resume Management

- **POST** `/resumes`: Save a new resume.
- **GET** `/resumes`: Retrieve all resumes metadatas for the authenticated user.
- **GET** `/resumes/{id}`: Retrieve a specific resume.
- **PUT** `/resumes/{id}`: Update a specific resume.
- **DELETE** `/resumes/{id}`: Delete a specific resume.

### Resume Review

- **POST** `/reviews/{resume_id}`: Submit peer feedback for a resume.
- **GET** `/reviews/{resume_id}`: Retrieve all reviews for a specific resume.
- **POST** `/ai/review`: Submit a resume for AI-powered analysis.

---
