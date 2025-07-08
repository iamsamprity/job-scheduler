const fastcsv = require('fast-csv');
const { spawn } = require('child_process');

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
  fs.writeFileSync(CSV_FILE, 'JobID,Deadline,Profit,Duration\n');
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

  // Save new jobs to CSV as before
  const newJobs = jobs.filter(job => !existingJobIDs.has(job.id));
  newJobs.forEach(job => {
    existingJobIDs.add(job.id);
    const line = `${job.id},${job.deadline},${job.profit},${job.duration}\n`;
    fs.appendFileSync(CSV_FILE, line);
  });

  // Call Python script for scheduling
  const python = spawn('python', ['scheduler.py']);
  let dataString = '';

  python.stdin.write(JSON.stringify(jobs));
  python.stdin.end();

  python.stdout.on('data', (data) => {
    dataString += data.toString();
  });

  python.stderr.on('data', (data) => {
    console.error(`Python error: ${data}`);
  });

  python.on('close', (code) => {
    try {
      const result = JSON.parse(dataString);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: 'Failed to parse Python output.' });
    }
  });
});

const csvParser = require('csv-parser'); // Make sure this is installed via `npm install csv-parser`

// 📤 Endpoint to read jobs from CSV
app.get('/read', (req, res) => {
  const jobs = [];
  fs.createReadStream(CSV_FILE)
    .pipe(fastcsv.parse({ headers: true }))
    .on('data', row => {
      const id = row.id || row.JobID;
      const deadline = parseInt(row.deadline || row.Deadline);
      const profit = parseInt(row.profit || row.Profit);
      const duration = parseInt(row.duration || row.Duration);

      if (id && !isNaN(deadline) && !isNaN(profit) && !isNaN(duration)) {
        jobs.push({ id, deadline, profit, duration });
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
