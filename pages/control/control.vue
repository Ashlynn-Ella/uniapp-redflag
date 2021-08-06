<template>
	<view class="control-box">
		<view class="tabs-box">
			<s-tabs effect @change="tabChange" barHeight="6" barWidth="80" background="#1985FF" color="#ffffff"
				activeColor="#ffffff" barColor="#ffffff">
				<s-tab :title="'设备控制'"></s-tab>
				<s-tab :title="'水肥控制'"></s-tab>
			</s-tabs>
		</view>
		<view style="padding-top: 80rpx;">
			<uni-notice-bar showIcon="true" scrollable="true" backgroundColor="#ee0a24" color="#fff" single="true"
				v-if="noticeText" :text="noticeText"></uni-notice-bar>
			<s-dialog></s-dialog>
			<view class="tab1-inner" v-if="activeTab===0">
				<view class="flex-btw mt-30">
					<view class="select-box">
						<device-select @hisFun="getOptions"></device-select>
					</view>
					<view class="away-pick-box">
						<uni-data-picker v-model="value" :localdata="options" @change="awayChange"></uni-data-picker>
					</view>
				</view>
				<view class="control-device container flex-btw">
					<view class="device-item flex-btw">
						<view class="left flex-clumn" @click="detailOpen">
							<text :class="['mb-20',CJ01_emerstop01?'':'close']">E-stop</text>
							<text :class="[CJ01_emerstop01?'':'close']">{{!CJ01_emerstop01?'紧急停止':'复位'}}</text>
						</view>
						<evan-switch v-model="CJ01_emerstop01" :size="16" inactive-color="#ccc" active-color="#ee0a24"
							@change="stopChange" />
					</view>
					<view class="device-item flex-btw">
						<view class="left flex-clumn" @click="detailOpen">
							<image v-if="CJ01_lighting01" src="/static/images/data/lighting.png" />
							<image v-else src="/static/images/data/lighting01.png" />
							<text :class="[CJ01_lighting01?'':'close']">照明灯</text>
						</view>
						<evan-switch v-model="CJ01_lighting01" :size="16" inactive-color="#ccc" active-color="#1985FF"
							@change="lightChange" :disabled="disabled" />
					</view>
					<view class="device-item flex-btw">
						<view class="left flex-clumn" @click="detailOpen">
							<image v-if="CJ01_cyclefan01" src="/static/images/data/cyclefan.png" />
							<image v-else src="/static/images/data/cyclefan01.png" />
							<text :class="[CJ01_cyclefan01?'':'close']">环流风机</text>
						</view>
						<evan-switch v-model="CJ01_cyclefan01" :size="16" inactive-color="#ccc" active-color="#1985FF"
							@change="cycleChange" :disabled="disabled" />
					</view>
					<view class="device-item flex-btw">
						<view class="left flex-clumn" @click="detailOpen">
							<image v-if="CJ01_coolpump01" src="/static/images/data/coolpump.png" />
							<image v-else src="/static/images/data/coolpump01.png" />
							<text :class="[CJ01_coolpump01?'':'close']">湿帘水泵</text>
						</view>
						<evan-switch v-model="CJ01_coolpump01" :size="16" inactive-color="#ccc" active-color="#1985FF"
							@change="coolChange" :disabled="disabled" />
					</view>
				</view>
			</view>

			<view class="tab2-inner container" v-else>
				<view class="banner-box flex-clumn">
					<view class="mb-40 title">
						<text>水肥一体化灌溉设备</text>
						<view class="open-btn center" @click="onlineChange">
							<image v-if="open" src="/static/images/control/on.png" />
							<image v-else src="/static/images/control/off.png" />
						</view>
					</view>
					<image src="/static/images/control/water.png" />
					<view class="vul-box flex-btw">
						<view class="vul-ph flex-clumn">
							<view class="mb-30">
								<text class="vul-blue">7</text>
							</view>
							<text>PH参数值</text>
						</view>
						<view class="vul-ec flex-clumn">
							<view class="mb-30">
								<text class="vul-blue">0.0μs/cm</text>
							</view>
							<text>EC参数值</text>
						</view>
					</view>
				</view>
				<view v-if="open">
					<view class="btn-box flex-btw mt-40">
						<text>{{status?'自动模式':'手动模式'}}</text>
						<evan-switch v-model="status" :size="18" @change="statusChange" inactive-color="#ccc"
							active-color="#1985FF" />
					</view>
					<view class="input-list mt-40">
						<uni-list>
							<uni-list-item title="氮肥">
								<template slot="footer">
									<uni-number-box :disabled="wtDisabled" v-model="value1" />
								</template>
							</uni-list-item>
							<uni-list-item title="磷肥">
								<template slot="footer">
									<uni-number-box :disabled="wtDisabled" v-model="value2" />
								</template>
							</uni-list-item>
							<uni-list-item title="钾肥">
								<template slot="footer">
									<uni-number-box :disabled="wtDisabled" v-model="value3" />
								</template>
							</uni-list-item>
							<uni-list-item title="微量元素">
								<template slot="footer">
									<uni-number-box :disabled="wtDisabled" v-model="value4" />
								</template>
							</uni-list-item>
						</uni-list>
					</view>
					<view class="btn-wrapper mt-40" @click="toStand">标准配比</view>
				</view>
			</view>
		</view>
		<s-toast></s-toast>
	</view>
</template>

<script>
	import DeviceSelect from '../../components/custom/device-select.vue'
	import {
		client,
		http,
		url
	} from '../../utils/http.js'
	export default {
		data() {
			return {
				value: 1,
				options: [{
						"value": 1,
						"text": "手动控制"
					},
					{
						"value": 0,
						"text": "自动控制"
					}
				],
				activeTab: 0,
				CJ01_lighting01: true,
				CJ01_coolpump01: true,
				CJ01_cyclefan01: true,
				CJ01_emerstop01: false,
				disabled: false,
				deviceId: "",
				productId: "",
				disabled: false,
				autoDisabled: false,
				status: false,
				open: true,
				wtDisabled: false,
				value1: 2,
				value2: 1,
				value3: 2,
				value4: 1,
			}
		},
		components: {
			DeviceSelect
		},
		computed: {
			noticeText() {
				return this.$store.state.noticeText
			}
		},
		onPullDownRefresh() {
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			tabChange(name, title) {
				this.activeTab = name
			},
			getOptions(value) {
				this.deviceId = value.deviceId.value
				this.productId = value.productId
				this.getStatus()
				this.getStopStatus()
				this.getAutoStatu()
			},
			detailOpen() {},
			stopChange(value) {
				uni.showModal({
					title: '提示',
					content: `确定${!this.CJ01_emerstop01 ? '紧急停止' : '复位'}设备吗？`,
					success: (res) => {
						if (res.confirm) {
							this.putStatus('CJ01_emerstop01', value)
						} else if (res.cancel) {
							this.CJ01_emerstop01 = !value
							uni.showToast({
								title: '取消操作',
								duration: 500
							});
						}
					}
				})
			},
			lightChange(value) {
				this.putStatus('CJ01_lighting01', value)
			},
			cycleChange(value) {
				this.putStatus('CJ01_cyclefan01', value)
			},
			coolChange(value) {
				this.putStatus('CJ01_coolpump01', value)
			},
			//手自动控制
			awayChange(e) {
				const des = e.detail.value[0].value === 1 ? true : false
				this.putStatus('CJ01_manuauto01', des)
			},

			//获取按钮的状态
			getStatus() {
				const propList = ["CJ01_lighting01", "CJ01_coolpump01", "CJ01_cyclefan01"]
				propList.forEach(async item => {
					const url =
						`device-instance/${this.deviceId}/properties/_query?pageIndex=0&pageSize=1&sorts[0].name=timestamp&sorts[0].order=desc&terms[0].column=property&terms[0].value=${item}`
					const res = await client('GET', url)
					const data = res.result.data[0]
					const value = data.value === 'false' ? false : true
					this[item] = value
				})
			},
			//获取紧急停止的状态
			async getStopStatus() {
				wx.getStorage({
					key: 'X-Access-Token',
					success: (res) => {
						http(
							"GET",
							`${url}/status.php?token=${res.data}&deviceId=${this.deviceId}&productId=${this.productId}`
						).then(res => {
							if (res.statusCode === 200) {
								this.CJ01_emerstop01 = !res.data.status
								this.disabled = !res.data.status
								this.autoDisabled = !res.data.status
							}
						})
					}
				})
			},
			//获取手自动状态
			async getAutoStatu() {
				const url =
					`device-instance/${this.deviceId}/properties/_query?pageIndex=0&pageSize=1&sorts%5B0%5D.name=timestamp&sorts%5B0%5D.order=desc&terms%5B0%5D.column=property&terms%5B0%5D.value=CJ01_manuauto01`
				const res = await client('GET', url)
				const away = res.result.data[0].value === 'true' ? 1 : 0
				this.CJ01_manuauto01 = away
				this.disabled = !away
			},
			//控制所有按钮开关
			async putStatus(propId, value) {
				this.disabled = true
				const results = await client(
					"PUT",
					`/device/instance/${this.deviceId}/property`, {
						[propId]: value
					}
				);
				if (results.code === 'success') {
					if (propId === 'CJ01_emerstop01') {
						if (results.result[0].code === 1) {
							this.getStatus()
							this.disabled = value
							this.autoDisabled = value
							this[propId] = value
							uni.showToast({
								title: '操作成功',
								duration: 2000
							});
						} else {
							this[propId] = !value
							uni.showToast({
								title: '操作失败',
								duration: 2000
							});
						}
					} else if (propId === 'CJ01_manuauto01') {
						uni.showToast({
							title: '操作成功',
							duration: 2000
						});
						this.disabled = !value
					} else {
						uni.showToast({
							title: '操作成功',
							duration: 2000
						});
						const res = results.result[0];
						value = res[propId];
						this[propId] = value
						setTimeout(() => {
							this.disabled = false
						}, 1000);
					}
				} else {
					setTimeout(() => {
						this.disabled = false
					}, 500);
					if (propId === 'CJ01_emerstop01') {
						this.getStopStatus()
					} else if (propId === 'CJ01_manuauto01') {
						this.getAutoStatu()
					} else {
						client(
							"GET",
							`/device-instance/${this.deviceId}/properties/_query?pageIndex=0&pageSize=1&sorts[0].name=timestamp&sorts[0].order=desc&terms[0].column=property&terms[0].value=${propId}`
						).then((res) => {
							const value = res.result.data[0].value === "true" ? true : false;
							setTimeout(() => {
								this.disabled = false
								this[propId] = value
							}, 500);

						});
					}
					uni.showToast({
						title: `操作失败,${results.message}`,
						duration: 2000
					});
				}
			},
			//水肥控制
			onlineChange() {
				this.open = !this.open
			},
			statusChange(value) {
				this.wtDisabled = value
			},
			toStand() {
				uni.showModal({
					title: '提示',
					content: '确定标准配比吗?',
					success:(res)=> {
						if (res.confirm) {
							this.value1 = 2
							this.value2 = 1
							this.value3 = 2
							this.value4 = 1
						}
					}
				})

			}
		},
	}
</script>

<style>
	.device-item {
		width: 320rpx;
		background: #FFFFFF;
		box-shadow: 1px 2px 10px 3px rgba(0, 0, 2, 0.05);
		border-radius: 12px;
		padding: 40rpx;
		margin-bottom: 40rpx;
	}

	.device-item .left image {
		width: 60rpx;
		height: 60rpx;
		margin-bottom: 20rpx;
	}

	.device-item .left text {
		font-size: 26rpx;
	}

	.away-pick-box {
		width: 45%;
		margin: 0 auto;
	}

	.popup-box {
		padding: 50rpx 20rpx 0;
	}

	.popup-box .title view {
		font-size: 24rpx;
	}

	.popup-box .title01 {
		font-size: 36rpx;
		font-weight: 500;
	}

	.step-box {
		height: 280rpx;
		overflow-y: scroll;
	}

	.banner-box {
		width: 100%;
		background: #FFFFFF;
		box-shadow: 1px 2px 10px 3px rgba(0, 0, 2, 0.05);
		border-radius: 12px;
		padding: 40rpx;
	}

	.banner-box image {
		height: 200rpx;
		margin-bottom: 75rpx;
	}

	.title {
		text-align: center;
		width: 100%;
		position: relative;
	}

	.banner-box .open-btn {
		position: absolute;
		right: 0;
		top: 0;
	}

	.banner-box .open-btn image {
		width: 50rpx;
		height: 50rpx;
		margin-bottom: 0;
	}

	.banner-box .open-btn:hover {
		background-color: none;
	}

	.vul-box {
		width: 100%;
	}

	.close {
		color: #999999;
	}

	.vul-ph {
		border-right: 2rpx solid #EDEFF1;
	}

	.vul-ph,
	.vul-ec {
		width: 50%;
		height: 105rpx;
	}

	.btn-box {
		background: #FFFFFF;
		box-shadow: 1px 2px 10rpx 3rpx rgba(0, 0, 2, 0.05);
		border-radius: 12rpx;
		padding: 32rpx 40rpx;
	}

	.input-list {
		background: #FFFFFF;
		box-shadow: 1px 2px 10px 3px rgba(0, 0, 2, 0.05);
		border-radius: 12px;
	}

	.btn-wrapper {
		width: 100%;
		height: 105rpx;
		font-size: 32rpx;
		font-weight: 400;
		color: #FFFFFF;
		background: #FFFFFF linear-gradient(270deg, #57A5FD 0%, #5AD3FC 100%);
		box-shadow: 1rpx 2rpx 10rpx 3rpx rgba(0, 0, 2, 0.05);
		border-radius: 50rpx;
		text-align: center;
		line-height: 105rpx;
	}

	.open-btn {
		width: 50rpx;
		height: 50rpx;
		position: relative;
	}

	.open-btn image {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
