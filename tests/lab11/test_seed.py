"""Deterministic offline checks for lab11 dataset, no external dependencies."""
import csv
import json
import tempfile
import unittest
from pathlib import Path
from scripts.labs.seed_lab11 import generate

class SyntheticDataTests(unittest.TestCase):
    def test_sizes_and_unique_emails(self):
        with tempfile.TemporaryDirectory() as tmp:
            people, activity = generate(tmp)
            self.assertEqual(len(people), 50)
            self.assertEqual(len(activity), 500)
            self.assertEqual(len({p["email"] for p in people}), 50)
            self.assertTrue(all(p["email"].endswith("@example.invalid") for p in people))
            self.assertEqual(len(list(csv.DictReader((Path(tmp)/"synthetic_activities.csv").open()))), 500)

    def test_seed_is_reproducible(self):
        with tempfile.TemporaryDirectory() as a, tempfile.TemporaryDirectory() as b:
            generate(a)
            generate(b)
            for name in ("synthetic_users.csv", "synthetic_activities.csv", "manifest.json"):
                self.assertEqual((Path(a)/name).read_bytes(), (Path(b)/name).read_bytes())

    def test_no_real_contacts_or_db_writes(self):
        with tempfile.TemporaryDirectory() as tmp:
            generate(tmp)
            meta=json.loads((Path(tmp)/"manifest.json").read_text())
            self.assertEqual(meta["origin"], "synthetic-only")
            self.assertFalse(meta["contains_real_personal_data"])
            self.assertFalse(meta["database_writes"])

    def test_invalid_dataset_size_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError):
                generate(tmp, 0, 500)
            with self.assertRaises(ValueError):
                generate(tmp, 20, -1)

if __name__ == "__main__":
    unittest.main()
