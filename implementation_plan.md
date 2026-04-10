# Doctor Appointment Booking System

The goal is to build a full-stack web application for booking doctor appointments using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This comprehensive system will serve Patients, Doctors, and Administrators with a rich set of features and fully realize the provided specification and learning objectives.

## User Review Required

> [!IMPORTANT]
> Thank you for the detailed `verification_plan.txt`. I have thoroughly updated this implementation plan to include **all** missing files, features, database relationships, schema fields, architectural components, and optional technologies identified. 
> Please review the revised, 100% compliant plan before giving the green light to write code!

## System Overview

### Core Features
1. **User Authentication & Role-Based Access Control**
2. **Doctor Search by Specialization**
3. **Appointment Booking, Rescheduling, and Cancellation**
4. **Doctor Availability Management**
5. **Appointment History**
6. **Consultation Record Management & Completion Marker**
7. **Notification and Reminder System**
8. **Patient Dashboard**
9. **Doctor Dashboard**
10. **Admin Dashboard (with booking conflict resolution & doctor approvals)**

### Comprehensive Architecture
To map strictly to the architectural diagram, the backend Node.js application will adopt a service-oriented structure representing:
- **Load Balancer / Web Server** (conceptual, handling incoming client traffic).
- **API Gateway** (Express.js routing layer).
- Core Services: **Authentication Service**, **Appointment Service**, **Notification Service**, **Availability Service**, **Reporting & Records Service**, **Schedule Management Service**, and **Doctor Management**.

> [!NOTE] 
> Optional technologies outlined in the specification will be **mocked/simplified** to keep the MVP clean and submittable:
> - File uploads will use `multer` with local storage in the `uploads/` folder instead of Cloudinary.
> - Notifications (Email/SMS) will be mocked by directly saving records to the MongoDB `Notifications` collection rather than using Twilio/Nodemailer.
> - Live updates via Socket.io will be omitted in favor of simple polling or refresh logic if needed.

### Extended Database Design & ER Relationships
The MongoDB structure will integrate all fields and relationships:

- **Users (Patient):** `patient_id`, `name`, `email`, `password`, `phone`, `date_of_birth`, `role` (1:N with Appointments).
- **Doctors:** `doctor_id`, `name`, `specialization`, `experience`, `hospital` (ref), `fee`, `availableSlots`, `email` (1:N with Appointments).
- **Admins:** `admin_id`, `name`, `email`, `phone` (1:N with managed Doctors).
- **Appointments:** `appointment_id`, `patientId`, `doctorId`, `date`, `start_time`, `end_time`, `reason`, `status`.
- **Notifications:** `notification_id`, `appointment_id`, `message`, `sent_at`, `status`, `type` (Reminder / Confirmation) (1:N with Appointments).
- **Hospitals:** `hospitalName`, `location`, `contactNumber` (1:N with Doctors).
- **Consultation Records:** `appointmentId`, `doctorNotes`, `prescription`.
- **Specializations:** (1:N with Doctors).

---

## Proposed Changes

### Phase 1: Repository Root & General Setup

Ensure the root structure accurately matches the specification.

#### [NEW] [root files](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/)
- `README.md`: Project description matching the project's introduction.
- `package.json`: Root package configuration (e.g., for concurrent scripts).
- `client/` and `server/` directories.

---

### Phase 2: Complete Backend Server Architecture

Implementing the detailed Server structure exactly as listed.

#### [NEW] [server/config](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/server/config)
- `db.js`: Mongoose connection logic.
- `emailConfig.js`: Nodemailer setup.

#### [NEW] [server/models](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/server/models)
- `User.js`, `Doctor.js`, `Admin.js`, `Appointment.js`, `Notification.js`, `Prescription.js`, `Hospital.js`.

#### [NEW] [server/controllers & routes](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/server)
- **Auth:** `authController.js`, `authRoutes.js`.
- **Doctor:** `doctorController.js`, `doctorRoutes.js`.
- **Appointment:** `appointmentController.js`, `appointmentRoutes.js`.
- **Admin:** `adminController.js`, `adminRoutes.js` (including conflict resolution and doctor approvals).
- **Notification:** `notificationController.js`, `notificationRoutes.js`.
- **Prescription:** `prescriptionController.js`, `prescriptionRoutes.js`.

#### [NEW] [server/middleware & utils](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/server)
- **Middleware:** `authMiddleware.js`, `roleMiddleware.js`, `errorMiddleware.js`, `uploadMiddleware.js`.
- **Utils:** `generateToken.js`, `sendAppointmentReminder.js`, `checkDoctorAvailability.js`, `calculateConsultationFee.js`.

#### [NEW] [server/uploads](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/server/uploads)
- `doctor-profiles/`
- `prescriptions/`

#### [NEW] [server root](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/server)
- `server.js`, `package.json`, `.env`.

---

### Phase 3: Complete Frontend Client

Fulfilling the exact Client structure and files in React.

#### [NEW] [client/public & assets](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/client)
- `public/`: `index.html`, `favicon.ico`, `images/`.
- `src/assets/`: `doctor-images/`, `hospital-images/`, `banner-images/`.

#### [NEW] [client/components](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/client/src/components)
- `Navbar.jsx`, `Footer.jsx`, `ProtectedRoute.jsx`.
- Content Cards: `DoctorCard.jsx`, `AppointmentCard.jsx`, `NotificationCard.jsx`, `PrescriptionCard.jsx`.

#### [NEW] [client/pages](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/client/src/pages)
- Auth & Main: `Home.jsx`, `Login.jsx`, `Register.jsx`, `NotFound.jsx`.
- Doctor Flows: `DoctorList.jsx`, `DoctorDetails.jsx`.
- Appointment Flows: `BookAppointment.jsx`, `AppointmentHistory.jsx`.
- Dashboards: `PatientDashboard.jsx`, `DoctorDashboard.jsx`, `AdminDashboard.jsx`.

#### [NEW] [client state mapping & utils](file:///c:/Users/sudas/OneDrive/Projects/fullstack_group_project/client/src)
- **Redux:** `store.js`, `authSlice.js`, `doctorSlice.js`, `appointmentSlice.js`, `notificationSlice.js`, `patientSlice.js`.
- **Services:** `authService.js`, `doctorService.js`, `appointmentService.js`, `notificationService.js`, `prescriptionService.js`.
- **Utils:** `formatDate.js`, `validateForm.js`, `generateTimeSlots.js`.
- **Roots:** `App.js`, `index.js`, `routes.js`.

---

### Phase 4: Validating Educational Outcomes

Throughout development, the code will be tailored to clearly demonstrate the 11 key project outcomes:
1. **Full Stack Development:** Seamless MERN integration.
2. **REST API Design:** Clean boundaries among the 6 primary routes.
3. **Authentication/Authorization:** JWT & `roleMiddleware.js`.
4. **MongoDB Database Design:** Efficient Mongoose schemas matching the ER diagram.
5. **CRUD Operations:** Across Doctors, Appointments, and Users.
6. **Appointment Scheduling Logic:** Demonstrated via `generateTimeSlots.js` & `checkDoctorAvailability.js`.
7. **Notification System Integration:** Implementation of mocked notification logic via MongoDB inserts in `sendAppointmentReminder.js`.
8. **Role-Based Access Control:** Realized in `AdminDashboard`, `DoctorDashboard`, and backend guarding.
9. **React State Management:** Proper structuring of the 5 Redux slices.
10. **Real-world Project Structure:** Maintained perfectly aligned to the context.txt spec.
11. **Deployment Basics:** Readied environment variable separation.

## Open Questions

> [!WARNING]
> Everything is clear based on the specifications. The optional tech integrations (Twilio, Cloudinary, Socket.io, Nodemailer) have been removed from the plan. Instead, we will simulate notifications via MongoDB entries and handle file uploads locally via `multer` to ensure the project remains a clean, submittable MVP.
> 
> **Are you ready to give the green flag to begin scaffolding and coding Phase 1?**
