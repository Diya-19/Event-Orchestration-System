# Event-Orchestration-System

This README provides clear instructions on how to set up, migrate, and run both the backend and frontend components of this application.

## Prerequisites

Ensure you have the following installed on your machine:
- **Docker** and **Docker Compose**
- **Python 3.x**
- **Node.js** and **npm**
- **PostgreSQL CLI** (for the `createdb` command)

### Development Summary
Backend API URL: http://localhost:8000 (Default Uvicorn port)

Frontend App URL: Check terminal output after running npm run dev (usually http://localhost:517)

Database Service: Managed via Docker Compose EOF

### Project Structure Overview 

├── backend/            # FastAPI backend application
│   ├── app/
│   │   └── main.py     # Main API entry point
│   ├── alembic/        # DB Migration scripts and environment configuration
│   └── requirements.txt# Python dependencies
├── frontend/           # Frontend web application
│   ├── package.json    # Node scripts and dependencies
│   └── src/            # Frontend source files
└── docker-compose.yml  # Docker service configurations (PostgreSQL)

---

## Step-by-Step Installation & Setup

### 1. Start the Database
Spin up the PostgreSQL database container in the background:
```bash
docker compose up db -d

# Navigate to backend directory
cd backend
python -m venv venv

# Activate the virtual environment:
# On macOS/Linux:
source venv/bin/activate
# On Windows (Command Prompt):
# venv\Scripts\activate.bat
# On Windows (PowerShell):
# .\venv\Scripts\Activate.ps1

pip install -r requirements.txt

# Create the target PostgreSQL database
createdb eventdb

# Generate the initial migration script for the events table
alembic revision --autogenerate -m "create events table"

# Apply migrations to the head version
alembic upgrade head

# Launch the FastAPI/Uvicorn development server with hot-reloading enabled:
cd backend && uvicorn app.main:app --reload

# Open a new terminal window or tab, navigate to the frontend directory, install Node dependencies, and start the development server:
cd frontend
npm install
npm run dev

>>>>>>> 43f426b (Initial commit with project setup and README)
