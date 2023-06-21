<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import { useNow, useStorage } from "@vueuse/core";
import { computed, onMounted, ref, watch } from "vue";
import { emojisplosion, emojisplosions } from "emojisplosion";
import Knob from "primevue/knob";
import { supabase } from '../../supabase';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import { useDateFormat } from "@vueuse/core";
import useUser from "../../composables/use-user";
import Accordion from "primevue/accordion";
import AccordionTab from 'primevue/accordiontab';


const confirm = useConfirm();

const { user, getUserActivity } = useUser();

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

					toast.add({
						severity: "info",
						summary: "Reset successful",
						detail: "All your activity for today has been deleted.",
						life: 5000,
						group: 'tr'
					});
				}
				activity.value = [];
				activity.value = await getUserActivity();

			},
			reject: () => {
				toast.add({ severity: 'info', summary: 'Operation canceled', detail: 'Nothing has been reset', life: 3000, group: 'tr' });
			}
		});
	} else {
		activity.value = [];
	};
};

const toast = useToast();


const activity = ref([] as any[]);
const todayActivity = computed(() => {
	if (activity.value.length === 0) return [];
	return activity.value?.filter((a: any) => useDateFormat(a.log_time, 'MM-DD-YYYY').value === useDateFormat(useNow(), 'MM-DD-YYYY').value);
});


const emojis = ["💦", "💧", "🌊", "💦", "💧", "🌊", "🐬"];

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

watch(user, async () => {

})

watch(progress, () => {
	if (progress.value === 100) {
		toast.add({
			severity: "success",
			summary: "Goal reached!",
			detail: "You have reached your goal for the day!",
			life: 10000,
			group: 'tr'
		});
		const { cancel } = emojisplosions({
			emojis,
			emojiCount: 100,
		});
		setTimeout(cancel, 6000);
	}
});

const addToTotal = async (e: MouseEvent) => {
	if (user.value) {
		const { data, error } = await supabase.rpc('insert_daily_activity', {
			p_amount_logged: bottleSize.value
		});

		if (error) {
			toast.add({
				severity: "error",
				summary: "Error code: " + error.code,
				detail: error.message + ((error.hint) ? '<br>' + error.hint : ''),
				life: 0,
				group: 'tr'
			});
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

const dataTableData = computed(() => {
	return activity.value?.slice().reverse();
});

onMounted(async () => {
	if (!user.value) {
		const { data, error } = await supabase.auth.getSession();
		if (error) {
			toast.add({
				severity: "error",
				summary: "Error refreshing session",
				detail: "Try logging in again.",
				life: 0,
				group: 'tr'
			});
		}
		activity.value = await getUserActivity();
	}
});
</script>

<template>
	<div class=" flex flex-column sm:flex-row justify-content-center gap-6">
		<div class="flex flex-column gap-4">
			<div class="flex align-items-center gap-2">
				<div class="flex flex-column">
					<label class="font-bold" for="goal">Goal (in oz)</label>
					<InputNumber id="goal" v-model.number="state.goal" /><small>How much water are you trying to get in?</small>
				</div>
			</div>
			<div class="flex flex-column justify-content-center gap-2">
				<label class="font-bold" for="bottleSize">Bottle Size</label>
				<SelectButton v-model="state.bottleSize" :options="options" optionLabel="label" optionValue="value"
					aria-labelledby="basic" />
				<InputNumber v-if="state.bottleSize === 0" id="bottleSize" aria-label="Custom bottle size"
					v-model.number="state.otherValue" />
			</div>

			<Button ref="logButton" @click="addToTotal" :label="`Log ${bottleSize}oz`" />
		</div>

		<div class="flex flex-grow-1 flex-column gap-2">
			<div class="flex align-items-center justify-content-center gap-2">
				<div class="font-bold inline-block text-4xl">
					{{ total }} / {{ state.goal }}oz
				</div>
			</div>
			<div class="flex justify-content-center">
				<Knob ref="knob" valueTemplate="{value}%" :size="200" :readonly="true" v-model="progress"></Knob>
			</div>
			<Button class="p-button-link" label="Reset" @click="handleResetClick" />
		</div>

	</div>

	<div class="container my-4">
		<Accordion v-if="user" :collapsed="true" :toggleable="true">
			<AccordionTab header="List of all times you've logged water">
				<table class="p-datatable-table">
					<tr>
						<th>Time</th>
						<th>Amount Logged</th>
					</tr>
					<tr v-for="a in dataTableData" :key="a.id">
						<td>{{ new Date(a.log_time).toLocaleString() }}</td>
						<td>{{ a.amount_logged }}oz</td>
					</tr>
				</table>

			</AccordionTab>
		</Accordion>
	</div>
</template>


<style>
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
</style>
