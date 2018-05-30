<template>
  <div class="home">
    <loading v-if="slist.length === 0"></loading>
    <h1 class="songs_title" :class="{ songs_fixed: scrollTop > 72}">推荐歌单</h1>
    <ul v-if="slist.length > 1" class="songs_control" :class="{ songs_history: history, songs_fixed: scrollTop > 72}">
      <li><router-link :to="controlOrder">顺序播放</router-link></li>
      <li><router-link :to="controlRandom">随机播放</router-link></li>
      <li v-if="history"><router-link :to="controlHistory">播放历史</router-link></li>
    </ul>
    <ul class="songs_list">
      <li v-for="(v, i) in slist" :key="i"><router-link :to="`/detail/${v.id}`">
        <span>{{ $_CompleteNum(i) }}</span>
        <h4>{{ v.name }}</h4>
        <small>{{ v.artist }} - {{ v.album }}</small>
      </router-link></li>
    </ul>
    <a href="https://github.com/iflycn/music" class="copyright">Gito Player @ Github.com</a>
  </div>
</template>

<script>
import loading from "@/components/loading";

export default {
  name: "home",
  components: { loading },
  data() {
    return {
      scrollTop: 0,
      history: null,
      slist: []
    };
  },
  created() {
    window.addEventListener("scroll", () => {
      this.scrollTop = window.scrollY;
    });
    this.history = localStorage.history;
    this.$_GetList();
  },
  computed: {
    controlOrder: function() {
      return `/detail/${this.$_GetIds()}`;
    },
    controlRandom: function() {
      return `/detail/${this.util.arrShuffle(this.$_GetIds())}`;
    },
    controlHistory: function() {
      return `/detail/${this.history}`;
    }
  },
  methods: {
    $_CompleteNum(i) {
      i += 1;
      return this.util.fillZero(i);
    },
    $_GetIds() {
      const ids = [];
      for (let i = 0; i < this.slist.length; i++) {
        ids.push(this.slist[i].id);
      }
      return ids;
    },
    $_GetList() {
      const that = this;
      that.axios
        .get(`${that.util.baseUrl}/slist`)
        .then(res => {
          console.log(res.data);
          that.slist = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
.songs_title {
  margin: 0.5em 0;
  padding-left: 0.5em;
  font-size: 2em;
  font-weight: normal;
  border-left: 3px solid #df3436;
}
h1.songs_fixed {
  margin-bottom: 60px;
}
ul.songs_fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.songs_control:after {
  content: " ";
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
.songs_control li {
  float: left;
  margin-left: -1px;
  width: 50%;
  text-align: center;
  border: 1px solid #f3f3f3;
  border-right: 0;
  background: rgba(255, 255, 255, 0.95);
}
.songs_history li {
  width: 33.33%;
}
.songs_control a {
  display: inline-block;
  padding: 1em 0 1em 2em;
  font-size: 0.8em;
  color: #888;
  background-repeat: no-repeat;
  background-position: 0 center;
  background-size: auto 1em;
  background-origin: content;
}
.songs_control li:nth-child(1) a {
  background-image: url(../assets/icon_play_order.png);
}
.songs_control li:nth-child(2) a {
  background-image: url(../assets/icon_play_random.png);
}
.songs_control li:nth-child(3) a {
  background-image: url(../assets/icon_play_history.png);
}
.songs_list {
  background: url(../assets/slist_bg.png) 0 bottom no-repeat;
  background-size: 100% auto;
}
.songs_list li {
  margin-left: 3em;
  padding: 0.4em 0;
  border-bottom: 1px solid #f3f3f3;
  background: url(../assets/icon_music.png) right center no-repeat;
  background-size: auto 40%;
}
.songs_list span {
  float: left;
  display: block;
  margin-left: -3em;
  width: 3em;
  height: 3em;
  line-height: 3em;
  color: #888;
  text-align: center;
}
.songs_list li:nth-child(1) span,
.songs_list li:nth-child(2) span,
.songs_list li:nth-child(3) span {
  color: #df3436;
}
.songs_list h4,
.songs_list small {
  width: 80%;
  height: 1.5em;
  line-height: 1.5em;
  overflow: hidden;
}
.songs_list h4 {
  font-weight: normal;
}
.songs_list small {
  display: block;
  color: #888;
}
.copyright {
  display: block;
  padding: 1em;
  font-size: 0.6em;
  color: #888;
  text-align: center;
}
</style>
