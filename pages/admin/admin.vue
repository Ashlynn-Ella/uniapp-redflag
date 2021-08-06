<template>
	<view class="admin-box">
		<s-dialog></s-dialog>
		<s-toast></s-toast>
		<view class="saerch-box flex-btw-nowrap">
			<view class="search">
				<uni-search-bar cancelButton="none" v-model="name" :focus="true" bgColor="#fff" :radius="100"
					@input="input"></uni-search-bar>
			</view>

			<navigator url="/pages/add-user/add-user">
				<button type="info">新建</button>
			</navigator>
		</view>
		<view class="container">
			<view class="user-list flex-btw">
				<view class="user-item flex-clumn mb-30" v-for="item in userList" :key="item.id">
					<view class="mb-20 flex-clumn" @click="editUser(item)">
						<view class="mb-20">
							<image src="/static/images/avartar.png" />
						</view>
						<text class="username">{{item.name}}</text>
					</view>
					<button @click="changeStatus(item.id,item.status)"
						:class="[item.status?'':'off']">{{item.status?"正常":"禁用"}}</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		client,
		http,
		url
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				userList: [],
				name: ''
			}
		},
		onPullDownRefresh() {
			this.getUsers()
			uni.stopPullDownRefresh()
		},
		onLoad() {
			this.getUsers()
		},
		methods: {
			getUsers() {
				uni.getStorage({
					key: 'X-Access-Token',
					success: (res) => {
						http(
							"GET",
							`${url}/users.php?token=${res.data}&name=${this.name}`
						).then(res => {
							if (res) {
								this.userList = res.data
							}
						})
					}
				})
			},
			editUser(user) {
				uni.navigateTo({
					url: `/pages/edit-user/edit-user`,
					success: (res) => {
						res.eventChannel.emit('user', {
							data: {
								...user
							}
						})
					}
				})
			},
			changeStatus(id, status) {
				const sta = status ? 0 : 1
				uni.getStorage({
					key: 'X-Access-Token',
					success: (res) => {
						uni.showModal({
							title: '提示',
							message: `确定${!status ? '启用' : '禁用'}该用户吗？`,
							success: (result) => {
								if (result.confirm) {
									http(
										"POST",
										`${url}/usersave.php?token=${res.data}`, {
											id,
											status: sta
										}
									).then(res => {
										if (res.result === true) {
											this.getUsers()
										} else {
											uni.showToast({
												title: res.message,
												duration: 500
											});
										}
									})
								}
							}
						})
					}
				})
			},
			input(value) {
				this.getUsers()
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}

	.saerch-box {
		padding-right: 30rpx;
	}

	.search-input {
		background-color: #fff;
	}

	.search {
		flex: 1
	}

	uni-button {
		width: 110rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 24rpx;
		box-shadow: none;
	}

	uni-button.off {
		background: #9B9B9B;
	}

	.user-item {
		width: 330rpx;
		background: #FFFFFF;
		box-shadow: 1px 2px 10px 3px rgba(0, 0, 2, 0.05);
		border-radius: 12px;
		padding: 40rpx 0 30rpx;
	}

	.user-item image {
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}
</style>
