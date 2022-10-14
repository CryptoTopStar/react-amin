import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { Input, message } from 'antd';

const LoginPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [activeIndex, setActiveIndex] = useState('1');
    const [firstPhone, setFirstPhone] = useState('');
    const [firstPass, setFirstPass] = useState('');
    const [timerText, setTimerText] = useState('获取验证码');
    const [timerBtnDisabled, setTimerBtnDisabled] = useState(false);
    const [normalLoginAble, setNormalLoginAble] = useState(false);
    const [phoneLoginAble, setPhoneLoginAble] = useState(false);

    let [counter, setCounter] = useState(60);
    const [account, setAccount] = useState('');
    const [secondPass, setSecondPass] = useState('');
    const phoneReg = /^1[3-9]\d{9}$/;
    const timerAction = () => {
        if (firstPhone) {
            const result = phoneReg.test(firstPhone);
            if (result) {
                if (!timerBtnDisabled) {
                    let data = {
                        mobile: firstPhone,
                    };
                    setTimerBtnDisabled(true);
                    Apis.sendSms(data)
                        .then((res: any) => {
                            if (res && res.code === 0) {
                                message.success('短信验证码发送成功');
                                window.timer = setInterval(() => {
                                    setCounter(counter--);
                                    setTimerText(`${counter}s后重新发送`);
                                    if (counter == 0) {
                                        setTimerBtnDisabled(false);
                                        setCounter(60);
                                        setTimerText('获取验证码');
                                        clearInterval(window.timer);
                                    }
                                }, 1000);
                            } else {
                                message.error(res.msg);
                                setTimerBtnDisabled(false);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            setTimerBtnDisabled(false);
                        });
                }
            } else {
                message.error('请输入正确手机号');
            }
        }
    };
    const phoneLoginAction = () => {
        if (firstPass && firstPhone) {
            let data = {
                mobile: firstPhone,
                verify_code: firstPass,
            };
            if (!phoneLoginAble) {
                setPhoneLoginAble(true);
                Apis.adminLoginMobile(data)
                    .then((res: any) => {
                        if (res && res.code === 0) {
                            localStorage.setItem(
                                'loginInfo',
                                JSON.stringify(res.data),
                            );
                            Apis.getAdminInfo({})
                                .then((res2: any) => {
                                    if (res2 && res2.code === 0) {
                                        history.push({
                                            pathname: '/',
                                        });
                                        dispatch({
                                            type: 'baseModel/initBaseState',
                                            payload: '1',
                                        });
                                        localStorage.setItem(
                                            'currentInfo',
                                            JSON.stringify(res2.data),
                                        );
                                    } else {
                                        message.error(res2.msg);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        console.log('err', err);
                    })
                    .finally(() => {
                        setPhoneLoginAble(false);
                    });
            }
        } else {
            message.error('请检查输入项');
        }
    };
    const normalLoginAction = () => {
        if (secondPass && account) {
            let data = {
                username: account,
                password: secondPass,
            };
            if (!normalLoginAble) {
                setNormalLoginAble(true);
                Apis.adminLogin(data)
                    .then((res: any) => {
                        if (res && res.code === 0) {
                            localStorage.setItem(
                                'loginInfo',
                                JSON.stringify(res.data),
                            );
                            Apis.getAdminInfo({})
                                .then((res2: any) => {
                                    if (res2 && res2.code === 0) {
                                        history.push({
                                            pathname: '/',
                                        });
                                        dispatch({
                                            type: 'baseModel/initBaseState',
                                            payload: '1',
                                        });
                                        localStorage.setItem(
                                            'currentInfo',
                                            JSON.stringify(res2.data),
                                        );
                                    } else {
                                        message.error(res2.msg);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        } else {
                            message.error(res.msg);
                        }
                    })
                    .catch((err) => {
                        console.log('err', err);
                    })
                    .finally(() => {
                        setNormalLoginAble(false);
                    });
            }
        } else {
            message.error('请检查输入项');
        }
    };
    const secondPassChange = (e: any) => {
        setSecondPass(e.target.value);
    };
    const firstPhoneChange = (e: any) => {
        setFirstPhone(e.target.value);
    };
    const firstPassChange = (e: any) => {
        setFirstPass(e.target.value);
    };
    const changeActive = (index: string) => {
        setActiveIndex(index);
    };
    const secondAccountChange = (e: any) => {
        setAccount(e.target.value);
    };
    let formSwitch;
    if (activeIndex == '1') {
        formSwitch = (
            <div className={styles.firstFormCon}>
                <div className={styles.firstFormFirstLineCon}>
                    <img
                        className={styles.phone}
                        src="https://img.hzanchu.com/acimg/ac32e8d9571ee029fbe6faa4076de989.png"
                    />
                    <Input
                        size="large"
                        className={styles.firstFormFirstInput}
                        placeholder="请输入手机号"
                        allowClear
                        bordered={false}
                        maxLength={11}
                        value={firstPhone}
                        onChange={(e) => {
                            firstPhoneChange(e);
                        }}
                    />
                </div>
                <div className={styles.firstFormSecondLineCon}>
                    <div className={styles.firstFormSecondFakeInputCon}>
                        <img
                            className={styles.password1}
                            src="https://img.hzanchu.com/acimg/5c4a1b2a921ea136a33aa4219d6931a2.png"
                        />
                        <Input
                            className={styles.firstFormSecondInput}
                            size="large"
                            placeholder="请输入验证码"
                            allowClear
                            bordered={false}
                            type="password"
                            maxLength={6}
                            value={firstPass}
                            onChange={(e) => {
                                firstPassChange(e);
                            }}
                        />
                    </div>
                    <div>
                        <button
                            className={styles.getSms}
                            disabled={timerBtnDisabled}
                            onClick={() => {
                                timerAction();
                            }}
                        >
                            {timerText}
                        </button>
                    </div>
                </div>
                <button
                    className={styles.loginBtn}
                    disabled={phoneLoginAble}
                    onClick={() => {
                        phoneLoginAction();
                    }}
                >
                    登录
                </button>
            </div>
        );
    } else {
        formSwitch = (
            <div className={styles.secondFormCon}>
                <div className={styles.secondFormFirstLineCon}>
                    <img
                        className={styles.account}
                        src="https://img.hzanchu.com/acimg/c3887cafd4ffc8639577d3251bc2a8f4.png"
                    />
                    <Input
                        size="large"
                        className={styles.secondFormFirstInput}
                        placeholder="请输入账号"
                        allowClear
                        bordered={false}
                        maxLength={25}
                        value={account}
                        onChange={(e) => {
                            secondAccountChange(e);
                        }}
                    />
                </div>
                <div className={styles.secondFormSecondLineCon}>
                    <img
                        className={styles.account}
                        src="https://img.hzanchu.com/acimg/5c4a1b2a921ea136a33aa4219d6931a2.png"
                    />
                    <Input
                        size="large"
                        className={styles.secondFormFirstInput}
                        placeholder="请输入密码"
                        allowClear
                        type="password"
                        bordered={false}
                        maxLength={25}
                        value={secondPass}
                        onChange={(e) => {
                            secondPassChange(e);
                        }}
                    />
                </div>
                <button
                    className={styles.loginBtn}
                    disabled={normalLoginAble}
                    onClick={() => {
                        normalLoginAction();
                    }}
                >
                    登录
                </button>
            </div>
        );
    }
    return (
        <div className={styles.masterPageCon}>
            <div className={styles.centerCon}>
                <div className={styles.leftPart}>
                    <div className={styles.welcome}>欢迎登录</div>
                    <div className={styles.hrLine}></div>
                    <div className={styles.name}>数字乡村工作台</div>
                </div>
                <div className={styles.rightPart}>
                    <div className={styles.formCon}>
                        <div className={styles.activeTypeCon}>
                            <div
                                className={`${styles.hover} ${
                                    activeIndex == '1' ? styles.activeItem : ''
                                }`}
                                onClick={() => changeActive('1')}
                            >
                                手机号登录
                            </div>
                            <div className={styles.vertialLine}></div>
                            <div
                                className={`${styles.hover} ${
                                    activeIndex == '2' ? styles.activeItem : ''
                                }`}
                                onClick={() => changeActive('2')}
                            >
                                帐号登录
                            </div>
                        </div>
                        <div>{formSwitch}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(({ baseModel }) => ({ baseModel }))(LoginPage);
