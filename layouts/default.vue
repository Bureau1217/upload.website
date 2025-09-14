<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Layout logic here if needed
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}
</style>