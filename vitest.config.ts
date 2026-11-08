import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { environment: "node", include: ["tests/unit/**/*.test.ts"], coverage: {
    provider: "v8", include: ["src/lib/auth.ts", "src/lib/requestAuth.ts", "src/lib/validation.ts"],
    reporter: ["text", "json-summary"], thresholds: { lines: 80, branches: 70 },
  } },
});
