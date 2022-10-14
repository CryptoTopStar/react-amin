import Apis from '@/utils/apis';
import { history } from 'umi';
import { message } from 'antd';

const LoginModel = {
    namespace: 'loginModel',
    state: {
        status: null,
        userInfo: {},
    },
    effects: {
        *login({ payload }, { call, put }) {
            const { username, psw } = payload;
            const data = {
                username: username,
                password: psw,
            };
            const response = yield call(http.login, data);
            // 登录成功
            yield put({
                type: 'saveAccountInfo',
                payload: response,
            });
            if (response.token) {
                localStorage.setItem('userInfo', JSON.stringify(response));
                if (history.location.query.redirect) {
                    window.location.href = decodeURIComponent(
                        history.location.query.redirect,
                    );
                } else {
                    window.location = '/index';
                }
            }
        },
        *logout({ payload }, { call, put }) {
            localStorage.clear();
            if (window.location.pathname !== '/login') {
                let org = window.location;
                window.location.href =
                    org.origin +
                    '/login?redirect=' +
                    encodeURIComponent(org.href);
            }
        },
    },
    reducers: {
        saveAccountInfo(state, action) {
            return {
                ...state,
                userInfo: action.payload,
            };
        },
    },
};

export default LoginModel;
