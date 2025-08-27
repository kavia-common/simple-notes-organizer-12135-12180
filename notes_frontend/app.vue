<template>
  <div>
    <NuxtRouteAnnouncer />
    <TopNav />
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk?: string) => (titleChunk ? `${titleChunk} · Notes` : 'Notes'),
  title: 'Notes',
  meta: [
    { name: 'theme-color', content: '#ffffff' },
    { name: 'color-scheme', content: 'light' },
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22><rect width=%2216%22 height=%2216%22 rx=%223%22 fill=%22%231976d2%22/><path d=%22M4 4h8v1H4zm0 3h8v1H4zm0 3h6v1H4z%22 fill=%22%23ffca28%22/></svg>' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
</script>
