<template>
  <div class="wrapper" ref= "wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'Scroll',

  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: null
    }
  },
  mounted () {
    // 创建scroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    // 监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
        // console.log(position)
        this.$emit('scroll', position)
      })
    }
    // 监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')
      })
    }

    // this.scroll.refresh()
    // 监听上拉事件
    // this.scroll.on('pullingup', () => {
    //   this.$emit('pullingup')
    // })
  },
  methods: {
    refresh () {
      // console.log('-----')
      this.scroll && this.scroll.refresh()
    }

  }
}
</script>

<style>
</style>
