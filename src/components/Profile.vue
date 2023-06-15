<template>
	<div>
		<div class="flex flex-column gap-2">
			<p class="m-0">Logged in as {{ user?.email }}</p>
			<div class="m-0">Signup type:
				<Badge :value="user?.app_metadata.provider" />
			</div>
			<div class="flex flex-column gap-1">
				<label class="font-bold" for="password">Change password</label>
				<InputText ref="passwordRef" type="password" id="password" v-model="profile.password"
					aria-describedby="password-help" />
				<div>
					<Checkbox binary v-model="profile.showPassword" input-id="showPassword" name="showPassword" class="mr-2" />
					<label for="showPassword">Show password</label>
				</div>
			</div>
			<Button @click="handlePasswordUpdate" label="Change password" />
		</div>

	</div>
</template>

<script setup lang="ts">
import { ComponentPublicInstance, reactive, ref, watchEffect } from "vue";
import useUser, { user } from "../composables/use-user";
import Badge from "primevue/badge";
import Checkbox from "primevue/checkbox";

const { updateUserPassword } = useUser();
const passwordRef = ref<ComponentPublicInstance>();
const profile = reactive({
	password: "",
	showPassword: false,
});

const handlePasswordUpdate = async () => {
	await updateUserPassword(profile.password);
}

watchEffect(() => {
	console.log(profile.showPassword)
	console.log(passwordRef.value)
	if (profile.showPassword) {
		passwordRef.value?.$el.setAttribute("type", "text");
	} else {
		passwordRef.value?.$el.setAttribute("type", "password");
	}
})

console.log(user.value);
</script>

<style scoped></style>