# Multi-Container Docker Deployment Guide

## Architecture Overview

Your Savi AI application is now containerized into multiple services for better scalability, maintainability, and resource management.

### Services

```
┌──────────────────────────────────────────────────────────┐
│                  Docker Network: saviai-network           │
│                                                            │
│  ┌─────────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │  Next.js App    │  │   MongoDB   │  │  AI Service  │  │
│  │   Port: 3000    │  │  Port: 27017│  │  Port: 5000  │  │
│  │                 │  │             │  │              │  │
│  │ • Frontend      │  │ • Database  │  │ • AI Engine  │  │
│  │ • API Routes    │  │ • Persistence│ │ • ML Models  │  │
│  └─────────────────┘  └─────────────┘  └──────────────┘  │
│         │                   │  ▲              │            │
│         └───────────────────┼──┼──────────────┘            │
│                             │  │                           │
│                       Connected via Bridge                 │
└──────────────────────────────────────────────────────────┘
```

### Service Details

#### 1. **MongoDB** (`saviai_mongodb`)
- **Image**: mongo:7-alpine
- **Port**: 27017
- **Purpose**: Central database for all application data
- **Persistence**: Docker volume `mongodb_data`
- **Health Check**: Enabled with 10s intervals
- **Environment Variables**:
  - `MONGO_ROOT_USER`: MongoDB admin username
  - `MONGO_ROOT_PASSWORD`: MongoDB admin password

#### 2. **Next.js App** (`saviai_app`)
- **Dockerfile**: `./Dockerfile`
- **Port**: 3000
- **Purpose**: Frontend and API backend
- **Connects to**: MongoDB, AI Service
- **Environment Variables**:
  - `NODE_ENV`: production
  - `MONGODB_URI`: Connection string to MongoDB
  - `AI_SERVICE_URL`: URL to AI microservice

#### 3. **AI Service** (`saviai_ai_service`)
- **Dockerfile**: `./services/ai/Dockerfile`
- **Port**: 5000
- **Purpose**: Dedicated AI operations (question generation, etc.)
- **Connects to**: MongoDB
- **Endpoints**:
  - `POST /api/ai/generate-aptitude` - Generate aptitude questions
  - `POST /api/ai/generate-coding` - Generate coding problems
  - `GET /health` - Health check

---

## Setup Instructions

### Prerequisites
- Docker
- Docker Compose (v20.10+)
- `.env` file with required variables

### Environment Variables (.env)

```env
# MongoDB Configuration
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=your_secure_password
MONGODB_URI=mongodb://admin:your_secure_password@mongodb:27017/saviai_db?authSource=admin

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# AI Service
AI_SERVICE_URL=http://ai-service:5000

# Database
DB_NAME=saviai_db
```

### Build and Run

#### 1. **Build Images**
```bash
docker-compose build
```

#### 2. **Start Services**
```bash
docker-compose up -d
```

#### 3. **View Logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nextjs-app
docker-compose logs -f mongodb
docker-compose logs -f ai-service
```

#### 4. **Stop Services**
```bash
docker-compose down
```

#### 5. **Remove Volumes (Reset Database)**
```bash
docker-compose down -v
```

---

## Service Communication

### Next.js App → MongoDB
```typescript
// Uses MONGODB_URI environment variable
import clientPromise from './lib/mongodb'
const client = await clientPromise
const db = client.db('saviai_db')
```

### Next.js App → AI Service
```typescript
// Uses AI_SERVICE_URL environment variable
const response = await fetch('http://ai-service:5000/api/ai/generate-aptitude', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ topic, difficulty, count })
})
```

### AI Service → MongoDB
```javascript
const client = await clientPromise
const db = client.db('saviai_db')
const questions = await db.collection('aptitude_questions').findOne(...)
```

---

## Port Mapping

| Service | Internal Port | External Port | Purpose |
|---------|---------------|---------------|---------|
| Next.js | 3000 | 3000 | Web interface & API |
| MongoDB | 27017 | 27017 | Database access |
| AI Service | 5000 | 5000 | AI API endpoints |

---

## Health Checks

### MongoDB
```bash
docker exec saviai_mongodb mongosh -u admin -p password --eval "db.adminCommand('ping')"
```

### Next.js App
```bash
curl http://localhost:3000
```

### AI Service
```bash
curl http://localhost:5000/health
```

---

## Troubleshooting

### MongoDB Connection Failed
- Verify MongoDB container is running: `docker-compose ps`
- Check credentials in `.env`
- Ensure health check passed before Next.js starts

### AI Service Not Responding
- Check if service is running: `docker-compose logs ai-service`
- Verify `AI_SERVICE_URL` in Next.js environment

### Port Already in Use
```bash
# Find and stop containers using ports
docker ps
docker stop <container_id>
```

---

## Scaling

### Add More AI Service Instances
Update `docker-compose.yml`:
```yaml
ai-service-1:
  build:
    context: ./services/ai
    dockerfile: Dockerfile
  # ... config

ai-service-2:
  build:
    context: ./services/ai
    dockerfile: Dockerfile
  # ... config

# Use a load balancer or API gateway to route requests
```

### Database Replication
For production, configure MongoDB replica sets in `docker-compose.yml`.

---

## Production Considerations

1. **Use Secret Management**: Store sensitive data in Docker Secrets or external vaults
2. **Resource Limits**: Add memory/CPU limits to each service
3. **Restart Policies**: Configured to `unless-stopped`
4. **Volume Backups**: Regular MongoDB backups for persistence
5. **Monitoring**: Add health checks and logging
6. **SSL/TLS**: Implement HTTPS for production

---

## Useful Commands

```bash
# View running containers
docker-compose ps

# Execute command in container
docker-compose exec nextjs-app npm run lint

# Rebuild specific service
docker-compose build nextjs-app

# Restart service
docker-compose restart ai-service

# Remove everything (containers, networks)
docker-compose down

# Remove everything + volumes
docker-compose down -v
```
