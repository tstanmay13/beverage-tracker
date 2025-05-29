# Beer Tracker

A full-stack application for tracking and managing your beer collection. Built with React (Vite), Node.js, and PostgreSQL.

## Quick Start

1. Clone and install:
```bash
git clone <repository-url>
cd beverage-tracker
npm install
```

2. Start services:
```bash
docker-compose up -d
```

Access the application at:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Important Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart frontend
docker-compose restart backend
docker-compose restart db

# View logs
docker-compose logs -f [service_name]  # e.g., frontend, backend, or db

# Rebuild a service after dependency changes
docker-compose up -d --build [service_name]
```

## ⚠️ Important Warnings

1. **NEVER** remove Docker volumes or the database container without backing up data first. Data loss will occur.
2. If database data is lost, use the import script to restore:
```bash
# From the backend directory
python src/misc/import_beers.py
```

## Environment Setup

Create `.env` in backend directory:
```env
PORT=4000
DB_USER=postgres
DB_HOST=db
DB_NAME=beer_tracker
DB_PASSWORD=postgres
DB_PORT=5432
```

## API Endpoints

- `GET /api/beers` - List all beers
- `GET /api/beers/:id` - Get single beer
- `POST /api/beers` - Create beer
- `PUT /api/beers/:id` - Update beer
- `DELETE /api/beers/:id` - Delete beer
- `GET /api/user-collections` - Get collections
- `POST /api/user-collections` - Add to collection
- `PUT /api/user-collections` - Update collection

## Tech Stack

- Frontend: React (Vite), TypeScript, Material-UI
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Containerization: Docker

## License

MIT 