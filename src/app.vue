<template>
  <div class="main">
    <transition name="fade-in" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "app"
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
.h {
  display: none;
}
.t {
  transition: 0.1s;
}
.color_f {
  color: #fff;
}
.color_c {
  color: #ccc;
}
.color_9 {
  color: #999;
}
.color_6 {
  color: #666;
}
.color_3 {
  color: #333;
}
.color_0 {
  color: #000;
}
.color_r {
  color: #c33;
}
.color_g {
  color: #383;
}
.color_b {
  color: #38c;
}
.font_4 {
  font-size: 0.4em;
}
.font_6 {
  font-size: 0.6em;
}
.font_8 {
  font-size: 0.8em;
}
.font_10 {
  font-size: 1em;
}
.font_12 {
  font-size: 1.2em;
}
.font_14 {
  font-size: 1.4em;
}
.font_16 {
  font-size: 1.6em;
}
.font_18 {
  font-size: 1.8em;
}
.font_20 {
  font-size: 2em;
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
