/*
 * @Description: http请求失败翻译
 * @Author: 无痕
 * @Email: 350801869@qq.com
 * @Date: 2020-11-26 14:27:18
 * @LastEditTime: 2021-02-01 18:57:31
 * @LastEditors: 无痕
 */
const failMap = {
  400: '请求错误',
  401: '没有权限',
  403: '拒绝访问',
  404: '请求地址未发现',
  405: '请求方法未允许',
  406: '请求的格式不可得',
  408: '请求超时',
  410: '请求的资源被删除',
  422: '验证错误',
  500: '服务器端出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网关超时'
};

export default failMap;