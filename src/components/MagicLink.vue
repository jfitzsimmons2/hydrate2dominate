<template>
	<div class="flex flex-col gap-2">
		<p>Enter your email address to receive a magic link. This can be used to login or signup. If you use this method to
			sign up, you can set a password after you login by accessing your profile.</p>

		<form @submit.prevent="handleMagicLink">
			<div class="flex flex-col gap-2">
				<InputText class="w-full" v-model="login.email" placeholder="Email address" />

				<Button class="align-self-end" type="submit">Send magic link</Button>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { supabase } from '../supabase';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const toast = useToast();
const login = reactive({
	email: "",
});

const handleMagicLink = async () => {
	const { data, error } = await supabase.auth.signInWithOtp({
		email: login.email,
	});


	if (!error) {
		toast.add({
			severity: "success",
			summary: "Magic link sent",

			life: 5000,
			group: 'tr'
		});
	}
	if (error) {
		toast.add({
			severity: "error",
			summary: "Error sending magic link",
			detail: error.message,
			life: 0,
			group: 'tr'
		});
	}
};
</script>

<style scoped></style>