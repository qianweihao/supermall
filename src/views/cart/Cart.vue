<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>
    <!-- 列表 -->
    <cart-list/>
    <!-- 底部汇总 -->
    <cart-bottom-bar/>

  </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar.vue'
import CartList from './childComps/CartList.vue'
import { mapGetters } from 'vuex'
import CartBottomBar from './childComps/CartBottomBar.vue'
export default {
  name: 'Cart',
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    ...mapGetters({
      length: 'cartLength',
      list: 'cartList'
    })
  }
}
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color:#FFFFFF;

}
</style>
