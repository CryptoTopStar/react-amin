/* eslint-disable no-unused-vars */
import { message, Modal, Spin, Tree } from 'antd';
import {
    FileOutlined,
    FolderOutlined,
    BankOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import styles from './AccessManager.less';

const DIRECTORY_KEY_PREFIX = 'D__';
const GROUP_KEY_PREFIX = 'G__';

// function customProgressText(percent) {
//   return `已读取${percent.toFixed(2)}%`;
// }
function customRenderer(node) {
    const icon = () => {
        if (node.key.startsWith(GROUP_KEY_PREFIX)) {
            return <BankOutlined style={{ color: 'cornflowerblue' }} />;
        }
        if (node.key.startsWith(DIRECTORY_KEY_PREFIX)) {
            return <FolderOutlined style={{ color: 'orangered' }} />;
        }
        return <FileOutlined />;
    };
    return (
        <>
            {icon()} {node.title}
        </>
    );
}

/**
 * Build subtree
 * @param {Object} params - search params
 * @param {Object[]} directories - directories belong to the group
 * @param {Object[]} [files] - files belong to the group, will perform http request to get files if not supplied
 * @returns {Array<TreeNode[], string[], string|number>} [child nodes, checked ids, group id]
 */
async function buildTree(params, directories, files) {
    const uploadedFiles = files ?? (await http.getGroupFiles(params));
    // const perfCalcStart = performance.now();
    const dirMap = new Map();
    dirMap.set('0', { title: '根目录', depth: 0, children: [] });
    directories.forEach((dir) => {
        const directory = {
            title: dir.dirname,
            parent: dir.pid.toString(),
            key: `${DIRECTORY_KEY_PREFIX}${dir.id}`,
            value: dir.id,
            isLeaf: false,
            depth: dir.level,
        };
        dirMap.set(dir.id.toString(), directory);
    });
    uploadedFiles.forEach((file) => {
        const directory = dirMap.get(file.dir_id.toString());
        if (directory) {
            const fileNode = {
                title: `${file.file_title} (${file.category_name ?? '未知'})`,
                key: file.file_id.toString(),
                value: file.file_id.toString(),
                isLeaf: true,
            };
            if (directory.children) {
                directory.children = directory.children.concat(fileNode);
            } else {
                directory.children = [fileNode];
            }
        }
    });
    // 从下往上确保顺序
    directories
        .sort((a, b) => b.level - a.level)
        .forEach((dir) => {
            const parent = dir.pid;
            const directory = dirMap.get(dir.id.toString());
            // count files
            directory.fileCount =
                directory.children?.length > 0
                    ? // eslint-disable-next-line no-nested-ternary
                      directory.children.reduce(
                          (prev, node) =>
                              prev +
                              (node?.isLeaf === false
                                  ? node.fileCount
                                  : node?.isLeaf === true
                                  ? 1
                                  : 0),
                          0,
                      )
                    : 0;
            if (parent !== undefined && directory.fileCount > 0) {
                const parentDirectory = dirMap.get(parent.toString());
                if (parentDirectory.children) {
                    parentDirectory.children = [
                        directory,
                        ...parentDirectory.children,
                    ];
                } else {
                    parentDirectory.children = [directory];
                }
            }
            directory.title = `${directory.title}(${directory.fileCount})`;
        });
    const approved = uploadedFiles
        .filter((file) => file.checked)
        .map((file) => file.file_id.toString());
    // console.debug(`construction took ${performance.now() - perfCalcStart}ms`);
    return [dirMap.get('0').children, approved, params.own_department];
}

/**
 * 权限管理modal
 * @param {object} props
 * @param {boolean} props.visible - visibility
 * @param {object} props.self - 关于自身的信息, 目前只需要department_id
 * @param {object} props.selectedGroup - 所选的组的信息, 目前需要只用到id
 * @param {boolean} [props.isAdmin = false] - 超级管理员特殊处理
 * @param {function} [props.cancelCb] - 取消cb
 * @param {function} [props.okCb] - 确认cb
 */
function AccessManager({
    visible,
    self,
    cancelCb,
    okCb,
    isAdmin = false,
    selectedGroup,
}) {
    const [loading, setLoading] = useState(false);
    const [treeData, setTreeData] = useState([]);
    const [approved, setApproved] = useState([]);
    const requestRef = useRef();

    const loadData = async (searchParams) => {
        const params = {
            own_department: self.department_id,
            target_department: selectedGroup.id,
            ...searchParams,
        };
        setLoading(true);
        const requestId = uuidv4();
        requestRef.current = requestId;
        // const perfStart = performance.now();
        // let perfCalcStart;
        try {
            let children;
            let approvedList;
            let groups;
            let directories;
            let files;
            // 目前是这样...
            if (isAdmin) {
                [groups, directories, files] = await Promise.all([
                    http.getAllDepartments(),
                    http.listFolders(),
                    http.getGroupFiles(params),
                ]);
                // prepare data
                const categorizedDirectories = {};
                directories.forEach((dir) => {
                    if (categorizedDirectories[dir.department_id]) {
                        categorizedDirectories[dir.department_id].push(dir);
                    } else {
                        categorizedDirectories[dir.department_id] = [dir];
                    }
                });
                const categorizedFiles = {};
                files.forEach((file) => {
                    if (categorizedFiles[file.department_id]) {
                        categorizedFiles[file.department_id].push(file);
                    } else {
                        categorizedFiles[file.department_id] = [file];
                    }
                });
                const groupDict = {};
                groups.forEach((group) => {
                    groupDict[group.id] = group;
                });
                // build subtrees
                const tasks = [];
                groups.forEach((group) => {
                    if (selectedGroup.id !== group.id) {
                        tasks.push(
                            buildTree(
                                {
                                    ...params,
                                    own_department: group.id,
                                },
                                categorizedDirectories[group.id] ?? [],
                                categorizedFiles[group.id] ?? [],
                            ),
                        );
                    }
                });
                const results = await Promise.all(tasks);

                // concat results
                children = results.map((result) => {
                    const group = groupDict[result[2]];
                    // eslint-disable-next-line no-nested-ternary
                    const fileCount = (result[0] ?? []).reduce(
                        (prev, node) =>
                            prev +
                            (node?.isLeaf === false
                                ? node.fileCount
                                : node?.isLeaf === true
                                ? 1
                                : 0),
                        0,
                    );
                    return {
                        title: `${group.title} (${fileCount})`,
                        key: `${GROUP_KEY_PREFIX}${group.id}`,
                        value: group.id,
                        children: result[0],
                        isLeaf: false,
                    };
                });
                approvedList = results.reduce(
                    (prev, v) => prev.concat(v[1]),
                    [],
                );
            } else {
                directories = (await http.listFolders()).filter(
                    (dir) => dir.department_id === self.department_id,
                );
                [children, approvedList] = await buildTree(params, directories);
            }
            if (requestRef?.current === requestId) {
                setTreeData(children);
                setApproved(approvedList);
            }
        } catch (e) {
            console.debug(e);
        }
        if (requestRef?.current === requestId) {
            setLoading(false);
        }
        // console.debug(`loading took ${performance.now() - perfStart}ms, construction took ${performance.now() - perfCalcStart}ms`);
    };

    useEffect(() => {
        if (visible && selectedGroup) {
            setApproved([]);
            loadData();
        }
    }, [selectedGroup]);
    useEffect(
        () => () => {
            requestRef.current = undefined;
        },
        [],
    );
    const handleConfirm = async () => {
        const filteredList = approved.filter(
            (key) =>
                !(
                    key.startsWith(DIRECTORY_KEY_PREFIX) ||
                    key.startsWith(GROUP_KEY_PREFIX)
                ),
        );
        try {
            await http.grantFileAccess(selectedGroup.id, filteredList);
            message.success('修改请求成功');
            if (typeof okCb === 'function') {
                okCb();
            }
        } catch (e) {
            message.error('修改请求失败');
            console.error(e);
        }
    };
    const handleCheckEvent = (checkedKeys) => {
        setApproved(checkedKeys);
    };

    return (
        <Modal
            title={`授权管理-${selectedGroup?.title}`}
            visible={visible}
            onCancel={cancelCb}
            onOk={handleConfirm}
        >
            <Spin
                spinning={loading}
                indicator={<LoadingOutlined />}
                tip="读取中"
            >
                <div className={styles.container}>
                    <Tree
                        height={500}
                        treeData={treeData}
                        checkedKeys={approved}
                        onCheck={handleCheckEvent}
                        titleRender={customRenderer}
                        checkable
                        autoExpandParent
                        className={styles.selector}
                    />
                </div>
            </Spin>
        </Modal>
    );
}

export default AccessManager;
