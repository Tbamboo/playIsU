<style lang='scss'>
.tips {
  position: absolute;
  background-color: #323232b3;
  border-radius: 4px;
  padding: 4px;
  min-width: 100px;
  min-height: 40px;
  font-size: 14px;
  color: #fff;
}
</style>
<template>
  <div id="pie"></div>
</template>
<script setup lang='ts'>
import {
  onMounted,
  ref,
} from 'vue';

import * as d3 from 'd3';

const colors = ['#c23632', '#304553', '#60a0a8', '#d48265', '#91c7af']

interface pieItem {
  name: string,
  value: number,
  visible?: boolean,
  color?: string
}

// 数据源
const dataSet: pieItem[] = [
  { value: 335, name: '直接访问' },
  { value: 310, name: '邮件营销' },
  { value: 235, name: '联盟广告' },
  { value: 135, name: '视频广告' },
  { value: 1335, name: '搜索引擎' },
]
// 数据处理
// let data = ref<pieItem[]>([])
let data: pieItem[] = dataSet.map((item, i) => (
  { ...item,
    visible: true,
    color: colors[i]
  }
))
let svg: any;
let pie: any;
let arc: any
let arc1: any
let tips: any
let g: any
let pies: any
let enters: any
const init =() => {
  svg = d3.select('#pie').append('svg')
  let width: number = 400 //Number(svg.attr('width'))
  let height:number = 400 //Number(svg.attr('height'))
  let R = 150
  svg.attr('width', width).attr('height', height)
  initTitle()
    initTips()
    initLegend()
  //绘制饼图所需
  // pie计算扇形起始角度等参数
  pie = d3.pie().sort (null).value((d: any) =>  {
    return d.value})
  arc = d3.arc().innerRadius(0).outerRadius(R)
  arc1 = d3.arc().innerRadius(0).outerRadius(R + 10)
  g = svg.append('g').attr('class', 'pies').style('transform', `translate(${width/2}px, ${height/2}px)`)
  updateShape();
  }
  onMounted(() => {
    init()
  })
  const updateShape = () => {
    // 更新与数据相关联的扇形
    //绑定数据
    pies = g.selectAll('g.pie').data(pie(data.filter (item => item.visible)))
    // 更新数据后，如果数据有新增，则需要添加dom
    enters = pies.enter().append('g').attr('class', 'pie')
    enters.append('path')
    // 更新数据后，如果数据有减少，则需要删除多余
    pies.exit().remove()
    // 合并数据，将新增的dom和原有的dom合并
    pies = pies.merge(enters)

    // // 更新扇形
    pies.select('path').attr('fill', (d: any) => {
      console.log('path', d, d.data, d.data.color);
      return d.data.color
    }).attr('d', arc).call(addEvent)
  }
  const initTitle = () => {
    //绘制标题
    svg.append ('text')
      .text ('某站点访问来源')
      .attr ('x', 200)
      .attr ('y', 20)
      .style ('text-anchor', 'middle');
  }
  const initTips =  () => {
    tips = d3
      .select ('#pie')
      .append ('div')
      .attr ('class', 'tips')
      .style ('display', 'none');
    tips.append ('p').attr ('class', 'tips_title');
    tips.append ('p').attr ('class', 'tips_value');
  }
  const initLegend = () => {
    //先绘制创建图例group绑定数据，并定位
    let legends = svg
      .append ('g')
      .attr ('class', 'legends').style('float', 'right')
      .selectAll ('g.legend')
      .data (data)
      .enter ()
      .append ('g')
      .attr ('class', 'legend')
      .attr ('transform', (d: any, i: number) => `translate(0,${(i + 1) * 16})`);
    //绘制矩形
    legends
      .append ('rect')
      .attr ('rx', 2)
      .attr ('ry', 2)
      .attr ('width', 20)
      .attr ('height', 12)
      .attr ('fill', (d: { color: any; }, i: any) => d.color)
      .on ('click', (event: any, d: any) => {
        console.log(d, event, data);
        const index = data.findIndex(item => item.name === d.name)
        //更新数据是否可见，先更新legends颜色，然后重绘饼图
        data[index].visible = !data[index].visible;
        d3.select(event.target).attr ('fill', data[index].visible ? d.color : '#ccc');
        updateShape();
      });
    //绘制图例标题
    legends
      .append ('text')
      .attr ('x', 24)
      .attr ('y', 11)
      .style ('font-size', '12px')
      .text ((d: { name: any; }) => d.name);
  }
  const addEvent = (selection: any) => {
    //对扇形添加鼠标事件
    selection
      .on ('mouseover', (event: any, d: any) => {
        //鼠标移入，增大扇形半径，修改tips内容

        tips.style ('display', 'block');
        d3.select (event.target).attr ('d', arc1);
        tips.select ('p.tips_title').text (d.data.name);
        tips.select ('p.tips_value').text (d.data.value);
      })
      .on ('mousemove', (event: any) => {
        // console.log('event', event);
        // d3.select (event.target).attr ('d', arc);
        //鼠标移动，修改tips位置
        tips.style ('left', event.offsetX + 20 + 'px').style ('top', event.offsetY + 20 + 'px');
      })
      .on ('mouseout', (event: any) => {
        //鼠标移入，增大扇形半径，修改tips内容

        tips.style ('display', 'none');
        d3.select (event.target).attr ('d', arc);
      })
    }
      
</script>