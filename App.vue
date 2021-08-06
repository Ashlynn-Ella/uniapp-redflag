<script>
	export default {
		globalData: {
			text: 'text'
		},
		onLaunch: function() {
			console.log(getApp().globalData.text) 
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "/static/scss/common.scss";
	@import "@/uni_modules/s-ui/styles/index.scss";

	.uni-calendar--fixe{
		z-index: 999 !important;
	}
</style>
