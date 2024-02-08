import type { BunPlugin } from "bun";

import type {
  SFCTemplateCompileOptions,
  SFCAsyncStyleCompileOptions,
  SFCScriptBlock,
} from '@vue/compiler-sfc'

import {
  parse,
  compileScript,
  compileTemplate,
} from "@vue/compiler-sfc";
import { COMP_IDENTIFIER } from "./constant";

export interface Options {
  include: string | RegExp | (string | RegExp)[]
  exclude: string | RegExp | (string | RegExp)[]
  target: 'node' | 'browser'
  exposeFilename: boolean

  customBlocks?: string[]

  // if true, handle preprocessors directly instead of delegating to other
  // rollup plugins
  preprocessStyles?: boolean

  // sfc template options
  templatePreprocessOptions?: Record<
    string,
    SFCTemplateCompileOptions['preprocessOptions']
  >
  compiler?: SFCTemplateCompileOptions['compiler']
  compilerOptions?: SFCTemplateCompileOptions['compilerOptions']
  transformAssetUrls?: SFCTemplateCompileOptions['transformAssetUrls']

  // sfc style options
  postcssOptions?: SFCAsyncStyleCompileOptions['postcssOptions']
  postcssPlugins?: SFCAsyncStyleCompileOptions['postcssPlugins']
  cssModulesOptions?: SFCAsyncStyleCompileOptions['modulesOptions']
  preprocessCustomRequire?: SFCAsyncStyleCompileOptions['preprocessCustomRequire']
  preprocessOptions?: SFCAsyncStyleCompileOptions['preprocessOptions']
}

const defaultOptions: Options = {
  include: /\.vue$/,
  exclude: [],
  target: 'browser',
  exposeFilename: false,
  customBlocks: [],
}

function isTypescript(block: SFCScriptBlock | null) {
  const lang = block?.lang;

  if (!lang) return false;

  return ["ts", "tsx"].includes(lang)
}

const VuePlugin: BunPlugin = {
  name: "bun-plugin-vue",

  setup(build) {
    build.onLoad({ filter: /\.vue$/ }, async (option) => {
      const code = await Bun.file(option.path).text();

      let contents = `const ${COMP_IDENTIFIER} = `;

      const descriptor = parse(code, { filename: "XX.vue" }).descriptor;

      // 编译脚本
      if (descriptor.script || descriptor.scriptSetup) {
        descriptor.script
        if (isTypescript(descriptor.script)) {
          // TODO: 需要转换
          console.log(descriptor.script)
        }

        const { content: scriptCode } = compileScript(descriptor, { id: "XX.vue" });
        contents = scriptCode.replace("export default ", contents);
      }

      // 编译 template
      const template = descriptor.template?.content;
      if (template) {
        let { code: templateCode } = compileTemplate({ source: template, id: "XX", filename: "XX.vue" });

        templateCode = templateCode.replace("export function render", `${COMP_IDENTIFIER}.render = function`)

        contents = contents + `\n${templateCode}`;
      }

      contents = contents + `\n\nexport default ${COMP_IDENTIFIER}`;

      return {
        contents,
        loader: 'js'
      };
    });
  }
}

export default (userOptions: Partial<Options>) => {
  const options: Options = {
    ...defaultOptions,
    ...userOptions
  }

  return VuePlugin
};
