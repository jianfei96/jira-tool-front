<template>
  <div class="max-w-md w-full mx-auto p-6 bg-white rounded shadow-md">
    <div class="mb-4">
      <input v-model="username" type="text" placeholder="Username" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    <div class="mb-4">
      <input v-model="password" type="password" placeholder="Password" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
    <div class="mb-4">
      <button type="button" @click="testConnection" class="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">{{ buttonText }}</button>
    </div>
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      {{ errorMessage }}
    </div>
  </div>
</template>

  
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const username = ref('');
const password = ref('');
const buttonText = ref('Test Connection');
const error = ref(false);
const errorMessage = ref('');

const testConnection = async () => {
  try {
  const response = await axios.post('/api/test_jira_connection', {
    username: username.value,
    password: password.value,
  });

  if (response.status === 200 && response.data === true) {
    buttonText.value = 'OK';
    error.value = false;
    errorMessage.value = '';
    console.log('Connection successful, navigating to /add-sub-ticket');
    await router.push('/add-sub-ticket');
    console.log('Navigation should have occurred');
  } else {
    buttonText.value = 'ERROR';
    error.value = true;
    errorMessage.value = 'Connection failed, but no specific error message was returned.';
  }
} catch (err) {
  buttonText.value = 'ERROR';
  error.value = true;

  // 使用类型守卫检查错误是否为 AxiosError
  if (axios.isAxiosError(err)) {
    // 现在可以安全地访问 err.response
    if (err.response) {
      errorMessage.value = `Error: ${err.response.data}`;
    } else {
      errorMessage.value = "Error: The request was made but no response was received";
    }
  } else {
    // 处理非 Axios 错误
    errorMessage.value = `Error: ${(err as Error).message || 'An unknown error occurred'}`;
  }
}

}
</script>
  
<style>
/* 添加您的样式 */
</style>
  