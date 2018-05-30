<template>
  <div class="main">
    <transition name="fade-in" mode="out-in">
      <!-- 在组件化并引入 Vuex 前，因播放历史问题暂不启用缓存，待完成
      <keep-alive include="home">
        <router-view></router-view>
      </keep-alive>
      -->
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  beforeCreate() {
    console.log(
      "%c Gito Player @ Github.com/iflycn/music",
      "margin:1em 0;padding:1em;color:#fff;border-radius:.2em;background:#3caaf7"
    );
  }
};
</script>

<style>
/* 公用样式v0.2 */
* {
  margin: 0;
  padding: 0;
  border: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-user-select: none;
}
body {
  -webkit-touch-callout: none;
  -webkit-text-size-adjust: none;
  font-size: 1em;
}
img {
  display: block;
  max-width: 100%;
}
li {
  list-style-type: none;
}
p {
  word-wrap: break-word;
  word-break: break-all;
  text-align: justify;
}
a {
  text-decoration: none;
}
/* 过渡动画 */
.fade-in-enter,
.fade-in-leave-active {
  opacity: 0;
}
.fade-in-enter-active,
.fade-in-leave-active {
  -webkit-transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
/* 私有样式 */
body {
  color: #333;
}
a {
  color: #333;
}
</style>
