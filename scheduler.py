import sys
import json

def job_scheduling(jobs):
    jobs.sort(key=lambda x: x['profit'], reverse=True)
    max_deadline = max(job['deadline'] for job in jobs)
    slots = [False] * (max_deadline + 1)
    result = [None] * (max_deadline + 1)
    total_profit = 0

    for job in jobs:
        for t in range(job['deadline'], 0, -1):
            if not slots[t]:
                slots[t] = True
                result[t] = job
                total_profit += job['profit']
                break

    scheduled = [j for j in result if j]
    return scheduled, total_profit

if __name__ == "__main__":
    input_json = sys.stdin.read()
    jobs = json.loads(input_json)
    scheduled_jobs, total_profit = job_scheduling(jobs)
    print(json.dumps({"scheduledJobs": scheduled_jobs, "totalProfit": total_profit}))
