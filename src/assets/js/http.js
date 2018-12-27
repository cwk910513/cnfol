var axios = require('axios')
var qs = require('qs')

// 根据不同环境，获取具体的API地址（1：开发环境（dev），2：测试环境（test），3：生产环境（build））
var root = process.env.API_ROOT
console.log('根据不同环境获取的API地址：' + root)

// 自定义判断元素类型js
function toType (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// 过滤参数（去除参数中空格，或者为null的数据）
function filterNull(o) {
    for(var key in o) {
        if(o[key] === null) {
            delete o[key]
        }
        switch(toType(o[key])) {
            case 'string':
                o[key] = o[key].trim()
                break;
            case 'object':
                o[key] = filterNull(o[key])
                break;
            case 'array':
                o[key] = filterNull(o[key])
                break;
        }
    }
    return o;
}

export default {
    apiAxios(method, url, params, success, failed) {
        if(params) {
            params = filterNull(params)
        }
    
        // withCredentials  跨域请求是否提供凭据信息（cookie，HTTP认证及客户端SSL证明等）
        // 简单理解：当前请求为跨域类型时，是否在请求中协带cookie
        axios({
            method: method,
            url: url,
            data: method === 'POST' || method === 'PUT' ? qs.stringify(params) : null,
            params: method === 'GET' || method === 'DELETE' ? params : null,
            baseURL: root,
            withCredentials: false
        })
        .then(function(res) {
            if(res.code === 0) {
                if(success) {
                    success(res.data)
                }
            } else {
                if(failed) {
                    failed(res.data)
                } else {
                    window.alert('error：' + JSON.stringify(res.data))
                }
            }
        })
        .catch(function(err) {
            console.log(err)
            if(err) {
                window.alert('api error, HTTP CODE：')
                return
            }
        })
    }
}