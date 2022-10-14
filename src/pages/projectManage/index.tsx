import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message } from 'antd';

const SynergismPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [src, setSrc] = useState('');
    const [environment, setEnvironment] = useState('http://admini.phxmgl.cn');
    useEffect(() => {
        initAction();
    }, []);
    useEffect(() => {
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        setSrc(
            `${environment}/noHeaderDisplayScreen?secret=` +
                loginInfo.secret +
                '&redirect=1',
        );
    }, [environment]);
    const commitGlobalTitle = (e: any) => {
        dispatch({
            type: 'baseModel/changeHomeTitle',
            payload: e,
        });
    };
    const initAction = () => {
        commitGlobalTitle('projectMana1');
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        if (REACT_APP_ENV) {
            if (REACT_APP_ENV == 'dev') {
                setEnvironment('http://dev-admini.phxmgl.cn');
            }
            if (REACT_APP_ENV == 'pre') {
                setEnvironment('http://pre-admini.phxmgl.cn');
            }
        } else {
            if (loginInfo && loginInfo.secret) {
                setSrc(
                    `${environment}/noHeaderDisplayScreen?secret=` +
                        loginInfo.secret +
                        '&redirect=1',
                );
            }
        }
    };
    return (
        <div className={styles.homePageCon}>
            <iframe
                className={styles.iframeSet}
                src={src}
                width="100%"
                height="1200"
            ></iframe>
        </div>
    );
};
export default connect(({ baseModel }) => ({ baseModel }))(SynergismPage);
