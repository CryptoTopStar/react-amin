import React, { useEffect, useState } from 'react';
import { Helmet, history, connect } from 'umi';
import TopContainer from './topContainer';
import Apis from '@/utils/apis';
import BottomContainer from './bottomContainer';
import '../../src/pages/index.less';
// 注册service worker
if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('/sw.js');
}
const CommonLayout = (props: any) => {
    const { location, children, dispatch, accountInfo, baseModel, loginModel } =
        props;
    const [current, setCurrent] = useState(0);

    const userInfo = localStorage.getItem('userInfo');
    useEffect(() => {
        if (userInfo) {
            const params = {
                id: JSON.parse(userInfo).uid,
            };
            dispatch({
                type: 'account/getAccountInfo',
                payload: { ...params },
            });
        }
    }, [userInfo]);
    return (
        <div>
            <TopContainer baseModel={baseModel}></TopContainer>
            {/* <BottomContainer></BottomContainer> */}
            {children}
        </div>
    );
};

export default connect(({ baseModel, loginModel }) => ({
    baseModel,
    loginModel,
}))(CommonLayout);
