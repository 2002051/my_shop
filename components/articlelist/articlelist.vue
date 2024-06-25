<template>
	<view class="box">

		<view class="title">
			标题1
		</view>
		<view class="list">
			<view class="item" v-for="item in 4">
				<view class="img">
					<image src="../../static/link01.png" mode="scaleToFill"></image>
				</view>
				<view class="text">
					交友论坛{{item}}
				</view>
			</view>
		</view>

	</view>
</template>

<script setup>


</script>

<style scoped lang="scss">
	.box {
		width: 720rpx;
		margin-left: auto;
		margin-right: auto;
		// padding: 20rpx;
		background-color: white;

		// box-shadow: 0px 0px 0 1px #eeeeee inset;
		.title {
			color: #bababa;
		}

		.list {
			width: 700rpx;
			display: flex;
			flex-wrap: wrap;

			.item {
				// background-color: red;
				width: 330rpx;
				margin: 10rpx;
				height: 220rpx;

				.img {

					width: 100%;
					height: 80%;
					background-color: yellow;
					image {
						width: 100%;
						height: 100%;
					}
				}

				.text {
					height: 20%;
					text-align: center;
				}
			}
		}
	}
</style>