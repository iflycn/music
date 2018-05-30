# Gito Player
这是一个极简的 `Vue` 音乐播放器，使用了官方脚手架 `vue-cli` 搭建、 `Webpack` 打包，涉及到的技术栈包括 `Vue.js`、`vue-router`、`Axios`

## 应用预览
[https://iflycn.github.io/music/dist/](https://iflycn.github.io/music/dist/)

## 如何运行
``` bash
# 克隆到本地
git clone https://github.com/iflycn/music.git
# 进入文件夹
cd music
# 安装依赖
npm install
# 开启本地服务器
npm run dev
# 发布环境
npm run build
```

## 开发计划
- [x] 开个坑，有空就会填一填
- [x] 项目开始搭建，完成度 10%
- [x] 完成播放器样式，完成度 25%
- [x] 当前歌词高亮显示，完成度 30%
- [x] 完成歌词滚动，完成度 40%
- [x] 建立简单列表页，完成度 50%
- [x] 添加歌曲进度条，完成度 60%
- [x] 进度条拖动控制，完成度 70%
- [x] 歌单连续播放，完成度 75%
- [x] 解析复杂 LRC 文件，完成度 80%
- [x] 保存播放历史，完成度 85%
- [ ] 播放器抽象为组件，待完成
- [x] 修复 BUG：控制播放时，微信意外弹出图片浏览界面
- [ ] 已知 BUG：因移动端限制，音乐无法自动播放

## 参考资料
- [https://cn.vuejs.org/v2/guide/](https://cn.vuejs.org/v2/guide/)
- [http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp](http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp)
- [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)