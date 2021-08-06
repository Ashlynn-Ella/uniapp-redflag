import Vue from 'vue'
import App from './App'
import sUi from '@/uni_modules/s-ui';
import store from './store'

Vue.prototype.$store = store


Vue.use(sUi, {
	// 是否给页面page全局混入一个onEmitPage钩子，使用this.$emitPage(pagePath,...args)触发
	useEmitPageMixin: true,
	// 替换uni默认的showLoading,hideLoading
	replaceUniLoading: true,
	// 替换uni默认的showToast,hideToast
	replaceUniToast: true,
	// 替换uni默认的showModal
	replaceUniModal: true,
	// 主题变量更改和追加，使用this.$sTheme('{primary}')
	theme: {
		parmay: 'blue'
	}
});



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
