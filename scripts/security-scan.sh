#!/usr/bin/env bash
# Run from a full git clone. Requires Trivy and Gitleaks on PATH.
# Reports may contain sensitive metadata. Gitleaks values are redacted.
set -uo pipefail
umask 077
repo_root="$(git rev-parse --show-toplevel)" || exit 2
cd "$repo_root" || exit 2
for scanner in trivy gitleaks; do
  command -v "$scanner" >/dev/null 2>&1 || { echo "Missing tool: $scanner" >&2; exit 2; }
done
if [ "$(git rev-parse --is-shallow-repository)" = true ]; then
  echo 'Use a full clone; fetch all intended refs before scanning history.' >&2
  exit 2
fi
scan_dir="${SECURITY_SCAN_OUT:-$(mktemp -d)}"
mkdir -p "$scan_dir" || exit 2
scan_dir="$(cd "$scan_dir" && pwd)"
trivy --version > "$scan_dir/versions.txt"
gitleaks version >> "$scan_dir/versions.txt"
git rev-parse HEAD > "$scan_dir/baseline.txt"
git show-ref >> "$scan_dir/baseline.txt"
if trivy fs --scanners vuln,misconfig --include-dev-deps --exit-code 1 \
    --format json --output "$scan_dir/trivy.json" . > "$scan_dir/trivy.log" 2>&1; then
  trivy_status=0
else
  trivy_status=$?
fi
if gitleaks git . --log-opts=--all --redact=100 --no-banner \
    --report-format json --report-path "$scan_dir/gitleaks-history.json" \
    > "$scan_dir/gitleaks-history.log" 2>&1; then
  history_status=0
else
  history_status=$?
fi
if gitleaks dir . --redact=100 --no-banner --report-format json \
    --report-path "$scan_dir/gitleaks-working-tree.json" \
    > "$scan_dir/gitleaks-working-tree.log" 2>&1; then
  tree_status=0
else
  tree_status=$?
fi
printf 'Trivy=%s; Gitleaks history=%s; working tree=%s\nReports: %s\n' \
  "$trivy_status" "$history_status" "$tree_status" "$scan_dir"
echo 'Nonzero means review reports and logs: findings and execution errors both need attention.'
if [ "$trivy_status" -eq 0 ] && [ "$history_status" -eq 0 ] && [ "$tree_status" -eq 0 ]; then
  exit 0
fi
exit 1
