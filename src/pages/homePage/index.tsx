import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { message } from 'antd';

const HomePage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [bottomList, setBottomList] = useState([
        {
            platform_name: '善治宝',
            logo: 'https://img.hzanchu.com/acimg/cc1891cddd86873597cdf8180a16a601.png',
            link: '',
        },
    ]);
    const [bigList, setBigList] = useState([]);
    const [loginStatus, setLoginStatus] = useState(false);
    const initAction = () => {
        commitGlobalTitle('home');
        let currentInfo = localStorage.getItem('currentInfo')
            ? JSON.parse(localStorage.getItem('currentInfo'))
            : '';
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        setLoginStatus(!!loginInfo);
        let tempBig = [
            {
                title: '项目管理',
                id: '1',
                background:
                    'https://img.hzanchu.com/acimg/8a6223aa3b65cbe735f83d16dd9acca7.png',
                icon: 'https://img.hzanchu.com/acimg/4db62650d9a9e150d07c4829be52459e.png',
                width: 98,
                height: 105,
                path: '/project/index',
            },
            {
                title: '业务后台',
                id: '2',
                icon: 'https://img.hzanchu.com/acimg/e7cdef61089375f7b63e581e878ad992.png',
                background:
                    'https://img.hzanchu.com/acimg/421a51e3d7bac2c4dabd5c8b00f9a14e.png',
                width: 104,
                height: 92,
                targetTitle: 'backEnd',
                path: '/backEnd/index',
            },
            {
                title: '数据开放',
                id: '3',
                background:
                    'https://img.hzanchu.com/acimg/3ad655457192c17093fa6bb6b393006c.png',
                icon: 'https://img.hzanchu.com/acimg/4633e8c5eb1b2bedd8502a07d0d1b277.png',
                width: 91,
                height: 91,
                targetTitle: 'opening',
                path: '/opening/index',
            },
            // {
            //     title: '数据协同',
            //     id: '4',
            //     background:
            //         'https://img.hzanchu.com/acimg/142b8848cddb129c62bade72411f2e8d.png',
            //     icon: 'https://img.hzanchu.com/acimg/b333aea5016342d21bd032c3b1d7d69e.png',
            //     width: 102,
            //     height: 102,
            //     targetTitle: 'synergism',
            //     path: '/synergism/index',
            // },
            // {
            //     title: '数据上报',
            //     id: '5',
            //     background:
            //         'https://img.hzanchu.com/acimg/6e21826b5a503d6bdf5c2057a7b6fcc4.png',
            //     icon: 'https://img.hzanchu.com/acimg/c7778640e16f20c95b9d8123b9a4813c.png',
            //     width: 118,
            //     height: 89,
            //     path: '/report/index',
            // },
        ];
        if (
            currentInfo &&
            currentInfo.admin_info &&
            currentInfo.admin_info.permissions
        ) {
            if (currentInfo.admin_info.permissions.szxt_admin) {
                if (currentInfo.admin_info.permissions.szxt_admin.is_visit) {
                    // console.log()
                } else {
                    tempBig.splice(4, 1);
                    // console.log('noVisit', tempBig);
                }
            } else {
                tempBig.splice(4, 1);
                // console.log('noszxt_admin', tempBig);
            }
            if (currentInfo.admin_info.permissions.xmgl_admin) {
                if (currentInfo.admin_info.permissions.xmgl_admin.is_visit) {
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 0
                    ) {
                        setBigList(tempBig);
                    }
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 1
                    ) {
                        setBigList(tempBig);
                    }
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 2
                    ) {
                        tempBig[0].path = '/project/project';
                        setBigList(tempBig);
                    }
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 3
                    ) {
                        tempBig[0].path = '/project/project';
                        setBigList(tempBig);
                    }
                } else {
                    tempBig.splice(0, 1);
                    // console.log('noxmgl_adminVisit', tempBig);
                }
            } else {
                tempBig.splice(0, 1);
                // console.log('noxmgl_admin', tempBig);
            }
            setTimeout(() => {
                // console.log('final', tempBig);
                setBigList(tempBig);
            }, 300);
            // if (
            //     currentInfo.admin_info &&
            //     currentInfo.admin_info.permissions.xmgl_admin
            // ) {
            //     if (currentInfo.admin_info.permissions.xmgl_admin.is_visit) {
            //         if (currentInfo.admin_info.permissions.xmgl_admin.type == 0) {
            //             setBigList(tempBig);
            //         }
            //         if (currentInfo.admin_info.permissions.xmgl_admin.type == 1) {
            //             setBigList(tempBig);
            //         }
            //         if (currentInfo.admin_info.permissions.xmgl_admin.type == 2) {
            //             tempBig[0].path = '/project/project';
            //             setBigList(tempBig);
            //         }
            //         if (currentInfo.admin_info.permissions.xmgl_admin.type == 3) {
            //             tempBig[0].path = '/project/project';
            //             setBigList(tempBig);
            //         }
            //     } else {
            //         tempBig.splice(0, 1);
            //         setBigList(tempBig);
            //     }
            // } else {
            //     if (!loginStatus) {
            //         setBigList(tempBig);
            //     }
            // }
        } else {
            if (!loginStatus) {
                setBigList(tempBig);
            }
        }
    };
    const initFetch = () => {
        Apis.homePlatformIntegrationList({})
            .then((res: any) => {
                if (res && res.code === 0) {
                    setBottomList(res.data.list);
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    useEffect(() => {
        initAction();
        initFetch();
    }, []);
    const goMore = () => {
        history.push({
            pathname: '/integrationPage/index',
        });
    };
    const commitGlobalTitle = (e: any) => {
        dispatch({
            type: 'baseModel/changeHomeTitle',
            payload: e,
        });
    };
    const handleClickBigItem = (ele: any) => {
        if (ele.path) {
            if (!loginStatus) {
                if (ele.title == '数据开放' || ele.title == '数据协同') {
                    history.push({
                        pathname: ele.path,
                    });
                } else {
                    history.replace({
                        pathname: '/login',
                    });
                }
            } else {
                history.push({
                    pathname: ele.path,
                });
            }
        }
    };
    const jumpToSomeWhere = (ele: any) => {
        if (ele.link) {
            window.open(ele.link, '_blank');
        }
    };
    const blocks = bigList.map((ele) => (
        <div
            key={ele.id}
            className={styles.bigBlockItem}
            onClick={() => handleClickBigItem(ele)}
            style={{ backgroundImage: 'url(' + ele.background + ')' }}
        >
            <div className={styles.imgContainer}>
                <img
                    src={ele.icon}
                    style={{
                        width: ele.width + 'px',
                        height: ele.height + 'px',
                    }}
                />
            </div>
            <div className={styles.titleText}>{ele.title}</div>
        </div>
    ));
    const bottomBlocks = bottomList.map((ele, index) => (
        <div
            className={styles.bottomItemCon}
            key={index}
            onClick={() => jumpToSomeWhere(ele)}
        >
            <img
                src={
                    ele.logo && ele.logo.length < 10
                        ? 'https://img.hzanchu.com/acimg/cc1891cddd86873597cdf8180a16a601.png'
                        : ele.logo
                }
            />
            <div className={styles.bottomItemText}>{ele.platform_name}</div>
        </div>
    ));
    return (
        <div className={styles.homePageCon}>
            <div className={styles.topImgCon}>
                <div className={styles.bigBlockCon}>{blocks}</div>
            </div>
            <div className={styles.bottomCon}>
                <div className={styles.bottomLimit}>
                    <div className={styles.moreContainer}>
                        <div className={styles.moreLeft}>业务集成</div>
                        <div className={styles.more} onClick={() => goMore()}>
                            更多集成
                            <RightOutlined />
                        </div>
                    </div>
                    <div className={styles.bottomListCon}>{bottomBlocks}</div>
                </div>
            </div>
            <div className={styles.botWhite}></div>
        </div>
    );
};

export default connect(({ baseModel }) => ({ baseModel }))(HomePage);
