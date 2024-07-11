# Real-Time Notification System with Microservices

This project implements a microservices-based real-time notification system using Node.js, Express, MongoDB, RabbitMQ, WebSocket, and JWT authentication.

## Video Demo

Watch a demo of this project on [YouTube](https://youtu.be/5NK8c_IT0ZQ).

## Features

- **User Authentication**: JWT-based authentication middleware (`auth.js`) to secure routes.
- **User Model**: MongoDB models (`user.js`) for storing user information and generating authentication tokens.
- **Notification Model**: MongoDB model (`notification.js`) for storing user notifications.
- **Registration**: User registration endpoint (`registration.js`) with password hashing using bcrypt.
- **Login**: User login endpoint (`login.js`) with password validation and JWT token generation.
- **Notification Routes**: RESTful API endpoints (`notification.js`) for managing notifications:
  - `GET /api/notification/`: Fetch all notifications for the authenticated user.
    - Example: `curl -X GET http://localhost:3000/api/notification/ -H "Authorization: Bearer <your_token_here>"`
  - `GET /api/notification/:id`: Fetch a specific notification by ID.
    - Example: `curl -X GET http://localhost:3000/api/notification/6117f43885d8b29c1c249f55 -H "Authorization: Bearer <your_token_here>"`
  - `PUT /api/notification/:id`: Update a notification as read.
    - Example: `curl -X PUT http://localhost:3000/api/notification/6117f43885d8b29c1c249f55 -H "Authorization: Bearer <your_token_here>"`
  - `POST /api/notification/`: Create a new notification for the authenticated user.
    - Example: `curl -X POST http://localhost:3000/api/notification/ -H "Authorization: Bearer <your_token_here>" -H "Content-Type: application/json" -d '{"message":"New notification message"}'`
- **Real-Time Service(SOCKET.IO AND AMQP Messaging)**:
  - Establish a WebSocket connection for real-time notifications.
  - Listen for new notifications from the queue and broadcast them to the connected users.
- **Client**: The act of marking a notification as read is a client-side action. It indicates that the user has seen or interacted with the notification.

## Installation

1. Clone the repository:
- git clone [(https://github.com/singhshashank25/Real_time_Notification/new/)](https://github.com/singhshashank25/Real_time_Notification)
- cd Real_time_Notification


2. Install dependencies:
  - npm install

4. Set up environment variables:
 - Create a `.env` file based on `.env.example` and configure MongoDB URI, JWT secret, etc.

4. Start the application:
 - npm start or nodemon start or node app.js

## Swagger Documentation

Access Swagger API documentation at [http://localhost:3000/api-docs](http://localhost:3000/api-docs) after starting the application.

## Usage

- Register a new user: `POST /api/register`
- Login with credentials: `POST /api/login`
- Manage notifications: `GET`, `POST`, `PUT` on `/api/notification`

## Contact

For questions or support, please contact Shashank Singh(Me):
- Email: shashanksinghranu@gmail.com
- Phone: +91 9351648062

