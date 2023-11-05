await Bun.build({
  entrypoints: ["src/table/index.ts"],
  outdir: "./esm"
})