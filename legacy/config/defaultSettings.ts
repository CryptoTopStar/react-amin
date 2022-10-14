import { MenuTheme } from 'antd/es/menu/MenuContext';

export type ContentWidth = 'Fluid' | 'Fixed';

export interface DefaultSettings {
    /**
     * theme for nav menu
     */
    navTheme: MenuTheme;
    /**
     * primary color of ant design
     */
    primaryColor: string;
    /**
     * nav menu position: `sidemenu` or `topmenu`
     */
    layout: 'sidemenu' | 'topmenu';
    /**
     * layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
     */
    contentWidth: ContentWidth;
    /**
     * sticky header
     */
    fixedHeader: boolean;
    /**
     * auto hide header
     */
    autoHideHeader: boolean;
    /**
     * sticky siderbar
     */
    fixSiderbar: boolean;
    menu: { locale: boolean };
    title: string;
    pwa: boolean;
    // Your custom iconfont Symbol script Url
    // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
    // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
    // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
    iconfontUrl: string;
    colorWeak: boolean;
}

export default {
    navTheme: 'dark',
    primaryColor: '#1890ff',
    layout: 'topmenu',
    contentWidth: 'Fluid',
    fixedHeader: true,
    autoHideHeader: false,
    fixSiderbar: false,
    colorWeak: false,
    menu: {
        locale: false,
    },
    title: '项目管理',
    pwa: false,
    iconfontUrl: '//at.alicdn.com/t/font_1826039_fgsa2dtuvc.js',
} as DefaultSettings;
