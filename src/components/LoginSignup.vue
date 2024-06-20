<template>
	<Tabs value="0">
		<TabList>
			<Tab value="0">Log In</Tab>
			<Tab value="1">Sign Up</Tab>
			<Tab value="2">Magic Link</Tab>
		</TabList>
		<TabPanels>
			<TabPanel value="0" header="Login">
				<Login />
			</TabPanel>
			<TabPanel value="1" header="Signup">
				<Signup />
			</TabPanel>
			<TabPanel value="2" header="Magic Link">
				<MagicLink />
			</TabPanel>
		</TabPanels>
	</Tabs>
</template>

<script setup lang="ts">
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Login from './Login.vue';
import Signup from './Signup.vue';
import MagicLink from './MagicLink.vue';
</script>

<style scoped></style>