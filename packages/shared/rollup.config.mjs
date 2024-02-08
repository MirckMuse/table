import { defineConfig } from 'rollup'
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      file: './esm/index.esm.js',
      format: 'es',
      sourcemap: true,
      globals: {}
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
  ]
});
