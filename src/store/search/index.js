//search模块的小仓库
//引入接口函数
import { reqSearchList } from '@/api';

//state:仓库存储数据的地方
const state = {
    searchList: {}
};
//mutations:修改state的唯一手段
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
    }
};
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    //获取搜索页面的数据
    async getSearchList({ commit }, parmas) {
        //注意:获取搜索页面的数据（请求接口），至少携带一个空对象才能获取数据
        let result = await reqSearchList(parmas)
        if (result.code == 200) {
            commit('GETSEARCHLIST', result.data);
        }
    }
};
//getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {
    //搜索模块【商品展示的数据】
    //state：它是当前小仓库（search）的state数据，没有home仓库中的state
    //只是当前仓库的state
    goodsList(state) {
        return state.searchList.goodsList || [];
    },
    //品牌数据
    tradeMarkList(state) {
        return state.searchList.trademarkList;
    },
    //平台属性
    attrsList() {
        return state.searchList.attrsList;
    }
};
export default {
    state,
    mutations,
    actions,
    getters
}