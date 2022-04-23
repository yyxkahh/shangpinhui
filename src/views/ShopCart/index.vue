<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in shopList" :key="cart.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isChecked == 1"
              @click="changeChecked(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl" />
            <div class="item-msg">
              {{ cart.skuName }}
            </div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <!-- 购物车加减操的地方 -->
            <a class="mins" @click="handler('minus', -1, cart)">-</a>
            <!-- 用户输入地方幺蛾子一定多 -->
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="cart.skuNum"
              @input="handler('input', $event.target.value * 1, cart)"
            />
            <a class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCart(cart)">删除</a>
            <br />
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <!-- isCheck:计算出来的一个属性，在判断勾不勾选（布尔值） -->
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isChecks"
          @change="updateAllChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
//引入节流函数【按需加载】
//引入_把lodash全部引入进来
import throttle from "lodash/throttle";
export default {
  name: "ShopCart",
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.$store.dispatch("getShopCart");
    },
    //更新购物车商品数量
    handler: throttle(async function (type, disNum, cart) {
      //第一个参数：type,用来区分（加、减、文本框标记）
      //第二个参数:disNum,目前(加减按钮)，数量发生变化的数值,如果是表单元素disNum【最终数值 - 起始数值】
      //第三个参数:cart,点击的那个产品
      switch (type) {
        //加
        case "add":
          //disNum:数量变化的数值，带给服务器的
          disNum = 1;
          break;
        case "minus":
          //当前点击的产品个数如果大于1，带给服务器数量变化的数值 -1
          if (cart.skuNum > 1) {
            disNum = -1;
          } else {
            disNum = 0;
          }
          break;
        case "input":
          //非正常的情况判断---【汉字、出现负数】
          if (isNaN(disNum)) {
            //用户输入进来的数值不合法，已有的数量不变
            disNum = 0;
          } else {
            //如果用户输入进来数值--正常（算出差值）
            disNum = parseInt(disNum) - cart.skuNum;
          }

          break;
      }
      //判断修改成功与失败
      try {
        //发请求，通知服务器修改产品的数量，修改产品数量如果成功，需要再次获取购物车的数据进行展示，展示最新的数据。
        await this.$store.dispatch("addShopcar", {
          skuId: cart.skuId,
          skuNum: disNum,
        });
        //成功：再次获取购物车最新的数据进行展示
        this.getData();
      } catch (error) {}
    }, 500),
    //删除购物车商品
    async deleteCart(cart) {
      try {
        //删除产品的操作成功
        await this.$store.dispatch("deleteCartById", cart.skuId);
        this.getData();
      } catch (error) {
        alert("删除产品失败");
      }
    },
    //修改某个产品的选中状态
    async changeChecked(cart, event) {
      try {
        let isChecked = event.target.checked ? "1" : "0";
        await this.$store.dispatch("uppdateCartChecked", {
          skuId: cart.skuId,
          isChecked,
        });
        this.getData();
      } catch (error) {
        alert("修改选中状态失败");
      }
    },
    //删除购物车所有选中的产品
    async deleteAllCheckedCart() {
      try {
        //派发action
        await this.$store.dispatch("deleteCartByChecked");
        this.getData();
      } catch (error) {
        alert("删除失败");
      }
    },
    //修改全部商品选中状态
    async updateAllChecked(event) {
      //获取当前全选的这个复选框的状态,你能获取到全选按钮的选中还是未选中状态
      let isChecked = event.target.checked ? "1" : "0";
      //通知Vuex发请求：请求次数和数组里面元素个数一样的，要么大家都是1，要么大家都是0
      try {
        //派发action
        await this.$store.dispatch("updateAllCart", isChecked);
        this.getData();
      } catch (error) {
        alert("修改选中状态失败");
      }
    },
  },
  computed: {
    ...mapGetters(["shopCartData"]),
    //最终组件需要展示的购物车的数据
    shopList() {
      //数组：购物车的数据
      //假报错:至少有一个数据兜底
      return this.shopCartData.cartInfoList || [];
    },
    //计算总价
    totalPrice() {
      let sum = 0;
      this.shopList.forEach((item) => {
        sum += item.skuNum * item.cartPrice;
      });
      return sum;
    },
    //全选按钮选中|未选中
    isChecks() {
      //遍历数组里面的每一个元素（产品）：如果每一个产品的isChecked属性都为1->勾上
      //如果有一个产品isChecked属性为零，底下计算返回的是布尔值false->不够选上
      return this.shopList.every((item) => item.isChecked == 1);
    },
  },
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>