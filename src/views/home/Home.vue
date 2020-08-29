<template>
  <div id="home" >
    <nav-bar class="home-nav">
      <div slot= "center">购物街</div>
    </nav-bar>
     <tab-control :titles = "['流行', '新款', '精选']"  @tabClick= "tabClick" ref="tabControl1"  class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" ref= "scroll" :probe-type ="3" @scroll = "contentScroll" :pull-up-load="true" @pullingUp = "loadMore" >
        <home-swiper :banners="banners" @swiperImageLoad = "swiperImageLoad"/>
        <recommend-view :recommends="recommends"/>
        <feature-view></feature-view>
        <tab-control :titles = "['流行', '新款', '精选']"  @tabClick= "tabClick" ref="tabControl2" />
        <good-list :goods="showGoods"/>
     </scroll>
     <!-- native监听组件的原生事件 -->
     <back-top @click.native= "backClick" v-show="isShowBackTop"/>

  </div>
</template>

<script>
import TabControl from '../../components/content/tabControl/TabControl.vue'
import NavBar from '../../components/common/navbar/NavBar.vue'
import GoodList from '../../components/content/goods/GoodsList.vue'
import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'
import Scroll from 'components/common/scroll/Scroll'

import { getHomeMultidata, getHomeGoods } from '../../network/home.js'
// import { debounce } from 'common/utils'
import { itemListenerMixin, backTopMixin } from '../../common/mixin.js'

export default {
  name: 'Home',
  components: {
    GoodList,
    NavBar,
    TabControl,
    HomeSwiper,
    RecommendView,
    FeatureView,
    Scroll

  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',

      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0

    }
  },
  computed: {
    showGoods () {
      return this.goods[this.currentType].list
    }
  },
  created () {
    // 请求多个数据
    this.getHomeMultidata()
    // 请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  destroyed () {
    // console.log('home destroyed')
  },
  activated () {
    this.$refs.scroll.scroll.scrollTo(0, this.saveY, 10)
    this.$refs.scroll.scroll.refresh()
  },
  deactivated () {
    this.saveY = this.$refs.scroll.scroll.y
    this.$bus.$off('itemImageLoad', this.itemImgListener)
  },
  mounted () {
    // const refresh = debounce(this.$refs.scroll.refresh, 500)
    // this.itemImgListener = () => {
    //   refresh()
    //   }
    // 监听item中商品加载完成
    // this.$bus.$on('itemImageLoad', this.itemImgListener)

    // this.$refs.scroll && this.$refs.scroll.scroll.refresh()

  },
  methods: {
    // 事件监听相关方法
    tabClick (index) {
      // console.log(index)
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },

    contentScroll (position) {
      this.isShowBackTop = (-position.y) > 1000
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore () {
      // console.log('上拉记载更多')
      this.getHomeGoods(this.currentType)
      // this.$refs.scroll.scroll.refresh()
    },
    swiperImageLoad () {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    // 网络请求相关方法
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        // console.log(res)
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        // console.log(res)
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        this.$refs.scroll.scroll.finishPullUp()
      })
    }
  }

}
</script>

<style scoped>
 #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  /*.content {*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
  /*}*/
</style>
