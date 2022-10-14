// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
    hash: true,
    antd: {},
    dva: {
        hmr: true,
    },
    locale: {
        default: 'zh-CN',
        antd: true,
        baseNavigator: true,
    },
    dynamicImport: {},
    targets: {
        ie: 11,
    },
    nodeModulesTransform: {
        type: 'none',
    },
    ignoreMomentLocale: true,
    proxy: proxy[REACT_APP_ENV || 'dev'],
    layout: {},
    routes: [{ path: '/', component: '@/pages/index', title: 'asas' }],
    fastRefresh: {},
});
