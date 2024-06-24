<template>

	<view class="container">

		<view class="box" v-if="!isRegist">
			<view class="logo">
				用户登录
			</view>
			<view class="form-group">
				<input type="text" v-model="loginForm.username" placeholder="用户名" class="input-control" />
			</view>
			<view class="form-group">
				<input type="password" v-model="loginForm.password" placeholder="密码" class="input-control" />
			</view>
			<view class="form-group">
				<input style="width: 300rpx; display: inline-block;" type="text" v-model="loginForm.code"
					placeholder="图片验证码" class="input-control" />
				<image @click="doChangeImg" style="width: 300rpx;height: 100rpx;bottom: 15rpx;"
					:src="`data:image/jpeg;base64,`+base64_str" mode="widthFix">
					<!-- 				<image style="width: 300rpx;height: 100rpx;bottom: 15rpx;" src="/static/code.jpg" mode="aspectFill"> -->
				</image>
				<!-- <button style="display: inline-block;" class="btn">发送验证码</button> -->
			</view>

			<view class="form-group">
				<button @click="login" class="login-button">登录</button>
			</view>
			<view class="form-group">
				<view class="" @click="changeRegist">
					没有账号？点击注册
				</view>
			</view>
		</view>
		<view class="box" v-if="isRegist">
			<view class="logo">
				注册
			</view>
			<view class="form-group">
				<input type="text" v-model="registForm.username" placeholder="用户名" class="input-control" />
			</view>
			<view class="form-group">
				<input type="password" v-model="registForm.password" placeholder="密码" class="input-control" />
			</view>
			<view class="form-group">
				<input type="text" v-model="registForm.phone" placeholder="手机号" class="input-control" />
			</view>
			<view class="form-group">
				<input style="width: 300rpx; display: inline-block;" type="text" v-model="registForm.code"
					placeholder="验证码" class="input-control" />
				<button style="display: inline-block;" class="btn" v-if="!isSending" @click="doSendSms">发送验证码</button>
				<button style="display: inline-block;" class="btn" v-if="isSending" disabled>{{count}}后重新发送</button>
			</view>
			<view class="form-group">
				<button @click="doRegist" class="login-button">点击注册</button>
			</view>
			<view class="form-group">
				<view class="" @click="changeRegist">
					没有账号？点击注册
				</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		apiSendSms,
		apiDoRegist,
		apiGetCodeImg,
		apiLogin,
	} from "../../api/requests.js"
	import {
		ref
	} from 'vue';
	const loginForm = ref({
		username: "",
		password: "",
		code: ""
	})
	const registForm = ref({
		username: "",
		password: "",
		phone: "",
		code: ""
	})
	// const username = ref("");
	// const password = ref("");
	const isRegist = ref(false)
	const count = ref(60)
	const isSending = ref(false)
	const base64_str = ref("")

	function doChangeImg() {
		getCodeImg();
	}
	onLoad((e) => {
		console.log("页面加载")
		getCodeImg()
	})
	async function getCodeImg() {
		await apiGetCodeImg().then((res) => {
			base64_str.value = res.data
			// console.log("1", res)
		}).catch((err) => {
			console.log('2', err)
		})
	}

	async function login() {
		// 登录逻辑
		await apiLogin({
			...loginForm.value
		}).then((res) => {
			console.log(res, "ssss")
			localStorage.setItem("token", res.data)
			// 登录成功, 定向到某个页面
			// ......
			uni.redirectTo({
				url: "/pages/index/index"
			})
		}).catch((err) => {
			uni.showToast({
				title: err.detail,
				icon: "none"
			})
		})

		return 0
	};

	function changeRegist() {
		isRegist.value = !isRegist.value
	};

	// 发送短信
	async function doSendSms() {
		// 发送网络请求
		await apiSendSms({
			"phone": registForm.value.phone
		}).then((res) => {
			console.log("res1", res)
			uni.showToast({
				title: res.data,
				icon: "none",
			})
			isSending.value = true
			let v1 = setInterval(function() {
				count.value -= 1
				if (count.value <= 0) {
					count.value = 60
					clearInterval(v1)
					isSending.value = false
				}
			}, 1000)
		}).catch((err) => {
			uni.showToast({
				title: err.detail,
				icon: "error"
			})
			console.log("err", err)
		}).finally((res) => {
			console.log("finally", res)
		})

	}
	// 注册逻辑
	async function doRegist() {
		console.log('sss', registForm.value)
		await apiDoRegist({
			...registForm.value
			// "username": registForm.username,
			// "password": registForm.password,
			// "phone": registForm.phone,
			// "code": registForm.code
		}).then((res) => {

			uni.showToast({
				title: res.data,
				icon: "success"
			})
			console.log("res", res)
		}).catch((err) => {
			if (typeof err.detail === 'object') {
				console.log("请全部填好")
				uni.showToast({
					title: "请全部填好",
					icon: "error"
				})
			} else if (typeof err.detail === 'string') {
				uni.showToast({
					title: err.detail,
					icon: "error"
				})
			}
			console.log("err", err)
		})
	}
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #81f0a6;
	}

	.box {
		width: 80%;
		max-width: 400px;
		background-color: #ffffff;
		border-radius: 10px;
		padding: 20px;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
	}

	.logo {
		text-align: center;
		margin-bottom: 20px;
	}

	.input-control {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		margin-bottom: 15rpx;
	}

	.btn {
		margin-bottom: 15rpx;
		// height: 80rpx;
		// width: 200rpx;
		font-size: 25rpx;
		// display: flex;
		// justify-content: center;
		// align-items: center;
	}

	.login-button {
		width: 100%;
		padding: 10px;
		background-color: #007bff;
		color: #ffffff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
	}

	.login-button:hover {
		background-color: #0056b3;
	}

	.form-group {
		display: flex;
		justify-content: center;
		align-items: center;

		input {
			width: 550rpx;
		}
	}
</style>