<template >
  <div id="detail" >
  <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
  <scroll class="content" ref="scroll" @scroll = "contentScroll" :probe-type = "3" >

    <DatailSwiper :top-images="topImages"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"  />
    <detail-param-info :param-info="paramInfo" ref="params"/>
    <detail-comment-info :comment-info= "commentInfo" ref="comment"/>
    <goods-list :goods="recommends" ref="recommend"/>

  </scroll>
  <detail-bottom-bar @addCart="addToCart"/>
  <back-top @click.native= "backClick" v-show="isShowBackTop"/>
  <!-- <toast :message=""/> -->

  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import { getDetail, Goods, Shop, GoodsParam, getRecommend } from '../../network/detail.js'
import DatailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import Scroll from '../../components/common/scroll/Scroll.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import GoodsList from '../../components/content/goods/GoodsList.vue'
// import { debounce } from '../../common/utils.js'
import { itemListenerMixin, backTopMixin } from '../../common/mixin.js'
import { debounce } from '../../common/utils.js'
import DetailBottomBar from './childComps/DetailBottomBar.vue'

// import Toast from '../../components/common/toast/Toast.vue'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DatailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    Scroll,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar

    // Toast

  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0
      // message: '',
      // show: false

    }
  },
  created () {
    this.iid = this.$route.params.iid

    getDetail(this.iid).then(res => {
      // console.log(res)
      const data = res.result
      this.topImages = data.itemInfo.topImages
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      this.shop = new Shop(data.shopInfo)
      this.detailInfo = data.detailInfo
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      // 根据最新的数据对应的dom已经被渲染出来，但是图片依然没有加载完
      // this.$nextTick(() => {
      //   this.themeTopYs = []
      //   this.themeTopYs.push(0)
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // })
    })
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
    // 给getThemeTopy赋值
    this.getThemeTopY = debounce(() => {
      this.themeTopYs = []
      this.themeTopYs.push(0)
      this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      // this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs)
    })
  },
  methods: {

    imageLoad () {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick (index) {
      // console.log(index)
      this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll (position) {
      this.isShowBackTop = (-position.y) > 1000
      const positionY = -position.y
      const length = this.themeTopYs.length
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
    },
    addToCart () {
      // console.log('-----')
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      // if (product.iid) {
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product).then(res => {
        // console.log(res)
        // this.show = true;
        // this.message = res
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = ''

        // },1500)
        // console.log(res)
        // this.addCart(product).then(res => {
        this.$toast.show(res, 2000)
      })
    //   } else {
    //     this.$toast.show('添加失败请重试', 1500)
    //   }
    }

  },
  mounted () {

  },
  destroyed () {
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content {
   position: relative;
   /* width: 100%; */
    overflow: hidden;
    height: calc(100% - 44px);
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

</style>
