<template>
  <q-card
    class="bg-neutral-lowest shadow-neutral-lower col-shrink"
    flat
    style="height: fit-content"
    :style="{
      maxWidth: props.playlist.thumbnails[props.thumbSize].width + 32 + 'px',
    }"
  >
    <!-- ? IMG -->
    <q-card-section>
      <q-img
        class="rounded not-selectable clickable"
        :src="props.playlist.thumbnails[props.thumbSize].url"
        :width="props.playlist.thumbnails[props.thumbSize].width + 'px'"
        :height="props.playlist.thumbnails[props.thumbSize].height + 'px'"
        @click="$emit('playlist:select', playlist)"
      />
    </q-card-section>

    <!-- ? TITLE / COUNT / ACTIONS -->
    <q-card-section>
      <div class="row items-center justify-between">
        <span>
          <b>{{ props.playlist.title }}</b> ({{ props.playlist.count }})
          <q-btn
            flat
            dense
            size="sm"
            :color="state.hover.list ? 'blue' : ''"
            @mouseover="state.hover.list = true"
            @mouseout="state.hover.list = false"
            @click="$emit('playlist:details', props.playlist)"
          >
            <q-icon
              v-if="!props.playlist.loading.items"
              name="mdi-format-list-bulleted"
            />
            <q-spinner v-else color="blue" />
          </q-btn>
        </span>
        <div class="row justify-end items-center">
          <q-btn-dropdown
            flat
            split
            dense
            size="sm"
            icon="mdi-play"
            :color="state.hover.play ? 'red' : ''"
            @mouseover="state.hover.play = true"
            @mouseout="state.hover.play = false"
            @click="$emit('playlist:select', playlist)"
          >
            <q-btn
              flat
              size="sm"
              icon="mdi-shuffle"
              :color="state.hover.shuffle ? 'green' : ''"
              @mouseover="state.hover.shuffle = true"
              @mouseout="state.hover.shuffle = false"
              @click="$emit('playlist:shuffle', props.playlist)"
            />

            <q-btn
              flat
              size="sm"
              icon="mdi-playlist-plus"
              :color="state.hover.queue ? 'primary' : ''"
              @mouseover="state.hover.queue = true"
              @mouseout="state.hover.queue = false"
              @click="$emit('queue:playlist', props.playlist)"
            />
          </q-btn-dropdown>
        </div>
      </div>
    </q-card-section>

    <!-- ? VIDEOS -->
    <q-slide-transition>
      <q-card-section v-show="props.playlist.showDetails" class="q-pa-none">
        <div class="q-ma-md">
          <q-card
            v-for="item in props.playlist.items"
            :key="'playlist_' + props.playlist.id + '_item_' + item.id"
            :class="{ 'inner-border-primary': item.hover }"
            class="q-my-sm smooth not-selectable clickable"
            flat
            @mouseover="item.hover = true"
            @mouseout="
              item.hover = false;
              item.hovers.queue = false;
            "
            @click="$emit('video:select', item)"
          >
            <q-card-section horizontal>
              <q-card-section class="q-pr-none">
                <q-img
                  :src="item.thumbnails.default.url"
                  width="80px"
                  class="rounded"
                />
              </q-card-section>

              <q-card-section class="column">
                <b>{{ item.title }}</b>
                <span>
                  {{ item.videoOwnerChannelTitle }}
                </span>
              </q-card-section>

              <q-slide-transition>
                <q-card-section
                  v-if="item.hover"
                  style="position: absolute; right: 0; top: 0"
                >
                  <q-btn
                    flat
                    dense
                    icon="mdi-playlist-plus"
                    :color="item.hovers.queue ? 'accent' : ''"
                    @mouseover="item.hovers.queue = true"
                    @mouseout="item.hovers.queue = false"
                    @click="
                      ($event) => {
                        $emit('queue:add', item);
                        $event.stopPropagation();
                      }
                    "
                  >
                  </q-btn>
                </q-card-section>
              </q-slide-transition>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-slide-transition>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, PropType } from 'vue';
import { reactive } from 'vue';

enum EThumbSizes {
  default = 'default',
  medium = 'medium',
  high = 'high',
  standard = 'standard',
  maxres = 'maxres',
}

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
  hovers: {
    queue: boolean;
  };
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
defineEmits([
  'video:select',
  'playlist:select',
  'playlist:shuffle',
  'playlist:details',
  'queue:add',
  'queue:playlist',
]);

const props = defineProps({
  playlist: {
    type: Object as PropType<IPlaylist>,
    required: true,
  },
  thumbSize: {
    type: String as PropType<EThumbSizes>,
    // eslint-disable-next-line vue/valid-define-props
    default: EThumbSizes.medium,
  },
});
// const stateless = {};
const state = reactive({
  hover: {
    list: false,
    play: false,
    shuffle: false,
    queue: false,
  },
});

onMounted(() => {
  //
});
</script>
