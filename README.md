# CSC3916 Assignment Three

## Purpose
The purpose of this assignment is to get comfortable working with a NoSQL database (MongoDB) by building a full-stack application. The backend provides user authentication (signup/signin) and movie management (CRUD operations) endpoints, all protected with JWT tokens. The React frontend interacts with these endpoints.

## Requirements
- **Users Collection**:  
  - Fields: `name`, `username` (unique), and `password` (hashed).  
  - Signup should return an error if the username already exists.
  - Signin returns a JWT token that includes the user's name and username (not the password).

- **Movies Collection**:  
  - Fields:  
    - `title` (string, required, indexed)  
    - `releaseDate`  
    - `genre` (one of: Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Thriller, Western, Science Fiction)  
    - Array of three actors (each with `actorName` and `characterName`)  
  - At least five movies should be stored.
  - All movie endpoints (create, update, delete, get) are protected with JWT.

- **API**:  
  - Built with Node.js/Express.
  - Supports CRUD operations for movies.
  - All endpoints require a valid JWT (obtained via signin).

- **Frontend**:  
  - A React single page application (CSC3916_REACT19) that supports user signup and signin.



## Local Setup

### Backend (CSC3916_Assignment3)
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/CSC3916_Assignment3.git
   cd CSC3916_Assignment3

Backend: https://csc3916-assignment3-4jsa.onrender.com

Frontend: https://csc3916-react19-8nsz.onrender.com


[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/38973044-dcbbebf0-e172-4fc0-9750-6be3bdb3034c?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D38973044-dcbbebf0-e172-4fc0-9750-6be3bdb3034c%26entityType%3Dcollection%26workspaceId%3Db658d2e3-4b68-47a0-9ebe-b5fe94e0d60e)
