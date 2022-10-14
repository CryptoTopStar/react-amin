import { Dropdown, Menu, message, Button, Avatar, Image } from 'antd';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import styles from './bottomConStyle.less';

const BottomContainer = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [show, setShow] = useState(true);
    return <div className={styles.bottomContainer}>{children}</div>;
};

export default connect(({}) => ({}))(BottomContainer);
