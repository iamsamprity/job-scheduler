import sys
import json

def schedule_jobs(jobs):
    jobs.sort(key=lambda x: x['profit'], reverse=True)
    max_deadline = max(job['deadline'] for job in jobs)
    # Each slot represents a day; False means free
    time_slots = [False] * (max_deadline + 1)
    result = []
    total_profit = 0

    for job in jobs:
        # Try to find a window of 'duration' free days ending at or before deadline
        for end_day in range(job['deadline'], job['duration'] - 1, -1):
            # Check if all days in this window are free
            if all(not time_slots[day] for day in range(end_day - job['duration'] + 1, end_day + 1)):
                # Mark these days as occupied
                for day in range(end_day - job['duration'] + 1, end_day + 1):
                    time_slots[day] = True
                result.append(job)
                total_profit += job['profit']
                break

    return {'scheduledJobs': result, 'totalProfit': total_profit}

if __name__ == "__main__":
    jobs = json.loads(sys.stdin.read())
    output = schedule_jobs(jobs)
    print(json.dumps(output))
