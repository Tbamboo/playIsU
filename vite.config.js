import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
function pathResolve(dir) {
    return resolve(process.cwd(), '.', dir);
}
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        })
    ],
    define: {
        'process.env': {}
    },
    resolve: {
        alias: [{
                find: /\/@\//,
                replacement: pathResolve('src') + '/',
            }]
    },
    server: {
        proxy: {
            '/dev': 'https://www.baidu.com/'
        },
    },
    build: {
        minify: "terser",
        terserOptions: {
            compress: {
                //生产环境时移除console
                drop_console: true,
                drop_debugger: true,
            },
        },
    }
});
