import { removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import {
  addInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  listInterfaceInfoByPageUsingGet,
  offlineInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
  updateInterfaceInfoUsingPost // 新增：引入更新接口（根据实际接口名调整）
} from '@/services/shushu-backend/interfaceInfoController';
import { Button, Drawer, Input, message, Modal } from 'antd'; // 新增 Modal 引入
import React, { useCallback, useRef, useState } from 'react';
import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';
import { ExclamationCircleOutlined } from '@ant-design/icons';




const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [CreateModalVisible, handleModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  // 新增：更新弹窗相关状态
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateRow, setUpdateRow] = useState<API.InterfaceInfo>(); // 存储当前要修改的行数据



  // 新增：更新方法
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在修改');
    try {
      console.log(fields,'数据的信息查看一下');

      // 调用更新接口（根据实际接口参数调整）
      await updateInterfaceInfoUsingPost({
        ...fields
      });
      hide();
      message.success('修改成功');
      setUpdateModalVisible(false);
      actionRef.current?.reload(); // 修改后刷新表格
      return true;
    } catch (error: any) {
      hide();
      message.error('修改失败请重试！' + error.message);
      return false;
    }
  };

  // 新增：打开更新弹窗
  const handleOpenUpdateModal = (record: API.InterfaceInfo) => {
    setUpdateRow(record);
    setUpdateModalVisible(true);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const { run: delRun, loading } = useRequest(removeRule, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      messageApi.success('Deleted successfully and will refresh soon');
    },
    onError: () => {
      messageApi.error('Delete failed, please try again');
    },
  });

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      formItemProps: {
        hidden: true, // 表单中隐藏输入框，但仍会携带 id 值
        rules: [{ required: true }], // 确保 id 必传
      },
    },
    {
      key: 'name',
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '此项为必填项' }],
      },
    },
    {
      key: 'description',
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      key: 'method',
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      key: 'url',
      title: 'url',
      dataIndex: 'url',
      valueType: 'textarea',
    },
    {
      key: 'requestHeader',
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'textarea',
    },
    {
      key: 'requestParams',
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      key: 'responseHeader',
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'textarea',
    },
    {
      key: 'status',
      title: '状态',
      hideInForm: true,
      dataIndex: 'status',
      valueEnum: {
        0: { text: '关闭中', status: 'Default' },
        1: { text: '开启中', status: 'Processing' },
      },
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      key: 'option',
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        // 修改：替换原 UpdateModal 触发方式，改为点击后打开弹窗
        <a key="edit" onClick={() => handleOpenUpdateModal(record)}>
          修改
        </a>,
        record.status===0?<a key="edit"
          onClick={() => handleOnline(record)}>
          发布
        </a>:null,
        record.status===1?<a key="edit" style={{ color: '#ff4d4f' }}
        onClick={() => handleOffline(record)}>
          下线
        </a>:null,
        <Button key="confog" type='text' danger
            onClick={() => handleRemove(record)}>
          删除
        </Button>,
      ],
    },
  ];
  //删除的方法
  const handleRemove = useCallback(
    async (record: API.InterfaceInfo) => {
      if (!record) {
        messageApi.warning('请选择删除项');
        return;
      }

      // 弹出确认对话框
      Modal.confirm({
        title: '确认删除',
        icon: <ExclamationCircleOutlined />,
        content: `确定要删除 "${record.name || record.id}" 吗？此操作不可恢复！`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          const hide = message.loading('正在删除');
          try {
            await deleteInterfaceInfoUsingPost({
              id: record.id,
            });
            hide();
            message.success('删除成功');
            actionRef.current?.reloadAndRest?.();
            return true;
          } catch (error: any) {
            hide();
            message.error('删除失败请重试！' + error.message);
            return false;
          }
        },
      });
    },
    [deleteInterfaceInfoUsingPost, messageApi, actionRef], // 修复依赖项
  );

  //下线的方法
  const handleOffline = useCallback(
    async (record: API.InterfaceInfo) => {
      if (!record) {
        messageApi.warning('请选择要下线的数据');
        return;
      }
      const hide = message.loading('正在下线');
      try
       {
        await offlineInterfaceInfoUsingPost({
          id: record.id,
        });
        hide();
        message.success('下线成功');
        actionRef.current?.reloadAndRest?.();
        return true;
       }catch (error: any) {
         message.error('下线失败请重试！' + error.message);
         return false;
       }

    },
    [delRun, messageApi], // 修复依赖项（原 messageApi.warning 错误）
  );

  //发布的方法
  const handleOnline = useCallback(
    async (record: API.IdRequest) => {
      if (!record) {
        messageApi.warning('请选择发布的数据');
        return;
      }
      const hide = message.loading('正在发布');
      try
       {
        await onlineInterfaceInfoUsingPost({
          id: record.id,
        });
        hide();
        message.success('发布成功');
        actionRef.current?.reloadAndRest?.();
        return true;
       }catch (error: any) {
         message.error('发布失败请重试！' + error.message);
         return false;
       }

    },
    [delRun, messageApi], // 修复依赖项（原 messageApi.warning 错误）
  );

   // 添加的方法
   const handleAdd = async (fields: API.InterfaceInfo) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfoUsingPost({ ...fields });
      hide();
      message.success('添加成功');
      handleModalVisible(false);
      actionRef.current?.reload(); // 新增：添加后刷新表格
      return true;
    } catch (error: any) {
      hide();
      message.error('添加失败请重试！' + error.message);
      return false;
    }
  };

  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.InterfaceInfo, API.PageParams> // 原先是 API.RuleListItem，改为 API.InterfaceInfo
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="id" // 原先是 key，改为 id（匹配 InterfaceInfo 的主键）
        search={{ labelWidth: 120 }}
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (
          params: API.PageParams & { keyword?: string },
          sort,
          filter,
        ) => {
          const res: any = await listInterfaceInfoByPageUsingGet({ ...params });
          if (res?.data) {
            return {
              data: res.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            return { data: [], success: false, total: 0 };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {/* 批量操作工具栏 */}
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项 &nbsp;&nbsp;
              <span>
                服务调用次数总计{' '}
                {selectedRowsState.reduce((pre, item) => pre + (item.callNo ?? 0), 0)} 万
              </span>
            </div>
          }
        >
          <Button loading={loading} onClick={() => handleRemove(selectedRowsState)}>
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      {/* 详情抽屉 */}
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({ data: currentRow || {} })}
            params={{ id: currentRow?.name }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>

      {/* 新建弹窗 */}
      <CreateModal
        columns={columns}
        onCancel={() => handleModalVisible(false)}
        // 关键：显式绑定 handleAdd，确保方法传递
        onSubmit={async (values) => {
          console.log("父组件透传 onSubmit 触发：", values);
          return await handleAdd(values);
        }}
        visible={CreateModalVisible}
      />

      {/* 新增：更新弹窗 */}
      <UpdateModal
        columns={columns}
        values={updateRow} // 传递当前要修改的数据
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)} // 关闭弹窗
        onSubmit={(values) => handleUpdate(values)} // 提交更新
      />
    </PageContainer>
  );
};

export default TableList;