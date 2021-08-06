<template>
	<view class="index-box">
		<view class="view-img container">
			<uni-notice-bar showIcon="true" scrollable="true" backgroundColor="#ee0a24" color="#fff" single="true"
				v-if="noticeText" :text="noticeText"></uni-notice-bar>
			<view class="title">视频监控</view>
			<navigator url="/pages/video/video">
				<view class="video-box">
					<view class="play">
						<image src="/static/images/index/play.png" />
					</view>
					<image class="inner-image" src="/static/images/index/video.png" />
				</view>
			</navigator>
		</view>
		<view class="QS-tabs-box">
			<QSTabs ref="tabs" :tabs="tabs" animationMode="line3" :current="current" @change="change" activeColor="#000"
				lineColor="#1985FF" swiperWidth="750">
			</QSTabs>
		</view>
		<!-- <view class="container"> -->
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item">
				<scroll-view style="width: 100%;" class="container">
					<view class="tab1 flex-btw">
						<view class="tab1-item flex mb-30" v-for="(item,index) in multi" :key="index">
							<view class="img-box flex-clumn mr-40">
								<text class="roomtemp mb-20">{{item.name}}</text>
								<image :src="item.url" />
							</view>
							<text class="num">{{item.formatValue}}</text>
						</view>
						<view class="tab1-item flex mb-30">
							<view class="img-box flex-clumn mr-40">
								<text class="roomtemp mb-20">实况</text>
								<image src="/static/images/index/tem.png" />
							</view>
							<text class="num">晴</text>
						</view>

					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view style="width: 100%;" class="container">
					<view class="tab2 flex-btw">
						<view class="tab2-item">
							<text class="mr-30">园区面积</text>
							<text>500亩</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">大田地块</text>
							<text>200亩</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">连栋温室</text>
							<text>2栋</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">作物种类</text>
							<text>3种</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">大棚温室</text>
							<text>30栋</text>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<scroll-view scroll-y style="width: 100%; height: 100%;" class="container">
					<view class="tab2 mb-30 flex-btw">
						<view class="tab2-item flex">
							<text class="mr-30">西红柿</text>
							<image src="/static/images/index/tomato.png" />
						</view>
						<view class="tab2-item">
							<text class="mr-30">所属棚室:</text>
							<text>A1棚室</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">生长天数:</text>
							<text>53天</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">规模面积:</text>
							<text>200亩</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">种植日期:</text>
							<text>2020-7-10</text>
						</view>
					</view>
					<view class="tab2 mb-30 flex-btw">
						<view class="tab2-item flex">
							<text class="mr-30">马铃薯</text>
							<image src="/static/images/index/potato.png" />
						</view>
						<view class="tab2-item">
							<text class="mr-30">所属棚室:</text>
							<text>A2棚室</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">生长天数:</text>
							<text>60天</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">规模面积:</text>
							<text>200亩</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">种植日期:</text>
							<text>2020-7-10</text>
						</view>
					</view>
					<view class="tab2 mb-30 flex-btw">
						<view class="tab2-item flex">
							<text class="mr-30">大白菜</text>
							<image src="/static/images/index/caba.png" />
						</view>
						<view class="tab2-item">
							<text class="mr-30">所属棚室:</text>
							<text>A3棚室</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">生长天数:</text>
							<text>120天</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">规模面积:</text>
							<text>100亩</text>
						</view>
						<view class="tab2-item">
							<text class="mr-30">种植日期:</text>
							<text>2020-7-10</text>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- </view> -->
		<s-toast></s-toast>
	</view>
</template>

<script>
	import QSTabs from "../../components/QS-tabs/QS-tabs.vue"
	import {
		client
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				tabs: ['实时气象', '基本信息', '作物信息'],
				current: 0,
				swiperCurrent: 0,
				tabsHeight: 0,
				dx: 0,
				deviceId: 'smart_01',
				productId: '20201015170538',
				multi: [],
				wetherData: [{
						imgUrl: '/images/index/roomtemp.png',
						text: '湿度',
						value: '30℃',
						prop: 'CJ01_roomhumi01',
					},
					{
						imgUrl: '/images/index/roomtemp.png',
						text: '温度',
						value: '30℃',
						prop: "CJ01_roomtemp01"
					},
					{
						imgUrl: '/images/index/roomtemp.png',
						text: '光照',
						value: '30℃',
						prop: "CJ01_strength01"
					},
					{
						imgUrl: '/images/index/roomtemp.png',
						text: '风速',
						value: '30℃',
						prop: "CJ01_windsped01"
					},
					{
						imgUrl: '/images/index/roomtemp.png',
						text: '风向',
						value: '30℃',
						prop: "CJ01_winddire01"
					},
					{
						imgUrl: '/images/index/roomtemp.png',
						text: '实况',
						value: '30℃'
					}
				],
			}
		},
		components: {
			QSTabs
		},
		computed: {
			noticeText() {
				return this.$store.state.noticeText
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'X-Access-Token',
				success:(res)=> {
					this.getUser()
				},
				fail() {
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
			})
		},
		onShow() {
			this.getMulti()
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			change(index) {
				this.swiperCurrent = index;
			},
			transition({
				detail: {
					dx
				}
			}) {
				this.$refs.tabs.setDx(dx);
			},
			animationfinish({
				detail: {
					current
				}
			}) {
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			//获取用户信息
			async getUser() {
				const detail = await client('GET', `/user/detail`)
				const user = await client('GET', `/authorize/me`)
				const id = user.result.dimensions[1].id
				this.$store.dispatch('getUser',{...detail.result,id})
			},
			//获取实时气象
			async getMulti() {
				const param = {
					dashboard: "device",
					object: this.productId,
					measurement: "properties",
					dimension: "history",
					params: {
						deviceId: `${this.deviceId}`,
						history: 1
					},
				};
				const res = await client('POST', 'dashboard/_multi', param)
				const _multi = res.result
				const list = []
				_multi.forEach((item, index) => {
					const multiValue = item.data.value
					this.wetherData.map(item => {
						if (item.prop === multiValue.property) {
							const name = item.text
							const url = `/static/images/index/${multiValue.property.slice(5, -2)}.png`
							list.push({
								...multiValue,
								name,
								url
							})
						}
					})
				})
				this.multi = list
			},
		}
	}
</script>

<style scoped>
	uni-swiper {
		min-height: 900rpx;
	}

	.index-box {
		background: #FEFEFE;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.view-img {
		width: 100%;
		background: linear-gradient(180deg, #1985FF 0%, rgba(90, 211, 252, 0) 100%);
	}

	.title {
		font-size: 30rpx;
		color: #fff;
		padding-bottom: 20rpx;
	}

	.video-box {
		width: 100%;
		height: 325rpx;
		background: rgba(0, 0, 0, 0.4);
		box-shadow: 1px 2px 10px 3px rgba(0, 0, 2, 0.05);
		border-radius: 12rpx;
		position: relative;
	}

	.inner-image {
		width: 100%;
		height: 100%;
	}

	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100rpx;
		height: 100rpx;
		z-index: 99;
	}

	.video-box .play image {
		width: 100%;
		height: 100%;
		border-radius: 12rpx;
	}

	.tab1-item {
		width: 330rpx;
		height: 190rpx;
		background: #F9F9F9;
		border-radius: 12rpx;
		padding-left: 40rpx;
	}

	.tab1-item .num {
		color: #57A5FD;
		font-size: 36rpx;
	}

	.roomtemp {
		font-size: 28rpx;
	}

	.img-box image {
		width: 60rpx;
		height: 60rpx;
	}

	.tab2 {
		width: 100%;
		height: 320rpx;
		padding: 60rpx;
		background: #F9F9F9;
		border-radius: 12rpx;
	}

	.tab2-item {
		min-width: 45%;
		text-align: left;
		font-size: 28rpx;
		margin-bottom: 50rpx;
	}

	.tab2-item text:last-child {
		color: #57A5FD;
	}

	.tab2-item image {
		width: 34rpx;
		height: 34rpx;
		vertical-align: middle;
	}
</style>
