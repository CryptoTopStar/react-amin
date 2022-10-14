import Axios from 'axios';
import { message } from 'antd';
import { history } from 'umi';
const Instance = Axios.create({
    baseURL: '/admin',
    timeout: 20000,
    headers: {
        Accept: 'application/vnd.datashare.v1+json',
    },
});
Instance.interceptors.request.use(
    (config) => {
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        if (loginInfo && loginInfo.token) {
            config.headers.Authorization = loginInfo.token;
        }
        // config.headers.Accept = 'application/vnd.datashare.v1+json';
        // if (config.url == '/upload-avatar-image') {
        //   config.headers['Content-Type'] = 'multipart/form-data';
        // }
        return config;
    },
    (error) => Promise.reject(error),
);
Instance.interceptors.response.use((res) => {
    const { code } = res.data;
    // if (code === 500) {
    //   message.error('服务器错误');
    // } else if (code === 1010) {
    //   // history.replace('/index');
    // } else if (code === 1000 || code === 1001) {
    //   // window.location.href = '/login';
    //   // localStorage.clear();
    // } else {
    //   // message.error(res.data.message);
    //   // return Promise.reject(res.data);
    // }
    if (code != 0) {
        if (code === 21001) {
            window.location.href = '/login';
            localStorage.clear();
            sessionStorage.clear();
        }
    }
    return res.data;
});

export default Instance;
