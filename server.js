const fastcsv = require('fast-csv');

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const CSV_FILE = path.join(__dirname, 'jobs.csv');
let existingJobIDs = new Set();

// 🧹 Clear CSV on server start
function initializeCSV() {
  existingJobIDs.clear();
  fs.writeFileSync(CSV_FILE, 'JobID,Deadline,Profit\n');
}

initializeCSV();

// 🔁 Endpoint to clear the CSV via button
app.post('/reset', (req, res) => {
  initializeCSV();
  res.json({ message: 'CSV reset successfully' });
});

// 📥 Download CSV
app.get('/download', (req, res) => {
  res.download(CSV_FILE, 'jobs.csv');
});

// 🧠 Schedule logic + direct file write
app.post('/schedule', (req, res) => {
  const jobs = req.body.jobs;
  if (!Array.isArray(jobs)) return res.status(400).json({ error: 'Invalid job format' });

  const newJobs = jobs.filter(job => !existingJobIDs.has(job.id));
  newJobs.forEach(job => {
    existingJobIDs.add(job.id);
    const line = `${job.id},${job.deadline},${job.profit}\n`;
    fs.appendFileSync(CSV_FILE, line); // ✅ New line for each job
  });

  // Job scheduling algorithm
  jobs.sort((a, b) => b.profit - a.profit);
  const maxDeadline = Math.max(...jobs.map(j => j.deadline));
  const timeSlots = Array(maxDeadline + 1).fill(false);
  const result = Array(maxDeadline + 1).fill(null);
  let totalProfit = 0;

  for (const job of jobs) {
    for (let i = job.deadline; i > 0; i--) {
      if (!timeSlots[i]) {
        timeSlots[i] = true;
        result[i] = job;
        totalProfit += job.profit;
        break;
      }
    }
  }

  const scheduledJobs = result.filter(j => j !== null);
  res.json({ scheduledJobs, totalProfit });
});

const csvParser = require('csv-parser'); // Make sure this is installed via `npm install csv-parser`

// 📤 Endpoint to read jobs from CSV
app.get('/read', (req, res) => {
  const jobs = [];
  fs.createReadStream(CSV_FILE)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', row => {
      const id = row.id || row.JobID; // depends on CSV header
      const deadline = parseInt(row.deadline || row.Deadline);
      const profit = parseInt(row.profit || row.Profit);

      if (id && !isNaN(deadline) && !isNaN(profit)) {
        jobs.push({ id, deadline, profit });
      }
    })
    .on('end', () => {
      res.json(jobs);
    })
    .on('error', (err) => {
      console.error('CSV Read Error:', err);
      res.status(500).json({ error: 'Failed to read CSV file.' });
    });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
