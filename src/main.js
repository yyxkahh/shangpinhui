import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from '@/router'

//注册全局组件---三级联动
import TypeNav from '@/components/TypeNav'
//第一参数:全局组件名字  第二个参数：哪一个组件
Vue.component(TypeNav.name, TypeNav)
//注册全局组件的轮播图组件
import Carousel from '@/components/Carousel'
Vue.component(Carousel.name, Carousel)
//注册全局组件分页器
import Pagination from '@/components/Pagination'
Vue.component(Pagination.name, Pagination)
//引入全部的请求函数
import *as API from '@/api'
//引入仓库
import store from '@/store'
//引入serve.js (mock模拟数据)【需要代码执行一次】
import '@/mock/serve'
//引入swiper需要使用的样式[项目当中用到swiper的地方很多，样式引入一次即可
import "swiper/css/swiper.css"



/******************************************************************* */
//这部分区域专门讲解elementUI
//这种引入方式----引入全部的组件
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);


//按需引入相应使用的组件【按需引入注册组件的第一种方式】
import { Button, MessageBox } from 'element-ui'
//注册为全局组件---注册组件方式之一
Vue.component(Button.name, Button);


//注册弹框组件
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;



/*********************************************************************/
//图片懒加载
import VueLazyload from 'vue-lazyload'
//使用图片懒加载插件：自定义插件【Vue.use】
//Vue.use,回调用插件对象install方法，install方法会注入Vue构造函数
//插件里面：Vue.component、Vue.directive、Vue.prototype.$bus、Vue.filter等等
//在使用图片懒加载插件的时候，第二个参数：配置对象
//引入图片模块：JSON、图片默认对外暴露
import erha from '@/assets/images/1.gif'
//Vue.use的时候，这个插件给咱们提供一个全局指令v-lay
Vue.use(VueLazyload, {
  //设置图片懒加载默认图片
  loading: erha
})

//引入表单验证
import '@/validate'


Vue.config.productionTip = false
new Vue({
  render: h => h(App),
  beforeCreate() {
    //配置全局事件总线
    Vue.prototype.$bus = this
    //把全部的请求函数：作为Vue.prototype的属性，组件实例可以获取
    //请求函数只需要注册一次，可以在组件当中使用。
    Vue.prototype.$API = API
  },
  //注册路由 底下的写法kv一致省略v（router小写）
  //注册路由,给组件的身上添加了$router与$route两个属性
  router,
  //注册仓库，给每一个组件的身上添加$store属性
  store,
}).$mount('#app')
