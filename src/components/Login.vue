<template>
	<p>Enter your email address and password to login.</p>

	<form @submit.prevent="handleLogin">
		<div class="flex flex-column gap-2">
			<InputText type="text" class="w-full" v-model="login.email" placeholder="Email address" />
			<InputText ref="passwordRef" type="password" class="w-full" v-model="login.password" placeholder="Password" />

			<div class="flex">
				<Checkbox :binary="true" v-model="showPassword" input-id="showPasswordLogin" class="mr-2" />
				<label for="showPasswordLogin">Show password</label>
			</div>
			<Button class="align-self-end" type="submit">Login</Button>
		</div>
	</form>

	<hr />

	<p class="text-center text-gray-700 mb-1">Or log in via a third party provider</p>
	<Button style="background: #f5f5f5!important; border: 1px solid #f0f0f0; color: #2f2f2f" @click="handleSignInWithGithub"
		class="w-full flex justify-content-center"><i class="pi pi-github mr-2"></i>Continue
		with GitHub</Button>
	<Button style="background: #f5f5f5!important; border: 1px solid #f0f0f0; color: #2f2f2f" @click="handleSignInWithGoogle"
		class="w-full mt-2 flex justify-content-center"><i class="pi pi-googl emr-2"></i>Continue
		with Google</Button>
</template>

<script setup lang="ts">
import { Ref, inject, reactive, ref, watch } from 'vue';
import { supabase } from '../supabase';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { DynamicDialogInstance } from 'primevue/dynamicdialogoptions';
const dialogRef = inject('dialogRef') as Ref<DynamicDialogInstance>;
const passwordRef = ref();
const showPassword = ref(false);
const toast = useToast();
const login = reactive({
	email: "",
	password: "",
});

const handleSignInWithGoogle = async () => {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
	})
}

const handleSignInWithGithub = async () => {
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'github',
	})
}

const handleLogin = async () => {

	const { data, error } = await supabase.auth.signInWithPassword({
		email: login.email,
		password: login.password,
	});
	if (!error) {
		toast.add({
			severity: "success",
			summary: "Login successful",
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
