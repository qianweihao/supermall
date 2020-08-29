<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList" :item-info="item" :key="index"/>
    </scroll>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Scroll from '../../../components/common/scroll/Scroll.vue'
import CartListItem from './CartListItem.vue'
export default {
  name: 'CartList',
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated () {
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  .content {
    height: 100%;
    overflow: hidden;
  }
  .cart-list {
    position: absolute;
    /* position: absolute; */
    height: calc(100%-133px);
    top: 44px;
    left: 0;
    right: 0;
    bottom: 93px;
  }
</style>
