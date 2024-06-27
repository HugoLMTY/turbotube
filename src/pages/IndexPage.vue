<template>
  <div>
    <q-dialog v-model="state.showKeysModal">
      <q-card>
        <q-card-section class="text-h6 q-pb-none">
          Clés d'environnement
          <br />
          <p class="text-caption q-mb-none">
            Cette application nécessite des clés pour fonctionner. C'est comme
            une porte mais digitale
          </p>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <q-input
            v-for="key in stateless.requiredKeys"
            :key="'input-key_' + key.model"
            v-model="(state as any)[key.model]"
            :label="key.label"
            required
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            outline
            color="primary"
            :disable="!state.apiKey || !state.channelId"
            @click="initStoredValues"
          >
            Enregistrer
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <SideDrawer
      v-model:queue-opened="state.queueOpened"
      v-model:queue-overlay="state.queueOverlay"
      :queue="state.queue"
      :history="state.history"
      :currently-playing="state.currentlyPlaying"
      @video:select="($event) => selectVideo($event.video, $event.index)"
    />

    <!-- ? HEADER -->
    <div v-if="false" class="row align-center justify-between q-my-lg">
      <!-- ? ALIGN -->
      <div></div>

      <!-- ? SEARCH / CLOSE PLAYER -->
      <div v-if="false" class="row align-center justify-center q-gutter-sm">
        <q-input v-model="state.channelId" label="Channel ID" dense outlined />
        <q-btn
          color="primary"
          icon="mdi-magnify"
          outline
          @click="fetchPlaylists"
        />

        <q-btn
          v-if="state.currentlyPlaying"
          color="red"
          icon="mdi-close"
          outline
          @click="state.currentlyPlaying = null"
        />
      </div>

      <!-- ? THUMBSIZES / QUEUE -->
      <div>
        <q-btn-dropdown flat dense icon="mdi-move-resize">
          <div class="column">
            <q-btn
              v-for="size in stateless.thumbSizes"
              :key="'size_control_' + size.key"
              flat
              :color="state.thumbSize === size.key ? 'primary' : ''"
              :icon="size.icon"
              @click="() => { state.thumbSize = size.key as EThumbSizes }"
            />
          </div>
        </q-btn-dropdown>
        <q-btn
          flat
          :icon="`mdi-playlist-music${state.queueOpened ? '' : '-outline'}`"
          @click="state.queueOpened = !state.queueOpened"
        />
      </div>
    </div>

    <!-- ? PLAYER -->
    <q-slide-transition>
      <div
        v-if="state.currentlyPlaying"
        class="row justify-start bg-neutral-lowest q-mb-sm q-px-lg q-pb-lg q-pt-sm not-selectable"
        :style="{
          height: state.zenMode ? 'calc(100vh - 50px)' : 'auto',
        }"
      >
        <div class="col-12 row justify-end items-center q-mb-sm">
          <div class="col-grow">
            <span v-if="state.zenMode" class="text-bold text-subtitle2">
              {{ state.currentlyPlaying.title }}
            </span>
          </div>
          <q-btn
            flat
            :dense="state.zenMode"
            :icon="state.zenMode ? 'mdi-turbine' : 'mdi-monitor-shimmer'"
            @click="state.zenMode = !state.zenMode"
          />

          <q-btn
            flat
            :dense="state.zenMode"
            icon="mdi-cactus"
            @click="state.showKeysModal = true"
          />
          <q-btn
            flat
            :dense="state.zenMode"
            icon="mdi-theme-light-dark"
            @click="$q.dark.toggle"
          />
          <q-btn-dropdown flat dense icon="mdi-move-resize">
            <div class="column">
              <q-btn
                v-for="size in stateless.thumbSizes"
                :key="'size_control_' + size.key"
                flat
                :dense="state.zenMode"
                :color="state.thumbSize === size.key ? 'primary' : ''"
                :icon="size.icon"
                @click="() => { state.thumbSize = size.key as EThumbSizes }"
              />
            </div>
          </q-btn-dropdown>
          <q-btn
            flat
            :dense="state.zenMode"
            :icon="`mdi-playlist-music${state.queueOpened ? '' : '-outline'}`"
            @click="state.queueOpened = !state.queueOpened"
          />
        </div>

        <span v-if="!state.zenMode" class="text-bold text-h6 text-left q-mb-sm">
          {{ state.currentlyPlaying.title }}
        </span>

        <YoutubePlayer
          :video="state.currentlyPlaying"
          :zen="state.zenMode"
          @video:ended="playNextVideo"
        />
      </div>
    </q-slide-transition>

    <!-- ? PLAYLISTS -->
    <div style="display: flex; overflow: auto">
      <PlaylistCard
        v-for="playlist in state.playlists"
        :key="'playlist_' + playlist.id"
        :playlist="playlist"
        :thumb-size="state.thumbSize"
        class="q-ma-md"
        @queue:add="addToQueue"
        @queue:playlist="addPlaylistToQueue"
        @video:select="selectVideo"
        @playlist:select="selectPlaylist"
        @playlist:details="toggleShowDetails"
        @playlist:shuffle="selectPlaylist(playlist, true)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { reactive } from 'vue';

import axios from 'axios';
// import { computed } from 'vue';
import { defineAsyncComponent } from 'vue';
import { useQuasar } from 'quasar';
import { watch } from 'vue';

const $q = useQuasar();

const SideDrawer = defineAsyncComponent(
  () => import('src/components/SideDrawer.vue')
);
const PlaylistCard = defineAsyncComponent(
  () => import('src/components/card/PlaylistCard.vue')
);
const YoutubePlayer = defineAsyncComponent(
  () => import('src/components/YoutubePlayer.vue')
);

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

const stateless = {
  path: 'https://youtube.googleapis.com/youtube/v3',
  requiredKeys: [
    { label: "Clé d'api", model: 'apiKey' },
    { label: 'ID de chaîne', model: 'channelId' },
  ],
  thumbSizes: [
    {
      key: EThumbSizes.default,
      icon: 'mdi-view-grid-compact',
    },
    {
      key: EThumbSizes.medium,
      icon: 'mdi-grid',
    },
    {
      key: EThumbSizes.high,
      icon: 'mdi-grid-large',
    },
    {
      key: EThumbSizes.maxres,
      icon: 'mdi-square-outline',
    },
  ] as { key: string; icon: string }[],
};

const state = reactive({
  apiKey: '' as null | string,
  channelId: '' as null | string,
  showKeysModal: false,

  playlists: [] as IPlaylist[],

  currentlyPlaying: null as null | IVideo,
  // selected: null as null | IPlaylist,
  thumbSize: 'medium' as EThumbSizes,

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  player: null as any,

  zenMode: false,

  queueOverlay: false,
  queueOpened: true,
  queue: [] as IVideo[],

  history: [] as { type: string; video?: IVideo; playlist?: IPlaylist }[],
});

const initKeys = () => {
  const [apiKey, channelId] = [
    localStorage.getItem('apiKey'),
    localStorage.getItem('channelId'),
  ];
  console.log({ apiKey, channelId });

  state.apiKey = apiKey;
  state.channelId = channelId;

  state.showKeysModal = !state.apiKey || !state.channelId;
  return !state.showKeysModal;
};

const initStoredValues = async () => {
  const [currentlyPlaying, queue] = [
    localStorage.getItem('currentlyPlaying'),
    localStorage.getItem('queue'),
  ];

  await fetchPlaylists();

  if (currentlyPlaying) {
    selectVideo(JSON.parse(currentlyPlaying));
  } else {
    pickRandomPlaylist();
  }

  if (queue) {
    state.queue = JSON.parse(queue);
  }
};

const query = async (endpoint: string, params: object) => {
  const res = await axios.get(`${stateless.path}${endpoint}`, { params });
  if (!res) {
    return console.log('No API Result :(');
  }

  const { data } = res;
  if (!data) {
    return console.log('No data from API Response');
  }

  const { items } = data;
  if (!items) {
    return console.log('No items found');
  }

  return items;
};

const fetchPlaylists = async () => {
  console.log('fetching...');

  const items = await query('/playlists', {
    part: 'snippet, contentDetails, player',
    channelId: state.channelId,
    key: state.apiKey,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state.playlists = items.map((item: any) => {
    const data = {
      item,
      id: item.id,

      title: item.snippet.title,
      author: item.snippet.channelTitle,

      thumbnails: {
        ...item.snippet.thumbnails,
      },
      count: item.contentDetails.itemCount,

      player: item.player?.embedHtml,
      showDetails: false,

      hover: {
        play: false,
        shuffle: false,
        list: false,
      },

      loading: {
        items: false,
      },
    } as IPlaylist;
    // console.log({ data });

    return data;
  });
};

const fetchPlaylistItems = async (playlist: IPlaylist) => {
  console.log('fetching playlist items...', playlist.id);

  const items = await query('/playlistItems', {
    part: 'id, snippet',
    playlistId: playlist?.id,
    maxResults: 50,
    key: state.apiKey,
  });

  const populatedVideos = await query('/videos', {
    part: 'id, snippet, player',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    id: items.map((item: any) => item.snippet.resourceId.videoId)?.join(','),
    key: state.apiKey,
  });
  console.log({ populatedVideos });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped = items.map((item: any) => mapVideo(item, populatedVideos));

  return mapped;
};

const toggleShowDetails = async (playlist: IPlaylist) => {
  if (!playlist.showDetails && !playlist.items?.length) {
    playlist.loading.items = true;
    playlist.items = await fetchPlaylistItems(playlist);

    state.playlists = state.playlists?.map((p) => {
      return { ...p, showDetails: p.id === playlist.id };
    });
    playlist.loading.items = false;
  } else {
    playlist.showDetails = !playlist.showDetails;
  }
};

const selectPlaylist = async (playlist: IPlaylist, shuffle = false) => {
  const items = await fetchPlaylistItems(playlist);

  // <!-- * thanks to https://stackoverflow.com/a/2450976 -->
  const shuffeul = (array: IVideo[]) => {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  state.queue = (shuffle ? shuffeul(items) : items)?.slice(1);
  state.history.unshift({ type: 'playlist', playlist });

  if (state.currentlyPlaying?.id === items[0]?.id) {
    return;
  }
  selectVideo(items[0]);
};

const selectVideo = async (video: IVideo, queueIndex = null) => {
  if (state.currentlyPlaying?.id === video.id) {
    return null;
  }

  state.history = state.history.filter((h) => {
    return h.type !== 'video' ? true : h.video?.id !== video.id;
  });
  state.history.unshift({ type: 'video', video });

  if (queueIndex) {
    state.queue = state.queue?.slice(queueIndex);
  }
  state.currentlyPlaying = video;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapVideo = (item: any, populatedVideos: any) => {
  const data = {
    item,
    id: item.id,
    videoId: item.snippet.resourceId.videoId,
    playlistId: item.snippet.playlistId,

    title: item.snippet.title,
    description: item.snippet.description,
    videoOwnerChannelTitle: item.snippet.videoOwnerChannelTitle,

    position: item.snippet.position,
    video: populatedVideos?.find(
      (v: IVideo) => v.id === item.snippet.resourceId.videoId
    ),

    thumbnails: {
      ...item.snippet.thumbnails,
    },

    hover: false,
    hovers: {
      queue: false,
    },
  } as IVideo;
  // console.log({ data });

  return data;
};

const pickRandomPlaylist = () => {
  const total = state.playlists?.length;
  const index = Math.floor(Math.random() * total);

  console.log('Picking random playlist...', total, index);
  const picked = state.playlists[index];

  console.log({ picked });

  return selectPlaylist(picked);
};

const playNextVideo = () => {
  if (state.queue?.length <= 0) {
    return;
  }

  selectVideo(state.queue[0]);
  state.queue = state.queue?.slice(1);
};

const addToQueue = (video: IVideo) => {
  state.queue.push(video);
};

const addPlaylistToQueue = (playlist: IPlaylist) => {
  state.queue = {
    ...state.queue,
    ...playlist.items,
  };
};

watch(
  () => state.zenMode,
  (zen: boolean) => {
    state.queueOpened = !zen;
    // state.queueOverlay = zen;
  }
);

watch(
  () => [state.queue],
  () => {
    localStorage.setItem('queue', JSON.stringify(state.queue));
  }
);

watch(
  () => [state.currentlyPlaying],
  () => {
    localStorage.setItem(
      'currentlyPlaying',
      JSON.stringify(state.currentlyPlaying)
    );
  }
);

watch(
  () => state.apiKey,
  () => {
    const current = localStorage.getItem('apiKey');
    if (state.apiKey === current) {
      return;
    }

    localStorage.setItem('apiKey', String(state.apiKey));
  }
);

watch(
  () => state.channelId,
  () => {
    const current = localStorage.getItem('channelId');
    if (state.channelId === current) {
      return;
    }

    localStorage.setItem('channelId', String(state.channelId));
  }
);

onMounted(async () => {
  const canFetch = initKeys();
  console.log({ canFetch });
  if (!canFetch) {
    return;
  }

  initStoredValues();
});
</script>
