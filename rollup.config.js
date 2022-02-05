import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
// import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const substituteModulePaths = {
}

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.browser,
                format: 'umd',
                name: 'RBTREE',
                sourcemap: true
            },
            {
                file: pkg.main,
                format: 'cjs',
                name: 'RBTREE',
                sourcemap: true
            },
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
            // terser()
        ]
    },
    {
        input: 'build/module/types/index.d.ts',
        output: [{ file: pkg.types, format: "esm" }],
        external: [/\.css$/],
        plugins: [dts()],
    }
];