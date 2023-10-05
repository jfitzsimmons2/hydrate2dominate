<template>
	<TabView>
		<TabPanel header="Login">
			<Login />
		</TabPanel>
		<TabPanel header="Signup">
			<Signup />
		</TabPanel>
		<TabPanel header="Magic Link">
			<MagicLink />
		</TabPanel>
	</TabView>
</template>

<script setup lang="ts">
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Login from './Login.vue';
import Signup from './Signup.vue';
import MagicLink from './MagicLink.vue';
</script>

<style scoped></style>