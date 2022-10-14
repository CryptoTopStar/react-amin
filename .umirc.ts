import { defineConfig } from 'umi';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    hash: true,
    antd: {},
    dva: {
        immer: { enableES5: true },
        hmr: true,
    },
    define: {
        REACT_APP_ENV,
    },
    // qiankun: {
    //     master: {
    //         // 注册子应用信息
    //         apps: [
    //             {
    //                 name: 'app1', // 唯一 id
    //                 entry: '//localhost:7001', // html entry
    //             },
    //             {
    //                 name: 'app2', // 唯一 id
    //                 entry: '//localhost:7002', // html entry
    //             },
    //         ],
    //     },
    // },
    locale: {
        default: 'zh-CN',
        antd: true,
        baseNavigator: true,
    },
    dynamicImport: {},
    targets: {
        ie: 11,
    },
    ignoreMomentLocale: true,
    fastRefresh: {},
    proxy: {
        '/admin': {
            // target: 'http://pre-pinghu-szgzt-apiadmini.hzanchu.com',
            target: 'http://pinghu-szgzt-apiadmini.hzanchu.com',
            secure: false,
            changeOrigin: true,
        },
    },
    routes: [
        { path: '/login', component: '@/pages/login/index', title: '登录' },
        {
            path: '/integrationPage',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/integrationPage',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/integrationPage/index',
                            component: '@/pages/integration/index',
                            title: '业务集成',
                        },
                    ],
                },
            ],
        },
        {
            path: '/project',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/project',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/project/index',
                            component: '@/pages/projectManage/index',
                            title: '大屏展示',
                        },
                        {
                            path: '/project/project',
                            component: '@/pages/projectManage/project/index',
                            title: '项目管理',
                        },
                        {
                            path: '/project/building',
                            component: '@/pages/projectManage/building/index',
                            title: '建设单位账号管理',
                        },
                        {
                            path: '/project/duty',
                            component: '@/pages/projectManage/duty/index',
                            title: '责任单位账号管理',
                        },
                        {
                            path: '/project/system',
                            component: '@/pages/projectManage/system/index',
                            title: '系统设置',
                        },
                    ],
                },
            ],
        },
        {
            path: '/backEnd',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/backEnd',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/backEnd/index',
                            component: '@/pages/backEnd/index',
                            title: '业务后台',
                        },
                    ],
                },
            ],
        },
        {
            path: '/opening',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/opening',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/opening/index',
                            component: '@/pages/opening/index',
                            title: '数据开放',
                        },
                    ],
                },
            ],
        },
        {
            path: '/synergism',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/synergism',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/synergism/index',
                            component: '@/pages/synergism/index',
                            title: '数据协同',
                        },
                    ],
                },
            ],
        },
        {
            path: '/report',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/report',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/report/index',
                            component: '@/pages/report/index',
                            title: '数据上报',
                        },
                        {
                            path: '/report/auth',
                            component: '@/pages/report/auth/index',
                            title: '授权管理',
                        },
                        {
                            path: '/report/system',
                            component: '@/pages/report/system/index',
                            title: '系统设置',
                        },
                    ],
                },
            ],
        },
        {
            path: '/workBench',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/workBench',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/workBench/config',
                            component: '@/pages/workBench/config/index',
                            title: '后台配置',
                        },
                        {
                            path: '/workBench/account',
                            component: '@/pages/workBench/account/index',
                            title: '账户管理',
                        },
                    ],
                },
            ],
        },
        {
            path: '/',
            component: '@/layouts/commonLayout',
            routes: [
                {
                    path: '/',
                    component: '@/layouts/bottomContainer',
                    routes: [
                        {
                            path: '/',
                            component: '@/pages/homePage/index',
                            title: '首页',
                        },
                    ],
                },
            ],
        },
    ],
});
