<template>

	<view class="body">
		<view class="swpierBox">
			<swiper>
				<swiper-item>
					<image src="../../2.jpg" mode="aspectFit"></image>
				</swiper-item>

			</swiper>
		</view>
		<view class="cartList">

			<view class="cartItem" v-for="(item,index) in cartlist">

				<image :src="item.img" mode="aspectFit"></image>
				{{item.title}}
			</view>
		</view>
		<view class="main">
			<view class="articlebox" v-for="item in 3">
				<articlelist></articlelist>
			</view>
		</view>
	</view>

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
	const cartlist = ref([{
		title: "最新文章",
		img: "../../static/tabbar/1.png"
	}, {
		title: "相册",
		img: "../../static/tabbar/2.png"
	}, {
		title: "网课",
		img: "../../static/tabbar/3.png"
	}])
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
	.body {
		background-color: #e6e6e6;
		// height: 100vh;
		padding-bottom: 30rpx;
		.swpierBox {
			// background-color: red;
			width: 750rpx;
			height: 320rpx;
		
			swiper {
				background-color: red;
				height: 100%;
				width: 100%;
		
				swiper-item {
					height: 100%;
					width: 100%;
		
					image {
						height: 100%;
						width: 100%;
					}
		
				}
			}
		}
		
		.cartList {
		
			margin: 15rpx;
		
			height: 150rpx;
			display: flex;
			align-items: center;
			justify-content: space-around;
		
			.cartItem {
				width: 150rpx;
				height: 100%;
				// background-color: red;
				display: flex;
				flex-direction: column;
				align-items: center;
		
				image {
					height: 80%;
					width: 100%;
				}
			}
		
			.cartItem:hover {
				background-color: wheat;
			}
		}
		
		
		.main{
			.articlebox{
				padding-top: 20rpx;
			}
		}
	}

	



</style>