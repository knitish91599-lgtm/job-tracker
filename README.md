# Job Application Tracker

A full-stack dashboard to track all your job applications — built with **Angular 19** (standalone components) + **Spring Boot 3.2** + **H2 Database** + **JWT authentication**.

---

## Features

- **Secure Login/Register** with JWT token-based auth
- **Dashboard** with stats: total apps, this week, this month, interviews count, status breakdown
- **CRUD Operations**: Add, edit, delete, view job applications
- **Search & Filter** by company name and status
- **Tracks**: Job ID (auto-generated), company, role, JD, date/time, resume version, link URL, email used, platform, location, salary, notes, status
- **Responsive** design — works on desktop, tablet, and mobile

---

## Project Structure

```
job-tracker/
├── backend/                    # Spring Boot API
│   ├── src/main/java/com/jobtracker/
│   │   ├── config/            # Security config
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Data transfer objects
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Spring Data repos
│   │   ├── security/          # JWT filter & utils
│   │   └── service/           # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # Angular 19 app
│   ├── src/app/
│   │   ├── components/        # Login, Dashboard, JobForm, JobList, Navbar
│   │   ├── guards/            # Auth guard
│   │   ├── interceptors/      # JWT interceptor
│   │   ├── models/            # TypeScript interfaces
│   │   └── services/          # Auth & JobApplication services
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Maven 3.8+** (for backend build)
- **Docker & Docker Compose** (optional, for containerized deployment)

---

## Local Development Setup

### 1. Backend (Spring Boot)

```bash
cd backend

# Build and run
mvn clean install
mvn spring-boot:run
```

The API starts at **http://localhost:8080**
H2 Database Console: **http://localhost:8080/h2-console**
  - JDBC URL: `jdbc:h2:file:./data/jobtracker_db`
  - Username: `sa`
  - Password: (leave empty)

### 2. Frontend (Angular)

```bash
cd frontend

# Install dependencies
npm install

# Install Angular CLI globally (if not already)
npm install -g @angular/cli

# Start dev server with API proxy
ng serve
```

The app opens at **http://localhost:4200**
API calls are proxied to the backend via `proxy.conf.json`.

### 3. First Use

1. Open **http://localhost:4200**
2. Click **Register** tab → create an account
3. Sign in → you land on the **Dashboard**
4. Click **+ New Application** to add your first job

---

## API Endpoints

| Method | Endpoint            | Description              | Auth |
|--------|---------------------|--------------------------|------|
| POST   | /api/auth/register  | Register a new user      | No   |
| POST   | /api/auth/login     | Login, returns JWT       | No   |
| GET    | /api/jobs           | Get all applications     | Yes  |
| GET    | /api/jobs/:id       | Get one application      | Yes  |
| POST   | /api/jobs           | Create application       | Yes  |
| PUT    | /api/jobs/:id       | Update application       | Yes  |
| DELETE | /api/jobs/:id       | Delete application       | Yes  |
| GET    | /api/jobs/search    | Search by company name   | Yes  |
| GET    | /api/jobs/filter    | Filter by status         | Yes  |
| GET    | /api/jobs/stats     | Get dashboard stats      | Yes  |

---

## Docker Deployment (Easiest)

```bash
# From the project root
docker-compose up --build -d
```

- Frontend: **http://localhost** (port 80)
- Backend: **http://localhost:8080**
- Data persists in a Docker volume

To stop: `docker-compose down`

---

## Deploying to the Cloud (Access from Anywhere)

### Option A: Railway (Recommended — Free Tier Available)

Railway is the simplest way to deploy full-stack apps.

1. **Push your code to GitHub**
2. Go to [railway.app](https://railway.app) → Sign in with GitHub
3. **New Project** → Deploy from GitHub repo
4. Railway auto-detects the Spring Boot backend and Angular frontend
5. For the backend service:
   - Set root directory to `/backend`
   - It auto-detects Maven/Java
6. For the frontend service:
   - Set root directory to `/frontend`
   - Build command: `npm run build:prod`
   - Start command: use the Nginx Dockerfile
7. Railway gives you a public URL like `https://your-app.up.railway.app`

**Cost**: Free tier gives ~500 hours/month. Paid starts at $5/month.

### Option B: Render (Free Tier)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create a **Web Service** for backend:
   - Root: `/backend`
   - Runtime: Docker
   - Free tier available
4. Create a **Static Site** for frontend:
   - Root: `/frontend`
   - Build: `npm install && npm run build:prod`
   - Publish: `dist/job-tracker-frontend/browser`
5. Update `environment.prod.ts` with your Render backend URL

### Option C: Oracle Cloud (Always Free)

Oracle Cloud gives you **always-free** VMs (1-2 ARM instances with 24GB RAM total).

1. Create an Oracle Cloud account → provision an **ARM VM** (free)
2. SSH into the VM, install Docker:
   ```bash
   sudo apt update && sudo apt install docker.io docker-compose -y
   ```
3. Clone your repo and run:
   ```bash
   git clone https://github.com/you/job-tracker.git
   cd job-tracker
   docker-compose up --build -d
   ```
4. Open port 80 in Oracle's security list
5. Access via the VM's public IP: `http://<your-vm-ip>`
6. Optional: Get a free domain from [freenom.com](https://freenom.com) or use [nip.io](https://nip.io)

### Option D: AWS EC2 Free Tier

1. Create an AWS account (12 months free tier)
2. Launch a **t2.micro** EC2 instance (Amazon Linux 2)
3. Install Docker, clone repo, run `docker-compose up --build -d`
4. Open port 80 in Security Group
5. Access via public IP

### Option E: Google Cloud Run (Pay-per-use, very cheap)

1. Push Docker images to Google Container Registry
2. Deploy backend and frontend as separate Cloud Run services
3. You only pay when requests are being served

---

## Switching to PostgreSQL (For Production)

Replace H2 with PostgreSQL for a more robust production database:

1. In `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobtracker
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

2. Add to `pom.xml`:
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

3. Add PostgreSQL to `docker-compose.yml`:
```yaml
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: jobtracker
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
```

---

## Security Notes

- **Change the JWT secret** in `application.properties` before deploying!
- For HTTPS, use a reverse proxy like Nginx with Let's Encrypt SSL
- The H2 console is enabled for dev — disable it in production:
  ```properties
  spring.h2.console.enabled=false
  ```

---

## Accessing the Database

- **Via Dashboard**: The Angular frontend IS the dashboard — open it in any browser
- **Via H2 Console**: Go to `http://localhost:8080/h2-console` for direct SQL access
- **Via API**: Use Postman/curl with your JWT token to hit the REST endpoints

---

## License

MIT — Use it freely for your job search!
