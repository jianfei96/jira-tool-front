<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="container mx-auto px-6 py-3 flex justify-start items-center">
        <router-link to="/" class="text-blue-500 hover:text-blue-600 mr-6">AddSubTicket</router-link>
        <router-link to="/test-connection" class="text-blue-500 hover:text-blue-600">TestConnection</router-link>
      </div>
    </nav>
    <div class="container mx-auto px-4 py-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
// Script content
</script>

<style>
/* 这里可以添加额外的自定义样式 */
</style>
