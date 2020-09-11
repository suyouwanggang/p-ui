import resolve from 'rollup-plugin-node-resolve';
import babel from "rollup-plugin-babel";
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import filesize from 'rollup-plugin-filesize';

export default [
{
		input: ['index.ts'],
		output:[ {
			file: 'build/index.js',
			format: 'esm',
			sourcemap: true
		}
		
		],	
		plugins: [
			typescript(),
			resolve(),
			//terser(), /*压缩js*/
//			filesize()
	]
},
// {
//     input: ['index.ts'],
//     output: {
//       file: 'build/index.legacy.js',
// 	  sourcemap:true,
//       format: 'esm'
//     },
//     plugins: [
// 	  resolve(),
// 	  typescript({
// 		exclude: "node_modules/**",
// 		typescript: require("typescript")
// 	  }),
//       commonjs({
//         include: 'node_modules/**'
//       }),
//       babel({
//         runtimeHelpers: true,
//         presets: [
//           [
//             '@babel/preset-env',
//             {
//               useBuiltIns: false,
//               modules: false,
//               targets: {
//                 browsers: '> 1%, IE 11, not dead'
//               }
//             }
//           ]
//         ],
//         plugins: ['@babel/plugin-transform-runtime']
//       }),
//     //  terser(),
//       filesize()
//     ]
//   }
]
