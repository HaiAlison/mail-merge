import Home from "../../pages/Home";
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';


import React, { useEffect, useState } from 'react';
import { getSummarySent } from "../../api/dashboard";

const Dashboard = () => {
  const [axisData, setAxisData] = useState({
    xAxis: ['Thứ hai',
      'Thứ ba',
      'Thứ tư',
      'Thứ năm',
      'Thứ sáu',
      'Thứ bảy',
      'Chủ nhật',],
    yAxis: [],
  });
  const option = {
    grid: {top: 8, right: 8, bottom: 24, left: 36},
    xAxis: {
      type: 'category',
      data: axisData.xAxis,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: axisData.yAxis,
        type: 'bar',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };
  const fetchSummarySent = () => {
    getSummarySent().then((response) => {
      const yAxis = axisData.xAxis.map((day) => {
        const found = response.find((x) => x.date === day);
        return found ? found.count : 0;
      });
      setAxisData({
        ...axisData,
        yAxis: yAxis,
      });
    }).catch((error) => {
      console.error(error);
    });
  }
  useEffect(() => {
    fetchSummarySent();
    // eslint-disable-next-line
  }, []);
  return (
    <Home>
      <ReactEcharts echarts={echarts} option={option} />
      <p className={'note'} style={{justifyContent: 'center', display: 'flex'}}>Biểu đồ thống kê số email gửi 7 ngày gần
        nhất</p>
    </Home>
  );
}
export default Dashboard;
