WHITEBOARD Project

Welcome to the WHITEBOARD project! This application allows users to draw, save, and manage drawings with various tools and features. Below, you'll find details about the tech stack, features, future enhancements, requirements for running the app locally, and major learnings from developing this app.
Tech Stack and Frameworks Used
Frontend:

    React: A JavaScript library for building user interfaces.
    Vite: A build tool that aims to provide a faster and leaner development experience for modern web projects.
    CSS: For styling the application.

Backend:

    Node.js: A JavaScript runtime built on Chrome's V8 JavaScript engine.
    Express.js: A minimal and flexible Node.js web application framework.
    MongoDB: A NoSQL database for storing user data and drawings.
    Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.

Tools Used:

    Axios: Promise-based HTTP client for the browser and Node.js.
    JWT (JSON Web Token): For user authentication.
    Local Storage: For storing user tokens on the client side.

Features

    User Authentication: Users can sign up, sign in, and sign out.
    Drawing Tools: Users can draw using different tools like pen, eraser, etc.
    Color and Brush Size: Users can change the pen color and brush size.
    Text Tools: Users can add text with various font settings.
    Save Drawings: Users can save their drawings.
    View Saved Drawings: Users can view and manage their saved drawings.

Future Enhancements

    Collaborative Drawing: Allow multiple users to draw on the same whiteboard in real-time.
    Export Drawings: Add functionality to export drawings in different formats like PDF, SVG, etc.
    Advanced Drawing Tools: Introduce more drawing tools like shapes, gradients, and layers.
    User Profiles: Implement user profiles to manage their drawings and settings.
    Responsive Design: Improve the responsiveness of the app for mobile and tablet devices.

Requirements

To run this application on your local computer, you will need the following:

    Node.js: Download and install from nodejs.org
    MongoDB: Install MongoDB or use a cloud-based solution like MongoDB Atlas.
    Git: Version control system to clone the repository.
    A Web Browser: Modern web browser like Google Chrome, Mozilla Firefox, etc.

Installation and Running Locally

    Clone the Repository:

    bash

git clone https://github.com/RachitSrivastava12/BNGYA.git
cd WHITEBOARD-main

Install Dependencies:

    For the backend:

    bash

cd Backend
npm install

For the frontend:

bash

    cd ExacldrawFrontend
    npm install

Set Up Environment Variables:

    Create a .env file in the Backend directory with the following content:

    bash

    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret_key>

    Ensure that the frontend API URL matches your backend URL in the frontend configuration.

Run the Application:

    Start the backend server:

    bash

cd Backend
npm start

Start the frontend development server:

bash

        cd ExacldrawFrontend
        npm run dev

    Open the App:
        Navigate to http://localhost:3000 in your web browser.

Major Learnings

While developing this app, I learned several key concepts and skills:

    React and State Management: Handling state and props in React to manage UI components effectively.
    API Integration: Using Axios to interact with backend APIs for user authentication and data fetching.
    User Authentication: Implementing secure user authentication using JWT tokens.
    Drawing Logic: Managing canvas drawing operations and state.
    Backend Development: Building RESTful APIs with Node.js and Express.
    Database Integration: Using MongoDB and Mongoose for data storage and retrieval.
    Error Handling: Implementing robust error handling on both frontend and backend.
    Version Control: Using Git for version control and managing code changes.

Thank you for exploring the WHITEBOARD project! Feel free to contribute or reach out if you have any questions or suggestions.
