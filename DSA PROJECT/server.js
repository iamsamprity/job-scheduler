const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Job Scheduling Logic (Greedy)
app.post('/schedule', (req, res) => {
  const jobs = req.body.jobs;

  // Sort by descending profit
  jobs.sort((a, b) => b.profit - a.profit);

  let maxDeadline = Math.max(...jobs.map(job => job.deadline));
  let result = Array(maxDeadline).fill(null);
  let totalProfit = 0;

  for (let job of jobs) {
    for (let i = job.deadline - 1; i >= 0; i--) {
      if (result[i] === null) {
        result[i] = job;
        totalProfit += job.profit;
        break;
      }
    }
  }

  const scheduledJobs = result.filter(Boolean);
  res.json({ scheduledJobs, totalProfit });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

