<template>
	<view class="data-box">
		<s-toast></s-toast>
		<view class="tabs-box">
			<s-tabs effect @change="tabChange" barHeight="6" barWidth="80" background="#1985FF" color="#ffffff"
				activeColor="#ffffff" barColor="#ffffff">
				<s-tab :title="'实时数据'"></s-tab>
				<s-tab :title="'历史数据'"></s-tab>
			</s-tabs>
		</view>
		<view style="padding-top: 80rpx;">
			<uni-notice-bar showIcon="true" scrollable="true" backgroundColor="#ee0a24" color="#fff" single="true"
				v-if="noticeText" :text="noticeText"></uni-notice-bar>
			<view v-if="activeTab===0">
				<view class="mt-30">
					<view class="select-box">
						<device-select @hisFun="getOptions"></device-select>
					</view>
				</view>
				<view class="flex-btw props-list container">
					<view class="props-item mb-30 flex-clumn" v-for="(item,index) in multi" :key="index">
						<image :src="item.url" />
						<text
							:class="['vul','mb-20','mt-40', item.value || item.value ===0 ?'':'close']">{{item.formatValue}}</text>
						<text :class="[item.value || item.value ===0?'':'close']">{{item.name}}</text>
					</view>
				</view>
			</view>
			<view class="container" v-else>
				<device-select @hisFun="getOptions" show="true" showDate="true"></device-select>
				<view class="charts-box mt-40">
					<qiun-data-charts type="area"
						:opts="{extra:{area:{type:'curve',addLine:true,gradient:true,opacity:0.8}}}"
						:chartData="chartsData" />
				</view>
				<view class="mt-40">
					<view class="panel container">
						<view class="echarts-title flex-center">
							<view class="round"></view>
							<view>{{deviceName}} {{propName}} {{date}}天内日走势图</view>
						</view>
						<view class="divider"></view>
						<view class="vul-list flex-btw-nowrap">
							<view class="vul-item flex-clumn">
								<text class="num">{{minValue}}</text>
								<text>最小值</text>
								<text>{{minTime}}</text>
							</view>
							<view class="vul-item flex-clumn">
								<text class="num">{{avgValue}}</text>
								<text>平均值</text>
							</view>
							<view class="vul-item flex-clumn">
								<text class="num">{{maxValue}}</text>
								<text>最大值</text>
								<text>{{maxTime}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import uniDatetimePicker from '@/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue'
	import qiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'
	import qiunLoading from '@/uni_modules/qiun-data-charts/components/qiun-loading/qiun-loading.vue'
	import DeviceSelect from '../../components/custom/device-select.vue'
	import {
		client
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				activeTab: 0,
				deviceId: '',
				prop: '',
				productId: '',
				deviceName: '红旗智慧农业控制器',
				propName: '',
				date: 5,
				minValue: 0,
				maxValue: 0,
				avgValue: 0,
				minTime: '',
				maxTime: '',
				chartsData: {},
				propList: [],
				multi: [{
					url: '/static/images/data/lighting.png',
					name: '照明灯',
					value: true,
					formatValue: '开'
				}],
			}
		},
		components: {
			qiunDataCharts,
			DeviceSelect,
			qiunLoading
		},
		onLoad() {

		},

		onPullDownRefresh() {
			this.getMulti()
			this.initHistory()
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		computed: {
			noticeText() {
				return this.$store.state.noticeText
			}
		},
		methods: {
			tabChange(name, title) {
				this.activeTab = name
			},

			//获取10天的历史数据
			async initHistory() {
				const url = `api/v1/device/${this.deviceId}/agg/AVG/${this.prop}/_query`
				const data = await client('POST', url, {
					interval: "1d",
					from: `now-${this.date}d`,
					to: "now",
					query: {
						pageSize: this.date,
					}
				})
				const time = []
				const vlaueList = []

				data.result.forEach(item => {
					time.push(item.time)
					vlaueList.push(item[this.prop])
				})
				const maxValue = Math.max(...vlaueList)
				const minValue = Math.min(...vlaueList) == 0 ? 0 : Math.min(...vlaueList)
				this.avgValue = ((maxValue + minValue) / 2).toFixed(2)
				this.minTime = data.result.filter(
					(item) => item[this.prop] == minValue
				)[0].time;
				this.maxTime = data.result.filter(
					(item) => item[this.prop] == maxValue
				)[0].time;
				this.maxValue = maxValue.toFixed(2)
				this.minValue = minValue.toFixed(2)
				this.chartsData = {
					categories: time,
					series: [{
						"name": this.propName,
						"data": vlaueList
					}]
				}
			},
			//获取子组件的参数
			getOptions(value) {
				const {
					date,
					prop,
					deviceId,
					productId,
					propsList
				} = value
				this.deviceName = deviceId.text
				this.propName = prop.text
				this.deviceId = deviceId.value
				this.prop = prop.value
				this.date = date
				this.productId = productId
				this.propList = propsList
				this.initHistory()
				this.getMulti()
				this.initWebsocket()
			},

			//获取历史数据
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
				_multi.forEach(item => {
					const multiValue = item.data.value
					const name = this.propList?.filter(prop => prop.value === multiValue.property)[0].text
					const unit = this.propList?.filter(prop => prop.value === multiValue.property)[0].unit
					const url = multiValue.value || multiValue.value === 0 ?
						`/static/images/data/${multiValue.property.slice(5, -2)}.png` :
						`/static/images/data/${multiValue.property.slice(5, -2)}01.png`
					list.push({
						...multiValue,
						name,
						unit,
						url
					})
				})
				this.multi = list
			},
			//连接websocket
			initWebsocket() {
				uni.getStorage({
					key: 'X-Access-Token',
					success: (res) => {
						uni.connectSocket({
							url: `wss://aiot.chinaredflag.cn/messaging/${res.data}`,
							header: {
								'content-type': 'application/json'
							},
							method: 'GET',
							success: (res) => {
								console.log(res)
							}
						})
						this.onSocketOpen()
					}
				})
			},
			onSocketOpen() {
				let socketMsgQueue = [{
					type: "sub", //固定为sub
					topic: `/device/${this.productId}/${this.deviceId}/message/property/report`,
					id: `request-data`
				}, {
					type: "sub", //固定为sub
					topic: `/rule-engine/device/alarm/${this.productId}/${this.deviceId}/1382229364221140992`,
					"id": "request-notice01"
				}]
				uni.onSocketOpen(res => {
					for (let i = 0; i < socketMsgQueue.length; i++) {
						this.sendSocketMessage(JSON.stringify(socketMsgQueue[i]))
					}
				})
				uni.onSocketMessage(res => {
					const data = JSON.parse(res.data)
					if (data.requestId === 'request-data') {
						let prop = data.payload.properties
						const list = this.multi
						list.forEach(item => {
							if (item.property === Object.keys(prop)[0]) {
								let value = prop[item.property]
								let formatValue
								let unit = item.unit ? item.unit : ''
								if (typeof value === 'boolean') {
									if (item.property === 'CJ01_manuauto01') {
										formatValue = value ? '手动' : '自动'
									} else {
										formatValue = value ? '开' : '关'
									}
								} else {
									value = value === 0 ? 0 : typeof value === 'string' ? value : value
										.toFixed(1)
									formatValue = (value + unit)
								}
								item.formatValue = formatValue
							}
						})
						this.multi = list
					} else if (data.requestId === 'request-notice01') {
						const res = data.payload
						const noticeText = `${res.productName}：${res.alarmName}`
						this.$store.dispatch('saveNotice', noticeText)
						setTimeout(() => {
							this.$store.dispatch('saveNotice', null)
						}, 5000)
					}
				})
			},
			sendSocketMessage(msg) {
				uni.sendSocketMessage({
					data: msg
				})
			},
		}
	}
</script>

<style lang="scss">
	.data-box {
		background: #FEFEFE;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}

	.charts-box {
		width: 100%;
		height: 700rpx;
	}

	.column-box {
		width: 200rpx;
		height: 300rpx;
	}

	.props-item {
		width: 330rpx;
		height: 310rpx;
		background: #F9F9F9;
		border-radius: 12px;
	}


	.props-item image {
		width: 55rpx;
		height: 55rpx;
	}

	.props-item text.vul {
		color: #1985FF;
		font-size: 32rpx;
	}

	.pick-time-box {
		z-index: 199;
	}

	.echart {
		width: 100vw;
		height: 700rpx;
	}

	.echart image {
		width: 100%;
		height: 100%;
	}

	.panel {
		width: 100%;
		height: 310rpx;
		background: #FFFFFF;
		box-shadow: 1px 2px 10px 3px rgba(0, 0, 2, 0.05);
		border-radius: 12rpx;

		.divider {
			width: 100%;
			height: 2rpx;
			border-radius: 2rpx;
			background-color: #e3e3e3;
			margin: 20rpx 0 40rpx;
		}
	}

	.echarts-title {
		width: 100%;
		font-size: 28rpx;
		text-align: center;
	}

	.round {
		width: 10rpx;
		height: 10rpx;
		background: #57A5FD;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.vul-item text.num {
		color: #1985FF;
		font-size: 40rpx;
		line-height: 48rpx;
	}

	.vul-item text {
		font-size: 24rpx;
		line-height: 32rpx;
		text-align: center;
		margin-bottom: 10rpx;
	}


	#mychart-dom-bar {
		z-index: 0 !important;
	}

	.props-list .props-item .close {
		color: #ccc;
	}
</style>
