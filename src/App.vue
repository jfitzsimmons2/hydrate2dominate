<script setup lang="ts">
import Header from "./components/Header.vue";
import ConfirmDialog from 'primevue/confirmdialog';
import DynamicDialog from 'primevue/dynamicdialog';
import { Device } from '@capacitor/device';
import { ref } from 'vue';

const deviceInfo = ref();

const getDeviceInfo = async () => {
	deviceInfo.value = await Device.getInfo();
}

getDeviceInfo();
</script>

<template>
	<div class="p-2" :class="{ 'mt-16': deviceInfo.platform === 'ios' }">
		<ConfirmDialog style="max-width: 500px;" />
		<Header />
		<div class="container">
			<RouterView />
		</div>
		<footer>
			<div class="container">
				<div class="flex justify-center items-center gap-2 mt-8">
					<i class="line-md line-md-beer-alt-filled-loop text-blue-700 text-2xl" />
					<RouterLink to="/">Home</RouterLink>
					<span class="text-gray-400">//</span>
					<RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
					<i class="line-md line-md-beer-alt-filled-loop text-blue-700 text-2xl" />
				</div>
			</div>
		</footer>

		<DynamicDialog />
	</div>
</template>


<style>
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
