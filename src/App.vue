<script setup lang="ts">
import Header from "./components/Header.vue";
import { onMounted } from "vue";
import { supabase } from './supabase';
import Toast from "primevue/toast";
import ConfirmDialog from 'primevue/confirmdialog';
import useUser from "./composables/use-user";
import DynamicDialog from 'primevue/dynamicdialog';

const { user } = useUser();

onMounted(async () => {
	if (!user.value) {
		const { data, error } = await supabase.auth.getSession();
	}
});
</script>

<template>
	<ConfirmDialog style="max-width: 500px;" />
	<Toast position="top-right" group="tr" />
	<Header />
	<div class="container">
		<RouterView />
	</div>
	<footer>
		<div class="container flex justify-content-center gap-2">
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
		</div>
	</footer>

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
