# Gito Player
这是一个极简的 `Vue` 音乐播放器，使用了官方脚手架 `vue-cli` 搭建、 `Webpack` 打包，涉及到的技术栈包括 `Vue.js`、`vue-router`、`Vuex`、`Axios`

## 应用截图
![](https://github.com/iflycn/music/blob/master/dist/screenshot.png)

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

## 一些细节代码

### 在 JS 中使用将被打包的静态资源
```javascript
export default {
  data() {
    return {
      image: require("../assets/img.png"),
    };
  }
};
```

### 获取路由参数
```html
<!-- 带参数的路由链接 -->
<router-link to="/page/1">页面</router-link>
```
```javascript
// 路由组件
export default new Router({
  routes: [{
    path: "/page/:id",
    name: "page",
    component: page
  }]
})
```
```javascript
// 接收路由参数的组件
export default {
  data() {
    return {
      id: ""
    };
  },
  created() {
    this.id = this.$route.params.id;
  },
  watch: {
    $route() {
      this.id = this.$route.params.id;
    }
  }
};
```

### 使用 axios 获取数据
```javascript
export default {
  data() {
    return {
      data: {}
    };
  },
  created() {
    this.$_GetAjax();
  },
  methods: {
    $_GetAjax() {
      this.axios
        .get("interface/address")
        .then(res => {
          console.table(res.data);
          this.data = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
```

### 格式化 LRC 歌词
```javascript
function formatLrc(lrc) {
  lrc = lrc
    .replace(
      /(\[\d{2,}:\d{2}(?:\.\d{2,3})?]){2,}(.*)(\n)/g,
      (match, _, txt) => {
        return match
          .replace(`${txt}\n`, "")
          .replace(/(\[\d{2,}:\d{2}(?:\.\d{2,3})?])/g, `$1${txt}\n`);
      }
    )
    .split("\n");
  const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;
  const lines = [];
  for (let i = 0; i < lrc.length; i++) {
    const result = timeExp.exec(lrc[i]);
    const txt = lrc[i].replace(timeExp, "").trim();
    if (result && txt) {
      lines.push({
        time:
          result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
        txt
      });
    }
  }
  lines.sort((a, b) => {
    return a.time - b.time;
  });
  return lines;
}
```

## 开发历史
- [x] 开个坑，有空就会填一填
- [x] 项目开始搭建
- [x] 完成播放器样式
- [x] 当前歌词高亮显示
- [x] 完成歌词滚动
- [x] 建立简单歌单
- [x] 修复 BUG：控制播放时，微信意外弹出图片浏览界面
- [x] 添加歌曲进度条
- [x] 进度条拖动控制
- [x] 歌单连续播放
- [x] 解析复杂 LRC 文件
- [x] 保存播放历史
- [x] 根据窗口大小计算歌词高度
- [x] 播放器抽象为公用组件
- [x] 歌单页显示播放状态
- [x] 修复 BUG：因移动端限制，音乐无法自动播放
- [x] 修复 BUG：播放历史不能及时刷新

## TODO
- [ ] 已知 BUG：部分移动端浏览器中，transform: rotate 对应的 animation-play-state 属性工作不正常
- [ ] 已知 BUG：部分移动端浏览器中，audio 组件工作不正常

## 参考资料
- [https://cn.vuejs.org/v2/guide/](https://cn.vuejs.org/v2/guide/)
- [https://vuex.vuejs.org/](https://vuex.vuejs.org/)
- [http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp](http://www.w3school.com.cn/tags/html_ref_audio_video_dom.asp)
- [https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)