import { computed, reactive } from 'vue';
import type { 
  FormConfig, 
  FormFields 
} from '../types/validation';

export function useValidation(config: FormConfig) {
  const fields = reactive<FormFields>({});

  for (const fieldName in config) {
    const fieldConfig = config[fieldName];
    fields[fieldName] = {
      value: fieldConfig.initialValue ?? '',
      errors: [],
      focused: false,
      dirty: false,
      valid: true,
    };
  }

  const validateField = (fieldName: string): boolean => {
    const field = fields[fieldName];
    const fieldConfig = config[fieldName];

    if (!field || !fieldConfig) {
      return false;
    }

    field.errors = [];

    const rules = fieldConfig.rules || [];
    for (const rule of rules) {
      const result = rule.validator(field.value);
      if (result !== true) {
        field.errors.push(result);
      }
    }

    field.valid = field.errors.length === 0;
    return field.valid;
  };

  const validate = (): boolean => {
    let formValid = true;

    for (const fieldName in fields) {
      const isFieldValid = validateField(fieldName);
      if (!isFieldValid) {
        formValid = false;
      }
    }

    return formValid;
  };

  const isValid = computed(() => {
    return Object.values(fields).every(field => field.valid && field.errors.length === 0);
  });

  const isDirty = computed(() => {
    return Object.values(fields).some(field => field.dirty);
  });

  const getValues = () => {
    const values: Record<string, unknown> = {};
    for (const fieldName in fields) {
      values[fieldName] = fields[fieldName].value;
    }
    return values;
  };

  const setValue = (fieldName: string, value: unknown) => {
    if (fields[fieldName]) {
      fields[fieldName].value = value;
      fields[fieldName].dirty = true;
    }
  };

  const setFocused = (fieldName: string) => {
    if (fields[fieldName]) {
      fields[fieldName].focused = true;
    }
  };

  const setAllFocused = () => {
    for (const fieldName in fields) {
      fields[fieldName].focused = true;
    }
  };

  const reset = () => {
    for (const fieldName in fields) {
      const fieldConfig = config[fieldName];
      fields[fieldName].value = fieldConfig.initialValue ?? '';
      fields[fieldName].errors = [];
      fields[fieldName].focused = false;
      fields[fieldName].dirty = false;
      fields[fieldName].valid = true;
    }
  };

  const setFieldError = (fieldName: string, error: string) => {
    if (fields[fieldName]) {
      fields[fieldName].errors.push(error);
      fields[fieldName].valid = false;
      fields[fieldName].focused = true;
    }
  };

  const setErrors = (errors: Record<string, string | string[]>) => {
    for (const fieldName in errors) {
      if (fields[fieldName]) {
        const errorValue = errors[fieldName];
        const errorMessages = Array.isArray(errorValue)
          ? errorValue
          : [errorValue];

        fields[fieldName].errors = errorMessages;
        fields[fieldName].valid = false;
        fields[fieldName].focused = true;
      }
    }
  };

  return {
    fields,
    isValid,
    isDirty,
    validate,
    validateField,
    getValues,
    setValue,
    setFocused,
    setAllFocused,
    reset,
    setFieldError,
    setErrors,
  };
}
