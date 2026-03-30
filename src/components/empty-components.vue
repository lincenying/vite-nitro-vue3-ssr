<template>
    <div>{{ title }}</div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'EmptyComponents',
})

const { title = 'Empty Components' } = defineProps<{
    title?: string
}>()
</script>
