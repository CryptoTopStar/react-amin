import {
    Dropdown,
    Menu,
    message,
    Button,
    Avatar,
    Form,
    Upload,
    Input,
    Modal,
} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import styles from './userLayoutStyle.less';
import Apis from '@/utils/apis';

const UserLayout = (props: any) => {
    const { location, accountInfo, dispatch, onSubmit } = props;
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('用户名');
    const [userId, setUserId] = useState('');
    const [loginStatus, setLoginStatus] = useState(false);
    const [avatar, setAvatar] = useState(
        'https://img.hzanchu.com/acimg/1decb3c0cc73c1b4ce4ad43ac24d995b.png',
    );
    useEffect(() => {
        initAction();
    }, []);
    const initAction = () => {
        let currentInfo = localStorage.getItem('currentInfo')
            ? JSON.parse(localStorage.getItem('currentInfo'))
            : '';
        const loginInfo = localStorage.getItem('loginInfo')
            ? JSON.parse(localStorage.getItem('loginInfo'))
            : '';
        setLoginStatus(!!loginInfo);
        if (currentInfo) {
            if (currentInfo.admin_info) {
                if (currentInfo.admin_info.real_name) {
                    setUserName(currentInfo.admin_info.real_name);
                }
                if (currentInfo.admin_info.avatar) {
                    setAvatar(currentInfo.admin_info.avatar);
                }
                setUserId(currentInfo.admin_info.id);
            }
        }
    };
    const onUserInfoClick = (e: any) => {
        if (e.key == 'logout') {
            Apis.adminLogout({})
                .then((res: any) => {
                    if (res && res.code === 0) {
                        clearAction();
                    } else {
                        message(res.msg);
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                });
        } else {
            setModalVisible(true);
        }
    };
    const menu = (
        <Menu onClick={onUserInfoClick}>
            <Menu.Item key="resetPsw">修改密码</Menu.Item>
            <Menu.Item key="logout">退出登录</Menu.Item>
        </Menu>
    );
    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };
    const clearAction = () => {
        localStorage.clear();
        sessionStorage.clear();
        dispatch({
            type: 'baseModel/initBaseState',
            payload: '1',
        });
        history.push({
            pathname: '/login',
        });
    };
    const handleOk = () => {
        form.validateFields()
            .then((res) => {
                let data = {
                    id: userId,
                    password: res.password,
                    password2: res.repeatPassword,
                };
                Apis.adminModifyPassword(data)
                    .then((res: any) => {
                        if (res && res.code === 0) {
                            message.success('修改密码成功，请重新登录');
                            clearAction();
                        } else {
                            message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const handleCancel = async () => {
        setModalVisible(false);
        await form.resetFields();
    };
    const goToLogin = () => {
        history.replace({
            pathname: '/login',
        });
    };
    const checkRepeatPassword = (_: any, value: { number: number }) => {
        let first = form.getFieldValue('password');
        if (!value) {
            return Promise.reject(new Error('确认密码不能为空'));
        } else {
            if (first != value) {
                return Promise.reject(new Error('新密码与确认密码不一致'));
            } else {
                return Promise.resolve();
            }
        }
    };
    return (
        <div className={styles.userCount}>
            {loginStatus ? (
                <Dropdown overlay={menu} placement="bottomCenter" arrow>
                    <div className={styles.AvatarCon}>
                        <Avatar className={styles.avatarImg} src={avatar} />
                        <span>{userName}</span>
                        <CaretDownOutlined
                            style={{ marginLeft: '10px', fontSize: '12px' }}
                        />
                    </div>
                </Dropdown>
            ) : (
                <div
                    className={styles.loginTrigger}
                    onClick={() => goToLogin()}
                >
                    登录
                </div>
            )}
            <Modal
                destroyOnClose
                centered
                maskClosable={false}
                visible={modalVisible}
                confirmLoading={loading}
                title="修改密码"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    {...layout}
                    form={form}
                    name="nest-messages"
                    labelAlign={'left'}
                >
                    <Form.Item
                        name="password"
                        label="新密码"
                        hasFeedback
                        rules={[
                            { required: true, message: '请输入新密码' },
                            {
                                min: 6,
                                max: 15,
                                message: '密码长度在6-15位之间',
                            },
                        ]}
                    >
                        <Input.Password maxLength={15} />
                    </Form.Item>
                    <Form.Item
                        name="repeatPassword"
                        label="确认密码"
                        hasFeedback
                        rules={[
                            { required: true, message: '请输入确认密码' },
                            { validator: checkRepeatPassword },
                        ]}
                    >
                        <Input.Password maxLength={15} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default connect(({ baseModel }) => ({ baseModel }))(UserLayout);
