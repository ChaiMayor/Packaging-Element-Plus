// 将驼峰命名法转换为小写
export const toLine = (value: string): string => {
  return value.replace(/(A-Z)/g, "-$1").toLocaleLowerCase();
};
