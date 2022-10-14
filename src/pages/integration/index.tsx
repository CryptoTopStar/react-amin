import styles from './index.less';
import { Menu, message } from 'antd';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';

const IntegrationPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [currentList, setCurrentList] = useState([]);
    const [rightSideDynamicList, setRightSideDynamicList] = useState([]);

    const commitGlobalTitle = (e: any) => {
        dispatch({
            type: 'baseModel/changeHomeTitle',
            payload: e,
        });
    };
    const initAction = () => {
        commitGlobalTitle('integration');
    };
    const initRequest = () => {
        Apis.platIntegrationgetPlatformIntegList({})
            .then((res) => {
                if (res && res.code === 0) {
                    setCurrentList(res.data.list);
                    if (
                        res.data.list &&
                        res.data.list.length &&
                        res.data.list[0].list
                    ) {
                        setRightSideDynamicList(res.data.list[0].list);
                    }
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const bigBlockItemClick = (item: any) => {
        if (item.link) {
            window.open(item.link, '_blank');
        }
    };
    useEffect(() => {
        initAction();
        initRequest();
    }, []);
    const blocks = rightSideDynamicList.map((ele: any) => (
        <div
            key={ele.id}
            className={styles.bigBlockItem}
            onClick={() => bigBlockItemClick(ele)}
        >
            <img src={ele.logo} />
            <div className={styles.bigBlockItemText}>{ele.platform_name}</div>
        </div>
    ));
    const leftViewArray = currentList.map((ele) => (
        <Menu.Item key={ele.category_id}>{ele.category_name}</Menu.Item>
    ));
    const handleClick = (e: any) => {
        let track = currentList.find((ele) => {
            return ele.category_id == e.key;
        });
        if (track.list) {
            setRightSideDynamicList(track.list);
        }
    };
    return (
        <div className={styles.IntegrationPageCon}>
            <div className={styles.IntegrationPageLeftCon}>
                <Menu
                    onClick={handleClick}
                    style={{ width: 256 }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="light"
                >
                    {leftViewArray}
                </Menu>
            </div>
            <div className={styles.IntegrationPageRightCon}>{blocks}</div>
        </div>
    );
};
export default connect(({ baseModel }) => ({ baseModel }))(IntegrationPage);
