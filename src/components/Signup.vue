<template>
	<p>Enter your email address and password to sign up.</p>

	<form @submit.prevent="handleSignup">
		<div class="flex flex-col gap-2">
			<InputText type="text" class="w-full" v-model="signup.email" placeholder="Email address" />
			<InputText ref="passwordRef" type="password" class="w-full" v-model="signup.password" placeholder="Password" />

			<div class="flex">
				<Checkbox :binary="true" v-model="showPassword" input-id="showPassword" class="mr-2" />
				<label for="showPassword">Show password</label>
			</div>

			<Button class="align-self-end" type="submit">Signup</Button>
		</div>
	</form>
</template>

<script setup lang="ts">
import { Ref, inject, reactive, ref, watch } from 'vue';
import { supabase } from '../supabase';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';


const dialogRef = inject('dialogRef') as Ref<any>;
const passwordRef = ref();
const showPassword = ref(false);
const toast = useToast();
const signup = reactive({
	email: "",
	password: "",
});

const handleSignup = async () => {

	const { data, error } = await supabase.auth.signUp({
		email: signup.email,
		password: signup.password,
	});
	if (!error) {
		toast.add({
			severity: "success",
			summary: "Signup successful",

			life: 5000,
			group: 'tr'
		});
		dialogRef.value?.close();

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
};

watch(showPassword, (value) => {
	if (value) {
		passwordRef.value?.$el.setAttribute("type", "text");
	} else {
		passwordRef.value?.$el.setAttribute("type", "password");
	}
})

</script>
