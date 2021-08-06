<template>
	<view class="login-box flex-clumn-ftw">
		<view class="logo-box">
			<image src="/static/images/logo.png" />
		</view>
		<s-toast></s-toast>
		<view class="input-box">
			<uni-forms :value="formData" ref="form">
				<uni-forms-item required name="username" class="mb-10">
					<uni-easyinput focus type="text" v-model="formData.username" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item required name="password" class="mb-10">
					<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码" />
				</uni-forms-item>
				<view class="code-box">
					<uni-forms-item required name="verifyCode">
						<uni-easyinput type="text" v-model="formData.verifyCode" placeholder="请输入验证码" />
					</uni-forms-item>
					<view class="code-img" @click="initCode">
						<image :src="base64" />
					</view>
				</view>
				<view class="submit-box mt-40">
					<button type="primary" @click="submitForm">登录</button>
				</view>
			</uni-forms>
			<view class="flex-center mt-50">
				<text class="info">登录代表已同意中科红旗用户协议和隐私协议</text>
			</view>
		</view>
		<view class="ft-image">
			<image src="/static/images/logo-bg.png" />
		</view>
	</view>
</template>

<script>
	import {
		http,
		baseUrl,
		client
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				formData: {},
				base64: '/static/images/logo.png',
				key: '',
				expires: 3600000
			}
		},
		onLoad() {
			this.initCode()
		},
		onPullDownRefresh() {
			this.initCode()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			initCode() {
				http('GET', `${baseUrl}/authorize/captcha/image?width=130&height=40`,{},true).then(res => {
					this.base64 = res.result.base64
					this.key = res.result.key
				})
			},
			submitForm() {
				// this.$refs.form.submit().then((res) => {
				// 	console.log('表单返回得值：', {
				// 		...res
				// 	})
				// })
				http('POST', `${baseUrl}/authorize/login`,{
					expires:this.expires,
					verifyKey:this.key,
					...this.formData
				}).then(res => {
					if (res.status === 200) {
						uni.showToast({
							title: '登录成功',
							duration: 1000,
							icon:'success'
						})
						uni.setStorage({
							key: "X-Access-Token",
							data: res.result.token
						})
						uni.switchTab({
							url: '/pages/index/index'
						})
					} else {
						this.initCode()
						uni.showToast({
							title: res.message,
							duration: 1000
						})
						
					}
				})
			}
		}
	}
</script>

<style>
	@import "/static/scss/common.scss";
	page {
		height: 100%;
	}

	.login-box {
		width: 100%;
		height: 100%;
		padding: 0 40rpx;
		margin-bottom: 120rpx;
	}

	.logo-box image {
		margin-top: 40rpx;
		width: 230rpx;
		height: 60rpx;
	}

	.ft-image image {
		width: 190rpx;
		height: 50rpx;
	}

	.input-box {
		width: 100%;
		background: #FFFFFF;
		box-shadow: 1px 2rpx 10rpx 3px rgba(0, 0, 2, 0.05);
		border-radius: 12rpx;
		padding: 80rpx 50rpx 100rpx;
	}

	.code-box {
		position: relative;
		margin-bottom: 80rpx;
	}

	.code-img {
		width: 240rpx;
		height: 55rpx;
		position: absolute;
		right: 0rpx;
		top: -5rpx;
	}

	.code-img image {
		width: 100%;
		height: 100%;
	}

	.submit-box {
		padding: 0 30rpx;

		button {
			height: 85rpx;
			background: linear-gradient(270deg, #57A5FD 0%, #5AD3FC 100%);
			border-radius: 50rpx;
		}
	}

	.submit-inner {
		box-shadow: 1px 2px 10px 3px rgba(0, 0, 2, 0.05);
	}

	.info {
		text-align: center;
		color: #ADADAD;
		font-size: 24rpx;
	}
</style>
