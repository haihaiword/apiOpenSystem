import { ProColumns, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Modal, message } from 'antd';
import type { FC } from 'react';

export type CreateFormProps = {
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<boolean>;
  visible: boolean;
};

// 手动映射 columns 到 ProForm 表单项（避免 ProTable 封装问题）
const getFormItems = (columns: ProColumns<API.InterfaceInfo>[]) => {
  return columns.map((col) => {
    // 过滤不需要在新增表单显示的字段（如创建时间、更新时间）
    if (col.hideInForm || col.dataIndex === 'id') return null;

    const commonProps = {
      name: col.dataIndex,
      label: col.title,
      rules: col.formItemProps?.rules || [],
    };

    // 根据 valueType 渲染不同表单项
    if (col.valueType === 'textarea') {
      return <ProFormTextArea {...commonProps} key={col.dataIndex} />;
    }
    return <ProFormText {...commonProps} key={col.dataIndex} />;
  }).filter(Boolean);
};

const CreateModal: FC<CreateFormProps> = (props) => {
  const { columns, onCancel, onSubmit, visible } = props;

  return (
    <ModalForm
      title="新增接口信息"
      visible={visible}
      onVisibleChange={(vis) => {
        if (!vis) onCancel(); // 弹窗关闭时触发取消逻辑
      }}
      onFinish={async (values) => {
        console.log("ModalForm 提交值：", values);
        const success = await onSubmit(values);
        if (success) {
          message.success("提交成功");
          return true; // 告诉 ModalForm 提交成功，自动关闭弹窗
        }
        return false; // 提交失败，不关闭弹窗
      }}
      submitter={{
        searchConfig: false,
        resetButtonProps: { style: { display: 'none' } }, // 可选：隐藏重置按钮
        submitButtonProps: { children: '新增', type: 'primary' },
      }}
    >
      {/* 手动渲染表单项，避免 ProTable 封装问题 */}
      {getFormItems(columns)}
    </ModalForm>
  );
};

export default CreateModal;