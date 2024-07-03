<template>
  <q-page v-if="state.loaded">
    <!-- ? PLAYGROUND -->
    <div class="q-mb-md">
      <h4 class="q-mb-sm">Playground</h4>

      <!-- ? TEST SUBJECT -->
      <div class="row justify-center items-center">
        <div
          style="height: 150px; width: 150px"
          class="row justify-center items-center clickable not-selectable"
          :class="mappedClasses"
          @click="copyClasses"
        >
          :)
        </div>
      </div>

      <!-- ? CUSTOM CLASSES -->
      <div>
        <!-- ? QOL -->
        <q-card class="q-ma-sm q-pa-sm bg-neutral-low" flat>
          <q-select
            v-for="(qolClass, pi) in state.qolClasses"
            :key="'qol_' + pi"
            v-model="qolClass.variation"
            emit-value
            :options="findQolVariations(qolClass)"
            :label="
              stateless.qols.find((qol) => qol.name === qolClass.name)?.label
            "
            clearable
          >
            <template v-slot:prepend>
              <q-toggle v-model="qolClass.active" />
            </template>

            <template v-slot:append>
              <q-toggle
                v-if="qolClass.hover !== undefined"
                v-model="qolClass.hover"
              />
            </template>
          </q-select>
        </q-card>

        <!-- ? CUSTOM -->
        <q-card
          v-for="(customClass, ci) in state.classes"
          :key="'class_' + ci"
          class="q-ma-sm q-pa-sm bg-neutral-low"
          flat
        >
          <div class="row">
            <q-select
              v-model="customClass.name"
              :options="stateless.bases?.map((b) => b.name)"
              label="Type"
              class="col-6 q-pa-sm"
            />

            <q-select
              v-model="customClass.color"
              :options="state.colors"
              label="Couleur"
              class="col-6 q-pa-sm"
            />
          </div>

          <q-toggle v-model="customClass.hover" label="on Hover" />

          <q-select
            v-for="(variation, vi) in findVariations(customClass)"
            :key="`class_${ci}_variation_${variation?.group}_${vi}`"
            v-model="customClass.variation"
            :options="variation?.mapped?.map((m) => m.value)"
            :label="variation?.group"
            class="q-pa-sm"
            clearable
          />
        </q-card>

        <q-card
          class="clickable row items-center justify-center q-ma-sm q-pa-sm bg-neutral-low border-neutral-low-dashed-thick shadow-primary-dense-hover smooth-slower"
          flat
          @click="addClass"
        >
          <q-icon name="mdi-plus" />
        </q-card>
      </div>

      <!-- ? DETAILS CARD -->
      <div class="rw q-mt-xl">
        <q-card
          v-for="preset in state.presets"
          :key="'preset_' + preset.group"
          flat
          class="q-ma-sm q-pa-md rounded bg-neutral-low col-shrink"
        >
          <div class="row items-center justify-between">
            <b>
              {{
                (
                  stateless.bases.find((b) =>
                    b.variations?.includes(preset.group)
                  ) ||
                  stateless.qols.find((b) =>
                    b.variations?.includes(preset.group)
                  )
                )?.label
              }}
            </b>
          </div>
          <ul>
            <li
              v-for="option in preset.mapped"
              :key="`preset_${preset.group}_option_${option.name}_${option.value}`"
            >
              {{ `${option.name} (${option.value?.trim()})` }}
            </li>
          </ul>
        </q-card>
      </div>
    </div>

    <!-- ? COULEURS -->
    <div class="q-mb-md">
      <h4 class="q-mb-sm">Couleurs</h4>
      <div v-for="color in state.colors" :key="'color_' + color">
        {{ color }}
      </div>
    </div>

    <!-- ? BASES -->
    <div class="q-mb-md">
      <h4 class="q-mb-sm">Bases</h4>
      <div v-for="base in stateless.bases" :key="'base_' + base.name">
        <h5 class="q-mb-sm">
          {{ base.name }}
        </h5>
        <span v-if="base.variations?.length">
          Variations: {{ base.variations?.join(', ') }}
        </span>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import axios from 'axios';
import { computed } from 'vue';

// interface IBase {
//   name: string;
//   label: string;
//   variations: string[];

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   value?: any;
//   hoverable?: boolean;
// }

interface IClass {
  name: string;
  color: string;
  variation: string;
  hover: boolean;
  active: boolean;
}

interface IPreset {
  group: string;
  type: string;
  color: string;
  hover: boolean;
  mapped: { name: string; value: string; type: string }[];
}

// const emits = defineEmits([]);
// const props = defineProps({});
const stateless = {
  path: 'src/css/skss',
  // <!-- ? god they are beautiful don't even touch them -->
  regexes: {
    // <!-- * Separate arguments into 3 groups -> 1.color name 2.light color 3.dark color -->
    findArgs:
      /setGlobalColors ?\((?: ?(?:[\r\n] +)?)?(\$\w+(?:(?:-\w+)?))(?:, ?(?:[\r\n] +)?)(\$\w+(?:(?:-\w+)?))(?:, ?(?:[\r\n] +)?)'(\w+-?\w+)'/gm,
    // <!-- * Separate variations arrays and it's content into 2 groups -> 1.group 2.content -->
    findVariationsGroups: /\$(\w+(?:-\w+)): (\((?:(?:[\r\n] +)?.+)+)/gm,
    // <!-- * Separate presets variations arrays into 2 groups -> 1.name 2.value -->
    findVariationsValues: /(?:[\r\n\( ])(?:(\w+):?( .+)?)[,)]/gm,
  },
  bases: [
    {
      name: 'text',
      label: 'Text color',
      variations: [],
    },
    {
      name: 'bg',
      label: 'Background',
      variations: ['background-opacity'],
    },
    {
      name: 'border',
      label: 'Border',
      variations: ['border-widths', 'border-styles'],
    },
    {
      name: 'inner-border',
      label: 'Inner border',
      variations: ['border-widths'],
    },
    {
      name: 'shadow',
      label: 'Shadow',
      variations: ['shadow-widths'],
    },
  ],
  qols: [
    {
      name: 'rounded',
      label: 'Roundation',
      value: null,
      variations: ['round-accentuations'],
    },
    {
      name: 'smooth',
      label: 'Smoothitude',
      value: null,
      hoverable: false,
      variations: ['animation-durations'],
    },
  ],
};
const state = reactive({
  loaded: false,

  colors: [],
  presets: [] as IPreset[],

  forms: [],

  qolClasses: [] as IClass[],
  classes: [] as IClass[],
});

const fetchColors = async () => {
  const colorsPath = `${stateless.path}/_global.scss`;
  const presetsPath = `${stateless.path}/_presets.scss`;

  const { data: colors } = await axios.post('http://localhost:3069/read', {
    path: colorsPath,
  });
  const { data: presets } = await axios.post('http://localhost:3069/read', {
    path: presetsPath,
  });
  // console.log({ colors, presets });

  state.colors = colors
    ?.match(stateless.regexes.findArgs)
    ?.map((match: string) => {
      return [...match.matchAll(stateless.regexes.findArgs)];
    })
    ?.map((matches: string[]) => {
      return matches[0][3];
    });

  state.presets = presets
    ?.match(stateless.regexes.findVariationsGroups)
    ?.map((match: string) => {
      return [...match.matchAll(stateless.regexes.findVariationsGroups)];
    })
    ?.map((matches: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, group, content] = matches[0];

      const mapped = content
        ?.match(stateless.regexes.findVariationsValues)
        ?.map((match: string) => {
          return [...match.matchAll(stateless.regexes.findVariationsValues)];
        })
        // <!-- ? dunno why string[] isn't accepted but whatever i got d'autres chats à fouetter -->
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ?.map((matches: any) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, name, value] = matches[0];

          return value
            ? { value: name, name: value, type: 'select' }
            : { value: name, type: 'slider' };
        });

      return { group, mapped, type: mapped?.[0].type };
    });

  console.log({ colors: state.colors, presets: state.presets });

  state.loaded = true;
};

const initQolClasses = () => {
  state.qolClasses = [
    {
      name: 'rounded',
      active: false,
      hover: false,
    },
    {
      name: 'smooth',
      active: false,
    },
  ] as IClass[];
};

const addClass = (
  { name, color, hover } = { name: 'bg', color: 'primary-low', hover: false }
) => {
  state.classes.push({
    name,
    color,
    hover,
  } as IClass);
};

const findVariations = (customClass: IClass) => {
  const base = stateless.bases.find((b) => b.name === customClass.name);
  if (!base) {
    return null;
  }

  const { variations } = base;
  if (!variations?.length) {
    return null;
  }

  const presets = variations?.map((v) => {
    const matching = state.presets?.find((p) => p.group === v);
    if (!matching) {
      return null;
    }

    return matching;
  });

  console.log({ presets });
  return presets;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const findQolVariations = (preset: any) => {
  const base = stateless.qols.find((b) => b.name === preset.name);
  if (!base) {
    return [];
  }

  const { variations } = base;
  if (!variations?.length) {
    return [];
  }

  const presets = variations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((v: any) => {
      const matching = state.presets?.find((p) => p.group === v);
      // console.log({ matching, presets: state.presets, v });
      if (!matching) {
        return null;
      }

      return matching;
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((p: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return p.mapped.map((m: any) => {
        return {
          label: `${m.value} (${m.name?.trim()})`,
          value: m.value,
        };
      });
    })
    ?.flat();

  // console.log({ qolv: preset });

  return presets;
};

const copyClasses = () => {
  const classes = mappedClasses.value;

  console.log({ classes });
  navigator.clipboard.writeText(classes);
};

const mappedClasses = computed(() => {
  const mapped = [
    ...state.classes,
    ...state.qolClasses?.filter((c) => c.active),
  ]
    ?.map(({ name, color, variation, hover }: IClass) => {
      // console.log({ name, color, variation, hover });
      let mapped = `${name}`;

      if (color) {
        mapped += `-${color}`;
      }

      if (variation) {
        mapped += `-${variation}`;
      }

      if (hover) {
        mapped += '-hover';
      }

      return mapped;
    })
    ?.join(' ');

  console.log({ mapped });
  return mapped;

  // const qol = state.qolClasses
  //   ?.filter(c => c.active)
  //   ?.map(({ name, color, variation, hover }: IClass) => {
  //     let mapped = `${name}-${color}`;

  //     if (variation) {
  //       mapped += `-${variation}`;
  //     }

  //     if (hover) {
  //       mapped += '-hover';
  //     }

  //     return mapped;
  //   })
  //   ?.join(' ');

  // return `${classes} ${qol}`
});

onMounted(() => {
  fetchColors();

  initQolClasses();
  addClass();
});
</script>
