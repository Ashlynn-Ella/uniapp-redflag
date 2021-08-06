export default {
	saveNotice(context,notice){
		context.commit('saveNotice',notice)
	},
	getUser(context,user){
		context.commit('getUser',user)
	}
}