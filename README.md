Coursefinity's backend is built using the Express framework, a fast and minimalist web application framework for Node.js. It includes models, controllers, and router paths to handle server-side logic and API integrations. The backend communicates with the frontend to manage user interactions, course enrollments, and quiz data.

The backend is responsible for handling user authentication, course data management, quiz handling, and certificate generation. It supports two types of user roles: "Learner" and "Instructor." Learners can enroll in courses, take quizzes, and earn certificates upon completion. Instructors, on the other hand, have access to the instructor dashboard, where they can create course listings, manage content, set up quizzes, and interact with learners.

Technology Stack:

The backend of Coursefinity is built using:

- **Express:** A fast and minimalist web application framework for Node.js, which handles server-side logic and API integrations.

Installation Steps (Backend):

To set up the Coursefinity backend, follow these steps:

1. **Clone the Backend Repository:** Open your console or terminal and navigate to the directory where you want to clone the backend repository. Run the following command:

```
git clone https://github.com/YagnikAkbari2/Coursefinity-Backend.git
```

This will download the backend repository files to your local machine.

2. **Navigate to the Backend Directory:** After cloning, navigate to the backend directory using the following command:

```
cd Coursefinity-Backend
```

3. **Install Backend Dependencies:** In the console or terminal, run the following command to install the required backend dependencies:

```
npm install
```

This command will read the `package.json` file and install all the necessary backend dependencies.

4. **Start the Backend Server:** After installing the dependencies, run the following command to start the backend server:

```
nodemon app.js
```

Or

```
node app.js
```

This will start the backend server, allowing it to handle incoming requests from the frontend and manage the application's core functionality.

Getting Started (Backend):

To interact with the Coursefinity web application, you need to install the frontend separately, as it will be running concurrently with the backend. Simply follow the frontend installation steps provided earlier to run the entire application.

Thank you for choosing Coursefinity! We hope you have a great learning experience.
