import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import { eslint } from "rollup-plugin-eslint";
import json from "@rollup/plugin-json";

const libraryName = "access-sdk";
const input = "./src/index.ts";
const extensions = [".js", ".ts"];
const plugins = [
  json(),
  resolve({ extensions }),
  commonjs(),
  eslint(),
  babel({
    extensions,
    babelHelpers: "bundled",
    exclude: "node_modules/**",
  }),
];

export default {
  input,
  output: [
    {
      file: "./lib/" + libraryName + ".esm.js",
      format: "esm",
    },
    {
      file: "./lib/" + libraryName + ".js",
      format: "cjs",
      exports: "named",
    },
  ],
  plugins,
  external: ["jose", "@locoworks/cijson-engine", "@locoworks/cijson-utils"],
};
