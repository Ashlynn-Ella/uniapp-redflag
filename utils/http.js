export const baseUrl = 'https://aiot.chinaredflag.cn/api'
export const url = 'https://aiot.chinaredflag.cn/php'

export const http = (method, url, data,loading) => {
	if(!loading){
		uni.showLoading({
		    title: '加载中',
			image:'/static/images/loading-spin.svg'
		});
	}
	return new Promise((resolve, reject) => {
		uni.request({
			method,
			url,
			data,
			header: {
				'content-type': 'application/json'
			},
			success: (res) => {
				resolve(res.data)
			},
			fail() {
				reject({
					message: '请求失败'
				})
			},
			complete:()=>{
				uni.hideLoading()
			}
		});
	})
}

export const client = (method, endpoint, data,loading) => {
	if(!loading){
		uni.showLoading({
		    title: '加载中',
			image:'/static/images/loading-spin.svg'
		});
	}
	try {
		var value = uni.getStorageSync('X-Access-Token')
		if (value) {
			return new Promise((resolve, reject) => {
				uni.request({
					method,
					url:`${baseUrl}/${endpoint}`,
					data,
					header: {
						'content-type': 'application/json',
						'X-Access-Token': value
					},
					success(res) {
						if (res.data.status === 401) {
							uni.showToast({
							    title: res.data.message,
							    duration: 1000
							});
							uni.removeStorage({
								key: 'X-Access-Token'
							})
							uni.navigateTo({
								url: "/pages/login/login"
							})
						} else if (res.data.status === 200) {
							resolve(res.data)
						} else {							
							resolve(res.data)
						}
					},
					fail(res) {
						uni.showToast({
						    title: '网络错误',
						    duration: 1000
						})
						reject(res)
					},
					complete:()=>{
						uni.hideLoading()
					}
				})
			})
		} else {
			uni.hideLoading()
			uni.navigateTo({
				url: "/pages/login/login"
			})
		}
	} catch (e) {
		
	}
}
