"""Run the lab 6 notebook code cells without Jupyter, using a fresh namespace."""
from pathlib import Path
import json, os

root = Path(__file__).resolve().parents[1]
os.chdir(root)
notebook = json.loads((root / "notebooks/lab6_monte_carlo.ipynb").read_text(encoding="utf-8"))
scope = {"__name__": "__main__"}
for index, cell in enumerate(notebook["cells"], 1):
    if cell["cell_type"] == "code":
        exec(compile("".join(cell["source"]), f"notebook-cell-{index}", "exec"), scope)
