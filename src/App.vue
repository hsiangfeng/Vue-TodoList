<script setup lang="ts">
import { ref, computed } from 'vue';

import type { Ref } from 'vue'
import type { Todo } from '@/models/todo';

import TodoItem from './components/TodoItem.vue';


const data: Ref<Todo[]> = ref([]);
const state:Ref<string> = ref('all');

const filterData = computed(() => {
  if (state.value === 'Active') {
      return data.value.filter((item) => !item.isCompleted);
    }
    if (state.value === 'Completed') {
      return data.value.filter((item) => item.isCompleted);
    }
    return data.value;
});

const cacheTodo: Ref<string> = ref('');

const createTodo = () => {
    if(!cacheTodo.value) return;

    data.value.push({
      id: crypto.randomUUID(),
      text: cacheTodo.value,
      isCompleted: false,
      createdAt: new Date().toLocaleString(),
    });

    cacheTodo.value = '';
  }

const updateTodo = (item: Todo) => {
  data.value = data.value.map((todo) => {
    if (todo.id === item.id) {
      return {
        ...todo,
        text: item.text,
      }
    }
    return todo;
  })
};


const toggleTodo = (id: string) => {
  data.value = data.value.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        isCompleted: !todo.isCompleted,
      }
    }
    return todo;
  })
}

const deleteTodo = (id: string) => {
  data.value = data.value.filter((item) => item.id !== id);
}
</script>

<template>
  <div class="h-screen w-100 bg-cover flex justify-center items-center" style="background-image: url('/glenn-carstens-peters-RLw-UC03Gwc-unsplash.jpg')">
    <div class="h-[550px] backdrop-blur-md p-5 w-[800px] rounded-md border-2 border-white bg-opacity-80 shadow-xl">
      <header class="text-4xl text-[#474747] font-bold text-center mb-5">
        TodoList
      </header>
      <div>
        <form @submit.prevent="createTodo">
          <label class="w-full flex items-center relative">
            <mdicon name="plus" size="30" color="#00251A" class="m-3 absolute z-10"/> 
            <input v-model="cacheTodo" id="text" class="pl-[50px] w-full opacity-90 text-xl h-[60px] border-0 rounded-md focus:ring-0" type="text" placeholder="TodoList..."/>
          </label>
        </form>
      </div>

      <main class="bg-white bg-opacity-80 mt-4 overflow-y-auto h-[300px] rounded-md p-3">
        <TodoItem
          :data="filterData"
          @update="updateTodo"
          @toggle="toggleTodo"
          @delete="deleteTodo"
        />
      </main>

      <footer class="bg-white bg-opacity-80 p-3 mt-4 rounded-md">
        <div class="flex justify-between items-center">
          <span class="text-xl">{{ filterData.length }} items left</span>
          <div class="flex">
            <button
              type="button"
              class="text-xl mr-4 px-4 py-1 border-2 hover:border-black border-black"
              :class="state === 'All' ? 'border-black' : 'border-transparent'"
              @click="state = 'All'"
            >
              All
            </button>

            <button
              type="button"
              class="text-xl mr-4 px-4 py-1 border-2 hover:border-black border-black"
              :class="state === 'Active' ? 'border-black' : 'border-transparent'"
              @click="state = 'Active'"
            >
              Active
            </button>

            <button
              type="button"
              class="text-xl mr-4 px-4 py-1 border-2 hover:border-black border-black"
              :class="state === 'Completed' ? 'border-black' : 'border-transparent'"
              @click="state = 'Completed'"
            >
              Completed
            </button>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>

</style>
