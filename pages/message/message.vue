<template>
	<view class="message-box">
		<view class="tabs-box">
			<s-tabs effect @change="tabChange" barHeight="6" barWidth="80" background="#F2F2F2" color="#000"
				activeColor="#000000" barColor="#000000">
				<s-tab :title="'系统消息'"></s-tab>
				<s-tab :title="'预警消息'"></s-tab>
				<s-tab :title="'报警消息'"></s-tab>
			</s-tabs>
		</view>		
		<view style="margin-top: 70rpx;">
			<uni-notice-bar showIcon="true" scrollable="true" backgroundColor="#ee0a24" color="#fff" single="true"
				v-if="noticeText" :text="noticeText"></uni-notice-bar>
			<view class="container" style="margin-bottom: -30rpx;">
				<device-select @hisFun="getOptions" showDate="true"></device-select>
			</view>
		</view>		
		<view class="tab01-inner" v-if="active === 0">
			<view class="mes-list container">
				<view class="flex-center" v-if="!logs.length">
					暂无记录......
				</view>
				<view class="mes-item flex-btw-nowrap mb-20" v-for="(item,index) in logs" :key="index">
					<view class="mes-hd">
						<view class="mb-10">
							<text>{{item.content}}</text>
						</view>
						<text>设备{{item.name}}</text>
					</view>
					<text>{{item.date}}</text>
				</view>
			</view>
		</view>
		<view class="tab02-inner" v-else-if="active === 1">
			<view class="mes-list container">
				<view class="flex-center" v-if="!logs.length">
					暂无记录......
				</view>
				<view class="mes-item flex-btw-nowrap mb-20" v-for="(item,index) in logs" :key="index">
					<view class="mes-hd">
						<view class="mb-10">
							<text>{{item.info}}</text>
						</view>
						<text>{{item.name}}</text>
					</view>
					<text>{{item.date}}</text>
				</view>
			</view>
		</view>
		<view class="tab03-inner" v-else>
			<view class="mes-list container">
				<view class="flex-center" v-if="!logs.length">
					暂无记录......
				</view>
				<view class="mes-item flex-btw-nowrap mb-20" v-for="(item,index) in logs" :key="index">
					<view class="mes-hd">
						<view class="mb-10">
							<text>{{item.name}}</text>
						</view>
						<text>{{item.content}}</text>
					</view>
					<text style="text-align:right">{{item.date}}</text>
				</view>

			</view>
		</view>
		<s-toast></s-toast>
	</view>

</template>

<script>
	import DeviceSelect from '../../components/custom/device-select.vue'
	import {
		http,
		url
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				active: 0,
				logs: [],
				dateTime: [],
				device: {},
				productId: '',
				pageIndex: 0,
				pageSize: 8
			}
		},
		components: {
			DeviceSelect
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		computed:{
			noticeText(){
				return this.$store.state.noticeText
			}
		},
		onReachBottom: function() {
			this.pageIndex = +1
			this.getLogs()
		},
		methods: {
			tabChange(name) {
				this.active = name
				this.logs = []
				this.pageIndex = 0
				this.getLogs()
			},
			getOptions(value) {
				this.dateTime = value.dateTime
				this.device = value.deviceId
				this.productId = value.productId
				this.getLogs()
			},
			getLogs() {
				const event = this.active === 0 ?
					'systemlogs' : this.active === 1 ?
					'alertlogs' : 'event'
				uni.getStorage({
					key: 'X-Access-Token',
					success: async (res) => {
						const Url =
							`${url}/${event}.php?token=${res.data}&deviceId=${this.device.value}&productId=${this.productId}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}&start=${this.dateTime[0]} 00:00:00&end=${this.dateTime[1]} 23:59:59`
						const result = await http('GET', Url)
						if (result.total !== 0) {
							this.logs = this.logs.concat(result.data)
						} else {
							this.logs = []
							uni.showToast({
								title: '无记录',
								duration: 500
							});
						}
					}
				})
			}
		}
	}
</script>

<style>

	.mes-item {
		background: #FFFFFF;
		box-shadow: 0px 3rpx 10rpx 0px rgba(0, 0, 0, 0.08);
		border-radius: 12rpx;
		padding: 30rpx;
		font-size: 24rpx;
		color: #9B9B9B;
	}

	.mes-hd view text {
		font-size: 28rpx;
		color: #000000;
	}

	.tabs-box {
		width: 100%;
		position: fixed;
	}
</style>
