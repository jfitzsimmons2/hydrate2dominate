<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import Dialog from "primevue/dialog";
import { useStorage } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { emojisplosion, emojisplosions } from "emojisplosion";
import Knob from "primevue/knob";
import { supabase } from './supabase';
import Toast from "primevue/toast";
import { useToast } from 'primevue/usetoast';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Panel from "primevue/panel";
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();
const toast = useToast();
const email = ref('');
const user = ref();
const activity = ref([] as any[]);
const todayActivity = computed(() => {
	if (activity.value.length === 0) return [];
	return activity.value?.filter((a: any) => a.log_time.split('T')[0] === new Date().toISOString().split('T')[0]);
});

const login = async () => {
	loginButtonLoading.value = true;
	const { data, error } = await supabase.auth.signInWithOtp({
		email: email.value,
	});
	if (!error) {
		loginDialogVisible.value = false;
		toast.add({
			severity: "success",
			summary: "Login email sent",
			detail: "Check your email for the login link",
			life: 0,
			group: 'tr'
		});
	}
	if (error) {
		toast.add({
			severity: "error",
			summary: "Error logging in",
			detail: error.message,
			life: 0,
			group: 'tr'
		});
	}
	loginButtonLoading.value = false;

};

supabase.auth.onAuthStateChange((event, session) => {
	if (event === 'SIGNED_IN') {
		user.value = session?.user;
		getUserActivity();
	} else if (event === 'SIGNED_OUT') {
		user.value = undefined;
	}
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

const loginDialogVisible = ref(false);

const handleResetClick = async () => {
	if (user.value) {
		confirm.require({
			message: 'Resetting will delete all your activity for today. Are you sure you want to continue?',
			header: 'Confirm reset',
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
				getUserActivity();

			},
			reject: () => {
				toast.add({ severity: 'info', summary: 'Operation canceled', detail: 'Nothing has been reset', life: 3000, group: 'tr' });
			}
		});
	} else {
		activity.value = [];
	};
};

const handleLoginClick = () => {
	loginDialogVisible.value = true;
};

const handleLogoutClick = async () => {
	const { error } = await supabase.auth.signOut();
	if (!error) {
		toast.add({
			severity: "success",
			summary: "Logged out",
			detail: "You have been logged out. Your logging will not be saved to your account.",
			life: 5000,
			group: 'tr'
		});
	}
};

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

if (!user) {
	console.log("no user")
}

const loginButtonLoading = ref(false);

const getUserActivity = async () => {
	const { data, error } = await supabase.rpc('get_user_activity');

	if (!error) {
		activity.value = data;
	}

	if (error) {
		toast.add({
			severity: "error",
			summary: "Error getting activity",
			detail: error.message,
			life: 0,
			group: 'tr'
		});
	}

}

const dataTableData = computed(() => {
	return activity.value?.slice().reverse();
})


</script>

<template>
	<ConfirmDialog />
	<Toast position="top-right" group="tr" />
	<header class="container sm:flex align-items-center gap-2 justify-content-between mb-4">
		<h1 class="text-2xl flex align-items-center gap-2 m-0"><img src="favicon.ico" style="width: 2rem; height: 2rem;" />
			Hydrate2Dominate</h1>
		<div v-if="!user">
			<Button @click="handleLoginClick" :loading="loginButtonLoading">login</Button>
		</div>
		<div v-else class="flex align-items-center gap-1">
			<p class="m-0"><strong>logged in as</strong><br /> {{ user.email }}</p>
			<Button @click="handleLogoutClick">logout</Button>
		</div>
	</header>

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

		<div class="flex flex-column gap-2">
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
		<Panel v-if="user" header="List of all times you've logged water" :collapsed="true" :toggleable="true">

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

	<Dialog :modal="true" v-model:visible="loginDialogVisible" header="Login">

		<p>Enter your email address to login or signup, you will be sent a magic link to login.</p>
		<p>After you have an account, you can keep track of how much water you've consumed over time.</p>

		<form @submit.prevent="login">
			<div class="flex gap-1">
				<InputText class="w-full" v-model="email" placeholder="Email address" />
				<Button type="submit">Login</Button>
			</div>
		</form>

	</Dialog>
</template>

<style>
.container {
	max-width: 800px;
	margin: 0 auto;
}

span:empty {
	display: none;
}
</style>
