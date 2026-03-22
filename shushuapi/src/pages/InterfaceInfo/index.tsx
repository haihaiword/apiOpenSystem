import { getInterfaceInfoByIdUsingGet, invokeInterfaceInfoUsingPost, listInterfaceInfoByPageUsingGet } from '@/services/shushu-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { useMatch, useParams } from '@umijs/max';
import { Button, Card, Descriptions, Divider, Form, Input, List, message, Skeleton, Spin, theme } from 'antd';

import React, { useEffect, useState } from 'react';
import { json } from 'stream/consumers';



const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [invokeLoading, setInvokeLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo>();
  const params=useParams();
  const [invokeRes,setInvokeRes] = useState<any>();
  if(!params.id){
    message.error('id不存在');
  }
  const loadData= async()=>{
    try {

      const res= await getInterfaceInfoByIdUsingGet({id:Number(params.id)});
      setData(res.data);

      setLoading(false);
    }catch (error:any) {
      message.error('获取数据失败！' + error.message);
    }
  }

  const onFinish=async(values:any) => {
    if(!params.id){
      message.error('id不存在');
      return;

    }
    setInvokeLoading(true);
    try{
      const res=await invokeInterfaceInfoUsingPost({
        id:params.id,
        ...values
      })
      setInvokeRes(res.data);
      message.success('请求成功！');
    }catch(error:any){
      message.error('请求失败！' + error.message);
    };
    setInvokeLoading(false);
  };



  useEffect(() => {
    setLoading(true);
    loadData();
  }, []);

  return (
    <PageContainer title="查看接口文档">
      <Card>
        {
          data?
          <Descriptions title={data.name} column={1}
            >
            <Descriptions.Item label="接口状态">{data.status?'启用':'禁用'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {data.createTime}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {data.updateTime}
            </Descriptions.Item>
          </Descriptions> :<>接口不存在</>
        }
      </Card>
      <Divider></Divider>
      <Card title="在线测试">
        <Form
          name="invoke"
          onFinish={onFinish}
          layout="vertical"

          // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="请求参数"
            name="userRequestParams"
            rules={[{ required: false, message: 'Please input your username!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="primary" htmlType="submit">调用</Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
      <Divider></Divider>
      <Card title="调用结果" loading={invokeLoading}>

        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
