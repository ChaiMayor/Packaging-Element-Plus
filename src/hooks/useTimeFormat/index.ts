import dayjs from "dayjs";

// 格式化时间为指定格式，传入时间戳转化为默认格式 "YYYY-MM-DD HH:mm:ss"
export const useTimeFormat = (
  time: string | number,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return dayjs(Number(time)).format(format);
};

// 传入时间戳，返回几天前、几周前的格式
export const useTiming = (dateTimeStamp: string | number): string | boolean => {
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let month = day * 30;
  let year = month * 12;

  if (dateTimeStamp == undefined) {
    return false;
  } else {
    if (typeof dateTimeStamp === "string") {
      dateTimeStamp = Number(dateTimeStamp);
    }

    let sTime = new Date(dateTimeStamp).getTime(); //把所输入的时间转化为时间戳

    let now = new Date().getTime(); //获取当前时间的时间戳

    let diffValue = now - sTime;

    if (diffValue < 0) {
      return "刚刚";
      // return "结束日期不能小于开始日期！";
    }

    let yearC = diffValue / year;
    let monthC = diffValue / month;
    let weekC = diffValue / (7 * day);
    let dayC = diffValue / day;
    let hourC = diffValue / hour;
    let minC = diffValue / minute;

    if (yearC >= 1) {
      return parseInt(String(yearC)) + "年前";
    } else if (monthC >= 1) {
      return parseInt(String(monthC)) + "个月前";
    } else if (weekC >= 1) {
      return parseInt(String(weekC)) + "周前";
    } else if (dayC >= 1) {
      return parseInt(String(dayC)) + "天前";
    } else if (hourC >= 1) {
      return parseInt(String(hourC)) + "个小时前";
    } else if (minC >= 1) {
      return parseInt(String(minC)) + "分钟前";
    } else {
      return "刚刚";
    }
  }
};
