# REACT TODO APP

This document provides step-by-step instructions on how to set up a React project along with a JSON Server for building a front-end application with API data. By following these steps, you'll be able to create a React application that communicates with a JSON Server, making it easier to develop and test your front-end without relying on a real backend.

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- npm (Node Package Manager): npm is included with Node.js installation.
- MongoDB: Install mongodb on your machine

## Step 1: Goto Project directory
```bash
cd todo
```

## Step 2: Install dependencies

Open your terminal and run the following command to install dependencies 

```bash
npm install
```

## Step 2: Start the Backend API
```bash
npm run backend
```

## Step 3: Start the Application
```bash
npm start
```
Your React application will be running at http://localhost:3000

## Step 4: Admin/User login page

Login Url: http://localhost:3000/login

#### Admin credentials
```javascript
username: admin
password: admin
```
#### Admin privileges

An admin us able to delete/modify users once logged in

#### User privileges

A user is able to manage tasks once logged.





