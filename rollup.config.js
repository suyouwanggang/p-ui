import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import babel from "rollup-plugin-babel";
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import minifyHTML from 'rollup-plugin-minify-html-literals';

export default {
	input: ['index.ts'],
	output:[ {
		file: 'build/index.js',
        format: 'cjs',
		sourcemap: false
	},{
		file: 'build/index.umd.js',
        format: 'umd',
		sourcemap: false
	},{
		file: 'build/index.es.js',
        format: 'es',
		sourcemap: false
	}],
	plugins: [
		//minifyHTML(),
		typescript(),
		resolve(),
		commonjs(),
		builtins(),
		babel({
			/*exclude: 'node_modules/**'*/
		})
		
		//,terser()  /*压缩js*/
  ]
};

