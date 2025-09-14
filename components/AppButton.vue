<template>
  <button 
    class="app-button"
    :class="{ 'is-selected': selected }"
    @click="handleClick"
  >
    <slot>{{ text }}</slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  selected?: boolean
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  selected: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style lang="scss" scoped>
.app-button {
  display: inline-block;
  padding: 5px 10px;
  background-color: white;
  color: black;
  border: 2px solid black;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: inherit;
  font-weight: bold;
  text-decoration: none;

  &:hover,
  &.is-selected {
    background-color: black;
    color: white;
  }
}
</style>