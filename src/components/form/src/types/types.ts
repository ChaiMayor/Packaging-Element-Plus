// 可配置表单
import type { CSSProperties } from "vue";
import type { RuleItem } from "./rule";

export type FormItemType =
  | "cascader"
  | "checkbox"
  | "checkbox-group"
  | "checkbox-button"
  | "color-picker"
  | "date-picker"
  | "input"
  | "input-number"
  | "radio"
  | "radio-group"
  | "radio-button"
  | "rate"
  | "select"
  | "option"
  | "slider"
  | "switch"
  | "time-picker"
  | "time-select"
  | "transfer"
  | "upload"
  | "editor";

// 表单每一项的配置选项
export interface FormConfig {
  // 表单项显示的元素
  type: FormItemType;
  // 表单项的值
  value?: any;
  // 表单项的label
  label?: string;
  // 表单项的标识
  prop?: string;
  // 表单项的验证规则
  rules?: RuleItem[];
  // 表单项的占位符
  placeholder?: string;
  // 表单元素特有的属性 暂时给个any
  attrs?: {
    style?: CSSProperties; // vue提供的css样式ts
    clearable?: boolean;
    showPassword?: boolean;
    disabled?: boolean;
  };
  // 表单项的子元素
  children?: FormConfig[];
  // 上传项配置
  uploadAttrs?: {
    action: string;
    headers?: object;
    method?: "post" | "put" | "patch";
    multiple?: boolean;
    data?: any;
    name?: string;
    withCredentials?: boolean;
    showFileList?: boolean;
    drag?: boolean;
    accept?: string;
    thumbnailMode?: boolean;
    fileList?: any[];
    listType?: "text" | "picture" | "picture-card";
    autoUpload?: boolean;
    disabled?: boolean;
    limit?: number;
  };
}

// ElementPlus校验表单的ts文件
import type { ValidateFieldsError } from "async-validator";
interface Callback {
  (isValid?: boolean, invalidFields?: ValidateFieldsError): void;
}

export interface ValidateFieldCallback {
  (message?: string, invalidFields?: ValidateFieldsError): void;
}

export interface FormInstance {
  registerLabelWidth(width: number, oldWidth: number): void;
  deregisterLabelWidth(width: number): void;
  autoLabelWidth: string | undefined;
  emit: (evt: string, ...args: any[]) => void;
  labelSuffix: string;
  inline?: boolean;
  model?: Record<string, unknown>;
  size?: string;
  showMessage?: boolean;
  labelPosition?: string;
  labelWidth?: string;
  rules?: Record<string, unknown>;
  statusIcon?: boolean;
  hideRequiredAsterisk?: boolean;
  disabled?: boolean;
  validate: (callback?: Callback) => Promise<boolean>;
  resetFields: () => void;
  clearValidate: (props?: string | string[]) => void;
  validateField: (props: string | string[], cb: ValidateFieldCallback) => void;
}
