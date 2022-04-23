//axios进行二次封装
import axios from "axios";
//引入进度条
import nprogress from "nprogress";
//start:进度条开始  done:进度条结束
//没有显示进度条是因为进度条样式没有引入
import 'nprogress/nprogress.css'
//在当前模块中引入store
import store from "@/store";
//创建axios实例[创建出来的实例即为axios，只不过可以配置一些东西]
const requests = axios.create({
    //可以给请求路径中添加一些参数
    baseURL: '/api',
    //设置请求时间(5s)
    timeout: 5000
});
//请求拦截器:在发请求之前可以检测到，可以干一些事情
requests.interceptors.request.use((config) => {
    //进度条开始
    nprogress.start();
    //config配置对象，这里面有请求头
    if (store.state.detail.uuid_token) {
        //请求头添加一个字段（userTempId）：和后台商量好的
        config.headers.userTempId = store.state.detail.uuid_token
    }
    //用户身份token
    if (store.state.user.token) {
        //请求头的这个属性token，和后台老师商量好的了，不能叫做别的名字
        config.headers.token = store.state.user.token
    }
    //config，请求拦截器的一个配置对象
    return config;
});
//响应拦截器：服务器的数据已经返回了，可以干一些事情
requests.interceptors.response.use((res) => {
    //成功的回调函数：服务器响应数据回来以后，响应拦截器可以检测到
    //进度条结束
    nprogress.done();
    return res.data;
}, (error) => {
    //响应失败的回调函数
    return Promise.reject(error);
});
export default requests;