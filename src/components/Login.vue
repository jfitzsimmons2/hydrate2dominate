<template>
	<p>Enter your email address and password to login.</p>

	<form @submit.prevent="handleLogin">
		<div class="flex flex-col gap-2">
			<InputText type="text" class="w-full" v-model="login.email" placeholder="Email address" />
			<InputText ref="passwordRef" type="password" class="w-full" v-model="login.password" placeholder="Password" />

			<div class="flex">
				<Checkbox :binary="true" v-model="showPassword" input-id="showPasswordLogin" class="mr-2" />
				<label for="showPasswordLogin">Show password</label>
			</div>
			<Button class="justify-center" type="submit">Login</Button>
		</div>
	</form>

	<hr />

	<p class="text-center text-gray-700 dark:text-gray-100 mb-1">Or log in via a third party provider</p>
	<Button style="background: #f5f5f5!important; border: 1px solid #f0f0f0; color: #2f2f2f"
		@click="handleSignInWithGithub" class="w-full flex justify-center"><i class="pi pi-github mr-2"></i>Continue
		with GitHub</Button>
	<Button style="background: #f5f5f5!important; border: 1px solid #f0f0f0; color: #2f2f2f"
		@click="handleSignInWithGoogle" class="w-full mt-2 flex justify-center"><i class="pi pi-google mr-2"></i>Continue
		with Google</Button>
</template>

<script setup lang="ts">
import { Ref, inject, reactive, ref, watch } from 'vue';
import { supabase } from '../supabase';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import { user } from '../composables/use-user';

const dialogRef = inject('dialogRef') as Ref<any>;
const passwordRef = ref();
const showPassword = ref(false);

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

		dialogRef.value?.close();
		user.value = data?.session.user;
	}
	if (error) {

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
