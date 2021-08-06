<template>
	<view class="flex-btw">
		<view :class="['data-pick-box',show ?'':showDate?'two-pick':'one-pick']">
			<uni-data-picker v-model="deviceId.value" :localdata="DeviceList" @change="deviceChange"></uni-data-picker>
		</view>
		<view class="data-pick-box" v-if="show">
			<uni-data-picker v-model="prop.value" :localdata="propsList" @change="propChange"></uni-data-picker>
		</view>
		<view class="date-box" v-if="showDate">
			<uni-datetime-picker type="daterange" :start-placeholder="startDate" :end-placeholder="endDate"
				:value="dateTime" :end="maxDate" @change="dateChange"></uni-datetime-picker>
		</view>
	</view>
</template>

<script>
	import {
		client
	} from '../../utils/http.js'
	import dayjs from "dayjs"
	export default {
		data() {
			return {
				dateTime: [],
				date: 15,
				deviceId: {
					text: '红旗智慧农业控制器',
					value: 'smart_01'
				},
				DeviceList: [{
					text: '红旗智慧农业控制器',
					value: 'smart_01'
				}],
				propsList: [],
				prop: {
					text: '',
					value: ''
				},
				productId: '20201015170538',
				startDate: "",
				endDate: "",
				maxDate:""
			}
		},
		created() {
			this.init()
		},
		props:['show','showDate'],
		methods: {
			async init() {
				await this.initDevice()
				await this.initProps()
				this.maxDate = new Date().getTime()
				this.endDate = dayjs(new Date().getTime()).format("YYYY-MM-DD")
				this.startDate = dayjs(new Date().getTime() - 15 * 1000 * 24 * 3600).format(
					"YYYY-MM-DD"
				);
				this.dateTime = [this.startDate,this.endDate]
				const {
					date,
					deviceId,
					prop,
					productId,
					propsList,
					dateTime
				} = this

				this.$emit('hisFun', {
					date,
					deviceId,
					prop,
					productId,
					propsList,
					dateTime
				})
			},
			async initDevice() {
				const deviceRes = await client('GET', 'device-instance/_query?pageSize=200',{},true)
				const deviceList = deviceRes.result.data
				this.productId = deviceList.filter(item => item.id === this.deviceId.value)[0].productId
				const list = []
				deviceList.forEach(async item => {
					list.push({
						text: item.name,
						value: item.id,
					})
					this.DeviceList = list
				})
			},
			async initProps() {
				const res = await client('GET', `/api/v1/device/${this.deviceId.value}/_detail`,{},true)
				if(res){
					const propsList = this.formatProps(res.result.metadata)
					this.propsList = propsList
					this.prop = this.propsList[0]
				}			
			},
			//格式化属性
			formatProps(obj) {
				let props = JSON.parse(obj).properties;
				let list = []
				props.forEach(item => {
					list.push({
						text: item.name,
						value: item.id,
						unit: item.valueType.unit
					})
				})
				return list
			},
			async deviceChange(e) {
				this.deviceId = e.detail.value[0]
				await this.initProps()
				const {
					date,
					deviceId,
					prop,
					productId,
					dateTime,
					propsList
				} = this

				this.$emit('hisFun', {
					date,
					deviceId,
					prop,
					productId,
					dateTime,
					propsList
				})
			},
			propChange(e) {
				const value = e.detail.value[0]
				this.prop = value
				const {
					date,
					deviceId,
					prop,
					productId,
					propsList,
					dateTime
				} = this

				this.$emit('hisFun', {
					date,
					deviceId,
					prop,
					productId,
					propsList,
					dateTime
				})
			},

			dateChange(value) {
				this.dateTime = value
				this.date = new Date(new Date(value[1]) - new Date(value[0])) / (1000 * 60 * 60 * 24)
				const {
					date,
					deviceId,
					prop,
					productId,
					dateTime,
					propsList
				} = this

				this.$emit('hisFun', {
					date,
					deviceId,
					prop,
					productId,
					dateTime,
					propsList
				})
			}
		}
	}
</script>

<style lang="scss">
	.data-pick-box {
		width: 25%;
		&.one-pick{
			width: 100%;
			margin: 0 auto;
		}
		&.two-pick{
			width: 50%;
		}
	}

	.date-box {
		width: 45%;
	}
</style>
