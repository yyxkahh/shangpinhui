import { reqShopCarList, reqDeleteCartById, reqUppdateCartChecked } from "@/api"
import { Promise } from "core-js"
const state = {
    shopList: []
}
const mutations = {
    GETSHOPCART(state, shopList) {
        state.shopList = shopList
    }
}
const actions = {
    //获取购物车数据的方法
    async getShopCart({ commit }) {
        let result = await reqShopCarList()
        if (result.code == 200) {
            commit('GETSHOPCART', result.data)
        }
    },
    //删除购物车中某一个的产品
    async deleteCartById({ commit }, skuId) {
        let result = await reqDeleteCartById(skuId)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //修改购物车中某一个的产品的选中状态
    async uppdateCartChecked({ commit }, { skuId, isChecked }) {
        let result = await reqUppdateCartChecked(skuId, isChecked)
        if (result.code == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //删除购物车所有选中的产品
    deleteCartByChecked({ dispatch, getters }) {
        let arr = []
        //获取购物车里面全部商品进行遍历
        getters.shopCartData.cartInfoList.forEach((item) => {
            //如果产品被选中才删除
            if (item.isChecked == 1) {
                let promise = dispatch('deleteCartById', item.skuId)
                arr.push(promise)
            }
        })
        return Promise.all(arr)
    },
    //修改购物车全部产品的选中状态
    updateAllCart({ dispatch, state }, isChecked) {
        //在action当中如何获取到仓库中的存储的数据
        //1:获取到全部购物车的数据【数组：六个元素】
        //2:触发updateChecked这个action六次【全部产品都修改了】
        //3:updateAllCart,返回一个Promise，告诉组件成功了，还是败了【组件才能继续写别的业务】
        //遍历购物车里面产品：购物车里面有多少产品，回调就执行多少次
        let arr = []
        state.shopList[0].cartInfoList.forEach((item) => {
            //在当前action内部，调用顶部action执行N次
            let promise = dispatch('uppdateCartChecked', { skuId: item.skuId, isChecked })
            arr.push(promise)
        })
        //如果不书写return，返回结果永远undefined，永远是真
        //Promise.all执行,参数需要的是一个数组，数组里面每一个都是promise，如果都成功，promise返回即为成功结果
        //如果有一个【修改状态】promise失败返回的结果即为失败
        return Promise.all(arr)//可以保证 updateAllCart返回的是promise【成功、失败】
    }
}
const getters = {
    //简化购物车的数据
    //当前购物车模块的state，并非大仓库的state数据【只是包含购物车state数据】
    shopCartData(state) {
        return state.shopList[0] || {}
    }
}
export default {
    state,
    mutations,
    actions,
    getters
}