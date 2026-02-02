export type ValidatorFunction<T = unknown> = (value: T) => true | string;

export interface ValidationRule<T = unknown> {
  validator: ValidatorFunction<T>;
  message?: string;
}

export interface FieldConfig<T = unknown> {
  initialValue?: T;
  rules?: Array<ValidationRule<unknown>>;
  hint?: string;
}

export interface FieldState<T = unknown> {
  value: T;
  errors: string[];
  focused: boolean;
  dirty: boolean;
  valid: boolean;
}

export type FormConfig = Record<string, FieldConfig>;

export type FormFields = Record<string, FieldState>;
