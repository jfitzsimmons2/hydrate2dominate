<template>
	<header class="container flex flex-wrap align-items-center gap-2 justify-content-between mb-4">
		<div class="flex align-items-center gap-2">
			<img src="/favicon.ico" style="width: 2.5rem; height: 2.5rem;" />
			<div class="flex flex-column">
				<h1 class="text-lg flex align-items-center gap-2 m-0">
					<span><span class="text-blue-600">Hydrate</span><span class="text-blue-700">2</span><span
							class="text-blue-600">Dominate</span></span>
				</h1>
				<p class="m-0 text-sm">{{ hydrationQuote() }}</p>
			</div>
		</div>
		<div v-if="!user">
			<Button @click="handleLoginClick" text><i class="pi pi-user mr-2"></i>
				Login</Button>
		</div>
		<div v-else class="flex align-items-center gap-1">
			<Button @click="toggleMenu" icon="pi pi-bars" class="p-button-rounded p-button-text" />
			<Menu ref="menu" :model="menuItems" id="overlay_menu" style="width: auto;" :popup="true">
				<template #start>
					<p class="m-0 py-2 px-3"><strong>Logged in as</strong><br /> {{ user.email }}</p>
				</template>
				<template #end>
					<button @click="handleLogoutClick"
						class="w-full p-link flex align-items-center py-2 px-3 text-color hover:surface-200 border-noround">
						<i class="pi pi-sign-out" />
						<span class="ml-2">Log Out</span>
					</button>
				</template>
			</Menu>

		</div>
	</header>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

import Login from './Login.vue';
import useUser, { user } from '../composables/use-user';
import Menu from 'primevue/menu';
import { supabase } from '../supabase';
import { useDialog } from 'primevue/usedialog';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import Profile from './Profile.vue';
import LoginSignup from './LoginSignup.vue';
const confirm = useConfirm();
const menu = ref();
const dialog = useDialog();
const toast = useToast();
const toggleMenu = (event: Event) => {
	menu.value.toggle(event);
};

const menuItems = [
	{ separator: true }, {
		label: 'Profile',
		command: () => {
			dialog.open(Profile, {
				props: {
					modal: true,
					header: "Profile",
				}
			})
		}
	},
	{ separator: true }];


const handleLoginClick = () => {
	dialog.open(LoginSignup, {
		props: {
			modal: true,
			style: {
				width: "600px"
			},
		}
	})
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

const hydrationStrings = [
	"Stay hydrated, stay motivated, conquer!",
	"Water fuels your motivation fire.",
	"Hydration unlocks your true potential.",
	"Drink water, stay focused, achieve.",
	"Hydration: the weapon of champions.",
	"Stay hydrated, let motivation flow.",
	"Water nourishes, fuels motivation.",
	"Hydration for an energized life.",
	"Sip by sip, fuel determination.",
	"Stay hydrated, stay motivated, win!",
	"Water: the elixir of motivation.",
	"Hydration powers your success.",
	"Drink water, stay motivated, thrive.",
	"Hydration fuels your inner drive.",
	"Stay hydrated, seize the day!",
	"Water: the catalyst for motivation.",
	"Hydration empowers your aspirations.",
	"Drink water, ignite motivation!",
	"Stay hydrated, conquer your goals!",
	"Water: the secret to motivation."
];
const hydrationQuote = () => {
	return hydrationStrings[Math.floor(Math.random() *
		hydrationStrings.length)]
}


</script>

<style scoped></style>