import { Dropdown, Menu, message, Button, Avatar, Image } from 'antd';
import { connect, history } from 'umi';
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styles from './topConStyle.less';
import Apis from '@/utils/apis';
import UserLayout from './UserLayout';
const { SubMenu } = Menu;
const TopContainer = (props: any) => {
    const { location, dispatch, baseModel } = props;
    const [current, setCurrent] = useState(baseModel.homeTitle);
    const [showWorkBench, setShowWorkBench] = useState(false);
    let [projectManage, setProjectManage] = useState(<></>);
    let [reportList, setReportList] = useState(<></>);
    const [loginStatus, setLoginStatus] = useState(false);
    useEffect(() => {
        setCurrent(baseModel.homeTitle);
    }, [baseModel]);
    useEffect(() => {
        initAction();
    }, []);
    const initAction = () => {
        let currentInfo = localStorage.getItem('currentInfo')
            ? JSON.parse(localStorage.getItem('currentInfo'))
            : '';
        if (currentInfo) {
            if (currentInfo.admin_info.role_type == '1') {
                setShowWorkBench(true);
            } else {
                setShowWorkBench(false);
            }
            if (currentInfo.admin_info.permissions.xmgl_admin) {
                if (currentInfo.admin_info.permissions.xmgl_admin.is_visit) {
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 0
                    ) {
                        setProjectManage(
                            <SubMenu key="projectMana" title="项目管理">
                                <Menu.Item key="projectMana1">
                                    大屏展示
                                </Menu.Item>
                                <Menu.Item key="projectMana2">
                                    项目管理
                                </Menu.Item>
                                <Menu.Item key="projectMana3">
                                    建设单位账号管理
                                </Menu.Item>
                                <Menu.Item key="projectMana4">
                                    责任单位账号管理
                                </Menu.Item>
                                <Menu.Item key="projectMana5">
                                    系统设置
                                </Menu.Item>
                            </SubMenu>,
                        );
                    }
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 1
                    ) {
                        setProjectManage(
                            <SubMenu key="projectMana" title="项目管理">
                                <Menu.Item key="projectMana1">
                                    大屏展示
                                </Menu.Item>
                                <Menu.Item key="projectMana2">
                                    项目管理
                                </Menu.Item>
                                <Menu.Item key="projectMana3">
                                    建设单位账号管理
                                </Menu.Item>
                                <Menu.Item key="projectMana4">
                                    责任单位账号管理
                                </Menu.Item>
                            </SubMenu>,
                        );
                    }
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 2
                    ) {
                        setProjectManage(
                            <Menu.Item key="projectMana2">项目管理</Menu.Item>,
                        );
                    }
                    if (
                        currentInfo.admin_info.permissions.xmgl_admin.type == 3
                    ) {
                        setProjectManage(
                            <Menu.Item key="projectMana2">项目管理</Menu.Item>,
                        );
                    }
                }
            }
            if (currentInfo.admin_info.permissions.szxt_admin) {
                if (currentInfo.admin_info.permissions.szxt_admin.is_visit) {
                    if (
                        currentInfo.admin_info.permissions.szxt_admin.type == 1
                    ) {
                        setReportList(
                            <SubMenu key="数据上报" title="数据上报">
                                <Menu.Item key="report1">数据上报</Menu.Item>
                                <Menu.Item key="report2">授权管理</Menu.Item>
                                <Menu.Item key="report3">系统设置</Menu.Item>
                            </SubMenu>,
                        );
                    }
                    if (
                        currentInfo.admin_info.permissions.szxt_admin.type == 2
                    ) {
                        setReportList(
                            <SubMenu key="数据上报" title="数据上报">
                                <Menu.Item key="report1">数据上报</Menu.Item>
                                <Menu.Item key="report2">授权管理</Menu.Item>
                            </SubMenu>,
                        );
                    }
                    if (
                        currentInfo.admin_info.permissions.szxt_admin.type == 3
                    ) {
                        setReportList(
                            <SubMenu key="数据上报" title="数据上报">
                                <Menu.Item key="report1">数据上报</Menu.Item>
                                <Menu.Item key="report2">授权管理</Menu.Item>
                            </SubMenu>,
                        );
                    }
                }
            }
        } else {
            if (!loginStatus) {
                setProjectManage(
                    <SubMenu key="projectMana" title="项目管理">
                        <Menu.Item key="projectMana1">大屏展示</Menu.Item>
                        <Menu.Item key="projectMana2">项目管理</Menu.Item>
                        <Menu.Item key="projectMana3">
                            建设单位账号管理
                        </Menu.Item>
                        <Menu.Item key="projectMana4">
                            责任单位账号管理
                        </Menu.Item>
                        <Menu.Item key="projectMana5">系统设置</Menu.Item>
                    </SubMenu>,
                );
                setReportList(
                    <SubMenu key="数据上报" title="数据上报">
                        <Menu.Item key="report1">数据上报</Menu.Item>
                        <Menu.Item key="report2">授权管理</Menu.Item>
                        <Menu.Item key="report3">系统设置</Menu.Item>
                    </SubMenu>,
                );
            }
        }
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        setLoginStatus(!!loginInfo);
    };

    const routerMap = [
        { title: 'home', path: '/' },
        { title: 'integration', path: '/integrationPage/index' },
        { title: 'projectMana1', path: '/project/index' },
        { title: 'projectMana2', path: '/project/project' },
        { title: 'projectMana3', path: '/project/building' },
        { title: 'projectMana4', path: '/project/duty' },
        { title: 'projectMana5', path: '/project/system' },
        { title: 'report1', path: '/report/index' },
        { title: 'report2', path: '/report/auth' },
        { title: 'report3', path: '/report/system' },
        { title: 'opening', path: '/opening/index' },
        { title: 'synergism', path: '/synergism/index' },
        { title: 'backEnd', path: '/backEnd/index' },
        { title: 'benchConfig', path: '/workBench/config' },
        { title: 'benchAccount', path: '/workBench/account' },
    ];
    const handleClick = (e: any) => {
        let track = routerMap.find((ele) => {
            return ele.title == e.key;
        });
        if (track) {
            if (loginStatus) {
                history.push({
                    pathname: track.path,
                });
            } else {
                let projectTrack = track.path.includes('/project');
                let reportTrack = track.path.includes('/report');
                if (projectTrack || reportTrack) {
                    history.replace({
                        pathname: '/login',
                    });
                } else {
                    history.push({
                        pathname: track.path,
                    });
                }
            }
        }
    };
    return (
        <div className={styles.topPart}>
            <div className={styles.topLine}>
                <div className={styles.leftCon}>
                    <div className={styles.leftTitle}>
                        <img src="https://img.hzanchu.com/acimg/48e39cfd1fa92a645cdc7938b5a91ed6.png" />
                        <span>数字乡村工作台</span>
                    </div>
                    <div className={styles.leftMenusCon}>
                        <Menu
                            onClick={handleClick}
                            selectedKeys={[current]}
                            mode="horizontal"
                        >
                            <Menu.Item key="home">首页</Menu.Item>
                            <Menu.Item key="integration">业务集成</Menu.Item>
                            {projectManage}
                            {/* <SubMenu key="projectMana" title="项目管理">
                                <Menu.Item key="projectMana1">
                                    大屏展示
                                </Menu.Item>
                                <Menu.Item key="projectMana2">
                                    项目管理
                                </Menu.Item>
                                <Menu.Item key="projectMana3">
                                    建设单位账号管理
                                </Menu.Item>
                                <Menu.Item key="projectMana4">
                                    责任单位账号管理
                                </Menu.Item>
                                <Menu.Item key="projectMana5">
                                    系统设置
                                </Menu.Item>
                </SubMenu> */}
                            <Menu.Item key="opening">数据开放</Menu.Item>
                            {/* <Menu.Item key="synergism">数据协同</Menu.Item> */}
                            {/* {reportList} */}
                            {/* <SubMenu key="数据上报" title="数据上报">
                                <Menu.Item key="report1">数据上报</Menu.Item>
                                <Menu.Item key="report2">授权管理</Menu.Item>
                                <Menu.Item key="report3">系统设置</Menu.Item>
                            </SubMenu> */}
                            <Menu.Item key="backEnd">业务后台</Menu.Item>
                            {showWorkBench ? (
                                <SubMenu key="工作台设置" title="工作台设置">
                                    <Menu.Item key="benchConfig">
                                        后台配置
                                    </Menu.Item>
                                    <Menu.Item key="benchAccount">
                                        账户管理
                                    </Menu.Item>
                                </SubMenu>
                            ) : null}
                        </Menu>
                    </div>
                </div>
                <div
                    className={
                        loginStatus ? styles.rightCon : styles.rightConEmpty
                    }
                >
                    <UserLayout></UserLayout>
                </div>
            </div>
            <div className={styles.bgCon}></div>
        </div>
    );
};

export default connect(({ baseModel }) => ({ baseModel }))(TopContainer);
