import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import del from "rollup-plugin-delete";

import pkg from './package.json';

export default [{
  input: 'src/index.ts',
  external: [
    'react',
    'react-dom',
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    external(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser()
  ],
},
{
  input: 'dist/types/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: "esm" }],
  plugins: [
    dts(),
    del({ hook: "buildEnd", targets: "./dist/types" }),
  ],
}];
