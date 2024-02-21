<template>
	<Dialog v-model:visible="profileOpen" :style="{ width: '600px', maxWidth: '100%' }">
		<Profile />
	</Dialog>
	<header class="container flex flex-wrap items-center gap-2 justify-between mb-4">
		<a href="/" class="flex items-center gap-2 no-underline">
			<img src="/favicon.ico" style="width: 2.5rem; height: 2.5rem;" />
			<div class="flex flex-col">
				<h1 class="text-lg flex items-center gap-2 m-0">
					<span><span class="text-blue-600 dark:text-blue-100">Hydrate</span><span
							class="text-blue-700 dark:text-blue-200">2</span><span
							class="text-blue-600 dark:text-blue-100">Dominate</span></span>
				</h1>
				<p class="m-0 text-gray-800 dark:text-gray-100 text-sm">{{ hydrationQuote() }}</p>
			</div>
		</a>

		<div class="flex gap-2">
			<Button
				:icon="darkMode ? 'line-md line-md-moon-filled-to-sunny-filled-loop-transition' : 'line-md line-md-moon-rising-filled-alt-loop'"
				rounded outlined @click="toggleDarkMode" />
			<div v-if="!user">
				<Button icon="pi pi-user" outlined @click="handleLoginClick" rounded />
			</div>
			<div v-else class="flex items-center gap-1">
				<Button @click="toggleMenu" class="p-button-rounded p-button-text">
					<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
						<path fill="currentColor"
							d="M19 12.75H5a.75.75 0 0 1 0-1.5h14a.75.75 0 0 1 0 1.5Zm0-4.5H5a.75.75 0 0 1 0-1.5h14a.75.75 0 0 1 0 1.5Zm0 9H5a.75.75 0 0 1 0-1.5h14a.75.75 0 0 1 0 1.5Z">
						</path>
					</svg>
				</Button>
				<Menu ref="menu" :model="menuItems" id="overlay_menu" style="width: auto;" :popup="true">

					<template #start>
						<p class="m-0 py-2 px-3"><strong>Logged in as</strong><br /> {{ user.email }}</p>
					</template>
					<template #end>
						<button @click="handleLogoutClick"
							class="w-full p-link flex items-center py-2 px-3 text-color hover:surface-200 border-noround">
							<i class="pi pi-sign-out" />
							<span class="ml-2">Log Out</span>
						</button>
					</template>
				</Menu>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '@vueuse/core';

import Dialog from 'primevue/dialog';
import { user } from '../composables/use-user';
import Menu from 'primevue/menu';
import { supabase } from '../supabase';
import { useDialog } from 'primevue/usedialog';
import { useConfirm } from 'primevue/useconfirm';
import Profile from './Profile.vue';
import LoginSignup from './LoginSignup.vue';
const confirm = useConfirm();
const menu = ref();
const dialog = useDialog();
const profileOpen = ref(false);


const darkMode = useStorage('my-dark-mode', false)
darkMode.value ? document.querySelector('html')?.classList.add('dark') : document.querySelector('html')?.classList.remove('dark');


const toggleDarkMode = () => {
	darkMode.value = !darkMode.value;
	document.querySelector('html')?.classList.toggle('dark');
};

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
					style: {
						width: "600px",
						maxWidth: "100%"
					},
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
				width: "600px",
				maxWidth: "100%"
			},
		}
	})
};

defineEmits(['logout']);

const handleLogoutClick = async () => {
	const { error } = await supabase.auth.signOut();
	if (!error) {

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

<info lang="json">
{
	"name": "Header",
	"description": "The header component for the app"
}
</info>