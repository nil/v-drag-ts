const { build } = require("esbuild");

const sharedConfig = {
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: true,
};

build({
  ...sharedConfig,
  platform: 'node', // for CJS
  outfile: "dist/index.js",
}).catch(() => process.exit(1));

build({
  ...sharedConfig,
  outfile: "dist/index.esm.js",
  platform: 'neutral', // for ESM
  format: "esm",
}).catch(() => process.exit(1));