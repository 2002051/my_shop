<template>
	<h1>你好，这是首页
	</h1>
</template>

<script setup>
	import {
		onReady
	} from "@dcloudio/uni-app"
	import {
		ValidateCode
	} from "../../api/requests.js"
	import {
		ref
	} from "vue";

	const token = ref("")
	onReady(x => {
		token.value = localStorage.getItem("token");
		// console.log("read函数", token.value)
		DoValidateCode();

	})
	async function DoValidateCode() {
		await ValidateCode({
			token: token.value
		}).then(res => {
			console.log("res", res)
		}).catch(err => {
			uni.showToast({
				title: err.detail,
				icon: "none"
			})
			uni.redirectTo({
				url: "/pages/login/login"
			})
		})
	}
</script>

<style lang="scss" scoped>

</style>