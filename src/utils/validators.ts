import type { ValidatorFunction } from '../types/validation.types';


export const required = (message = 'Поле обязательно для заполнения'): ValidatorFunction<unknown> => {
  return (value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return message;
    }
    if (Array.isArray(value) && value.length === 0) {
      return message;
    }
    return true;
  };
};


export const minLength = (min: number, message?: string): ValidatorFunction<string> => {
  return (value: string) => {
    if (!value) return true;
    const length = String(value).length;
    if (length < min) {
      return message || `Минимальная длина: ${min} символов`;
    }
    return true;
  };
};


export const maxLength = (max: number, message?: string): ValidatorFunction<string> => {
  return (value: string) => {
    if (!value) return true;
    const length = String(value).length;
    if (length > max) {
      return message || `Максимальная длина: ${max} символов`;
    }
    return true;
  };
};


export const min = (minValue: number, message?: string): ValidatorFunction<number> => {
  return (value: number) => {
    if (!value && value !== 0) return true;
    const num = Number(value);
    if (isNaN(num) || num < minValue) {
      return message || `Минимальное значение: ${minValue}`;
    }
    return true;
  };
};


export const max = (maxValue: number, message?: string): ValidatorFunction<number> => {
  return (value: number) => {
    if (!value && value !== 0) return true;
    const num = Number(value);
    if (isNaN(num) || num > maxValue) {
      return message || `Максимальное значение: ${maxValue}`;
    }
    return true;
  };
};


export const email = (message = 'Введите корректный email'): ValidatorFunction<string> => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return (value: string) => {
    if (!value) return true;
    if (!emailRegex.test(String(value))) {
      return message;
    }
    return true;
  };
};


export const pattern = (regex: RegExp, message = 'Неверный формат'): ValidatorFunction<string> => {
  return (value: string) => {
    if (!value) return true;
    if (!regex.test(String(value))) {
      return message;
    }
    return true;
  };
};


export const phone = (message = 'Введите корректный номер телефона'): ValidatorFunction<string> => {
  return (value: string) => {
    if (!value) return true;
    const digitsOnly = String(value).replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return message;
    }
    return true;
  };
};


export const custom = <T = unknown>(
  validatorFn: (value: T) => boolean,
  message = 'Значение не прошло валидацию'
): ValidatorFunction<T> => {
  return (value: T) => {
    if (!validatorFn(value)) {
      return message;
    }
    return true;
  };
};
