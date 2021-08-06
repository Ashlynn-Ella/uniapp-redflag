<template>
	<view>
		<s-dialog></s-dialog>
		<s-toast></s-toast>
		<uni-list>
			<uni-list-item title="姓名" link :to="`/pages/editing/editing?editname=0&id=${user.id}&name=${user.name}`" :rightText="user.name"></uni-list-item>
			<uni-list-item title="用户名" :rightText="user.username"></uni-list-item>
			<uni-list-item title="密码" :to="`/pages/editing/editing?editname=1&id=${user.id}`" link></uni-list-item>
			<uni-list-item title="权限" :to="`/pages/editing/editing?editname=2&id=${user.id}&username=${user.username}&role=${user.role}`" link></uni-list-item>
		</uni-list>
		<view class="logout-box mt-40 flex-center" @click="deleteUser" v-if="user.status===0">
			<text>删除用户</text>
		</view>
	</view>

</template>

<script>
	import {
		client
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				user: ''
			}
		},
		onLoad(option) {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('user', (res) => {
				this.user = res.data
			})
		},
		methods: {
			deleteUser() {
				uni.showModal({
					title: '提示',
					content: `确定删除用户吗？`,
					success: (res) => {
						if (res.confirm) {
							client('DELETE', `user/${this.user.id}`).then(
								res => {
									if (res.result) {
										uni.showToast({
											title: '删除成功',
											icon: 'success'
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
					}
				})
			},
		}
	}
</script>

<style>
	page {
		background-color: #F2F2F2;
	}

	.logout-box {
		width: 100%;
		height: 100rpx;
		font-size: 30rpx;
		background-color: #fff;
		color: #F50000;
	}
</style>
