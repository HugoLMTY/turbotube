<template>
  <iframe
    id="youtube-player"
    :class="`rounded smooth-slowest ${state.glow}`"
    type="text/html"
    :src="currentUrl"
    style="width: 100%; max-width: 1000px; aspect-ratio: 16 / 9"
    frameborder="0"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { watch } from 'vue';
import { computed, onMounted } from 'vue';
import { reactive } from 'vue';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
  }
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
}

const emits = defineEmits(['video:playing', 'video:paused', 'video:ended']);
const props = defineProps({
  video: {
    type: Object as PropType<IVideo>,
    default: null,
  },
});
const stateless = {
  glowingStates: [
    null,
    'shadow-primary-sparest',
    'shadow-secondary-sparest',
    'shadow-accent-sparest',
  ],
};
const state = reactive({
  ready: false,
  player: null,

  playing: false,
  glow: stateless.glowingStates[0],
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onPlayerStateChange = (event: any) => {
  // console.log({ event });
  switch (event.data) {
    case window.YT.PlayerState.PLAYING:
      // console.log('Video is playing');
      state.playing = true;
      state.glow = 'GLOW MY QUEEN';
      emits('video:playing', true);
      break;

    case window.YT.PlayerState.PAUSED:
      // console.log('Video is paused');
      state.playing = false;
      emits('video:paused', true);
      break;

    case window.YT.PlayerState.ENDED:
      console.log('Video has ended');
      state.playing = false;
      emits('video:ended', true);
      break;

    default:
      state.playing = false;
    // console.log('Other state:', event.data);
  }
};

const initPlayer = () => {
  try {
    state.player = new window.YT.Player('youtube-player', {
      events: {
        onStateChange: onPlayerStateChange,
      },
    });
  } catch (err) {
    console.log({ err });
  }
};

const currentUrl = computed(() => {
  if (!props.video?.videoId) {
    return;
  }

  const baseUrl = 'https://www.youtube.com/embed/';
  const params = {
    autoplay: true,
    enablejsapi: 1,
  };

  const mapped = `${baseUrl}${props.video.videoId}?${Object.entries(params)
    ?.map((p) => `${p[0]}=${p[1]}`)
    ?.join('&')}`;
  console.log({ mapped });

  return mapped;
});

watch(
  () => state.glow,
  () => {
    const { glowingStates } = stateless;

    if (!state.playing) {
      state.glow = glowingStates[0];
      return;
    }

    const generateGlow = (): string => {
      const colors = [
        'primary',
        'secondary',
        'accent',
        'success',
        'danger',
        'warning',
      ];
      const ranges = [
        '-lowest',
        '-lower',
        '-low',
        '-medium',
        '-high',
        '-higher',
        '-highest',
      ];
      const expansions = [
        // '-dense',
        // '-denser',
        // '-densest',
        '-spare',
        '-sparer',
        '-sparest',
      ];

      const range = ranges[Math.floor(Math.random() * ranges?.length)];
      const color = colors[Math.floor(Math.random() * colors?.length)];
      const expansion =
        expansions[Math.floor(Math.random() * expansions?.length)];

      const newGlow = `shadow-${color}${
        color === 'accent' ? '' : range
      }${expansion}`;

      if (newGlow === state.glow) {
        return generateGlow();
      }
      return newGlow;
    };

    // const current = glowingStates.indexOf(state.glow);

    setTimeout(() => {
      state.glow = generateGlow();
      // state.glow = glowingStates[current + 1]
      //   ? glowingStates[current + 1]
      //   : glowingStates[1];
    }, 500);
  }
);

watch(
  () => props.video,
  () => {
    initPlayer();
  }
);

onMounted(() => {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (!firstScriptTag) {
    return;
  }

  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => {
    console.log({ ready: true });
    state.ready = true;

    initPlayer();
  };
});
</script>
