import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const root = read("../package.json");
const ui = read("../packages/ui/package.json");
assert.equal(root.private, true);
assert.equal(root.type, "module");
assert.deepEqual(root.workspaces, ["packages/*"]);
assert.equal(ui.name, "@rittick/ui");
assert.equal(ui.private, true);
assert.equal(ui.type, "module");
for (const name of ["ARCHITECTURE.md", "PROGRESS.md", "DEVELOPMENT_PROGRESS.md"])
  assert.ok(existsSync(new URL(`../${name}`, import.meta.url)), `${name} missing`);
console.log("UI-001 workspace checks passed");
