# Doctor Appointment Booking System

A full stack MERN project for booking and managing doctor appointments with separate patient, doctor, and admin workflows.

## Overview

This project provides:

- Patient registration, login, booking, cancellation, rescheduling, appointment history, and notifications
- Doctor login, availability management, appointment handling, and consultation record management
- Admin login, doctor approval, hospital management, patient monitoring, and system notifications

The frontend is built with React and Vite, and the backend is built with Node.js, Express, and MongoDB.

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, React Router, Axios
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt
- File upload support: multer

## Core Features

### Patient

- Register and log in
- Search doctors by specialization, hospital, location, and slot availability
- Book appointments
- Cancel or reschedule appointments
- View appointment history
- View consultation records after treatment
- Receive appointment and reminder notifications

### Doctor

- Log in after admin approval
- Manage slot-based availability
- View and manage patient appointments
- Confirm or cancel requests
- Add consultation notes and prescriptions
- Complete appointments by saving the consultation record
- Receive workflow notifications

### Admin

- Log in with seeded admin accounts
- Approve or reject doctor registrations
- View system stats
- View doctors and patients
- Create and manage hospital records
- Trigger reminder processing
- Receive operational notifications

## Appointment Workflow

1. Patient registers or logs in
2. Patient searches for a doctor
3. Patient books a time slot
4. Doctor confirms or cancels the request
5. Patient receives updates and reminders
6. Doctor saves consultation notes and prescription
7. Appointment moves to `Completed`
8. Patient can review the consultation record in appointment history

## Project Structure

```text
fullstack_group_project/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── package.json
└── README.md
```

## Installation

### 1. Clone the project

```bash
git clone <your-repo-url>
cd fullstack_group_project
```

### 2. Install dependencies

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Configure environment

Create a `.env` file inside `server/` if needed.

Example:

```env
MONGO_URI=mongodb://localhost:27017/doctor_appointments
JWT_SECRET=supersecret
DEFAULT_PORTAL_PASSWORD=mockpassword
PORT=5000
```

You can also create a `.env` inside `client/` if you want a custom API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running the Project

### Start both frontend and backend

```bash
npm run dev
```

### Start frontend only

```bash
npm run client
```

### Start backend only

```bash
npm run server
```

## Build and Lint

### Frontend build

```bash
npm run build --prefix client
```

### Frontend lint

```bash
npm run lint --prefix client
```

## Seeded Accounts

These accounts are created during backend bootstrap.

### Admin

- `admin@mediluxe.com` / `mockpassword`
- `admin@gmail.com` / `admin@1234`

Note:
- If `DEFAULT_PORTAL_PASSWORD` is set in `server/.env`, that value is used for `admin@mediluxe.com`

### Seeded Doctors

- `doctor1@mediluxe.com` / `mockpassword`
- `doctor2@mediluxe.com` / `mockpassword`
- `doctor3@mediluxe.com` / `mockpassword`

Note:
- Seeded doctors are already approved
- Newly registered doctors must be approved by an admin before login

## API Areas

Main backend route groups:

- `/api/auth`
- `/api/doctors`
- `/api/appointments`
- `/api/admin`
- `/api/notifications`
- `/api/prescriptions`

## Current Limitations

- Notifications are in-app only
- No Twilio or real SMS integration
- No real email sending yet
- Reminder processing is manual/system-triggered, not cron-based
- Availability management is slot-based, not full calendar-based
- Prescription file upload backend exists, but the frontend flow is still basic

## Suggested Demo Flow

For presentation or evaluation, this flow works well:

1. Log in as admin and show doctor approval plus hospital management
2. Log in as patient and book an appointment
3. Log in as doctor and confirm the appointment
4. Save consultation notes and prescription
5. Return to patient account and show completed appointment history plus notifications

## Verification Done

The current project state has been checked with:

- Backend syntax checks
- Frontend lint
- Frontend production build

## Future Improvements

- Real email reminders with Nodemailer
- SMS integration
- Calendar-based doctor schedule management
- Richer reporting and analytics
- Automated reminder scheduler
- More advanced profile management

