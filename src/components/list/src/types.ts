export interface ListItem {
  // 头像信息
  avatar?: string;
  // 标题信息
  title?: string;
  // 描述
  desc?: string;
  // 时间
  time?: string | number;
  // 时间类型 format 格式化时间为 YYYY-MM-DD 形式 | timing 格式化时间为 几天前、几周前
  timeType?: "format" | "timing";
  // 格式化时间的格式
  timeFormat?: string;
  // 标签内容
  tag?: string;
  // 标签类型
  tagType?: "" | "success" | "warning" | "info" | "danger";
}

// 列表
export interface ListOptions {
  title: string;
  content: ListItem[];
}

// 操作选项
export interface ActionOptions {
  text: string;
  icon?: string;
}
