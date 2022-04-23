//配置路由的地方
import Vue from 'vue';
import VueRouter from 'vue-router'
//引入store
import store from '@/store'
//使用插件
Vue.use(VueRouter);
//先把VueRouter原型对象的push，保存一份
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
//引入路由信息
import routes from './routes'
//重写push|replace
//第一个参数：告诉原来push方法，你往哪里跳（传递哪些参数）
//第二个参数：成功回调
//第三个参数：失败的回调
//call|apply区别
//相同点：都可以调用函数一次，都可以篡改函数的上下文一次
//不同点：call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject);
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject);
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}
//配置路由
//对外默认暴露一个VueRouter的实例
//在路由配置的时候，对外暴露一个Router类的一个实例
const router = new VueRouter({
    //配置路由
    routes,
    //滚动行为的设置
    scrollBehavior(to, from, savedPosition) {
        //设置Y轴的起点【y属性值没有负数】
        //当然滚动行为也可以设置x轴的
        return { y: 0 }
    }
})
//全局守卫使用:全局守卫它router【VueRouter类的一个实例】的一个方法
//全局守卫【前置守卫:在路由跳转之前会执行一次】
router.beforeEach(async (to, from, next) => {
    //to:要去哪里【路由信息】
    //from:从哪里来【路由信息】
    //next:是一个函数，放行函数
    //1:next()执行不传递参数【放行：该去哪里去哪里】 2:next(path):放行，放行到准确的某一个路由当中   
    next()
    //获取仓库中的token,因为如果用户登录了，仓库中一定是有token，用户没有登录，没有token
    let token = store.state.user.token;
    let name = store.state.user.userInfo.name;
    //用户登录了
    if (token) {
        //已经登录而且还想去登录------不行
        if (to.path == "/login" || to.path == '/register') {
            next('/');
        } else {
            //已经登陆了,访问的是非登录与注册
            //登录了且拥有用户信息放行
            if (name) {
                next();
            } else {
                //登陆了且没有用户信息
                //在路由跳转之前获取用户信息且放行
                try {
                    await store.dispatch('getUserInfo');
                    next();
                } catch (error) {
                    //token失效从新登录
                    await store.dispatch('logout');
                    next('/login')
                }
            }
        }
    } else {
        //未登录：不能去交易相关、不能去支付相关【pay|paysuccess】、不能去个人中心
        //未登录去上面这些路由-----登录
        let toPath = to.path;
        if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
            //把未登录的时候向去而没有去成的信息，存储于地址栏中【路由】
            next('/login?redirect=' + toPath);
        } else {
            //去的不是上面这些路由（home|search|shopCart）---放行
            next();
        }
    }
})


export default router
