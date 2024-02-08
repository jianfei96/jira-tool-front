<template>
  <div class="p-4">
    <div class="mb-4">
      <label for="parent-ticket" class="block text-sm font-medium text-gray-700">Parent Ticket Number</label>
      <input v-model="parentTicket" id="parent-ticket" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
    </div>

    <div class="flex gap-4 mb-4">
      <button @click="clearSubtickets()" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">clear</button>
      <button @click="saveSubTicketsAsCsv()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">save</button>
      <input type="file" ref="fileInputRef" style="display: none" @change="loadSubTicketsFromCsv" accept=".csv">
      <button @click="triggerFileInput" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Load</button>
    </div>

    <div v-for="(ticket, index) in subTickets" :key="ticket.id" class="flex flex-wrap items-center mb-4 gap-2">
    <div class="flex-none w-8">{{ index + 1 }}</div>
    <input v-model="ticket.title" type="text" placeholder="Sub Ticket Title" class="flex-grow p-2 rounded border border-gray-300">
    <input v-model="ticket.description" type="text" placeholder="Description" class="flex-grow p-2 rounded border border-gray-300">
    <input v-model="ticket.estimatedTime" type="text" placeholder="Estimated Time" class="flex-grow p-2 rounded border border-gray-300">
    <button @click="addTicket(index)" class="flex-none px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">+</button>
    <button @click="removeTicket(index)" class="flex-none px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">-</button>
  </div>

    <button @click="submitTickets" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-700">
      Submit Tickets
    </button>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

interface SubTicket {
  id: number;
  title: string;
  description: string;
  estimatedTime: string;
}

const parentTicket = ref('');
const subTickets = ref<SubTicket[]>([
  { id: Date.now(), title: '', description: '', estimatedTime: '' }
]);
const fileInputRef = ref<null | HTMLInputElement>(null);


const clearSubtickets = (): void => {
  subTickets.value = [{ id: Date.now(), title: '', description: '', estimatedTime: '' }];
}

const triggerFileInput = () => {
  if (fileInputRef.value) { // 确保引用不是 null
    fileInputRef.value.click();
  }
};

const loadSubTicketsFromCsv = (): void => {
  console.log("Loading Sub Tickets from CSV");
  if (!fileInputRef.value || !fileInputRef.value.files || fileInputRef.value.files.length === 0) {
    console.log("No file selected");
    return;
  }
  const file = fileInputRef.value.files[0];
  const reader = new FileReader();
  reader.onload = (event: any) => {
    console.log("File loaded");
    const csvData = event.target.result;
    const lines = csvData.split('\n');
    // Clear existing subTickets before adding new ones
    subTickets.value = []; // Clear existing tickets if needed
    lines.forEach((line: string, index: number) => {
      // Skip empty lines or header
      if (!line || index === 0) return;
      const values = line.split(',');
      if (values.length >= 3) { // Check if line has at least 3 values
        subTickets.value.push({
          id: Date.now() + index, // Ensure unique ID for each subTicket
          title: values[0].trim(),
          description: values[1].trim(),
          estimatedTime: values[2].trim()
        });
      }
    });
  };
  reader.readAsText(file);
};


const saveSubTicketsAsCsv = (): void => {
  const csvContent = 'data:text/csv;charset=utf-8,Title,Description,Estimated Time\n' + subTickets.value.map(ticket => `${ticket.title},${ticket.description},${ticket.estimatedTime}`).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'sub_tickets.csv');
  document.body.appendChild(link); // Required for FF
  link.click(); // This will download the data file named "my_data.csv".
}

const addTicket = (index: number): void => {
  subTickets.value.splice(index + 1, 0, { id: Date.now(), title: '', description: '', estimatedTime: '' });
};

const removeTicket = (index: number): void => {
  if (subTickets.value.length > 1) {
    subTickets.value.splice(index, 1);
  }
};

const submitTickets = async (): Promise<void> => {
  const data = {
    parentTicket: parentTicket.value,
    subTickets: subTickets.value.map(({ title, description, estimatedTime }) => ({
      title,
      description,
      estimatedTime
    }))
  };

  try {
    const response = await axios.post('/submitTickets', data);
    console.log('Submit response:', response.data);
    // 处理成功逻辑，比如清空表单，显示成功消息等
  } catch (error) {
    console.error('Submit error:', error);
    // 处理错误逻辑，比如显示错误消息
  }
};
</script>
