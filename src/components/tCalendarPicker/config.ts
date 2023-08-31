export interface Days {
  date: string,
  disabled: boolean,
  isInclude: number, 
  isSelected: number,
  num: string | number,
  today: string
}
export interface Month {
  month: string,
  days: array[],
  nowDateText: string
}
export interface dates {
  year: number,
  month: number,
  date: number
}
export const isLeap = (year: number) => {//是否为闰年
  return year % 4 === 0 ? (year % 100 !== 0 ? 1 : (year % 400 === 0 ? 1 : 0)) : 0;
}
export const getMonthDays = (t: any) => {
  const time = new Date(t);
  const m_days = [31, 28 + isLeap(time.getYear()), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //各月份的总天数
  return m_days[time.getMonth()];
}
export const timeObj = (t: any) => {//返回当前时间的年月日
  const time: Date = new Date(t);
  const timeObj = {
      year: time.getFullYear(),
      month: time.getMonth(),
      date: time.getDate()
  };
  return timeObj;
}
export const totalDay = (start: any, end: any) => {
  let d1:number = 0,
      d2: number = 0;
  if (start) d1 = new Date(start).getTime();
  if (end) d2 = new Date(end).getTime();
  const count: number = (d2 - d1) / 8.64e7 + 1 || 0;
  return count;
}