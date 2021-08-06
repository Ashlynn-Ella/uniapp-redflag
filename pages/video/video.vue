<template>
	<view class="video-wrapper">
		<view class="video-box">
			<video autoplay="true" :src="url"></video>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:'https://open.ys7.com/v3/openlive/C78551342_3_2.m3u8?expire=1654831427&id=324871610329042944&t=5c8d6c9c446c22f27feb07820054aa2bad3311fdbbda81c09446d78fa2ed326d&ev=100'
			}
		},
		methods: {

		}
	}
</script>

<style>
page {
  background-color: #000;
  height: 100%;
}

.video-box {
  width: 100%;
  height: 600rpx;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
}

.video-box video {
  width: 100%;
}

mp-video-swiper {
  width: 100%;
  height: 100%;
}

.van-dropdown-menu__item {
  background-color: #1985FF;
  color: #fff;
}

.van-dropdown-menu__title {
  color: #fff !important;
}
</style>
