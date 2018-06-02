<template>
  <div class="main">
    <transition name="fade-in" mode="out-in">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <g-audio></g-audio>
  </div>
</template>

<script>
import GAudio from "@/components/audio";

export default {
  name: "app",
  components: { GAudio },
  beforeCreate() {
    console.log(
      "%c Gito Player %c Github.com/iflycn/music ",
      "background:#df3436;padding:1px;border-radius:3px 0 0 3px;color:#fff",
      "background:#888;padding:1px;border-radius:0 3px 3px 0;color:#fff"
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
