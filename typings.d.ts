declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpg';
declare module '*.gif';
declare module '*.svg' {
    export function ReactComponent(
        props: React.SVGProps<SVGSVGElement>,
    ): React.ReactElement;
    const url: string;
    export default url;
}
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
    | 'site'
    | undefined;

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;
