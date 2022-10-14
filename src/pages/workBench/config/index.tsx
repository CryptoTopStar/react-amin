import styles from './index.less';
import Apis from '@/utils/apis';
import { connect, history } from 'umi';
import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Tabs,
    Input,
    InputNumber,
    Button,
    Table,
    Space,
    message,
    Pagination,
    Form,
    Upload,
    Modal,
    Select,
    Popconfirm,
} from 'antd';
const { TabPane } = Tabs;
const { Option } = Select;
const WorkBenchConfigPage = (props: any) => {
    const { location, accountInfo, dispatch, children } = props;
    const [activeIndex, setActiveIndex] = useState('1');
    const [leftSerach, setLeftSerach] = useState('');
    const [rightSerach, setRightSerach] = useState('');
    const [current, setCurrent] = useState(1);
    const [pagesize, setPagesize] = useState(10);
    const [listData, setListData] = useState('');
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [fileRightList, setFileRightList] = useState([]);
    const [publicKeyOption, setPublicKeyOption] = useState([]);
    const [rightModalTitle, setRightModalTitle] = useState('');
    const [leftModalTitle, setLeftModalTitle] = useState('');
    const [idForEdit, setIdForEdit] = useState('');

    const [showLeftNew, setShowLeftNew] = useState(false);
    const [showRightNew, setShowRightNew] = useState(false);
    const [form] = Form.useForm();
    const [rightForm] = Form.useForm();

    const [roleList, setRoleList] = useState([
        { id: '1', name: '生产管理' },
        { id: '2', name: '流通营销' },
        { id: '3', name: '行业监管' },
        { id: '4', name: '公共服务' },
        { id: '5', name: '乡村治理' },
    ]);
    const [imageUrl, setImageUrl] = useState('');
    const [imageRightUrl, setImageRightUrl] = useState('');

    const [imgPre, setImgPre] = useState(
        'https://pinghu-szgzt-img.zjsszxc.com/',
    );
    const showTotal = (total: number) => {
        return `共 ${total} 条`;
    };
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            render: (index: any) => <span>{index + 1}</span>,
        },
        {
            title: '名称',
            className: 'column-money',
            dataIndex: 'platform_name',
            align: 'center',
        },
        {
            title: '链接地址',
            dataIndex: 'link',
            align: 'center',
        },
        {
            title: '图标',
            dataIndex: 'logo',
            align: 'center',
            render: (logo: any) =>
                logo ? (
                    <img className={styles.listAvatar} src={logo} />
                ) : (
                    <span>暂无</span>
                ),
        },
        {
            title: '分类',
            dataIndex: 'category_name',
            align: 'center',
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <a onClick={() => editLeft(record)}>编辑 {record.name}</a>
                    <Popconfirm
                        title="确定删除此条目?"
                        onConfirm={() => deleteLeft(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const columnSecond = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            render: (index: any) => <span>{index + 1}</span>,
        },
        {
            title: '名称',
            className: 'column-money',
            dataIndex: 'platform_name',
            align: 'center',
        },
        {
            title: '链接地址',
            dataIndex: 'link',
            align: 'center',
        },
        {
            title: '图标',
            dataIndex: 'logo',
            align: 'center',
            render: (logo: any) =>
                logo ? (
                    <img className={styles.listAvatar} src={logo} />
                ) : (
                    <span>暂无</span>
                ),
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <a onClick={() => editRight(record)}>编辑 {record.name}</a>
                    <Popconfirm
                        title="确定删除此条目?"
                        onConfirm={() => deleteRight(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const deleteLeft = (record: any) => {
        let data = {
            id: record.id,
        };
        Apis.platIntegrationRemove(data)
            .then((res: any) => {
                if (res && res.code === 0) {
                    message.success('删除成功');
                    setCurrent(1);
                    initRequest();
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const editLeft = (record: any) => {
        console.log(record);
        setLeftModalTitle('编辑');
        setShowLeftNew(true);
        form.resetFields();
        // category_id
        form.setFieldsValue({
            platform_name: record.platform_name,
            link: record.link,
            logo: record.logo,
            // public_key: record.public_key,
            sorts: record.sorts,
            category_id: String(record.category_id),
            is_index_show: record.is_index_show,
            avatar: [{ url: record.logo }],
        });
        setIdForEdit(record.id);
        setImageUrl(record.logo);
        setFileList([
            {
                url: record.logo,
            },
        ]);
    };
    const deleteRight = (record: any) => {
        console.log(record);
        let data = {
            id: record.id,
        };
        Apis.platBgRemove(data)
            .then((res: any) => {
                if (res && res.code === 0) {
                    message.success('删除成功');
                    setCurrent(1);
                    init2Request();
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const editRight = (record: any) => {
        console.log(record);
        setRightModalTitle('编辑');
        setShowRightNew(true);
        rightForm.resetFields();
        rightForm.setFieldsValue({
            platform_name: record.platform_name,
            link: record.link,
            logo: record.logo,
            public_key: record.public_key,
            sorts: record.sorts,
            avatar: [{ url: record.logo }],
        });
        setIdForEdit(record.id);
        setImageRightUrl(record.logo);
        setFileRightList([
            {
                url: record.logo,
            },
        ]);
    };
    // const initRoles = () => {
    //     Apis.roleAllList({})
    //         .then((res: any) => {
    //             if (res && res.code === 0) {
    //                 setRoleList(res.data.list);
    //             } else {
    //                 message.error(res.msg);
    //             }
    //         })
    //         .catch((err) => {
    //             console.log('err', err);
    //         });
    // };
    const init2Request = () => {
        let data = {
            search_platform_name: rightSerach,
            page: current,
            pagesize: pagesize,
        };
        Apis.platInteBacklist(data)
            .then((res: any) => {
                if (res && res.code === 0) {
                    let bridge = res.data.data.map((ele: any, index: any) => {
                        return {
                            ...ele,
                            index,
                        };
                    });
                    setListData(bridge);
                    setTotal(res.data.total);
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const initRequest = () => {
        let data = {
            search_platform_name: leftSerach,
            page: current,
            pagesize: pagesize,
        };
        Apis.platIntegrationlist(data)
            .then((res: any) => {
                if (res && res.code === 0) {
                    let bridge = res.data.data.map((ele: any, index: any) => {
                        return {
                            ...ele,
                            index,
                        };
                    });
                    setListData(bridge);
                    setTotal(res.data.total);
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const rightSerachChange = (e: any) => {
        setRightSerach(e.target.value);
    };
    const leftSerachChange = (e: any) => {
        setLeftSerach(e.target.value);
    };
    const active1Search = () => {
        setCurrent(1);
        initRequest();
    };
    const active2Search = () => {
        setCurrent(1);
        init2Request();
    };
    const initAction = () => {
        commitGlobalTitle('benchConfig');
    };
    const normFile = (e: any) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const normRightFile = (e: any) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    const pop1New = () => {
        setLeftModalTitle('新建');
        setFileList([]);
        setImageUrl('');
        setShowLeftNew(true);
        form.resetFields();
    };
    const pop2New = () => {
        setRightModalTitle('新建');
        setFileRightList([]);
        setImageRightUrl('');
        setShowRightNew(true);
        rightForm.resetFields();
    };
    const handleRightNewOk = () => {
        rightForm
            .validateFields()
            .then((res) => {
                console.log(res);
                let data = {
                    platform_name: res.platform_name,
                    link: res.link,
                    public_key: res.public_key,
                    logo: fileRightList[0].url,
                    sorts: res.sorts,
                };
                if (rightModalTitle == '新建') {
                    Apis.platBackAdd(data)
                        .then((res: any) => {
                            if (res && res.code === 0) {
                                message.success('添加成功');
                                setCurrent(1);
                                init2Request();
                                setShowRightNew(false);
                            } else {
                                message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    data.id = idForEdit;
                    Apis.platBackModify(data)
                        .then((res: any) => {
                            if (res && res.code === 0) {
                                message.success('编辑成功');
                                setCurrent(1);
                                init2Request();
                                setShowRightNew(false);
                            } else {
                                message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const handleRightNewCancel = () => {
        setShowRightNew(false);
    };
    const handleNewOk = () => {
        form.validateFields()
            .then((res) => {
                let data = {
                    platform_name: res.platform_name,
                    link: res.link,
                    category_id: res.category_id,
                    is_index_show: res.is_index_show,
                    logo: fileList[0].url,
                    sorts: res.sorts,
                };
                if (leftModalTitle == '新建') {
                    Apis.platIntegrationgetPlatformInteAdd(data)
                        .then((res: any) => {
                            if (res && res.code === 0) {
                                message.success('添加成功');
                                setCurrent(1);
                                initRequest();
                                setShowLeftNew(false);
                            } else {
                                message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                } else {
                    data.id = idForEdit;
                    Apis.platIntegrationModify(data)
                        .then((res: any) => {
                            if (res && res.code === 0) {
                                message.success('编辑成功');
                                setCurrent(1);
                                initRequest();
                                setShowLeftNew(false);
                            } else {
                                message.error(res.msg);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    const handleNewCancel = () => {
        setShowLeftNew(false);
    };
    const layout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
    };
    const checkMobile = (_: any, value: { number: number }) => {
        const phoneReg = /^1[3-9]\d{9}$/;
        const result = phoneReg.test(value);
        if (value) {
            if (result) {
                return Promise.resolve();
            } else {
                return Promise.reject(new Error('请输入正确手机号'));
            }
        } else {
            return Promise.reject(new Error('手机号不能为空'));
        }
    };
    const checkRightLink = (_: any, value: { number: number }) => {
        const phoneReg = /(http|https):\/\/([\w.]+\/?)\S*/gi;
        const result = phoneReg.test(value);
        if (value) {
            if (result) {
                return Promise.resolve();
            } else {
                return Promise.reject(
                    new Error('请输入以http/https开头格式的链接'),
                );
            }
        } else {
            return Promise.reject(new Error('链接不能为空'));
        }
    };
    const checkLeftLink = (_: any, value: { number: number }) => {
        const phoneReg = /(http|https):\/\/([\w.]+\/?)\S*/gi;
        const result = phoneReg.test(value);
        if (value) {
            if (result) {
                return Promise.resolve();
            } else {
                return Promise.reject(
                    new Error('请输入以http/https开头格式的链接'),
                );
            }
        } else {
            return Promise.reject(new Error('链接不能为空'));
        }
    };
    let optionsArray = roleList.map((ele) => (
        <Option key={ele.id} value={ele.id}>
            {ele.name}
        </Option>
    ));
    let publicKeyArray = publicKeyOption.map((ele: any) => (
        <Option key={ele.public_key} value={ele.public_key}>
            {ele.public_key}
        </Option>
    ));
    const beforeUpload = (file: any) => {
        // const isJpgOrPng =
        //     file.type === 'image/jpeg' || file.type === 'image/png';
        // if (!isJpgOrPng) {
        //     message.error('只支持上传JPG/PNG图片!');
        // }
        // const isLt2M = file.size / 1024 / 1024 < 2;
        // if (!isLt2M) {
        //     message.error('图片大小不能大于2MB!');
        // }
        // return isJpgOrPng && isLt2M;
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只支持上传JPG/PNG图片!');
            return Upload.LIST_IGNORE;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能大于2MB!');
            return Upload.LIST_IGNORE;
        }
        return false;
    };
    const onRemoveImg = (file: any) => {
        setFileList([]);
        setImageUrl('');
    };
    const uploadButton = (
        <div>
            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
    );
    const handleRightChange = (info: any) => {
        if (info.fileList.length) {
            const formData = new FormData();
            formData.append('file', info.file);
            setUploadLoading(true);
            Apis.uploadImages(formData)
                .then((res: any) => {
                    if (res && res.code === 0) {
                        setImageRightUrl(`${imgPre}${res.data.img_url}`);
                        setFileRightList([
                            {
                                url: `${imgPre}${res.data.img_url}`,
                            },
                        ]);
                    } else {
                        message.error(res.msg);
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                })
                .finally(() => {
                    setUploadLoading(false);
                });
        } else {
            setFileRightList([]);
            setImageRightUrl('');
        }
    };
    const onRemoveRightImg = (file: any) => {
        setFileRightList([]);
        setImageRightUrl('');
    };
    const handleChange = (info: any) => {
        if (info.fileList.length) {
            const formData = new FormData();
            formData.append('file', info.file);
            setUploadLoading(true);
            Apis.uploadImages(formData)
                .then((res: any) => {
                    if (res && res.code === 0) {
                        setImageUrl(`${imgPre}${res.data.img_url}`);
                        setFileList([
                            {
                                url: `${imgPre}${res.data.img_url}`,
                            },
                        ]);
                    } else {
                        message.error(res.msg);
                    }
                })
                .catch((err) => {
                    console.log('err', err);
                })
                .finally(() => {
                    setUploadLoading(false);
                });
        } else {
            setFileList([]);
            setImageUrl('');
        }
    };
    const commitGlobalTitle = (e: any) => {
        dispatch({
            type: 'baseModel/changeHomeTitle',
            payload: e,
        });
    };
    const fetchPublicKeyList = () => {
        Apis.platBackGetPublicKeyList({})
            .then((res: any) => {
                if (res && res.code === 0) {
                    setPublicKeyOption(res.data.list);
                } else {
                    message.error(res.msg);
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };
    useEffect(() => {
        initAction();
        fetchPublicKeyList();
        // initRequest();
    }, []);
    useEffect(() => {
        setCurrent(1);
        if (activeIndex == '1') {
            initRequest();
        } else {
            init2Request();
        }
    }, [activeIndex]);
    useEffect(() => {
        if (activeIndex == '1') {
            initRequest();
        } else {
            init2Request();
        }
    }, [current]);
    const callback = (key: any) => {
        setActiveIndex(key);
    };
    const onPagChange = (e: any) => {
        setCurrent(e);
    };
    const publicKeyChange = (value: any) => {
        let track = publicKeyOption.find((ele) => {
            return ele.public_key == value;
        });
        rightForm.setFieldsValue({ platform_name: track.name });
    };
    let dynamicContent;
    if (activeIndex == '1') {
        dynamicContent = (
            <div className={styles.active1TableMaster}>
                <div className={styles.active1NewCon}>
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => pop1New()}
                    >
                        新建
                    </Button>
                </div>
                <div className={styles.active1TableCon}>
                    <Table
                        columns={columns}
                        rowKey={(item) => item.id}
                        dataSource={listData}
                        pagination={false}
                        loading={loading}
                        bordered
                    />
                    <Pagination
                        className={styles.pagination}
                        hideOnSinglePage
                        total={total}
                        current={current}
                        pageSize={pagesize}
                        showTotal={showTotal}
                        showSizeChanger={false}
                        onChange={(e) => {
                            onPagChange(e);
                        }}
                    />
                </div>
            </div>
        );
    } else {
        dynamicContent = (
            <div className={styles.active2TableMaster}>
                <div className={styles.active2NewCon}>
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => pop2New()}
                    >
                        新建
                    </Button>
                </div>
                <div className={styles.active2TableCon}>
                    <Table
                        columns={columnSecond}
                        rowKey={(item) => item.id}
                        dataSource={listData}
                        pagination={false}
                        loading={loading}
                        bordered
                    />
                    <Pagination
                        className={styles.pagination}
                        hideOnSinglePage
                        total={total}
                        current={current}
                        pageSize={pagesize}
                        showTotal={showTotal}
                        showSizeChanger={false}
                        onChange={(e) => {
                            onPagChange(e);
                        }}
                    />
                </div>
            </div>
        );
    }
    let tabAddon;
    if (activeIndex == '1') {
        tabAddon = (
            <div className={styles.active1InputCon}>
                <div className={styles.active1InputLeftCon}>
                    <span className={styles.active1InputLeftConTitle}>
                        名称：
                    </span>
                    <Input
                        className={styles.leftSerach}
                        placeholder="请输入名称"
                        allowClear
                        maxLength={20}
                        value={leftSerach}
                        onChange={(e) => {
                            leftSerachChange(e);
                        }}
                    />
                </div>
                <div className={styles.active1InputRightCon}>
                    <Button
                        type="primary"
                        shape="round"
                        onClick={() => active1Search()}
                    >
                        查询
                    </Button>
                </div>
            </div>
        );
    } else {
        tabAddon = (
            <div className={styles.active2InputCon}>
                <div className={styles.active2InputLeftCon}>
                    <span className={styles.active2InputLeftConTitle}>
                        名称：
                    </span>
                    <Input
                        className={styles.rightSerach}
                        placeholder="请输入名称"
                        allowClear
                        maxLength={20}
                        value={rightSerach}
                        onChange={(e) => {
                            rightSerachChange(e);
                        }}
                    />
                </div>
                <div className={styles.active2InputRightCon}>
                    <Button
                        shape="round"
                        type="primary"
                        onClick={() => active2Search()}
                    >
                        查询
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className={styles.masterPageCon}>
            <Modal
                maskClosable={false}
                centered
                destroyOnClose
                visible={showLeftNew}
                title={leftModalTitle}
                onOk={handleNewOk}
                onCancel={handleNewCancel}
            >
                <Form
                    {...layout}
                    form={form}
                    name="nest-messages"
                    labelAlign={'left'}
                >
                    <Form.Item
                        name="platform_name"
                        label="平台名称"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <Input maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        className={styles.requiredRed}
                        name="link"
                        label="链接地址"
                        hasFeedback
                        rules={[{ validator: checkLeftLink }]}
                    >
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        name="category_id"
                        label="分类"
                        hasFeedback
                        rules={[{ required: true, message: '分类不能为空' }]}
                    >
                        <Select>{optionsArray}</Select>
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="图标"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: '请上传头像' }]}
                        extra="只支持上传不大于2MB的JPG/PNG图片"
                    >
                        <Upload
                            fileList={fileList}
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={{
                                showRemoveIcon: true,
                                showPreviewIcon: false,
                            }}
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            onRemove={onRemoveImg}
                            maxCount={1}
                        >
                            {imageUrl ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="is_index_show"
                        label="首页展示状态"
                        hasFeedback
                        rules={[
                            { required: true, message: '首页展示状态不能为空' },
                        ]}
                    >
                        <Select>
                            <Option key={0} value={0}>
                                首页不展示
                            </Option>
                            <Option key={1} value={1}>
                                首页展示
                            </Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="sorts"
                        label="排序"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            className={styles.numberInput}
                            min={0}
                            max={1000}
                            precision={0}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                maskClosable={false}
                centered
                destroyOnClose
                visible={showRightNew}
                title={rightModalTitle}
                onOk={handleRightNewOk}
                onCancel={handleRightNewCancel}
            >
                <Form
                    {...layout}
                    form={rightForm}
                    name="nest-messages"
                    labelAlign={'left'}
                >
                    <Form.Item
                        name="platform_name"
                        label="平台名称"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <Input disabled={true} maxLength={20} />
                    </Form.Item>
                    <Form.Item
                        className={styles.requiredRed}
                        name="link"
                        label="链接地址"
                        hasFeedback
                        rules={[{ validator: checkRightLink }]}
                    >
                        <Input maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        name="avatar"
                        label="图标"
                        valuePropName="fileRightList"
                        getValueFromEvent={normRightFile}
                        rules={[{ required: true, message: '请上传头像' }]}
                        extra="只支持上传不大于2MB的JPG/PNG图片"
                    >
                        <Upload
                            fileList={fileRightList}
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={{
                                showRemoveIcon: true,
                                showPreviewIcon: false,
                            }}
                            beforeUpload={beforeUpload}
                            onChange={handleRightChange}
                            onRemove={onRemoveRightImg}
                            maxCount={1}
                        >
                            {imageRightUrl ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Form.Item
                        name="public_key"
                        label="接入码"
                        hasFeedback
                        rules={[{ required: true, message: '接入码不能为空' }]}
                    >
                        <Select onChange={(value) => publicKeyChange(value)}>
                            {publicKeyArray}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="sorts"
                        label="排序"
                        hasFeedback
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            className={styles.numberInput}
                            min={0}
                            max={1000}
                            precision={0}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <div className={styles.innerCon}>
                <Tabs
                    defaultActiveKey="1"
                    onChange={callback}
                    className={styles.tabsCon}
                >
                    <TabPane tab="业务集成配置" key="1"></TabPane>
                    <TabPane tab="业务后台配置" key="2"></TabPane>
                </Tabs>
                <div className={styles.tabAddonCon}>{tabAddon}</div>
                <div className={styles.dynamicContentCon}>{dynamicContent}</div>
            </div>
        </div>
    );
};
export default connect(({ baseModel }) => ({ baseModel }))(WorkBenchConfigPage);
