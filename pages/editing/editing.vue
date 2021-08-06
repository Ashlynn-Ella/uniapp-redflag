<template>
	<view class="add-box">
		<uni-forms>
			<view v-if="editname==='0'">
				<uni-forms-item required name="name" class="mt-30">
					<uni-easyinput focus type="text" v-model="name" placeholder="请输入姓名" />
				</uni-forms-item>
			</view>
			<view v-else-if="editname==='1'">
				<uni-forms-item required name="password" class="mt-30">
					<uni-easyinput focus type="password" v-model="password" placeholder="请输入密码" />
				</uni-forms-item>
				<uni-forms-item required name="confirm">
					<uni-easyinput type="password" v-model="confirm" placeholder="请再次输入密码" />
				</uni-forms-item>
			</view>
			<view class="mt-20" style="border-bottom: 1px solid #EEEEEE" v-else>
				<uni-data-checkbox mode="list" icon="right" v-model="role" :localdata="roleSelect" @change="roleChage">
				</uni-data-checkbox>
			</view>
		</uni-forms>
		<view class="container">
			<button v-if="editname!=='2'" @click="editUser" size="large">确认</button>
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
				roleSelect: [{
					'value': 1,
					'text': '游客'
				}, {
					'value': 2,
					'text': '管理员'
				}],
				role: '',
				editname: '',
				name: '',
				password: '',
				confirm: '',
				role: '',
				token: '',
				id: ''
			}
		},
		onLoad(option) {
			console.log(option)
			uni.getStorage({
				key: 'X-Access-Token',
				success: (res) => {
					this.token = res.data
				}
			})
			this.editname = option.editname
			this.name = option.name
			this.role = option.role === '管理员' ? 2 : 1
			this.id = option.id
		},
		methods: {
			editUser() {
				const {
					password,
					confirm,
					name,
					id,
					editname
				} = this
				let config = {
					name,
					id
				}
				if (editname === '1') {
					if (!password && !confirm) {
						uni.showToast({
							title: '密码修改不能为空'
						})
						return
					}
					if (password !== confirm) {
						uni.showToast({
							title: '两次密码不一样'
						})
						return
					}
					config.password = password
					config.confirm = confirm
				} else {
					uni.getStorage({
						key: 'X-Access-Token',
						success: (res) => {
							http('POST', `${url}/usersave.php?token=${res.data}`, config)
								.then(res => {
									if (res.result === true) {
										uni.showToast({
											title: '修改用户成功',
											icon: 'success',
											duration: 1000
										})
										uni.navigateTo({
											url: '/pages/admin/admin'
										})
									} else {
										uni.showToast({
											title: res.message,
										})
									}
								})
						}
					})
				}
			},
			roleChage(e) {
				console.log(e.detail.value)
				http('POST',
						`${url}/userbind.php?token=${this.token}&userId=${this.id}&role=${this.role}`
					)
					.then(res => {
						if (res.status === 1) {
							uni.showToast({
								title: res.message,
								icon: 'success',
								duration: 1000
							})
						} else {
							uni.showToast({
								title: res.message,
							})
						}
					})
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}

	.add-box {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-bottom: 130rpx;
	}
</style>
