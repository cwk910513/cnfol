import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = 'http://127.0.0.1:8080'
axios.defaults.timeout = 10000

// axios 请求拦截
axios.interceptors.request.use( config => {
    // todo 设置loading
    return config;
}, error => {
    return Promise.reject(error);
});

// axios 响应拦截
axios.interceptors.response.use( response => {
   return response;
}, error => {
    return Promise.reject(error.response);
});

// 登录成功时的状态
function checkStatus (response) {
    // loading
    // 如果http状态码正常，则直接返回数据
    if (response && response.data.rCode === '0' && (response.status === 200 || response.status === 304 || response.status === 400)) {
        return response
        // 如果不需要除了data之外的数据，可以直接 return response.data
    }
    // 异常状态下，把错误信息返回去
    return {
        status: -404,
        msg: response.data.msg
    }
}
  
// 登录异常返回的信息
function checkCode (res) {
    // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
    if (res.status === -404) {
        console.log(res);
    }
    return res
}

export default {  
    post (url, data) {
        return axios({
            method: 'post',
            url,
            data: qs.stringify(data),
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                // 'Token': sessionStorage.getItem('token')
            }
        }).then( (response) => {
            return checkStatus(response)
        }).then( (res) => {
            return checkCode(res)
        })
    },
    get (url, params) {
        return axios({
            method: 'get',
            url,
            params, // get 请求时带的参数
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                // 'Token': sessionStorage.getItem('token')
            }
        }).then( (response) => {
            return checkStatus(response)
        }).then( (res) => {
            return checkCode(res)
        })
    }
}