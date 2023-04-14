<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import { useStorage } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { emojisplosion, emojisplosions } from "emojisplosion";
import Knob from "primevue/knob";

const emojis = ["💦", "💧", "🌊", "💦", "💧", "🌊", "🐬"];

const defaults = {
	bottleSize: 8,
	otherValue: 0,
	goal: 0,
	total: 64,
};

const state = useStorage("state", defaults);

const knob = ref();
const logButton = ref();

const options = [
  { label: "8oz", value: 8 },
  { label: "16oz", value: 16 },
  { label: "32oz", value: 32 },
  { label: "64oz", value: 64 },
  { label: "Other", value: 0 },
];

const bottleSize = computed(() => {
  if (state.value.bottleSize === 0) {
    return state.value.otherValue;
  } else {
    return state.value.bottleSize;
  }
});

const progress = computed(() => {
  const p = (state.value.total / state.value.goal) * 100;
  if (p < 100) {
    return parseInt(p.toFixed(2));
  } else {
    return 100;
  }
});

watch(progress, () => {
  if (progress.value === 100) {
    const { cancel } = emojisplosions({
      emojis,
      emojiCount: 100,
    });
    // history.value.set(new Date().toISOString().split('T')[0], { total: state.value.total, goal: state.value.goal });
    setTimeout(cancel, 6000);
  }
});

const addToTotal = (e: MouseEvent) => {
  emojisplosion({
    emojis,
    position: () => ({
      x: e.clientX,
      y: e.clientY,
    }),
  });
  state.value.total += bottleSize.value;
};
</script>

<template>
  <h1 class="text-center mb-6">Hydrate2Dominate</h1>
  <div class="flex flex-column sm:flex-row justify-content-center gap-6">
    <div class="flex flex-column gap-4">
      <div class="flex align-items-center gap-2">
        <div class="flex flex-column">
          <label class="font-bold" for="goal">Goal (in oz)</label>
          <InputNumber id="goal" v-model.number="state.goal" /><small
            >How much water are you trying to get in?</small
          >
        </div>
      </div>
      <div class="flex flex-column justify-content-center gap-2">
        <label class="font-bold" for="bottleSize">Bottle Size</label>
        <SelectButton
          v-model="state.bottleSize"
          :options="options"
          optionLabel="label"
          optionValue="value"
          aria-labelledby="basic"
        />
        <InputNumber
          v-if="state.bottleSize === 0"
          id="bottleSize"
          aria-label="Custom bottle size"
          v-model.number="state.otherValue"
        />
      </div>

      <Button
        ref="logButton"
        @click="addToTotal"
        :label="`Log ${bottleSize}oz`"
      />
    </div>

    <div class="flex flex-column gap-2">
      <div class="flex align-items-center justify-content-center gap-2">
        <div class="font-bold inline-block text-4xl">
          {{ state.total }} / {{ state.goal }}oz
        </div>
      </div>
      <div class="flex justify-content-center">
        <Knob
          ref="knob"
          valueTemplate="{value}%"
          :size="200"
          :readonly="true"
          v-model="progress"
        ></Knob>
      </div>
      <Button class="p-button-link" label="Reset" @click="state.total = 0" />
    </div>
  </div>
</template>

<style></style>
