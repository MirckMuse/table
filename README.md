# @scode/table

虽然项目起名为稳定的 table，但其实这是一个非常激进的项目，采用的了各种最新的技术。

目标：10 万条数据，单次操作在 60ms 内。

+ Typescript: V5+
+ Vite：当前最新版本 V5+，作为 Demo 的构建工具。
+ Biome: 用作代码校验和格式化来代替 Eslint 和 prettier
+ Rust: 用作 table 核心功能的编写，包括不限于可视窗口的数据获取、类Excel的操作等等。[Future]
+ WebAssembly: 将 Rust 编写的核心模块编译成 wasm 二进制文件。[Future]

## TODO

+ [] 统一触发布局计算的入口
    + [] 可视宽度
    + [] 列宽、行高。

+ [] 虚拟行滚动
+ [] 虚拟列滚动
