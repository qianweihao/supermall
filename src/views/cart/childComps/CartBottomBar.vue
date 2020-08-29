<template>
  <div class="bottom-bar">
    <div>
      <check-button class="select-all" @click.native = "checkClick" :isChecked = "isSelectAll"/>

    </div>
         <span @click="checkClick">全选</span>
      <span class="total-price">
        合计: ¥{{totalPrice}}
      </span>

      <span class="calculate" @click="calcClick">
        去计算:{{checkLength}}
      </span>

  </div>
</template>

<script>
import CheckButton from '../../../components/content/checkButton/CheckButton.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'CartBottomBar',
  components: {
    CheckButton
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice () {
      const cartList = this.cartList
      return cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength () {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll () {
      if (this.cartList.length === 0) return false
      return !this.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick () {
      if (this.isSelectAll) {
        this.cartList.forEach(item => { item.checked = false })
      } else {
        this.cartList.forEach(item => { item.checked = true })
      }
    },
    calcClick () {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 2000)
      }
    }
  }
}
</script>

<style scoped>
/* .bottom-bar {
   width: 100%;
   height: 40px;
   background-color: #FF0000;
   position: fixed;
   bottom: 40px;

 } */
 .bottom-bar {
   width: 100%;
   height: 44px;
   background-color: #eee;
   position: fixed;
   bottom: 49px;
   left: 0;
   box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
   font-size: 14px;
   color: #888;
   line-height: 44px;
   padding-left: 35px;
   box-sizing: border-box;
 }

 .bottom-bar .select-all {
   position: absolute;
   line-height: 0;
   left: 12px;
   top: 13px;

 }

 .bottom-bar .total-price {
   margin-left: 15px;
   font-size: 16px;
   color: #666;
 }

 .bottom-bar .calculate {
   background-color: orangered;
   color: #fff;
   width: 100px;
   height: 44px;
   text-align: center;
   line-height: 44px;
   float: right;
 }
</style>
