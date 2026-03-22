import { listInterfaceInfoByPageUsingGet } from '@/services/shushu-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';

import { Card, List, message, Skeleton, theme } from 'antd';
import React, { useEffect, useState } from 'react';



const Index: React.FC = () => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfo[]>([]);
  const [list, setList] = useState<API.InterfaceInfo[]>([]);
  const [total, setTotal] = useState<number>(0);

  const loadData= async(current: number=1,pageSize:number=5)=>{
    try {
      setLoading(true);
      const res= await listInterfaceInfoByPageUsingGet({
        current,pageSize
      })
      setList(res?.data?.records??[]);
      setTotal(res?.data?.total??0);
      setLoading(false);
    }catch (error:any) {
      message.error('获取数据失败！' + error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title="在线接口开发平台">
     <List
      className="my-list"
      loading={loading}
      itemLayout="horizontal"
      dataSource={list}
      renderItem={(item) => {
        const apiLink=`/interface_info/${item.id}`;
        return <List.Item
          actions={[<a href={apiLink} key={item.id}>查看</a>]}
        >
            <List.Item.Meta
              title={<a href={apiLink}>{item.name}</a>}
              description={item.description}
            />
        </List.Item>
      }}
      pagination={{
        pageSize: 5,
        total,
        showTotal: (total) => `共 ${total} 条`,
        onChange: (page,pageSize) => {
          loadData(page,pageSize);
        },

      }}
    />
    </PageContainer>
  );
};

export default Index;
