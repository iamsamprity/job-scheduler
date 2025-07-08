# Job Scheduling Optimization

A web app to enter jobs with deadlines, profits, and durations, and optimize the schedule for maximum profit using a Python backend for scheduling logic.

---

## Features

- Add jobs with **ID**, **Deadline**, **Profit**, and **Duration**
- View and edit the job list
- Optimize the schedule for maximum profit (multi-day jobs supported)
- View scheduled jobs with assigned time slots
- Download jobs as CSV
- Reset jobs and scheduled jobs

---

## Project Structure

```
job-scheduler/
├── public/
│   └── index.html         # Frontend UI
├── jobs.csv               # Saved jobs
├── scheduled.csv          # Scheduled jobs (output)
├── server.js              # Node.js/Express backend
├── scheduler.py           # Python scheduling logic
├── package.json
```

---

## Getting Started

### 1. Install dependencies

```sh
npm install
```
```sh
npm install csv-parser
```
```sh
npm install fast-csv
```
```sh
npm install -g nodemon
```

### 2. Start the server

```sh
npm run dev
```
or
```sh
nodemon server.js
```

### 3. Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## How It Works

- **Frontend:**  
  Enter jobs and view results in your browser (`public/index.html`).

- **Backend:**  
  - Node.js/Express serves the frontend and handles API requests.
  - When you optimize, the backend sends jobs to `scheduler.py` (Python) for scheduling.
  - Results are saved to `scheduled.csv` and displayed in the UI.

- **Python Scheduler:**  
  - Receives jobs as JSON from Node.js.
  - Schedules jobs using a greedy algorithm (max profit, supports multi-day jobs).
  - Returns scheduled jobs and total profit as JSON.

---

## API Endpoints

- `POST /schedule` — Optimize and schedule jobs
- `GET /read` — Get all jobs from `jobs.csv`
- `GET /read-scheduled` — Get scheduled jobs from `scheduled.csv`
- `POST /reset` — Reset jobs list

---

## Customization

- **Scheduling logic:**  
  Edit `scheduler.py` to change how jobs are scheduled.

- **Frontend:**  
  Edit `public/index.html` for UI changes.

---

## Requirements

- Node.js (v14+ recommended)
- Python 3

---

## License

MIT
