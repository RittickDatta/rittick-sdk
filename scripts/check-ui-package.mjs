
import assert from "node:assert/strict";
import {
  existsSync,
  readFileSync,
  readdirSync
} from "node:fs";
import { fileURLToPath } from "node:url";

const packageRoot = new URL("../packages/ui/", import.meta.url);

const manifest = JSON.parse(
  readFileSync(new URL("package.json", packageRoot), "utf8")
);

assert.equal(manifest.name, "@rittick/ui");
assert.equal(manifest.private, true);
assert.equal(manifest.type, "module");
assert.equal(manifest.engines.node, "^22 || ^24");

assert.deepEqual(manifest.exports, {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.js"
  }
});

assert.equal(
  manifest.main,
  manifest.exports["."].import
);

assert.equal(
  manifest.types,
  manifest.exports["."].types
);

assert.deepEqual(manifest.files, ["dist"]);
assert.deepEqual(manifest.sideEffects, ["**/*.css"]);

assert.equal(manifest.peerDependencies.react, "^19.0.0");
assert.equal(manifest.peerDependencies["react-dom"], "^19.0.0");

for (const dependency of ["react", "react-dom"]) {
  assert.ok(
    !Object.hasOwn(manifest.dependencies ?? {}, dependency),
    `${dependency} must not be a regular runtime dependency`
  );
}

const expectedFiles = [
  "index.d.ts",
  "index.js",
  "index.js.map"
].sort();

const distDirectory = new URL("dist/", packageRoot);

assert.ok(
  existsSync(distDirectory),
  "Build output is missing. Run npm run build first."
);

const actualFiles = readdirSync(
  fileURLToPath(distDirectory)
).sort();

assert.deepEqual(
  actualFiles,
  expectedFiles,
  "Unexpected files in the UI-003 build output"
);

for (const target of [
  manifest.exports["."].types,
  manifest.exports["."].import
]) {
  assert.ok(
    existsSync(new URL(target, packageRoot)),
    `Missing package export: ${target}`
  );
}

const sourceMap = JSON.parse(
  readFileSync(
    new URL("dist/index.js.map", packageRoot),
    "utf8"
  )
);

assert.equal(sourceMap.version, 3);
assert.ok(sourceMap.sources.includes("../src/index.ts"));

const publicModule = await import("@rittick/ui");

assert.deepEqual(
  Object.keys(publicModule),
  [],
  "Unexpected public API in the UI-003 bootstrap"
);

await assert.rejects(
  import("@rittick/ui/dist/index.js"),
  { code: "ERR_PACKAGE_PATH_NOT_EXPORTED" }
);

console.log("UI-003 package checks passed");
