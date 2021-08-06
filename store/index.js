import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import mutations from './mutations.js'


Vue.use(Vuex)

const store = new Vuex.Store({
    state:{//存放状态
        user:'',
		noticeText:''
    },
	mutations,
	actions
})
export default store