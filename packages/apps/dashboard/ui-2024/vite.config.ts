import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		svgr({
			include: '**/*.svg',
			exclude: 'src/assets/icons/excluded/**/*.svg',
		}),
		nodePolyfills({
			// Whether to polyfill `node:` protocol imports.
			protocolImports: true,
		}),
	],
	resolve: {
		alias: {
			'@components': path.resolve(__dirname, './src/components'),
			'@helpers': path.resolve(__dirname, './src/helpers'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@api': path.resolve(__dirname, './src/api'),
		},
	},
	optimizeDeps: {
		include: ['@human-protocol/sdk'],
	},
	build: {
		commonjsOptions: {
			include: [/human-protocol-sdk/, /node_modules/],
		},
	},
	server: {
		port: 3002,
	},
});
