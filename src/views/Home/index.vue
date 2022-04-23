<template>
  <div>
    <!-- 三级联动全局组件：三级联动已经注册为全局组件，因此不需要再引入 -->
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
    <Floor v-for="floor in floorList" :key="floor.id" :listInfo="floor"></Floor>
    <Brand></Brand>
  </div>
</template>

<script>
//引入其余的组件
import ListContainer from "./ListContainer";
import Recommend from "./Recommend";
import Rank from "./Rank";
import Like from "./Like";
import Floor from "./Floor";
import Brand from "./Brand";
//引入辅助函数
import { mapState } from "vuex";
export default {
  name: "Home",
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand,
  },
  //Home组件的组件挂载完毕，生命周期函数，通过Vuex发请求，获取Floor组件数据
  mounted() {
    //父组件的生命周期函数（mounted），在这里通知Vuex发请求【获取Floor组件需要的数据】
    //由于Home父组件的mounted中通知Vuex发请求，请求回来以后，Floor组件才遍历出来。
    //当父组件的mounted执行的时候，Floor组件可能没有遍历完毕
    this.$store.dispatch("getFloorList");
    /******************************登录成功向服务器发请求，获取用户信息****************************************/
  },
  computed: {
    ...mapState({
      floorList: (state) => state.home.floorList,
    }),
  },
};
</script>

<style>
</style>