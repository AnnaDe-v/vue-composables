<script setup lang="ts">
import { ref } from 'vue';
import { 
  useGetUsers,
  useCreateUser,
  useDeleteUser,
  type CreateUserDto,
} from '../../api';

const {
  data: usersData,
  loading: usersLoading,
  error: usersError,
  success: usersSuccess,
  request: requestUsers,
} = useGetUsers();

const fetchUsers = async () => {
  await requestUsers();
};


const newUser = ref<CreateUserDto>({
  name: '',
  email: '',
});

const {
  data: createData,
  loading: createLoading,
  error: createError,
  success: createSuccess,
  request: requestCreate,
} = useCreateUser();

const createUser = async () => {
  await requestCreate({
    body: newUser.value,
  });
  
  if (createSuccess.value) {
    newUser.value.name = '';
    newUser.value.email = '';
  }
};


const deleteUserId = ref<number | null>(null);

const {
  loading: deleteLoading,
  error: deleteError,
  success: deleteSuccess,
  status: deleteStatus,
  request: requestDelete,
} = useDeleteUser();

const deleteUser = async () => {
  if (!deleteUserId.value) return;
  
  await requestDelete({
    params: { id: deleteUserId.value },
  });
};
</script>

<template>
  <div class="http-demo">
    <p class="description">Запросы к JSONPlaceholder</p>

    <section class="demo-section">
      <h3>GET - Список пользователей</h3>
      <div class="controls">
        <button @click="fetchUsers" :disabled="usersLoading" class="btn btn-primary">
          {{ usersLoading ? 'Загрузка...' : 'Загрузить пользователей' }}
        </button>
      </div>

      <div v-if="usersLoading" class="box box-accent">
        Загрузка данных...
      </div>

      <div v-if="usersError" class="box box-danger">
        <strong>Ошибка:</strong> {{ usersError.message }}
      </div>

      <div v-if="usersSuccess && usersData" class="box box-primary">
        <strong>Загружено {{ usersData.length }} пользователей</strong>
        <div class="users-list">
          <div v-for="user in usersData" :key="user.id" class="user-card">
            <strong>{{ user.name }}</strong>
            <p>{{ user.email }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="demo-section">
      <h3>POST - Создание пользователя</h3>
      <div class="form-group">
        <input
          v-model="newUser.name"
          type="text"
          placeholder="Имя пользователя"
          class="input"
        />
        <input
          v-model="newUser.email"
          type="email"
          placeholder="Email"
          class="input"
        />
      </div>
      <div class="controls">
        <button @click="createUser" :disabled="createLoading || !newUser.name || !newUser.email" class="btn btn-primary">
          {{ createLoading ? 'Отправка...' : 'Создать пользователя' }}
        </button>
      </div>

      <div v-if="createLoading" class="box box-accent">
        Отправка данных...
      </div>

      <div v-if="createError" class="box box-danger">
        <strong>Ошибка:</strong> {{ createError.message }}
      </div>

      <div v-if="createSuccess && createData" class="box box-primary">
        <strong>Пользователь создан!</strong>
        <pre>{{ JSON.stringify(createData, null, 2) }}</pre>
      </div>
    </section>

    <section class="demo-section">
      <h3>DELETE запрос - Удаление пользователя</h3>
      <div class="form-group">
        <input
          v-model.number="deleteUserId"
          type="number"
          placeholder="ID пользователя (1-10)"
          min="1"
          max="10"
          class="input"
        />
      </div>
      <div class="controls">
        <button @click="deleteUser" :disabled="deleteLoading || !deleteUserId" class="btn btn-danger">
          {{ deleteLoading ? 'Удаление...' : 'Удалить пользователя' }}
        </button>
      </div>

      <div v-if="deleteLoading" class="box box-accent">
        Удаление...
      </div>

      <div v-if="deleteError" class="box box-danger">
        <strong>Ошибка:</strong> {{ deleteError.message }}
      </div>

      <div v-if="deleteSuccess" class="box box-primary">
        <strong>Пользователь #{{ deleteUserId }} успешно удален!</strong>
        <p>Status: {{ deleteStatus }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
@import './HttpDemo.css';
</style>
