export interface City {
  id: number;
  // 拼音
  spell: string;
  // 名字
  name: string;
}

export interface CityV2 {
  id: number;
  // 拼音
  value: string;
  // 名字
  label: string;
}
