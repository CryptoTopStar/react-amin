import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message } from 'antd';

const BackEndPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [bigList, setBigList] = useState([]);
    const [loginStatus, setLoginStatus] = useState(false);
    const initAction = () => {
        commitGlobalTitle('backEnd');
        let currentInfo = localStorage.getItem('currentInfo')
            ? JSON.parse(localStorage.getItem('currentInfo'))
            : '';
        let loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        setLoginStatus(!!loginInfo);
        let tempArr = [
            {
                title: '项目管理后台',
                id: '1',
                background:
                    'https://img.hzanchu.com/acimg/e3ac66f638bdc50b5627344f6744ba28.png',
                icon: 'https://img.hzanchu.com/acimg/073929c22b5fba702677c64b75c88bfd.png',
                width: 98,
                height: 105,
                permission: false,
                path: '',
            },
            {
                title: '善治宝管理后台',
                id: '2',
                icon: 'https://img.hzanchu.com/acimg/05c5eb44ef82215a586c01fe1785e5e2.png',
                background:
                    'https://img.hzanchu.com/acimg/3e1b2257486ad44dd63074cf34b2ec58.png',
                width: 104,
                height: 92,
                permission: false,
                path: '',
            },
            {
                title: '协同平台管理后台',
                id: '3',
                background:
                    'https://img.hzanchu.com/acimg/e3ac66f638bdc50b5627344f6744ba28.png',
                icon: 'https://img.hzanchu.com/acimg/34c16a19c212a9145db86ef152b6e2d4.png',
                width: 91,
                height: 91,
                permission: false,
                path: '',
            },
        ];

        let data = {
            search_platform_name: '',
            page: 1,
            pagesize: 10,
        };
        if (currentInfo) {
            if (currentInfo.admin_info && currentInfo.admin_info.permissions) {
                if (currentInfo.admin_info.permissions.szb_admin) {
                    tempArr[1].permission = true;
                    setBigList(tempArr);
                }
                if (currentInfo.admin_info.permissions.xmgl_admin) {
                    tempArr[0].permission = true;
                    setBigList(tempArr);
                }
                if (currentInfo.admin_info.permissions.szxt_admin) {
                    tempArr[2].permission = true;
                    setBigList(tempArr);
                }
            }
            setBigList(tempArr);
        } else {
            setBigList(tempArr);
        }

        Apis.platInteBacklist(data)
            .then((res: any) => {
                if (res && res.code === 0) {
                    let track1 = res.data.data.find((ele: any) => {
                        return ele.platform_name == '数字协同平台管理后台';
                    });
                    let track2 = res.data.data.find((ele: any) => {
                        return ele.platform_name == '项目管理后台';
                    });
                    let track3 = res.data.data.find((ele: any) => {
                        return ele.platform_name == '善治宝管理后台';
                    });
                    if (track1) {
                        tempArr[2].path = `${track1.link}?secret=${loginInfo.secret}`;
                        setBigList(tempArr);
                    }
                    if (track2) {
                        tempArr[0].path = `${track2.link}?secret=${loginInfo.secret}`;
                        setBigList(tempArr);
                    }
                    if (track3) {
                        tempArr[1].path = `${track3.link}?secret=${loginInfo.secret}`;
                        setBigList(tempArr);
                    }
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const commitGlobalTitle = (e: any) => {
        dispatch({
            type: 'baseModel/changeHomeTitle',
            payload: e,
        });
    };
    useEffect(() => {
        initAction();
    }, []);
    const checkPermission = (ele: any) => {
        if (loginStatus) {
            if (ele && ele.permission) {
                if (ele.path) {
                    window.open(ele.path, '_blank');
                } else {
                    message.warning('请配置数据');
                }
            } else {
                message.warning('您暂无管理权限');
            }
        } else {
            history.replace({
                pathname: '/login',
            });
        }
    };
    const blocks = bigList.map((ele) => (
        <div
            key={ele.id}
            className={styles.bigBlockItem}
            style={{ backgroundImage: 'url(' + ele.background + ')' }}
            onClick={() => checkPermission(ele)}
        >
            <div className={styles.imgContainer}>
                <img src={ele.icon} />
            </div>
            <div className={styles.titleText}>{ele.title}</div>
        </div>
    ));

    return (
        <div className={styles.homePageCon}>
            <div className={styles.upperCon}>
                <div className={styles.topImgCon}>
                    <div className={styles.bigBlockOuter}>
                        <div className={styles.bigBlockCon}>{blocks}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default connect(({ baseModel }) => ({ baseModel }))(BackEndPage);
