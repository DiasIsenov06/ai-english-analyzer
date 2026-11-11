"""Generate synthetic lab11 QA datasets; never modifies production or any DB."""
import argparse
import csv
import json
import random
from pathlib import Path

TOPICS = ("grammar", "vocabulary", "reading", "listening", "speaking")
LEVELS = ("A1", "A2", "B1", "B2")
SEED = 42

def generate(out_dir, users=50, activities=500):
    if users < 1 or activities < 0 or users > 10000 or activities > 100000:
        raise ValueError("Unsafe dataset size")
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    rng = random.Random(SEED)
    people = [{
        "synthetic_id": f"student-{i:04d}",
        "email": f"student{i:04d}@example.invalid",
        "level": LEVELS[rng.randrange(len(LEVELS))],
        "goal": "Speaking" if i % 2 else "IELTS",
    } for i in range(1, users + 1)]
    sessions = [{
        "activity_id": f"demo-{i:05d}",
        "synthetic_id": people[i % users]["synthetic_id"],
        "topic": TOPICS[rng.randrange(len(TOPICS))],
        "score": rng.randrange(0, 101),
        "duration_minutes": rng.randrange(1, 41),
    } for i in range(activities)]
    for filename, records in (("synthetic_users.csv", people), ("synthetic_activities.csv", sessions)):
        with (out_dir / filename).open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=(records[0].keys() if records else
                (["activity_id", "synthetic_id", "topic", "score", "duration_minutes"])))
            writer.writeheader()
            writer.writerows(records)
    (out_dir / "manifest.json").write_text(json.dumps({
        "origin": "synthetic-only", "seed": SEED, "users": users, "activities": activities,
        "contains_real_personal_data": False, "database_writes": False,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return people, sessions

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="data/lab11")
    parser.add_argument("--users", type=int, default=50)
    parser.add_argument("--activities", type=int, default=500)
    args = parser.parse_args()
    generate(args.out, args.users, args.activities)
    print(f"Generated synthetic data at {args.out}; no database modified.")
