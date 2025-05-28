# Beer Tracker

A full-stack application for tracking and managing your beer collection. Built with React, Node.js, and PostgreSQL.

## Features

- View your beer collection
- Add new beers with details
- Rate and review beers
- Responsive design for mobile and desktop
- Modern UI with Material-UI components
- RESTful API backend with PostgreSQL database

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- RESTful API architecture
- Docker containerization

## Getting Started

### Prerequisites
- Node.js (v20 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd beverage-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development environment:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:4000
- PostgreSQL on port 5432

### Environment Variables

Create a `.env` file in the backend directory with the following variables:
```env
PORT=4000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=beer_tracker
DB_PASSWORD=postgres
DB_PORT=5432
```

## Development

### Frontend Development
```bash
npm run dev:frontend
```

### Backend Development
```bash
npm run dev:backend
```

### API Endpoints

The backend provides the following RESTful endpoints:

- `GET /api/beers` - Get all beers
- `GET /api/beers/:id` - Get a single beer
- `POST /api/beers` - Create a new beer
- `PUT /api/beers/:id` - Update a beer
- `DELETE /api/beers/:id` - Delete a beer

### Database Schema

The application uses a PostgreSQL database with the following schema:

```sql
CREATE TABLE beers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brewery VARCHAR(255) NOT NULL,
    style VARCHAR(100) NOT NULL,
    abv DECIMAL(4,2) NOT NULL,
    rating DECIMAL(3,1),
    image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Building for Production

```bash
npm run build
```

## License

MIT 