import { addRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import {
  type ActionType,
  ModalForm,
  ProColumns,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message, Modal } from 'antd';
import { useRef, type FC } from 'react';
import { useEffect } from 'react';

export type CreateFormProps = {
  values?: API.InterfaceInfo;
  columns: ProColumns<API.InterfaceInfo>[];
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfo) => Promise<boolean>;
  visible: boolean;
}

const UpdateModal: FC<CreateFormProps> = (props) => {
  const { values, columns, onCancel, onSubmit, visible } = props;

  const formRef = useRef<any>(undefined);

  useEffect(() => {
    if (visible && formRef.current && values) { // 增加 visible 守卫，避免隐藏时触发
      formRef.current.setFieldsValue(values);
    }
  }, [values, visible]) // 补充 visible 依赖，确保弹窗显隐时能正确触发

  return (
    <Modal
      visible={visible}
      onCancel={() => onCancel?.()}
      // 隐藏 Modal 自带的底部按钮，避免和 ProTable 的按钮重复
      footer={null}
    >
      <ProTable
        type='form'
        columns={columns}
        formRef={formRef}
        // 自定义提交栏按钮
        submitter={{
          // 隐藏默认的额外按钮（如返回、新增等）
          render: (_, doms) => {
            // 只保留重置和提交按钮，并修改提交按钮文字为“修改”
            return [
              doms.resetButton, // 重置按钮
              React.cloneElement(doms.submitButton, {
                children: '修改', // 把默认的“提交”改为“修改”
                type: 'primary' // 保持主按钮样式
              })
            ];
          },
          // 隐藏默认的提交文字说明
          submitText: '',
          resetText: '重置'
        }}
        // 隐藏表格自带的工具栏（避免多余按钮）
        toolBarRender={false}
        onSubmit={async (value) => {
          await onSubmit?.(value);
        }}
      />
    </Modal>
  );
};

export default UpdateModal;