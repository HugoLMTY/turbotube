<template>
  <!-- ? QUEUE -->
  <q-drawer
    :model-value="props.queueOpened"
    :overlay="props.queueOverlay"
    bordered
    side="right"
    class="bg-neutral-lower"
    @update:model-value="(event) => $emit('update:queueOpened', event)"
  >
    <!-- ? CONTROLS -->
    <div v-if="false" class="row align-center justify-start q-mt-md q-mr-md">
      <q-btn
        flat
        dense
        icon="mdi-chevron-right"
        @click="$emit('update:queueOpened', false)"
      />
      <!-- <q-btn
        flat
        dense
        :icon="`mdi-pin${state.queueOverlay ? '-outline' : ''}`"
        @click="state.queueOverlay = !state.queueOverlay"
      /> -->
    </div>

    <!-- ? HEADER -->
    <q-list>
      <q-item-label header class="row align-center justify-between">
        <span
          v-for="mode in stateless.modes"
          :key="'mode_' + mode.value"
          class="not-selectable smooth"
          :class="{ 'text-bold': state.mode === mode.value }"
          @click="state.mode = mode.value"
        >
          {{ mode.label }}
        </span>
      </q-item-label>
    </q-list>

    <!-- ? VIDEOS -->
    <div
      v-if="state.mode === 'queue'"
      style="max-height: calc(100vh - 50px); overflow: auto"
    >
      <q-slide-transition
        v-for="(video, i) in props.queue"
        :key="'queue_' + video.id + '_index_' + i"
      >
        <VideoCard
          :video="video"
          @video:select="$emit('video:select', { video, index: i })"
        />
      </q-slide-transition>
    </div>

    <div v-else-if="state.mode === 'history'">
      <q-slide-transition
        v-for="(history, i) in props.history?.filter((h) => h.type === 'video')"
        :key="'queue_' + history.video?.id + '_index_' + i"
      >
        <VideoCard
          v-if="history.video"
          :video="history.video"
          :currently-playing="props.currentlyPlaying"
          @video:select="$emit('video:select', history.video)"
        />
      </q-slide-transition>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { defineAsyncComponent } from 'vue';
import { onMounted, PropType } from 'vue';
import { reactive } from 'vue';

const VideoCard = defineAsyncComponent(
  () => import('src/components/card/VideoCard.vue')
);

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

interface IPlaylist extends IResponseObject {
  title: string;
  author: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: IVideo[];
  count: number;

  player: string;
  showDetails: boolean;

  hover: {
    play: boolean;
    shuffle: boolean;
    list: boolean;
  };

  loading: {
    items: boolean;
  };
}

defineEmits(['video:select', 'update:queueOpened', 'update:queueOverlay']);
const props = defineProps({
  queue: {
    type: Object as PropType<IVideo[]>,
    default: () => {
      [];
    },
  },
  history: {
    type: Object as PropType<
      { type: string; video?: IVideo; playlist?: IPlaylist }[]
    >,
    default: () => {
      [];
    },
  },
  currentlyPlaying: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type: Object as any,
    default: null,
  },
  queueOverlay: {
    type: Boolean,
    default: false,
  },
  queueOpened: {
    type: Boolean,
    default: true,
  },
});
const stateless = {
  modes: [
    {
      label: 'Queue',
      value: 'queue',
    },
    {
      label: 'History',
      value: 'history',
    },
  ],
};
const state = reactive({
  mode: stateless.modes[0].value,
});

watch(
  () => props.queue,
  (q) => {
    console.log({ q });
  }
);

onMounted(() => {
  //
});
</script>
