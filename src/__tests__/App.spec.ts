import { describe, it, expect, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils';

import type { VueWrapper } from '@vue/test-utils';

import App from '@/App.vue';
import mdiVue from 'mdi-vue/v3'
import * as mdijs from '@mdi/js'


import { Crypto } from '@peculiar/webcrypto'

global.crypto = new Crypto();

describe('App.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(App,
      {
        global: {
          plugins: [
            [
              mdiVue, {
                icons: mdijs,
              }
            ]
          ]
        }
      });
  })

  it('renders the correct number of items left', () => {
    const itemsLeft = wrapper.find('span.text-xl');
    expect(itemsLeft.text()).toMatch(/^[0-9]+ items left$/);
  });

  it('adds a new todo when submitted', async () => {
    const input = wrapper.find('#text');
    const form = wrapper.find('form');

    input.setValue('New Todo');
    form.trigger('submit');

    await flushPromises();

    expect(wrapper.vm.data).toContainEqual(expect.objectContaining({ text: 'New Todo' }));
  });

  it('toggles the completed state of a todo', async() => {
    const todoItem = wrapper.findComponent({ name: 'TodoItem' });
    const input = wrapper.find('#text');
    const form = wrapper.find('form');

    input.setValue('New Todo');
    form.trigger('submit');

    await flushPromises();

    const todo = wrapper.vm.data[0];

    todoItem.vm.$emit('toggle', todo.id);

    expect(wrapper.vm.data).toContainEqual(expect.objectContaining({ id: todo.id, isCompleted: !todo.isCompleted }));
  });

  it('updates the text of a todo', async() => {
    const todoItem = wrapper.findComponent({ name: 'TodoItem' });
    const input = wrapper.find('#text');
    const form = wrapper.find('form');

    input.setValue('New Todo');
    form.trigger('submit');

    await flushPromises();

    const todo = wrapper.vm.data[0];

    todoItem.vm.$emit('update', { id: todo.id, text: 'New Text' });

    expect(wrapper.vm.data).toContainEqual(expect.objectContaining({ id: todo.id, text: 'New Text' }));
  });

  it('deletes a todo', async () => {
    const todoItem = wrapper.findComponent({ name: 'TodoItem' });

    const input = wrapper.find('#text');
    const form = wrapper.find('form');

    input.setValue('New Todo');
    form.trigger('submit');

    const todo = wrapper.vm.data[0];

    todoItem.vm.$emit('delete', todo.id);

    expect(wrapper.vm.data).not.toContainEqual(expect.objectContaining({ id: todo.id }));
  });
});
