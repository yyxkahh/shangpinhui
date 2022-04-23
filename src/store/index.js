//仓库--vuex
import Vue from "vue";
import Vuex from 'vuex'
//使用插件
Vue.use(Vuex);
//引入相关模块的小仓库
import home from './home';
import search from './search';
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade'
//对外暴露Store类的一个实例
export default new Vuex.Store({
    modules: {
        home,
        search,
        detail,
        shopcart,
        user,
        trade
    }
})