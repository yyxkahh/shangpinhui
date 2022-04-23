import { reqCategoryList, reqGetBannerList, reqGetFloorList } from "@/api";
//home模块的小仓库
//state:仓库存储数据的地方
const state = {
    //state中的数据默认初始值别瞎写，服务器返回的是对象还是数组 （根据接口返回值初始化的）
    getCategoryList: [],
    //bannerList：存储首页的轮播图的数据
    bannerList: [],
    //floor：存储Floor（楼层组件的）数据
    floorList: []
};
//mutations:修改state的唯一手段
const mutations = {
    CATEGORYLIST(state, getCategoryList) {
        state.getCategoryList = getCategoryList;
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList
    }
};
//action:处理action，可以书写自己的业务逻辑，也可以处理异步
const actions = {
    // // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
    async getCategoryList({ commit }) {
        let result = await reqCategoryList();
        if (result.code == 200) {
            commit('CATEGORYLIST', result.data)
        }
    },
    //获取首页banner的数据【轮播图】
    async getBannerList({ commit }) {
        let result = await reqGetBannerList();
        if (result.code == 200) {
            commit('GETBANNERLIST', result.data)
        }
    },
    //获取Floor(楼层)数据
    async getFloorList({ commit }) {
        let result = await reqGetFloorList();
        if (result.code == 200) {
            commit('GETFLOORLIST', result.data)
        }
    }
};
//getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
const getters = {};
export default {
    state,
    mutations,
    actions,
    getters
}