<script setup lang="ts">
import { Device } from '@capacitor/device';
import SelectButton, { SelectButtonChangeEvent } from "primevue/selectbutton";
import { useNow, useStorage } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import { emojisplosion, emojisplosions } from "emojisplosion";
import Knob from "primevue/knob";
import { supabase } from '../../supabase';
import { useConfirm } from "primevue/useconfirm";
import { useDateFormat } from "@vueuse/core";
import useUser, { user, activity } from "../../composables/use-user";

const deviceInfo = ref<{ info: any, battery: any }>({ info: '', battery: '' });
const confirm = useConfirm();

const { getUserActivity } = useUser();

const handleResetClick = async () => {


	if (user.value) {
		confirm.require({
			message: 'Resetting will delete all your activity for today. Are you sure you want to continue?',
			header: 'Confirm reset',
			acceptIcon: 'pi pi-check',
			accept: async () => {
				const { error } = await supabase.rpc('delete_daily_activity_by_date', {
					"p_delete_date": useDateFormat(useNow(), 'YYYY-MM-DD').value,
				})
				if (!error) {

				}
				activity.value = [];
				activity.value = await getUserActivity();

			},
			reject: () => {
				alert("REJECTED")
			}
		});
	} else {
		activity.value = [];
	};
};

const today = useDateFormat(new Date(), 'MM-DD-YYYY').value;

const todayActivity = computed(() => {
	return activity.value?.filter((a: any) => useDateFormat(a.log_time, 'MM-DD-YYYY').value === today) ?? [];//
});


const emojis = ["💦", "💧", "🌊", "💧", "🌊", "🐬"];

const defaults = {
	bottleSize: 8,
	otherValue: 0,
	goal: 128,
	total: 0,
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

const total = computed(() => {
	return todayActivity.value?.reduce((acc: number, cur: any) => acc + cur?.amount_logged, 0) ?? 0;
});

const progress = computed(() => {
	const p = (total.value / state.value.goal) * 100;
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
		setTimeout(cancel, 6000);
	}
});

const addToTotal = async (e: MouseEvent) => {
	if (!activity.value) {
		activity.value = [];
	}
	if (user.value) {
		const { data, error } = await supabase.rpc('insert_daily_activity', {
			p_amount_logged: bottleSize.value
		});

		if (error) {

		} else {
			activity.value.push(data);
		}
	} else {
		activity.value.push({ log_time: new Date().toISOString(), amount_logged: bottleSize.value });
	}

	emojisplosion({
		emojis,
		position: () => ({
			x: e.clientX,
			y: e.clientY,
		}),
	});
}

onMounted(async () => {
	if (!user.value) {
		const { data, error } = await supabase.auth.getSession();
		if (error) {

		}
	}
	activity.value = await getUserActivity();
});

const dataTableData = computed(() => {
	return activity.value?.slice().reverse();
});

const groupByDate = (acc: any, cur: any) => {
	const date = useDateFormat(cur.log_time, 'MM-DD-YYYY').value;
	if (!acc[date]) {
		acc[date] = [];
	}
	acc[date].push(cur);
	return acc;
};

const dateReduce = computed(() => {
	return activity.value?.reduce(groupByDate, {}) ?? {};
});

const notFutureDate = (date: Date) => {
	return date <= new Date();
};

const darkenHexColor = (hexColor = '#5cb6ff', n = 0) => {
	// Validate input hex color
	if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hexColor)) {
		throw new Error('Invalid hex color format');
	}

	// Remove the '#' character from the beginning of hexColor
	hexColor = hexColor.replace('#', '');

	// Convert hex to RGB
	let r, g, b;
	if (hexColor.length === 3) {
		r = parseInt(hexColor[0] + hexColor[0], 16);
		g = parseInt(hexColor[1] + hexColor[1], 16);
		b = parseInt(hexColor[2] + hexColor[2], 16);
	} else {
		r = parseInt(hexColor.substring(0, 2), 16);
		g = parseInt(hexColor.substring(2, 4), 16);
		b = parseInt(hexColor.substring(4, 6), 16);
	}

	// Darken the color by reducing brightness
	r = Math.max(0, r - n);
	g = Math.max(0, g - n);
	b = Math.max(0, b - n);

	// Convert RGB back to hex
	const darkenedHexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

	return darkenedHexColor;
}

const handleBottleChange = (e: SelectButtonChangeEvent) => {
	if (e.value !== null) {
		state.value.bottleSize = e.value;
	}
}

const logDeviceInfo = async () => {
	deviceInfo.value.info = await Device.getInfo();
};

const logBatteryInfo = async () => {
	deviceInfo.value.battery = await Device.getBatteryInfo();
};

logDeviceInfo();
logBatteryInfo();

const test = ref('test');
</script>

<template>
	<div class="flex flex-col sm:flex-row justify-between items-start gap-6  my-8">
		<div class="flex flex-col gap-4 mx-auto sm:mx-0">
			<div class="flex items-center gap-2">
				<div class="flex flex-col">
					<label class="font-bold" for="goal">Goal (in oz)</label>
					<input pattern="\d*" class="p-inputtext" type="number" id="goal" v-model.number="state.goal" /><small>How much
						water are you
						trying to get
						in?</small>
				</div>
			</div>

			<div class="flex flex-col justify-center gap-2">
				<label class="font-bold" for="bottleSize">Bottle Size</label>
				<SelectButton v-model.number="state.bottleSize" :options="options" optionLabel="label" optionValue="value"
					aria-labelledby="basic" />
				<InputNumber v-if="state.bottleSize === 0" id="bottleSize" aria-label="Custom bottle size"
					v-model.number="state.otherValue" />
			</div>

			<Button ref="logButton" @click="addToTotal" :label="`Log ${bottleSize}oz`" />
		</div>

		<div class="flex flex-grow-1 flex-col gap-2 mx-auto sm:mx-0 mt-8 sm:mt-0">
			<div class="flex items-center justify-center gap-2">
				<div class="font-bold inline-block text-4xl">
					{{ total }} / {{ state.goal }}oz
				</div>
			</div>
			<div class="flex justify-center">
				<Knob ref="knob" :size="200" :readonly="true" v-model="progress"></Knob>
			</div>
			<Button class="p-button-link" label="Reset" @click="handleResetClick" />
		</div>

	</div>

	<div class="container my-4 mx-auto">
		<div class="teh-grid mx-auto">
			<template v-for="i in 365" :key="i">
				<div class="w-2 h-2" v-tooltip="`${useDateFormat(new Date(new Date().getFullYear(),
						0).setDate(i), 'MM-DD-YYYY').value}: ${dateReduce[useDateFormat(new Date(new Date().getFullYear(),
							0).setDate(i), 'MM-DD-YYYY').value]?.reduce((acc: number, cur: any) => acc +
								cur?.amount_logged, 0) ?? 0}oz`" :style="{

						backgroundColor: darkenHexColor('#cee9ff', dateReduce[useDateFormat(new Date(new Date().getFullYear(),
							0).setDate(i), 'MM-DD-YYYY').value]?.reduce((acc: number, cur: any) => acc +
								cur?.amount_logged, 0) ?? 0)
					}" v-if="notFutureDate(new Date(new Date().getFullYear(), 0, i))">


				</div>
				<div class="bg-slate-100 dark:bg-slate-700 w-2 h-2" v-tooltip="`${useDateFormat(new Date(new Date().getFullYear(),
						0).setDate(i), 'MM-DD-YYYY').value}`" v-else>

				</div>
			</template>
		</div>
		<!-- 
		<div>
			<h2>%MODE% debug info:</h2>
			<pre>
		{{ deviceInfo }}
	</pre>
		</div> -->
	</div>
</template>


<style>
.teh-grid {
	/* css grid for each day of the year */
	display: grid;
	grid-template-rows: repeat(52, 1fr);
	grid-template-columns: repeat(7, 1fr);
	width: calc((0.5rem * 7) + (0.25rem * 6));
	gap: 0.25rem;
	transform: rotate(180deg);
	grid-auto-flow: row;
}

@media screen and (min-width: 640px) {
	.teh-grid {
		transform: rotate(0);
		width: 100%;
		grid-template-rows: repeat(7, 1fr);
		grid-template-columns: repeat(52, 1fr);
		grid-auto-flow: column;
	}
}

.p-datatable-table th {
	text-align: left !important;
}

.container {
	max-width: 800px;
	margin: 0 auto;
}

.p-panel-header.closed {
	border-radius: 6px;
}

.p-toast-top-right {
	top: 0 !important;
	right: 0 !important;
	max-width: 100%;
}

@media screen and (min-width: 640px) {
	.p-toast-top-right {
		top: 1rem !important;
		right: 1rem !important;
	}
}

.p-inputtext {
	font-family: var(--font-family);
	font-feature-settings: var(--font-feature-settings, normal);
	font-size: 1rem;
	color: #334155;
	background: #ffffff;
	padding: 0.5rem 0.75rem;
	border: 1px solid #cbd5e1;
	transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, outline-color 0.2s;
	appearance: none;
	border-radius: 6px;
	outline-color: transparent;
}

.p-inputtext:enabled:hover {
	border-color: #94a3b8;
}

.p-inputtext:enabled:focus {
	outline: 1px solid var(--p-focus-ring-color);
	outline-offset: -1px;
	box-shadow: none;
	border-color: #94a3b8;
}

.p-inputtext.p-invalid.p-component {
	border-color: #f87171;
}

.p-inputtext.p-variant-filled {
	background-color: #f8fafc;
}

.p-inputtext.p-variant-filled:enabled:hover {
	background-color: #f8fafc;
}

.p-inputtext.p-variant-filled:enabled:focus {
	background-color: #ffffff;
}
</style>
