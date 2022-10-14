import Apis from '@/utils/apis';
import { history } from 'umi';
const BaseModel = {
    namespace: 'baseModel',
    state: {
        homeTitle: sessionStorage.getItem('globalStateHomeTitle')
            ? sessionStorage.getItem('globalStateHomeTitle')
            : 'home',
    },
    reducers: {
        changeHomeTitle(state, action) {
            state.homeTitle = action.payload;
            sessionStorage.setItem('globalStateHomeTitle', state.homeTitle);
        },
        initBaseState(state, action) {
            sessionStorage.setItem('globalStateHomeTitle', 'home');
            state.homeTitle = 'home';
        },
    },
};

export default BaseModel;
