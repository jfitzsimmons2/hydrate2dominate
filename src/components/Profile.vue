<template>
	<div>
		<div class="flex flex-col gap-2">
			<p class="m-0">Logged in as {{ user?.email }}</p>
			<div class="m-0 flex gap-2">Signup type:
				<Badge :value="provider" v-for="provider in user?.app_metadata.providers" :key="provider" />
			</div>
			<div class="flex flex-col gap-1">
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
import { Ref, inject, reactive, ref, watchEffect } from "vue";
import useUser, { user } from "../composables/use-user";
import Badge from "primevue/badge";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Button from "primevue/button";


const dialogRef = inject("dialogRef") as Ref<any>

const { updateUserPassword } = useUser();
const passwordRef = ref();
const profile = reactive({
	password: "",
	showPassword: false,
});

const handlePasswordUpdate = async () => {
	await updateUserPassword(profile.password);
	dialogRef.value?.close();
}

watchEffect(() => {
	if (profile.showPassword) {
		passwordRef.value?.$el.setAttribute("type", "text");
	} else {
		passwordRef.value?.$el.setAttribute("type", "password");
	}
});
</script>

<style scoped></style>