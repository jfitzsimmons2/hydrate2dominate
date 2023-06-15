<script setup lang="ts">
import Header from "./components/Header.vue";
import SelectButton from "primevue/selectbutton";
import Dialog from "primevue/dialog";
import { useNow, useStorage } from "@vueuse/core";
import { computed, defineAsyncComponent, reactive, ref, watch, watchEffect } from "vue";
//import { emojisplosion, emojisplosions } from "emojisplosion";
import Knob from "primevue/knob";
import { supabase } from './supabase';
import Toast from "primevue/toast";
import { useToast } from 'primevue/usetoast';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Panel from "primevue/panel";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useDateFormat } from "@vueuse/core";
import useUser from "./composables/use-user";
import DynamicDialog from 'primevue/dynamicdialog';

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
					"p_delete_date": new Date().toISOString().split('T')[0],
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
	return activity.value?.filter((a: any) => useDateFormat(a.log_time, 'MMMM-DD-YYYY').value === useDateFormat(useNow(), 'MMMM-DD-YYYY').value);
});

const items = ref([
	{ separator: true },
	{ label: 'New', icon: 'pi pi-fw pi-plus' },
	{ label: 'Delete', icon: 'pi pi-fw pi-trash' },
	{ separator: true }
]);



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

	activity.value = await getUserActivity();
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
		// const { cancel } = emojisplosions({
		// 	emojis,
		// 	emojiCount: 100,
		// });
		// setTimeout(cancel, 6000);
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

	// emojisplosion({
	// 	emojis,
	// 	position: () => ({
	// 		x: e.clientX,
	// 		y: e.clientY,
	// 	}),
	// });



}

const loginButtonLoading = ref(false);
const dataTableData = computed(() => {
	return activity.value?.slice().reverse();
})
</script>

<template>
	<ConfirmDialog style="max-width: 500px;" />
	<Toast position="top-right" group="tr" />
	<Header />
	<div class="container flex flex-column sm:flex-row justify-content-center gap-6">
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
		<Panel v-if="user" :pt="{
			header: ({ state }) => ({
				class: state.d_collapsed ? 'closed' : 'open'
			})
		}" header="List of all times you've logged water" :collapsed="true" :toggleable="true">

			<DataTable :sort-order="1" :value="dataTableData" :paginator="true" :rows="10"
				:rowsPerPageOptions="[10, 25, 50, 100]">
				<Column field="log_time" header="Time">
					<template #body="slotProps">
						{{ new Date(slotProps.data.log_time).toLocaleString() }}
					</template>
				</Column>
				<Column field="amount_logged" header="Amount Logged"></Column>
			</DataTable>
		</Panel>
	</div>

	<DynamicDialog />
</template>


<style>
.container {
	max-width: 800px;
	margin: 0 auto;
}

.p-panel-header.closed {
	border-radius: 6px;
}
</style>
