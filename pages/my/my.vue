<template>
	<view>
		<uni-list>
			<uni-list-item class="avartar" title="头像">
				<template slot="footer">
					<image class="slot-image" :src="user.avatar?user.avatar:'/static/images/avartar.png'"
						mode="">
					</image>
				</template>
			</uni-list-item>
			<uni-list-item title="姓名" link :to="`/pages/editing/editing?editname=0&name=${user.name}&id=${user.id}`">
			</uni-list-item>
			<uni-list-item title="密码" link :to="`/pages/editing/editing?editname=1&id=${user.id}`"></uni-list-item>
			<uni-list-item title="营业执照" link></uni-list-item>
		</uni-list>
		<view class="logout-box mt-40 flex-center" @click="logout">
			<text>退出登录</text>
		</view>
		<uni-popup ref="popup" type="bottom" background-color="#fff">
			<view class="pop-box container">
				<view class="pop-hd flex-btw mb-40">
					<text @click="close">取消</text>
					<text @click="confirm">确定</text>
				</view>
				<uni-file-picker fileMediatype="image" mode="grid" @success="success"
					file-extname="png,jpg" :limit="1" @fail="fail" />
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		client
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				user: {},
				imageValue:''
			}
		},
		onLoad() {
			this.initUser()
		},
		methods: {
			async initUser() {
				const detail = await client('GET', `/user/detail`)
				this.user = detail.result
			},
			open() {
				this.$refs.popup.open('bottom')
			},
			success(e) {
				console.log(e)
				// this.imageValue = e.tempFiles[0].image.location			
			},
			confirm() {
				this.$refs.popup.close()
				if(this.imageValue){
					client('POST','/file/static',{
						file:this.imageValue
					}).then(res=>{
						console.log(res)
					})
				}
			},
			close() {
				this.$refs.popup.close()
			},
			fail(e) {
				uni.showToast({
					title: '上传失败'
				})
				console.log('上传失败：', e)
			},
			async logout() {
				const res = await client('GET', `/user-token/reset`)
				if (res.result) {
					uni.removeStorage({
						key: 'X-Access-Token',
						success(res) {
							uni.showToast({
								title: '退出登录成功'
							})
						}
					})
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F2;
	}

	.pop-hd {
		text {
			font-size: 30rpx;
		}
		
	}

	.slot-image {
		width: 110rpx;
		height: 110rpx;
	}

	.logout-box {
		width: 100%;
		height: 100rpx;
		font-size: 30rpx;
		background-color: #fff;
	}

	.pop-box {
		// background-color: #FFFFFF;
	}
</style>
