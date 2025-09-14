<template>
  <main class="v-page"
  >
    <p>{{ status }}</p>
    <p>{{ data?.total }}</p>
  </main>
</template>


<script setup lang="ts">

const {data, status} = await useFetch<>('https://dummyjson.com/products', {
    lazy: true,
})

</script>


<style lang="scss" scoped>
.v-page {
}
</style>
