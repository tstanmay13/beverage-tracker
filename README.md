# Beer Tracker

A full-stack application for tracking and managing your beer collection. Built with React, Node.js, and PostgreSQL.

## Features

- View your beer collection
- Add new beers with details
- Remove beers from your list
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

3. Start the development environment (with Docker):
```bash
docker-compose up -d
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
DB_HOST=db
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

#### Beer Object Structure
```json
{
  "id": number,
  "brewery_id": number,
  "name": string,
  "cat_id": number,
  "style_id": number,
  "abv": number,
  "ibu": number,
  "srm": number,
  "upc": number,
  "filepath": string,
  "descript": string,
  "add_user": number,
  "last_mod": string (timestamp)
}
```

### Database Schema

The application uses a PostgreSQL database with the following schema:

```sql
CREATE TABLE IF NOT EXISTS beers (
    id SERIAL PRIMARY KEY,
    brewery_id INTEGER NOT NULL DEFAULT 0,
    name VARCHAR(255) NOT NULL DEFAULT '',
    cat_id INTEGER NOT NULL DEFAULT 0,
    style_id INTEGER NOT NULL DEFAULT 0,
    abv FLOAT NOT NULL DEFAULT 0,
    ibu FLOAT NOT NULL DEFAULT 0,
    srm FLOAT NOT NULL DEFAULT 0,
    upc INTEGER NOT NULL DEFAULT 0,
    filepath VARCHAR(255) NOT NULL DEFAULT '',
    descript TEXT NOT NULL,
    add_user INTEGER NOT NULL DEFAULT 0,
    last_mod TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Resetting the Database
If you change the schema, you may need to drop and recreate the table:
```bash
docker exec -i beverage_tracker-db-1 psql -U postgres -d beer_tracker < backend/src/db/schema.sql
```

You can also insert sample data using SQL commands or a compatible SQL file.

## Building for Production

```bash
npm run build
```

## License

MIT 