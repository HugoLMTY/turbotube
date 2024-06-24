<template>
  <q-card
    flat
    class="bg-neutral-lowest q-mx-sm q-my-md not-selectable clickable smooth"
    :class="{
      'inner-border-primary': state.hover,
      'inner-border-secondary': props.currentlyPlaying?.id === props.video.id,
    }"
    @mouseover="state.hover = true"
    @mouseout="state.hover = false"
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
import { reactive } from 'vue';

// enum EThumbSizes {
//   default = 'default',
//   medium = 'medium',
//   high = 'high',
//   standard = 'standard',
//   maxres = 'maxres',
// }

interface IThumbnail {
  url: string;
  width: number;
  height: number;
}

interface IThumbnails {
  default: IThumbnail;
  medium: IThumbnail;
  high: IThumbnail;
  standard: IThumbnail;
  maxres: IThumbnail;
}

interface IResponseObject {
  item: object;
  id: string;

  thumbnails: IThumbnails;
}

interface IVideo extends IResponseObject {
  videoId: string;
  playlistId: string;

  title: string;
  description: string;
  videoOwnerChannelTitle: string;

  video: {
    id: string;
    player: {
      embedHtml: string;
    };
  };

  position: number;

  hover?: boolean;
}

// interface IPlaylist extends IResponseObject {
//   title: string;
//   author: string;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   items: IVideo[];
//   count: number;

//   player: string;
//   showDetails: boolean;

//   hover: {
//     play: boolean;
//     shuffle: boolean;
//     list: boolean;
//   };

//   loading: {
//     items: boolean;
//   };
// }
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
const state = reactive({
  hover: false,
});

onMounted(() => {
  //
});
</script>
