// 打包 esm
await Bun.build({
  entrypoints: ["./src/index.ts"],
  outdir: "./lib",
  minify: true,
});
