<style lang='scss' scoped>
  ::v-deep {
    .bar-tooltip {
      z-index: -1;
    }
  }
</style>
<template>
  <el-row :gutter="10" type="flex">
    <el-col :span="12">
      <svg width="600" height="500"></svg>
    </el-col>
    <el-col :span="12">
      <t-pie></t-pie>
    </el-col>
  </el-row>
  
</template>
<script setup lang='ts'>
import {
  onMounted,
  reactive,
  ref,
} from 'vue';

import * as d3 from 'd3';

import tPie from './tPie.vue';

// import { tooltips } from './tool';
const name = ['a', 'b', 'c', 'd', 'e', 'f']
const data: number[] = reactive([73, 53, 33, 22, 14, 68]) 
const draw = () => {
  let margin = 30;
  let svg = d3.select('svg')
  let width: number = Number(svg.attr('width'))
  let height:number = Number(svg.attr('height'))
  //创建矩形分组
  let g = svg.append('g').attr('transform', `translate(${margin}, ${margin})`)

  //定义 X 轴比例尺
  const scaleX = d3.scaleBand().range([0, width - margin * 2]).domain(name)
  //定义 Y 轴比例尺
  let scaleY = d3.scaleLinear().domain([0, Number(d3.max(data))]).range([height - margin * 2, 0])
  //上边距30；注意：range后面跟的参数0，放在第二位因为y轴正方向向下
  
  //绘制x，y轴
  let axisX = d3.axisBottom(scaleX)
  let axisY = d3.axisLeft(scaleY)
  g.append('g').attr('transform', `translate(0, ${height - margin * 2})`).call(axisX)
  g.append('g').attr('transform', 'translate(0, 0)').call(axisY)

  //创建矩形分组
  let gs = g.selectAll('rect').data(data).enter().append('g')

  //绘制矩形 + 过渡效果
  let rectP = 40;// 柱状间距
  gs.append('rect')
  .attr('x', (d: number, i: any) => {
    console.log('d', scaleX(name[i]))
    return scaleX(name[i]) + rectP / 2
  })
  .attr('y', () => {
    let min = scaleY.domain()[0]
    return scaleY(min)
  // scaleY(0)y轴比例尺映射出来的是最大值；这个效果等同于return  height - margin*2 的效果
  })
  .attr('width', () => {
    return scaleX.step() - rectP
  })
  .attr('height', () => {
    return 0 //动画初始状态
  })
  .attr('fill', 'pink').transition().duration(1500)
  .delay((d: any, i: any) => {
    return i * 200 // 每个柱子逐渐开始的效果
  })
  .attr('y', (d: number) => {
    // console.log('scaleY(d)', scaleY(d), d);
    return scaleY(d)
  })
  .attr('height', (d: any) => {
    return height - margin * 2 - scaleY(d)
  })

  const tooltips = d3.select('body').append('div')
                  .attr("class", "bar-tooltip")
                  .style('width', '150px')
                  .style('height', 'auto')
                  .style('background-color', '#fff')
                  .style('border', '1px solid #999')
                  .style('border-radius', '5px')
                  .style('display', 'none')
                  .style('align-tems', 'center')
                  .style('justify-content', 'left')
                  .style('opacity', 1)
                  .style('padding', '5px 10px')
  //添加事件
  gs.on('mouseover', function(event: any, d: any) {
    console.log(event, d);
    d3.select(event.target).transition().duration(100).attr('fill', '#306ade')
    tooltips.html(d).style('left', `${event.pageX}px`).style('top', `${event.pageY + 20}px`)
    .style('opacity', 1).style('position', "fixed").style('z-index', 9999).style('display', 'flex')
  })
  gs.on('mouseout', function(event: any) {
    // console.log(event);
    d3.select(event.target).transition().duration(500).delay(200).attr('fill', 'pink')
    tooltips.style('display', 'none')
  })
  gs.append('text')
  .attr('x', (d: any, i: number = 0) => {
    console.log('x', i);
    return scaleX(name[i]) + rectP
  })
  .attr('y', () => {
    return height - margin * 2
  })
  .attr('dx', () => {
    return -2
  })
  .attr('dy', () => {
    return 20
  })
  .text((d: any) => {
    return d
  })
  .attr('fill', 'green').transition().duration(1500)
  .delay((d: any, i: any) => {
    return i * 200 // 每个柱子逐渐开始的效果
  })
  .attr('y', (d: number) => {
    // console.log('scaleY(d)', scaleY(d), d);
    return scaleY(d)
  })
}
onMounted(() => {
  draw()
})
</script>