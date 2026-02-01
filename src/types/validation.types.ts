export type ValidatorFunction = (value: any) => true | string;

export interface ValidationRule {
  validator: ValidatorFunction;
  message?: string;
}

export interface FieldConfig {
  initialValue?: any;
  rules?: ValidationRule[];
  hint?: string;
}

export interface FieldState {
  value: any;
  errors: string[];
  focused: boolean;
  dirty: boolean;
  valid: boolean;
}

export type FormConfig = Record<string, FieldConfig>;

export type FormFields = Record<string, FieldState>;
