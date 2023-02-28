<script setup lang="ts">
import { ref, toRefs } from 'vue';
import type { PropType, Ref } from 'vue'
import type { Todo } from '@/models/todo';

const props = defineProps({
  data: {
    type: Array as PropType<Todo[]>,
    required: true,
  },
})

const { data } = toRefs(props);

const cacheDataInit = {
  id: '',
  text: '',
  isCompleted: false,
  createdAt: '',
};

const emit = defineEmits<{
  (e: 'update', data: Todo): void;
  (e: 'toggle', id: string): void;
  (e: 'delete', id: string): void;
}>();

const cacheData: Ref<Todo> = ref(cacheDataInit);

const updateTodo = () => {
  emit('update', cacheData.value);
  cacheData.value = cacheDataInit;
};

const toggleTodo = (id: string) => {
  emit('toggle', id);
}

const deleteTodo = (id: string) => {
  emit('delete', id);
}
</script>

<template>
  <ul>
    <li v-for="item in data" class=" mb-3 pb-4" :key="item.id">
      <form v-if="cacheData.id === item.id" @submit.prevent="updateTodo">
        <label>
          <input type="text" class="w-full" v-model="cacheData.text" />
        </label>
      </form>
      
      <div v-else class="flex items-center justify-between">
        <label>
          <input type="checkbox" class="rounded-full w-[20px] h-[20px] mr-4" @click="toggleTodo(item.id)"/>
          <span
            class="text-xl"
            :class="item.isCompleted ? 'line-through' : ''">{{ item.text }}</span>
        </label>
        <div>
          <button @click="cacheData = Object.assign({}, item)" type="button" class="text-xl mr-2">
            <mdicon name="pen" size="20" color="#00251A" />
          </button>
          <button @click="deleteTodo(item.id)" type="button" class="text-xl mr-2">
            <mdicon name="deleteEmpty" size="20" color="#00251A" />
          </button>
        </div>
      </div>
      <p class="text-xs text-right border-b-2 border-gray-400">{{ item.createdAt }}</p>
    </li>
  </ul>
</template>

<style scoped>

</style>