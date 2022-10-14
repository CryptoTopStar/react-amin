import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message } from 'antd';
const { REACT_APP_BRIDGE } = process.env;

const SynergismPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [src, setSrc] = useState('');
    const [environment, setEnvironment] = useState('http://szxt.wsnf.cn');
    useEffect(() => {
        initAction();
    }, []);
    useEffect(() => {
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        setSrc(`${environment}/noHeader/openData?secret=` + loginInfo.secret);
    }, [environment]);
    const commitGlobalTitle = (e: any) => {
        dispatch({
            type: 'baseModel/changeHomeTitle',
            payload: e,
        });
    };
    const initAction = () => {
        commitGlobalTitle('synergism');
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        // if (loginInfo && loginInfo.secret) {
        //     setSrc(
        //         'http://dev-sjxt.anchu.vip/noHeader/openData?secret=' +
        //             loginInfo.secret,
        //     );
        // }
        if (REACT_APP_ENV) {
            if (REACT_APP_ENV == 'dev') {
                setEnvironment('http://dev-sjxt.anchu.vip');
            }
            if (REACT_APP_ENV == 'pre') {
                setEnvironment('http://pre-sjxt.anchu.vip');
            }
        } else {
            if (loginInfo && loginInfo.secret) {
                setSrc(
                    `${environment}/noHeader/openData?secret=` +
                        loginInfo.secret,
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
                height="1400"
            ></iframe>
        </div>
    );
};
export default connect(({ baseModel }) => ({ baseModel }))(SynergismPage);
