export interface TableOptions {
  // 字段名称
  prop: string;
  // 表头
  label: string;
  // 对应列的宽度
  width?: string | number;
  // 对齐方式
  align?: "left" | "center" | "right";
  // 自定义列模板的插槽名
  slot?: string;
  // 是否存在操作列
  action?: boolean;
  // 是否可编辑的单元格
  editable?: boolean;
}
