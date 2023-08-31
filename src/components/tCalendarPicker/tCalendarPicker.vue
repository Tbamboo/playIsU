<!--
	create: tangdeqiang
	date: 2023/1/14
-->
<style lang="scss" scoped>
    @import './tCalendarPicker.scss';
</style>
<template>
    <section class="modify-calendar" id="modifyCalendar">
        <div class="modify-calendar-week">
            <ul>
                <li v-for='week in weeks' :key="week">{{week}}</li>
            </ul>
        </div>
            <div class="modify-calendar-info" v-for="(m, index) in months" :key="index">
                <div class="calendar-info-month">
                    <span>{{m.nowDateText}}</span>
                </div>
                <div class="calendar-info-day" v-for="d in m.days" :key="d">
                    <ul class="calendar-day-ul">
                        <li v-for="col in d" :key="col" @click="getDay(col)">
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
        <div style="height: 50px;display: block;border: 0;background: #ffffff;width: 100%;z-index: 999"
            v-show="isMultiple!=1">
            <!-- <div class="font14 color319 text-center" style="width: 100%;line-height: 50px" v-if="totalDayCount>0">
                {{showDate}}
            </div> -->
            <el-button
                    style="width: 100%;height: 40px;border-radius: 0;background-image: linear-gradient(45deg, #319BF7 0%, #00CEFF 100%);color: #fff"
                    @click="getDate">确定
            </el-button>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
export default {
        //定义模版数据
        data() {
            return {
                weeks: ["日", "一", "二", "三", "四", "五", "六"],
                data: {
                    days: [], //每月的天数
                    nowDateText: '', //但前日历显示的日期
                    nowDate: new Date(), //当前日历显示的日期
                    id: 0, //设置日期的唯一标示
                    count: 0
                },
                months: [],
                dateList: [],
                startDate: '',
                endDate: '',
                totalDayCount: 0,
                showDate: '',
                date1: '',
                date2: ''
            }
        },
        props: [
            'count',
            'isMultiple'
        ],
        //计算属性
        computed: {},
        //主件被加载完成
        mounted: function () {
            var count = this.count || 0;
            for (var i = 0; i <= count; i++) {
                if (i == 0) {
                    this.getCalendarInfo(new Date());
                }
                if (i > 0) {
                    this.nextMonth();
                }
            }
        },
        //定义事件方法
        methods: {
            isLeap(year) {//是否为闰年
                return year % 4 === 0 ? (year % 100 !== 0 ? 1 : (year % 400 === 0 ? 1 : 0)) : 0;
            },
            getMonthDays(t) {
                let time = new Date(t);
                let m_days = [31, 28 + this.isLeap(time.getYear()), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //各月份的总天数
                return m_days[time.getMonth()];
            },
            timeObj(t) {//返回当前时间的年月日
                let time = new Date(t);
                let timeObj = {
                    year: parseInt(time.getFullYear()),
                    month: parseInt(time.getMonth()),
                    date: parseInt(time.getDate())
                };
                return timeObj;
            },
            totalDay(start, end) {
                let d1 = 0,
                    d2 = 0;
                if (start) d1 = new Date(start).getTime();
                if (end) d2 = new Date(end).getTime();
                let count = (d2 - d1) / 8.64e7 + 1 || 0;
                return count;
            },
            getCalendarInfo(time) {
                this.data.nowDate = time;
                let monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
                let curTime = new Date(time);//设置当前时间
                let obj = this.timeObj(curTime);
                let nowDate = new Date();
                let nowObj = this.timeObj(nowDate);
                let nowDay = -1;//标示是否为当前月份
                this.data.nowDateText = monthList[obj.month] + ' ' + obj.year;//设置页面头部显示的当前时间
                //判断是否为当前月份
                if (obj.year === nowObj.year && obj.month === nowObj.month)
                    nowDay = nowObj.date;
                let firtTime = new Date(obj.year + '/' + ((obj.month + 1) < 10 ? ('0' + (obj.month + 1)) : (obj.month + 1)) + '/' + '01');
                let weekArr = [], //定义行暂存数组
                    monthArr = [], //定义月暂存数组
                    indexDay = 1; //时间定值 第一天为1
                //定义行 一个月31天 每行显示7天 肯定不会超过6行
                let firstday = new Date(firtTime), //获取当月的第一天
                    dayOfWeek = firstday.getDay(), //判断第一天是星期几(返回[0-6]中的一个，0代表星期天，1代表星期一，以此类推)
                    days_per_month = [31, 28 + this.isLeap(firstday.getFullYear()), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], //创建月份数组
                    str_nums = Math.ceil((dayOfWeek + days_per_month[firstday.getMonth()]) / 7); //确定日期表格所需的行数
                for (let i = 0; i < str_nums; i++) {
                    //定义列 一行7列
                    for (let j = 1; j < 8; j++) {
                        let day = {
                            date: '',
                            num: '', //这里定义每天的字段
                            today: '',
                            isSelected: 0, //是否选中,
                            isInclude: 0,
                            disabled: false, //是否能点击
                        };
                        //只为这个月的有效时间填充数据
                        if ((j + 6 * i) >= (firtTime.getDay() + 1) && indexDay <= this.getMonthDays(curTime)) {
                            //设置今天为选中状态
                            if (nowDay === indexDay) {
                                day.today = "今天";
                                day.isSelected = 1;
                                this.date1 = day;
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

                this.months.push({
                    month: this.data.nowDate,
                    days: monthArr,
                    nowDateText: this.data.nowDateText
                });
                console.log(this.months);
            },
            getDay(d) {
                if (d.disabled || !d.num) {
                    return false;
                }
                let _this = this;

                if (!_this.isMultiple || _this.isMultiple == 0) {
                    let selectedDay = {
                        date: d.date + ' 00:00:00',
                        index: 0
                    };
                    if (this.index) {
                        selectedDay.index = this.index;
                    }
                    this.$parent.selectedDate = selectedDay;
                } else {
                    if (_this.isMultiple == 1) {
                        _this.months.forEach(function (months) {
                            months.days.forEach(function (item) {
                                item.forEach(function (col) {
                                    if (d.date == col.date) {
                                        if (col.isSelected == 0) {
                                            col.isSelected = 1;
                                            _this.dateList.push(d)
                                        }
                                        else if (col.isSelected == 1) {
                                            col.isSelected = 0;
                                            if (_this.dateList.length > 0) {
                                                _this.dateList.forEach(function (item, index) {
                                                    if (item.date == d.date) {
                                                        _this.dateList.splice(index, 1);
                                                    }
                                                })
                                            }
                                        }
                                        return false;
                                    }
                                })
                            })
                        })
                    } else if (_this.isMultiple == 2) {
                        if (!_this.date1) {
                            _this.months.forEach(function (months) {
                                months.days.forEach(function (item) {
                                    item.forEach(function (col) {
                                        if (d.date == col.date) {
                                            col.isSelected = 1;
                                            _this.date1 = d;
                                            _this.startTime = d.date + ' ' + '00:00:00';
                                            _this.endTime = d.date + ' ' + '00:00:00';
                                            return false;
                                        }
                                    })
                                })
                            })
                        } else if (_this.date1 && !_this.date2) {
                            let da1 = new Date(_this.date1.date).getTime();
                            let da2 = new Date(d.date).getTime();
                            if (da1 > da2) {
                                _this.startTime = d.date + ' ' + '00:00:00';
                                _this.endTime = _this.date1.date + ' ' + '00:00:00';
                            }
                            if (da2 >= da1) {
                                _this.endTime = d.date + ' ' + '00:00:00';
                                _this.startTime = _this.date1.date + ' ' + '00:00:00';
                            }
                            _this.months.forEach(function (months) {
                                months.days.forEach(function (item) {
                                    item.forEach(function (col) {
                                        if (d.date == col.date) {
                                            if (d.date == _this.date1.date) {
                                                return false;
                                            } else {
                                                _this.date2 = d;
                                                col.isInclude = 1;
                                                col.isSelected = da2 > da1 ? 2 : 1;
                                            }
                                        } else {
                                            if (_this.date1.date == col.date) {
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
                        } else if (_this.date1 && _this.date2) {
                            _this.months.forEach(function (months) {
                                months.days.forEach(function (item) {
                                    item.forEach(function (col) {
                                        col.isInclude = 0;
                                        if (d.date == col.date) {
                                            col.isSelected = 1;
                                        } else {
                                            col.isSelected = 0;
                                        }
                                        _this.date2 = '';
                                        _this.date1 = d;
                                        _this.startTime = d.date + ' ' + '00:00:00';
                                        _this.endTime = d.date + ' ' + '00:00:00';
                                    })
                                })
                            })
                        }
                        console.log(_this.startTime, _this.endTime);
                        _this.totalDayCount = _this.totalDay(_this.startTime, _this.endTime);
                        let startObj = _this.timeObj(_this.startTime);
                        let endObj = _this.timeObj(_this.endTime);
                        _this.showDate = (startObj.month + 1) + '月' + startObj.date + '日' + ' - ' + (endObj.month + 1) + '月' + endObj.date + '日   共' + _this.totalDayCount + '天';
                    }
                }
            },
            prevMonth(t) {
                let nowObj = this.timeObj(new Date());
                let obj = this.timeObj(t);
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
                this.getCalendarInfo(date);
            },
            nextMonth(t) {
                let nowObj = this.timeObj(new Date());
                let time = this.months[this.months.length - 1].days[2][0].date;
                let obj = this.timeObj(time);
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
                this.getCalendarInfo(date);
            },
            getDate() {
                let date = {startDate: this.startTime, endDate: this.endTime, totalCount: this.totalDayCount};
                console.log(date);
                if (!date.startDate) date = {startDate: new Date(), endDate: new Date(), totalCount: 1};
                this.$emit('getDate', date);
            },
            goBack() {
                this.$emit('goBack');
            }
        },
        //监听模版变量
        watch: {}

    }
</script>