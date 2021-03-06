<template>
  <div class="home">
    <g-loading v-if="slist.length === 0"></g-loading>
    <h1 class="songs_title">推荐歌单</h1>
    <router-link v-if="!this.audio.isPaused" :to="controlHistory" class="songs_playing"></router-link>
    <ul v-if="slist.length > 1" class="songs_control" :class="{ songs_control_history: history, songs_control_fixed: scrollTop > 72}">
      <li><router-link :to="controlOrder">顺序播放</router-link></li>
      <li><router-link :to="controlRandom">随机播放</router-link></li>
      <li v-if="history"><router-link :to="controlHistory">历史播放</router-link></li>
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
import GLoading from "@/components/loading";
import { mapState } from "vuex";

export default {
  name: "home",
  components: { GLoading },
  data() {
    return {
      scrollTop: 0,
      history: null,
      slist: []
    };
  },
  created() {
    this.audio.song.url ||
      window.addEventListener("touchend", this.$_FixAutoplay);
    window.addEventListener("scroll", this.$_SetScrollTop);
    this.history = localStorage.history;
    this.$_GetList();
  },
  destroyed() {
    window.removeEventListener("scroll", this.$_SetScrollTop);
  },
  computed: {
    ...mapState(["audio"]),
    controlOrder: function() {
      return `/detail/${this.$_GetIds()}`;
    },
    controlRandom: function() {
      if (this.audio.ids) {
        return `/detail/${this.util.arrShuffle(this.$_GetIds())}`;
      }
    },
    controlHistory: function() {
      return `/detail/${this.audio.ids.join(",") || this.history}`;
    }
  },
  methods: {
    $_FixAutoplay() {
      this.$root.bus.$emit("GAudioFixAutoplay");
      window.removeEventListener("touchend", this.$_FixAutoplay);
    },
    $_SetScrollTop() {
      this.scrollTop = window.scrollY;
    },
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
      this.axios
        .get(`${this.util.baseUrl}/slist`)
        .then(res => {
          this.slist = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@assets: "../assets/";
@base-color: #fff;
@main-color: #df3436;
@less-color: #888;
@border-color: #f0f0f0;

.songs_title {
  margin: 0.5em 0 60px 0;
  padding-left: 0.5em;
  font-size: 2em;
  font-weight: normal;
  border-left: 3px solid @main-color;
}
.songs_playing {
  position: absolute;
  top: 26px;
  right: 1em;
  width: 20px;
  height: 20px;
  background-image: url("@{assets}icon_playing.gif");
  background-size: 100% 100%;
}
.songs_control {
  position: absolute;
  top: 72px;
  left: 0;
  width: 100%;
  &:after {
    content: " ";
    clear: both;
    display: block;
    height: 0;
    visibility: hidden;
  }
  li {
    float: left;
    margin-left: -1px;
    width: 50%;
    text-align: center;
    border: 1px solid @border-color;
    border-right: 0;
    background: fade(@base-color, 90%);
    &:active {
      background: @base-color;
      a {
        color: darken(@less-color, 10%);
      }
    }
    a {
      display: inline-block;
      padding: 1em 0 1em 2em;
      font-size: 0.8em;
      color: @less-color;
      background-repeat: no-repeat;
      background-position: 0 center;
      background-size: auto 1em;
      background-origin: content;
    }
    &:nth-child(1) a {
      background-image: url("@{assets}icon_play_order.png");
    }
    &:nth-child(2) a {
      background-image: url("@{assets}icon_play_random.png");
    }
    &:nth-child(3) a {
      background-image: url("@{assets}icon_play_history.png");
    }
  }
}
.songs_control_history li {
  width: 33.33%;
}
.songs_control_fixed {
  position: fixed;
  top: 0;
}
.songs_list {
  background: url("@{assets}slist_bg.png") 0 bottom no-repeat;
  background-size: 100% auto;
  background-attachment: fixed;
  li {
    margin-left: 3em;
    padding: 0.4em 0;
    border-bottom: 1px solid @border-color;
    background: url("@{assets}icon_music.png") right center no-repeat;
    background-size: auto 40%;
    span {
      float: left;
      display: block;
      margin-left: -3em;
      width: 3em;
      height: 3em;
      line-height: 3em;
      color: @less-color;
      text-align: center;
    }
    &:nth-child(1) span,
    &:nth-child(2) span,
    &:nth-child(3) span {
      color: @main-color;
    }
    h4,
    small {
      width: 80%;
      height: 1.5em;
      line-height: 1.5em;
      overflow: hidden;
    }
    h4 {
      font-weight: normal;
    }
    small {
      display: block;
      color: @less-color;
    }
  }
}
.copyright {
  display: block;
  padding: 1em;
  font-size: 0.6em;
  color: @less-color;
  text-align: center;
}
</style>
