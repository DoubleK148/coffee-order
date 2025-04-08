import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            jsxImportSource: '@emotion/react',
            babel: {
                plugins: ['@emotion/babel-plugin']
            }
        })
    ],
    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false
            }
        }
    },
    define: {
        'process.env': {}
    },
    optimizeDeps: {
        include: [
            '@emotion/react',
            '@emotion/styled',
            '@mui/material',
            '@mui/system',
            '@mui/icons-material',
            '@mui/x-date-pickers',
            'date-fns'
        ],
        exclude: []
    },
    build: {
        commonjsOptions: {
            include: [/node_modules/],
            transformMixedEsModules: true
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    'mui': ['@mui/material', '@mui/icons-material', '@mui/system'],
                    'vendor': ['react', 'react-dom', 'react-router-dom']
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@assets': path.resolve(__dirname, './src/assets')
        }
    }
});
