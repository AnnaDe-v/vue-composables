<script setup lang="ts">
import { ref } from 'vue';
import { useValidation } from '../composables/useValidation';
import type { FormConfig } from '../types/validation.types';
import { required, email, minLength, maxLength, min, max, phone, pattern } from '../utils/validators';

const formConfig = {
  username: {
    initialValue: '',
    hint: 'Только латинские буквы, цифры и подчеркивание (3-20 символов)',
    rules: [
      { validator: required('Имя пользователя обязательно') },
      { validator: minLength(3, 'Минимум 3 символа') },
      { validator: maxLength(20, 'Максимум 20 символов') },
    ]
  },
  email: {
    initialValue: '',
    hint: 'Ваш email адрес',
    rules: [
      { validator: required('Email обязателен') },
      { validator: email('Некорректный email') }
    ]
  },
  phone: {
    initialValue: '',
    hint: 'Любой международный формат (10-15 цифр)',
    rules: [
      { validator: required('Телефон обязателен') },
      { validator: phone('Некорректный номер телефона') }
    ]
  },
  age: {
    initialValue: '',
    hint: 'От 18 до 100 лет',
    rules: [
      { validator: required('Возраст обязателен') },
      { validator: min(18, 'Минимальный возраст: 18 лет') },
      { validator: max(100, 'Максимальный возраст: 100 лет') }
    ]
  },
  password: {
    initialValue: '',
    hint: 'Минимум 8 символов, заглавные, строчные буквы и цифры',
    rules: [
      { validator: required('Пароль обязателен') },
      { validator: minLength(8, 'Минимум 8 символов') },
      { validator: pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать заглавные, строчные буквы и цифры') }
    ]
  },
  bio: {
    initialValue: '',
    hint: 'Максимум 200 символов',
    rules: [
      { validator: maxLength(200, 'Максимум 200 символов') }
    ]
  }
};

const { fields, isValid, isDirty, validate, validateField, setFocused, setAllFocused, setValue, reset, getValues } = useValidation(formConfig as FormConfig);

const handleInput = (fieldName: string, event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  setValue(fieldName, target.value);
  if (fields[fieldName].focused) {
    validateField(fieldName);
  }
};

const handleBlur = (fieldName: string) => {
  setFocused(fieldName);
  validateField(fieldName);
};

const submitStatus = ref<'idle' | 'success' | 'error'>('idle');
const submitMessage = ref('');

const handleSubmit = (event: Event) => {
  event.preventDefault();
  
  setAllFocused();
  
  if (validate()) {
    const values = getValues();
    submitStatus.value = 'success';
    submitMessage.value = `Форма успешно отправлена! Данные: ${JSON.stringify(values, null, 2)}`;
  } else {
    submitStatus.value = 'error';
    submitMessage.value = 'Пожалуйста, исправьте ошибки в форме';
  }
};

const handleReset = () => {
  reset();
  submitStatus.value = 'idle';
  submitMessage.value = '';
};
</script>

<template>
  <div class="validation-demo">
    <form @submit="handleSubmit" @reset="handleReset">
        <div class="form-group" :class="{ error: fields.username.errors.length > 0 && fields.username.focused }">
        <label for="username">
          Имя пользователя <span class="required">*</span>
        </label>
        <input
          id="username"
          type="text"
          :value="fields.username.value"
          @input="handleInput('username', $event)"
          @blur="handleBlur('username')"
          placeholder="john_doe"
          autocomplete="off"
        />
        <div v-if="fields.username.focused && fields.username.errors.length > 0" class="error-message">
          {{ fields.username.errors[0] }}
        </div>
        <div v-else-if="formConfig.username.hint" class="hint">{{ formConfig.username.hint }}</div>
      </div>

      <div class="form-group" :class="{ error: fields.email.errors.length > 0 && fields.email.focused }">
        <label for="email">
          Email <span class="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          :value="fields.email.value"
          @input="handleInput('email', $event)"
          @blur="handleBlur('email')"
          placeholder="john@example.com"
          autocomplete="off"
        />
        <div v-if="fields.email.focused && fields.email.errors.length > 0" class="error-message">
          {{ fields.email.errors[0] }}
        </div>
        <div v-else-if="formConfig.email.hint" class="hint">{{ formConfig.email.hint }}</div>
      </div>

      <div class="form-group" :class="{ error: fields.phone.errors.length > 0 && fields.phone.focused }">
        <label for="phone">
          Телефон <span class="required">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          :value="fields.phone.value"
          @input="handleInput('phone', $event)"
          @blur="handleBlur('phone')"
          placeholder="+7 (999) 123-45-67"
          autocomplete="off"
        />
        <div v-if="fields.phone.focused && fields.phone.errors.length > 0" class="error-message">
          {{ fields.phone.errors[0] }}
        </div>
        <div v-else-if="formConfig.phone.hint" class="hint">{{ formConfig.phone.hint }}</div>
      </div>

      <div class="form-group" :class="{ error: fields.age.errors.length > 0 && fields.age.focused }">
        <label for="age">
          Возраст <span class="required">*</span>
        </label>
        <input
          id="age"
          type="number"
          :value="fields.age.value as number"
          @input="handleInput('age', $event)"
          @blur="handleBlur('age')"
          placeholder="age"
          autocomplete="off"
        />
        <div v-if="fields.age.focused && fields.age.errors.length > 0" class="error-message">
          {{ fields.age.errors[0] }}
        </div>
        <div v-else-if="formConfig.age.hint" class="hint">{{ formConfig.age.hint }}</div>
      </div>

      <div class="form-group" :class="{ error: fields.password.errors.length > 0 && fields.password.focused }">
        <label for="password">
          Пароль <span class="required">*</span>
        </label>
        <input
          id="password"
          type="password"
          :value="fields.password.value"
          @input="handleInput('password', $event)"
          @blur="handleBlur('password')"
          placeholder="********"
          autocomplete="new-password"
        />
        <div v-if="fields.password.focused && fields.password.errors.length > 0" class="error-message">
          {{ fields.password.errors[0] }}
        </div>
        <div v-else-if="formConfig.password.hint" class="hint">{{ formConfig.password.hint }}</div>
      </div>

      <div class="form-group" :class="{ error: fields.bio.errors.length > 0 && fields.bio.focused }">
        <label for="bio">О себе</label>
        <textarea
          id="bio"
          :value="fields.bio.value as string"
          @input="handleInput('bio', $event)"
          @blur="handleBlur('bio')"
          placeholder="Расскажите о себе..."
          rows="4"
          autocomplete="off"
        ></textarea>
        <div v-if="fields.bio.focused && fields.bio.errors.length > 0" class="error-message">
          {{ fields.bio.errors[0] }}
        </div>
        <div v-else-if="formConfig.bio.hint" class="hint">{{ formConfig.bio.hint }} ({{ (fields.bio.value as string).length }}/200)</div>
      </div>

      <div v-if="submitStatus !== 'idle'" :class="['submit-result', submitStatus]">
        <pre v-if="submitStatus === 'success'" class="success-message">{{ submitMessage }}</pre>
        <div v-else class="error-message">{{ submitMessage }}</div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="!isValid || !isDirty">
          Отправить
        </button>
        <button type="reset" class="btn btn-secondary">
          Сбросить
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.validation-demo {
  background: white;
  border-radius: 9px;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group.error input,
.form-group.error textarea {
  border-color: red;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.required {
  color: red;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.error-message {
  margin-top: 0.5rem;
  color: red;
  font-size: 0.875rem;
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
}

.submit-result {
  margin: 1.5rem 0;
  padding: 1rem;
}

.submit-result .error-message {
  color: red;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.btn-primary {
  background-color: cornflowerblue;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
