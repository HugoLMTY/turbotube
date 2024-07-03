<template>
  <q-layout view="lHh lPr lFf" class="bg-neutral-lower">
    <q-header>
      <q-toolbar class="not-selectable">
        <q-icon size="sm" name="mdi-car-turbocharger" />
        <q-toolbar-title> TurboTube </q-toolbar-title>
        <q-btn
          class="q-mr-sm"
          flat
          dense
          icon="mdi-theme-light-dark"
          @click="$q.dark.toggle"
        />
        <div>tubinator v0.1</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
// import { reactive } from 'vue';

// const emits = defineEmits([]);
// const props = defineProps({});
// const stateless = {};

// const state = reactive({});

onMounted(() => {
  //
});
</script>
