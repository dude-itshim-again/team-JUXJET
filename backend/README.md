# Civic Complaint Management Platform Backend (SIH 26043)

Enterprise backend architecture built using **NestJS**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Validation**: `class-validator` and `class-transformer`
- **Security & Auth**: Passport JWT, Role-Based Access Control (`RolesGuard`), and Mock OTP authentication
- **Architecture**: Modular Domain-Driven Design (`AuthModule`, `ComplaintsModule`, `DepartmentsModule`, `PrismaModule`)

---

## 📦 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma              # Database schema (User, Complaint, ComplaintHistory, Department)
├── src/
│   ├── auth/                      # Authentication & Access Control
│   │   ├── decorators/            # @Roles(), @CurrentUser()
│   │   ├── dto/                   # RequestOtpDto, VerifyOtpDto
│   │   ├── guards/                # JwtAuthGuard, RolesGuard
│   │   ├── strategies/            # JwtStrategy (Passport)
│   │   ├── auth.controller.ts     # POST /auth/otp/request, POST /auth/otp/verify
│   │   ├── auth.service.ts        # OTP validation & JWT token issuance
│   │   └── auth.module.ts
│   ├── complaints/                # Complaint management & status workflows
│   │   ├── dto/                   # CreateComplaintDto, UpdateComplaintStatusDto
│   │   ├── complaints.controller.ts # REST endpoints for complaints
│   │   ├── complaints.service.ts  # Complaint ticket generation, transaction & history
│   │   └── complaints.module.ts
│   ├── departments/               # Department routing & assignment
│   │   ├── dto/                   # CreateDepartmentDto, AssignDepartmentDto
│   │   ├── departments.controller.ts # Department listing, creation & assignment
│   │   ├── departments.service.ts
│   │   └── departments.module.ts
│   ├── prisma/                    # Global database client provider
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts              # Root NestJS module
│   └── main.ts                    # Bootstrap with global ValidationPipe & CORS
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update the `DATABASE_URL` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/civic_complaints_db?schema=public"
JWT_SECRET="super-secret-jwt-key-for-sih26043-civic-platform-replace-in-production"
PORT=3000
```

### 2. Run Database Migrations
Generate Prisma Client:
```bash
npx prisma generate
```
Apply migrations to PostgreSQL:
```bash
npx prisma migrate dev --name init
```

### 3. Start the Backend Server
```bash
# Development mode with hot-reload
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## 📡 API Reference

### 🔐 1. Authentication (`/auth`)

#### Request OTP
- **Endpoint**: `POST /auth/otp/request`
- **Body**:
  ```json
  {
    "phone": "9876543210"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to 9876543210",
    "mockOtp": "123456",
    "expiresInSeconds": 300
  }
  ```

#### Verify OTP & Get JWT
- **Endpoint**: `POST /auth/otp/verify`
- **Body**:
  ```json
  {
    "phone": "9876543210",
    "otp": "123456",
    "name": "Sahil",
    "role": "CITIZEN" 
  }
  ```
  *(Note: `role` can be `CITIZEN`, `STAFF`, or `ADMIN` for testing purposes)*
- **Response**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "user": {
      "id": "uuid-string",
      "phone": "9876543210",
      "name": "Sahil",
      "role": "CITIZEN"
    }
  }
  ```

---

### 📝 2. Complaints (`/complaints`)

#### Submit Complaint
- **Endpoint**: `POST /complaints`
- **Headers**: `Authorization: Bearer <CITIZEN_JWT>`
- **Access**: Restricted to `CITIZEN`
- **Body**:
  ```json
  {
    "title": "Severe pothole on Main Street",
    "description": "Deep pothole causing traffic congestion and accident risk near Sector 4.",
    "category": "Roads & Infrastructure",
    "priority": "HIGH",
    "latitude": 28.6139,
    "longitude": 77.2090
  }
  ```
- **Response**:
  ```json
  {
    "id": "uuid-...",
    "complaintNumber": "CMP-20260922-8412",
    "title": "Severe pothole on Main Street",
    "status": "SUBMITTED",
    "priority": "HIGH",
    "latitude": 28.6139,
    "longitude": 77.2090,
    "createdAt": "2026-09-22T11:20:00.000Z"
  }
  ```

#### Get My Complaints
- **Endpoint**: `GET /complaints/mine`
- **Headers**: `Authorization: Bearer <CITIZEN_JWT>`
- **Access**: Restricted to `CITIZEN`
- **Returns**: Array of complaints submitted by the authenticated citizen, including status history timeline.

#### View All Municipal Complaints
- **Endpoint**: `GET /complaints?status=SUBMITTED&category=Roads`
- **Headers**: `Authorization: Bearer <STAFF_OR_ADMIN_JWT>`
- **Access**: Restricted to `STAFF`, `ADMIN`

#### Get Complaint Details
- **Endpoint**: `GET /complaints/:id`
- **Headers**: `Authorization: Bearer <JWT>`
- **Returns**: Full complaint record with audit history trail and department assignments.

#### Update Complaint Status
- **Endpoint**: `PATCH /complaints/:id/status`
- **Headers**: `Authorization: Bearer <STAFF_OR_ADMIN_JWT>`
- **Access**: Restricted to `STAFF`, `ADMIN`
- **Body**:
  ```json
  {
    "status": "IN_PROGRESS",
    "remarks": "Assigned road maintenance team dispatched to location"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Complaint status successfully updated from ASSIGNED to IN_PROGRESS",
    "complaint": { ... },
    "historyRecord": {
      "id": "uuid",
      "previousStatus": "ASSIGNED",
      "newStatus": "IN_PROGRESS",
      "timestamp": "2026-09-22T11:22:00.000Z"
    }
  }
  ```

---

### 🏢 3. Departments (`/departments`)

#### List Departments
- **Endpoint**: `GET /departments`

#### Create Department
- **Endpoint**: `POST /departments`
- **Headers**: `Authorization: Bearer <ADMIN_JWT>`
- **Access**: Restricted to `ADMIN`
- **Body**:
  ```json
  {
    "name": "Public Works & Road Safety",
    "jurisdiction": "Central Zone"
  }
  ```

#### Assign Complaint to Department
- **Endpoint**: `PATCH /departments/assign/:complaintId`
- **Headers**: `Authorization: Bearer <STAFF_OR_ADMIN_JWT>`
- **Access**: Restricted to `STAFF`, `ADMIN`
- **Body**:
  ```json
  {
    "departmentId": "<department-uuid>"
  }
  ```
