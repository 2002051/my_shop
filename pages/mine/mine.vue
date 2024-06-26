<template>

	<view class="main">
		<view class="avatar">
			<view class="img" @click="doUpload">
				<image :src="avatar" mode="aspectFit"></image>
			</view>
			<view class="nickname">
				{{name||"默认用户xxxxx"}}
			</view>
		</view>
		<view class="detail">
			<view class="box" v-for="item in 3">
				<view class="item" v-for="item in 4">
					<view class="txt">
						{{"测试文本"+item}}
					</view>
					{{">"}}
				</view>
			</view>
		</view>
		<view class="logout">
			<button>退出登录</button>

		</view>

	</view>

</template>

<script setup>
	import {
		onReady
	} from "@dcloudio/uni-app"
	import {
		ValidateCode,
		UploadAvatar,
	} from "../../api/requests.js"
	import {
		ref
	} from "vue";
	const token = ref("")
	const avatar = ref("../../static/logo.png")
	onReady(x => {
		// token.value = localStorage.getItem("token");
		// console.log("111111",uni.getStorageSync("token"))
		token.value = uni.getStorageSync("token")
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

	function doUpload() {
		console.log("上传")
		uni.chooseImage({
			count: 6, //默认9
			sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album'], //从相册选择
			success: function(res) {
				avatar.value = res.tempFiles
				console.log(JSON.stringify(res.tempFilePaths), res.tempFiles);
				DoUpload(res)
			}
		});
		async function DoUpload(res={}) {
			await UploadAvatar({
				"file": res.tempFiles
			}).then(x => {
				console.log('x,x', x)
			}).catch(err => {
				console.log("err,err", err)
			})

		}
		UploadAvatar({
			"file": avatar.value
		})

	}
</script>

<style lang="scss" scoped>
	.main {
		background-color: #eaeaea;
		padding-top: 30rpx;
		padding-bottom: 30rpx;

		.avatar {
			margin-top: 30rpx;
			// width: 200rpx;
			height: 300rpx;

			.img {
				margin-top: 0rpx;
				width: 200rpx;
				height: 200rpx;
				border-radius: 50%;
				margin-left: auto;
				margin-right: auto;

				image {
					margin-top: 0rpx;
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}

			}

			.nickname {
				margin-top: 10rpx;
				text-align: center;
			}
		}

		.detail {
			margin-top: 30rpx;

			.box {
				width: 660rpx;
				margin-left: auto;
				margin-right: auto;
				background-color: white;
				padding: 20rpx;
				margin-top: 50rpx;

				.item {
					margin-top: 10rpx;
					height: 60rpx;
					// background-color: red;
					padding-left: 30rpx;
					padding-right: 30rpx;
					display: flex;
					border-bottom: 1px solid #cfcfcf;

					.txt {
						width: 95%;
					}

					.jt {}
				}
			}
		}

	}
</style>