<template>
  <div class="pagination">
    <button :disabled="pageNo == 1" @click="$emit('currentPage', pageNo - 1)">
      上一页
    </button>
    <!-- 上 -->
    <button
      v-show="startAndEndNum.start >= 2"
      @click="$emit('currentPage', 1)"
      :class="{ active: pageNo == 1 }"
    >
      1
    </button>
    <button v-show="startAndEndNum.start >= 3">···</button>
    <!-- 中间页 continues -->
    <button
      v-for="(page, index) in startAndEndNum.end"
      :key="index"
      v-show="page >= startAndEndNum.start"
      @click="$emit('currentPage', page)"
      :class="{ active: pageNo == page }"
    >
      {{ page }}
    </button>
    <!-- 下 -->
    <button v-show="startAndEndNum.end < totalPage - 1">···</button>
    <button
      v-show="startAndEndNum.end < totalPage"
      @click="$emit('currentPage', totalPage)"
      :class="{ active: pageNo == totalPage }"
    >
      {{ totalPage }}
    </button>
    <button
      :disabled="pageNo == totalPage"
      @click="$emit('currentPage', pageNo + 1)"
    >
      下一页
    </button>

    <button style="margin-left: 30px" @click="$emit('currentPage', totalPage)">
      共{{ total }}条
    </button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: ["pageNo", "pageSize", "total", "continues"],
  computed: {
    //通过父组件传递数据total/pageSize计算出一共多少页
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    },
    //计算出连续页码的数字(开始数字|结束数字)【比如:当前第8页  6 7 8 9 10】
    startAndEndNum() {
      const { totalPage, continues, pageNo } = this;
      //先定义两个变量存储起始数字与结束数字
      let start = 0,
        end = 0;
      //连续页码数字5 【就是至少五页】
      //不正常现象【总页数没有连续页码多】
      if (continues > totalPage) {
        start = 1;
        end = totalPage;
      } else {
        //正常现象【总页数大于连续页码数5】
        //连续页码的开始数字|结束数字
        start = pageNo - parseInt(continues / 2);
        end = pageNo + parseInt(continues / 2);
        //还有一些不符合条件的需要纠正数字

        //pageNO 1  2 【start数字出现0|负数】
        if (start < 1) {
          start = 1;
          end = continues;
        }
        //【end数字大于总页码】
        if (end > totalPage) {
          start = totalPage - continues + 1;
          end = totalPage;
        }
      }
      return { start, end };
    },
  },
};
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>