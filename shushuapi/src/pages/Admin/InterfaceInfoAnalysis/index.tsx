
import { listTopInvokeInterfaceInfoUsingGet } from '@/services/shushu-backend/analysisController';
import {  PageContainer,} from '@ant-design/pro-components';
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
const TableList: React.FC = () => {
  const [data,setData] = useState<API.interfaceInfoVO[]>([])
  const [loading,setLoading] = useState(true)
  useEffect(() => {
    try {
      listTopInvokeInterfaceInfoUsingGet().then(res => {
        if (res.data) {
          setData(res.data)
        }
        setLoading(false)
      })
    }catch (error) {

    }
  },[])

  const chartData = data.map(item => {
    return {
      name:item.totalNum,
      value:item.name
    }
  })

  const options = {
    title: {
      text: '接口调用的前3位',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '接口分析',
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <PageContainer>
      <ReactECharts loadingOption={loading} option={options}/>
    </PageContainer>
  );
};

export default TableList;

