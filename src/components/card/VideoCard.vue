<template>
  <q-card
    flat
    class="bg-neutral-lowest q-mx-sm q-my-md not-selectable clickable smooth-slow inner-border-primary-thick-hover"
    :class="{
      'inner-border-secondary': props.currentlyPlaying?.id === props.video.id,
    }"
    @click="$emit('video:select', video)"
  >
    <q-card-section horizontal>
      <q-card-section>
        <q-img
          :src="video.thumbnails.default.url"
          width="70px"
          height="40px"
          class="rounded"
        />
      </q-card-section>
      <q-card-section>
        {{ video.title }}
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, PropType } from 'vue';
// import { reactive } from 'vue';
import { IVideo } from 'src/interfaces/turbo.interfaces';

defineEmits(['video:select']);
const props = defineProps({
  video: {
    type: Object as PropType<IVideo>,
    required: true,
  },
  currentlyPlaying: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Object as any,
    default: null,
  },
});
// const stateless = {};
// const state = reactive({});

onMounted(() => {
  //
});
</script>
