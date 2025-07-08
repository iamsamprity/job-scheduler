import sys
import json

def schedule_jobs(jobs):
    jobs.sort(key=lambda x: x['profit'], reverse=True)
    max_deadline = max(job['deadline'] for job in jobs)
    time_slots = [False] * (max_deadline + 1)
    result = []
    total_profit = 0

    for job in jobs:
        for end_day in range(job['deadline'], job['duration'] - 1, -1):
            # Check if all days in this window are free
            if all(not time_slots[day] for day in range(end_day - job['duration'] + 1, end_day + 1)):
                # Mark these days as occupied
                for day in range(end_day - job['duration'] + 1, end_day + 1):
                    time_slots[day] = True
                # Save the scheduled days for this job
                result.append({
                    "id": job['id'],
                    "deadline": job['deadline'],
                    "profit": job['profit'],
                    "duration": job['duration'],
                    "time_slots": list(range(end_day - job['duration'] + 1, end_day + 1))
                })
                total_profit += job['profit']
                break

    return {'scheduledJobs': result, 'totalProfit': total_profit}

if __name__ == "__main__":
    jobs = json.loads(sys.stdin.read())
    output = schedule_jobs(jobs)
    print(json.dumps(output))
