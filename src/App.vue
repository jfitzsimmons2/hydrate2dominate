<script setup lang="ts">
import ProgressBar from "primevue/progressbar";
import SelectButton from "primevue/selectbutton";
import { useStorage } from "@vueuse/core";
import { computed, ref } from "vue";

const defaults = {
  bottleSize: 0,
  otherValue: 0,
  goal: 0,
  setup: true,
  total: 0,
};

const state = useStorage("state", defaults);

// const bottleSize = ref<number>(0);
// const otherValue = ref<number>(0);
// const goal = ref<number>(0);
// const setup = ref<boolean>(true);
const options = [
  { label: "8oz", value: 8 },
  { label: "16oz", value: 16 },
  { label: "32oz", value: 32 },
  { label: "64oz", value: 64 },
  { label: "Other", value: 0 },
];

const bottleSizeReal = computed(() => {
  if (state.value.bottleSize === 0) {
    return state.value.otherValue;
  } else {
    return state.value.bottleSize;
  }
});

const progress = computed(() => {
  const p = (state.value.total / state.value.goal) * 100;
  if (p < 100) {
    return p;
  } else {
    return 100;
  }
});
</script>

<template>
  <h1>Hydrate2Dominate</h1>
  <div v-if="state.setup">
    <div class="flex flex-column gap-2">
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
          v-model.number="state.otherValue"
        />
        <small>You can change this later</small>
      </div>
    </div>
    <div class="my-4">
      <Button @click="state.setup = false">Ok</Button>
    </div>
  </div>
  <div v-else class="flex flex-column gap-2">
    <div class="flex">
      <Button
        @click="state.total += bottleSizeReal"
        :label="`Log ${bottleSizeReal}oz`"
      />
      <Button
        class="p-button-link"
        @click="state.setup = true"
        label="Change settings"
      />
    </div>
    <div class="flex align-items-center gap-2">
      <label class="font-bold" for="total">Total</label>
      <div class="font-bold inline-block text-5xl">{{ state.total }}oz</div>
    </div>
    <ProgressBar :value="progress"></ProgressBar>
  </div>
</template>

<style lang="scss"></style>
