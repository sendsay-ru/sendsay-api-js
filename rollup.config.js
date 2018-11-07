import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';

const configs = [
  {
    input: 'src/iife.js',

    output: [
      {
        name: 'sendsay',
        moduleName: 'sendsay',
        file: pkg.browser,
        format: 'iife',
      },
    ],

    plugins: [
      resolve(),

      babel({
        exclude: 'node_modules/**',
      }),

      commonjs({
        ignoreGlobal: true,
      }),

      json(),
    ],
  },

  {
    input: 'src/index.js',

    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
    ],

    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),

      json(),
    ],

    external: [
      'isomorphic-fetch',
      'es6-promise',
    ],
  },
];

if (process.env.NODE_ENV === 'production') {
  configs.push(
    {
      input: 'src/iife.js',

      output: [
        {
          name: 'sendsay',
          moduleName: 'sendsay',
          file: 'dist/sendsay-api.min.js',
          format: 'iife',
        },
      ],

      plugins: [
        resolve(),

        babel({
          exclude: 'node_modules/**',
        }),

        commonjs({
          ignoreGlobal: true,
        }),

        json(),
        uglify(),
      ],
    },
  );
}

export default configs;
