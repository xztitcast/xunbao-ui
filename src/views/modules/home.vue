<script setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'

const lineOptions = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
    },
  ],
}
const barOption = {
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' },
        ]),
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' },
          ]),
        },
      },
      // backgroundStyle: {
      //   color: 'rgba(180, 180, 180, 0.2)',
      // },
    },
  ],
}
const pieOption = {
  title: {
    text: 'Referer of a Website',
    subtext: 'Fake Data',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
}
const radarOption = {
  title: {
    text: 'Basic Radar Chart',
  },
  legend: {
    data: ['Allocated Budget', 'Actual Spending'],
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: 'Sales' },
      { name: 'Administration' },
      { name: 'Information Technology' },
      { name: 'Customer Support' },
      { name: 'Development' },
      { name: 'Marketing' },
    ],
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: 'Allocated Budget',
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: 'Actual Spending',
        },
      ],
    },
  ],
}

onMounted(() => {
  const arr = [
    { 'element': 'myChart1', 'option': barOption },
    { 'element': 'myChart2', 'option': radarOption },
    { 'element': 'myChart3', 'option': pieOption },
    { 'element': 'myChart4', 'option': lineOptions },
  ]
  arr.forEach((e) => {
    const dom = document.getElementById(e.element)
    if (dom) {
      const myChart = echarts.init(dom)
      myChart.setOption(e.option)
    }
  })
})
</script>

<template>
  <el-row>
    <el-col :span="24">
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="item" :style="{backgroundColor: '#67C23A'}">
              <div class="title">当日订单数量</div>
              <div class="number">10</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item" :style="{backgroundColor: '#E6A23C'}">
              <div class="title">昨天订单数量</div>
              <div class="number">50</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item" :style="{backgroundColor: '#409EFF'}">
              <div class="title">本周订单数量</div>
              <div class="number">358</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="item" :style="{backgroundColor: '#F56C6C'}">
              <div class="title">本月订单数量</div>
              <div class="number">1020</div>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10" class="chart">
    <el-col :span="12">
      <el-card class="box-card">
        <div id="myChart1" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <div id="myChart2" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10" class="chart">
    <el-col :span="12">
      <el-card class="box-card">
        <div id="myChart3" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card">
        <div id="myChart4" :style="{ width: '100%', height: '400px' }"></div>
      </el-card>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.chart {
  margin-top: 10px;
}

.item {
  height: 150px;
  background-color: rgb(103, 194, 58);
  color: rgb(255, 255, 255);
  position: relative;

  .title {
    position: absolute;
    top: 21px;
    left: 31px;
  }

  .number {
    position: absolute;
    left: 102px;
    top: 75px;
    font-weight: 600;
    font-size: 40px;
    cursor: pointer;
  }

  .el-icon {
    position: absolute;
    top: 42px;
    right: 24px;
  }
}
</style>