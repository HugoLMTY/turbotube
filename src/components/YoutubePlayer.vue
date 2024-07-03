<template>
  <iframe
    id="youtube-player"
    :class="`rounded smooth-slowest ${state.glow}`"
    type="text/html"
    :src="currentUrl"
    style="
      width: 100%;
      max-width: 100vw;
      max-height: calc(100vh - 110px);
      aspect-ratio: 16 / 9;
    "
    frameborder="0"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { watch } from 'vue';
import { computed, onMounted } from 'vue';
import { reactive } from 'vue';
import { IVideo } from 'src/interfaces/turbo.interfaces';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    YT: any;
  }
}

const emits = defineEmits(['video:playing', 'video:paused', 'video:ended']);
const props = defineProps({
  video: {
    type: Object as PropType<IVideo>,
    default: null,
  },
  zen: {
    type: Boolean,
    default: false,
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
        // onReady: setupAudioAnalysis,
        onStateChange: onPlayerStateChange,
      },
    });
  } catch (err) {
    console.log({ err });
  }
};

// const setupAudioAnalysis = () => {
//   console.log({ setupAudio: true });
//   const audioCtx = new window.AudioContext();
//   const source = audioCtx.createMediaElementSource(
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     (state.player as any).getIframe()
//     // .contentWindow.document.queySelector('video')
//   );
//   const analyser = audioCtx.createAnalyser();

//   console.log({ analyser, source, audioCtx });

//   source.connect(analyser);
//   analyser.connect(audioCtx.destination);

//   console.log({ analyser });
// };

const currentUrl = computed(() => {
  if (!props.video?.videoId) {
    return;
  }

  const baseUrl = 'https://www.youtube.com/embed/';
  const params = {
    autoplay: 1,
    enablejsapi: 1,
    playsinline: 1,
    fs: 1,
    // end: 3,
  };

  const mapped = `${baseUrl}${props.video.videoId}?${Object.entries(params)
    ?.map((p) => `${p[0]}=${p[1]}`)
    ?.join('&')}`;
  // console.log({ mapped });

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
