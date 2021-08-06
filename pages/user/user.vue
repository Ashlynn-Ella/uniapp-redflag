<template>
	<view class="user-box">
		<view class="avartar-box flex-clumn">
			<view class="img-box mb-30">
				<image :src="user.avatar?user.avatar:'/static/images/avartar.png'" />
			</view>
			<view class="flex-clumn">
				<text class="mb-10" style="font-size:24rpx">{{user.id}}</text>
				<text>{{user.name}}</text>
			</view>
		</view>
		<view class="container">
			<view class="user-list">
				<uni-list>
				 	<uni-list-item :show-extra-icon="true" :extra-icon="{size: '20',type: 'person'}" link to="/pages/my/my" title="我的资料" ></uni-list-item>
				 	<uni-list-item :show-extra-icon="true" :extra-icon="{size: '20',type: 'chat'}" link to="/pages/message/message" title="消息通知" ></uni-list-item>
				 	<uni-list-item :show-extra-icon="true" :extra-icon="{size: '20',type: 'personadd'}" link to="/pages/admin/admin" title="用户管理" ></uni-list-item>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
	import uniList from '@/uni_modules/uni-list/components/uni-list/uni-list.vue'
	import uniListItem from '@/uni_modules/uni-list/components/uni-list-item/uni-list-item.vue'
	export default {
		data() {
			return {
				
			}
		},
		components:{uniListItem,uniList},
		computed:{
			user(){
				return this.$store.state.user
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.avartar-box {
		width: 100%;
		height: 380rpx;
		background-color: #1985FF;
		color: #fff;
		font-size: 32rpx;
	}

	.img-box {
		width: 180rpx;
		height: 180rpx;
		border-radius: 50%;
		background-color: #fff;
		box-shadow: 0px 20px 15px 0px rgba(255, 255, 255, 0.08), 0px 13px 14px 0px rgba(255, 255, 255, 0.16), 0px 7px 12px 0px rgba(255, 255, 255, 0.14);
	}

	.avartar-box image {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.user-list {
		background: #FFFFFF;
		box-shadow: 0px 3rpx 10rpx 0px rgba(0, 0, 0, 0.08);
		border-radius: 12rpx;
	}
</style>
