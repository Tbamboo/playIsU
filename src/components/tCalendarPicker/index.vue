<style lang='scss' scoped>
@import './tCalendarPicker.scss';
</style>
<template>
  <section class="modify-calendar" id="modifyCalendar">
        <div class="modify-calendar-info" v-for="(m, index) in months" :key="index">
            <div class="calendar-info-month">
                <span>{{m.nowDateText}}</span>
            </div>
            <div class="modify-calendar-week">
                <ul>
                    <li v-for='week in weeks' :key="week">{{week}}</li>
                </ul>
            </div>
            <div class="calendar-info-day" v-for="d in m.days" :key="d.date">
                <ul class="calendar-day-ul">
                    <li v-for="col in d" :key="col.num" @click="getDay(col)">
                        <div :class="{'day-ul-before': col.disabled,'day-ul-select':col.isSelected==1||col.isSelected==2, 'day-ul-include': (col.num)&&col.isInclude==1,
        'day-ul-includeFirst': col.isSelected==1, 'day-ul-includeLast': col.isSelected==2}">
                            <p class="day-ul-today" :class="{'color319': col.today}">{{col.num}}</p>
                            <p class="day-ul-today-font" v-if="col.today&&col.isSelected==0"
                            :class="{'color319': col.today}">今天</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    <!-- <div v-show="isMultiple!=1" class="modifyCalendar_pointerEvents"></div> -->
    <!-- <div style="height: 50px;display: block;border: 0;background: #ffffff;width: 100%;z-index: 999"
        v-show="isMultiple!=1">
        <div class="font14 color319 text-center" style="width: 100%;line-height: 50px" v-if="totalDayCount>0">
            {{showDate}}
        </div>
        <el-button
                style="width: 100%;height: 40px;border-radius: 0;background-image: linear-gradient(45deg, #319BF7 0%, #00CEFF 100%);color: #fff"
                @click="getDate">确定
        </el-button>
    </div> -->
</section>
</template>
<script setup lang='ts'>
import {
  onMounted,
  ref,
} from 'vue';

import type {
  Days,
  Month,
} from './config';
import {
  getMonthDays,
  isLeap,
  timeObj,
} from './config';

const props = defineProps({
  isMultiple: Number,
  count: Number
})
const weeks: string[] = ["日", "一", "二", "三", "四", "五", "六"]
let months = ref<Month[]>([])
const date1 = ref<Days>()
  const date2 = ref<Days>()

onMounted(() => {
  var count = props.count || 0;
            for (var i = 0; i <= count; i++) {
                if (i == 0) {
                    getCalendarInfo(new Date());
                }
                if (i > 0) {
                    nextMonth();
                }
            }
})

/*=========methods======*/

const getCalendarInfo = (time: any): void => {
                const nowMonth = time;
                const monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
                const curTime = new Date(time);//设置当前时间
                const obj = timeObj(curTime);
                const nowDate = new Date();
                const nowObj = timeObj(nowDate);
                let nowDay = -1;//标示是否为当前月份
                const nowDateText = monthList[obj.month] + ' ' + obj.year;//设置页面头部显示的当前时间
                //判断是否为当前月份
                if (obj.year === nowObj.year && obj.month === nowObj.month)
                    nowDay = nowObj.date;
                let firtTime = new Date(obj.year + '/' + ((obj.month + 1) < 10 ? ('0' + (obj.month + 1)) : (obj.month + 1)) + '/' + '01');
                let weekArr: Days[] = [], //定义行暂存数组
                    monthArr = [], //定义月暂存数组
                    indexDay = 1; //时间定值 第一天为1
                //定义行 一个月31天 每行显示7天 肯定不会超过6行
                let firstday = new Date(firtTime), //获取当月的第一天
                    dayOfWeek = firstday.getDay(), //判断第一天是星期几(返回[0-6]中的一个，0代表星期天，1代表星期一，以此类推)
                    days_per_month = [31, 28 + isLeap(firstday.getFullYear()), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //创建月份数组
                    str_nums = Math.ceil((dayOfWeek + days_per_month[firstday.getMonth()]) / 7); //确定日期表格所需的行数
                for (let i = 0; i < str_nums; i++) {
                    //定义列 一行7列
                    for (let j = 1; j < 8; j++) {
                        let day: Days = {
                            date: '',
                            disabled: false,
                            isInclude: 0,
                            isSelected: 0,
                            num: '',
                            today: ''
                        } 
                        //只为这个月的有效时间填充数据
                        if ((j + 6 * i) >= (firtTime.getDay() + 1) && indexDay <= getMonthDays(curTime)) {
                            //设置今天为选中状态
                            if (nowDay === indexDay) {
                                day.today = "今天";
                                day.isSelected = 1;
                                date1.value = day;
                            }

                            //判断但前时间前面的时间
                            if (indexDay < nowDay && nowDay !== -1) {
                                day.disabled = true;
                            }
                            if (obj.year < nowObj.year) {
                                day.disabled = true;
                            }
                            if (obj.year === nowObj.year) {
                                if (obj.month < nowObj.month) {
                                    day.disabled = true;
                                }
                                if (obj.month === nowObj.month) {
                                    if (indexDay < nowDay && nowDay !== -1) {
                                        day.disabled = true;
                                    }
                                }
                            }

                            //设置这天的日历 为0点
                            day.date = obj.year + '/' + ((obj.month + 1) < 10 ? ('0' + (obj.month + 1)) : (obj.month + 1)) +
                                '/' + (indexDay < 10 ? ('0' + indexDay) : indexDay);
                            day.num = indexDay++
                        }
                        weekArr.push(day);
                    }
                    monthArr.push(weekArr);
                    weekArr = [];
                }

                months.value.push({
                    month: nowMonth,
                    days: monthArr,
                    nowDateText: nowDateText
                });
                console.log(months);
            }
            const prevMonth = (t: any) => {
                let nowObj = timeObj(new Date());
                let obj = timeObj(t);
                if (nowObj.year === obj.year) {
                    if (nowObj.month === obj.month) {
                        return false;
                    }
                }
                if (nowObj.year > obj.year) {
                    return false;
                }
                if (obj.month === 0) {
                    obj.year -= 1;
                    obj.month = 12;
                }
                let date = new Date(obj.year + '/' + obj.month + '/' + obj.date);
                getCalendarInfo(date);
            }
            const nextMonth = (t?: any) => {
                let nowObj = timeObj(new Date());
                let time = months[months.length - 1].days[2][0].date;
                let obj = timeObj(time);
                if (nowObj.year === obj.year) {
                    if (obj.month - nowObj.month > 6) {
                        return false;
                    }
                }
                if (nowObj.year < obj.year) {
                    if ((obj.month + 11) - nowObj.month > 12 - (11 - nowObj.month)) {
                        return false;
                    }
                }
                let m = obj.month + 2;
                if (m === 13) {
                    obj.year = obj.year + 1;
                    m = 1;
                }
                let date = new Date(obj.year + '/' + (m < 10 ? ('0' + m) : m) + '/' + (obj.date < 10 ? ('0' + obj.date) : obj.date));
                getCalendarInfo(date);
            }
const getDay = (d: Days) => {
                if (d.disabled || !d.num) {
                    return false;
                }
                if (!props.isMultiple || props.isMultiple == 0) {
                    // let selectedDay = {
                    //     date: d.date + ' 00:00:00',
                    //     index: 0
                    // };
                    
                } else {
                    if (props.isMultiple == 1) {
                        months.value.forEach((month: Month) => {
                            month.days.forEach(function (item: any) {
                                item.forEach(function (col: Days) {
                                    if (d.date == col.date) {
                                        if (col.isSelected == 0) {
                                            col.isSelected = 1;
                                            // _this.dateList.push(d)
                                        }
                                        else if (col.isSelected == 1) {
                                            col.isSelected = 0;
                                            // if (_this.dateList.length > 0) {
                                            //     _this.dateList.forEach(function (item, index) {
                                            //         if (item.date == d.date) {
                                            //             _this.dateList.splice(index, 1);
                                            //         }
                                            //     })
                                            // }
                                        }
                                        return false;
                                    }
                                })
                            })
                        })
                    } else if (props.isMultiple == 2) {
                        if (!date1.value) {
                            months.value.forEach(function (month: Month) {
                                month.days.forEach((item: any) => {
                                    item.forEach(function (col: Days) {
                                        if (d.date == col.date) {
                                            col.isSelected = 1;
                                            date1.value = d;
                                            return false;
                                        }
                                    })
                                })
                            })
                        } else if (date1.value && !date2.value) {
                            let da1 = new Date(date1.value.date).getTime();
                            let da2 = new Date(d.date).getTime();
                            months.value.forEach(function (month: Month) {
                                month.days.forEach(function (item: any) {
                                    item.forEach(function (col: Days) {
                                        if (d.date == col.date) {
                                            if (d.date == date1.value?.date) {
                                                return false;
                                            } else {
                                                date2.value = d;
                                                col.isInclude = 1;
                                                col.isSelected = da2 > da1 ? 2 : 1;
                                            }
                                        } else {
                                            if (date1.value?.date == col.date) {
                                                col.isSelected = da2 < da1 ? 2 : 1;
                                            }
                                            let da = +new Date(col.date);
                                            if ((da1 > da2 && (da <= da1 && da >= da2)) || (da1 < da2 && (da >= da1 && da <= da2))) {
                                                col.isInclude = 1;
                                            }
                                        }
                                    })
                                })
                            })
                        } else if (date1.value && date2.value) {
                            months.value.forEach((month: Month) => {
                                month.days.forEach((item: any) => {
                                    item.forEach(function (col: Days) {
                                        col.isInclude = 0;
                                        if (d.date == col.date) {
                                            col.isSelected = 1;
                                        } else {
                                            col.isSelected = 0;
                                        }
                                        date2.value = undefined;
                                        date1.value = d;
                                    })
                                })
                            })
                        }
                    }
                }
            }
const getDate = () => {}
</script>