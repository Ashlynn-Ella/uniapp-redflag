<template>
	<view class="add-user">
		<view class="form-box">
			<uni-forms :value="formData" ref="form">
				<uni-forms-item required name="name" class="mt-10">
					<uni-easyinput focus type="text" v-model="formData.name" placeholder="请输入姓名" />
				</uni-forms-item>
				<uni-forms-item required name="username">
					<uni-easyinput type="text" v-model="formData.username" placeholder="用户名" />
				</uni-forms-item>
				<uni-forms-item required name="password">
					<uni-easyinput type="password" v-model="formData.password" placeholder="请输入密码" />
				</uni-forms-item>
				<uni-forms-item required name="confirm">
					<uni-easyinput type="password" v-model="formData.confirm" placeholder="请再次输入密码" />
				</uni-forms-item>
			</uni-forms>
		</view>
		<view class="container">
			<button @click="addUser" size="large">确认</button>
			<s-toast></s-toast>
		</view>		
	</view>
</template>

<script>
	import {
		http,
		url
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				formData: {}
			}
		},
		methods: {
			addUser() {
				uni.getStorage({
					key: 'X-Access-Token',
					success: (res) => {
						http('POST', `${url}/usersave.php?token=${res.data}`, this.formData).then(res => {
							if (res.result) {
								uni.showToast({
									title: '添加用户成功',
									icon:'success'
								})
								uni.navigateTo({
									url: '/pages/admin/admin'
								})
							} else {
								uni.showToast({
									title: res.message
								})
							}
						})
					}
				})

			},
		}
	}
</script>

<style>
	page {
		background-color: #F2F2F2;
		height: 100%;
	}

	.form-box {
		background-color: #FFFFFF;
		padding-left: 20rpx;
		padding-right: 10rpx;
	}

	.add-user {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 130rpx;
	}
</style>
