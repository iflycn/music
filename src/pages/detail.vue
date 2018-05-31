<template>
  <div class="detail">
    <loading v-if="controls.duration === 0"></loading>
    <div class="song_wrap">
      <div class="song_disc" :class="{ song_needle: controls.isPaused }" @click="$_SongToggle()">
        <div class="song_turn song_rotate" :class="{ song_paused: controls.isPaused }">
          <img :src="song.picUrl" class="song_cover">
        </div>
        <span class="song_play" :class="{ song_pause: !controls.isPaused || controls.duration === 0 }"></span>
      </div>
    </div>
    <div v-show="song.name && song.artist" class="song_range">
      <audio ref="audio" :src="song.url" preload></audio>
      <small>{{ rangeTxt }}</small>
      <input type="range" v-model="controls.currentTime" :max="controls.duration" :style="{ background: rangeStyle }" @input="$_SongJump()">
    </div>
    <div v-show="song.name && song.artist" class="lyric" :style="{ height: `${lyricHeight}px` }">
      <h3>{{ song.name }} - {{ song.artist }}</h3>
      <div class="lyric_txt">
        <ul :style="{ marginTop: `-${~~this.controls.line * 2}em`}">
          <li v-for="(v, i) in song.lyric" :key="i" :class="{ hover: controls.line === i }">{{ v.txt }}</li>
        </ul>
      </div>
    </div>
    <div class="song_bg" :style="{ backgroundImage: `url(${song.picUrl})` }"></div>
  </div>
</template>

<script>
import loading from "@/components/loading";

export default {
  name: "detail",
  components: { loading },
  data() {
    return {
      lyricHeight: 0,
      controls: {
        ids: [],
        timer: -1,
        isPaused: !0,
        line: 1e-3,
        duration: 0,
        currentTime: 0
      },
      song: {
        id: -1,
        name: null,
        artist: null,
        url: null,
        picUrl: require("../assets/disc_default.png"),
        lyric: []
      }
    };
  },
  computed: {
    rangeStyle: function() {
      const percent =
        ~~(this.controls.currentTime / this.controls.duration * 100) + 1;
      const color = "rgba(255, 255, 255, 0.2)";
      return `linear-gradient(to right, ${color}, #fff ${percent}%, ${color} ${percent}%, ${color})`;
    },
    rangeTxt: function() {
      const currentTime = ~~this.controls.currentTime;
      const duration = ~~this.controls.duration;
      return `${this.util.fillZero(
        ~~((currentTime / 60) % 60)
      )}:${this.util.fillZero(currentTime % 60)}/${this.util.fillZero(
        ~~((duration / 60) % 60)
      )}:${this.util.fillZero(duration % 60)}`;
    }
  },
  created() {
    const id = this.$route.params.id;
    // console.log(`[PARAMS] detail?id=${id}`);
    this.controls.ids = id.split(",");
    this.$_GetDetail(this.controls.ids[0]);
  },
  mounted() {
    const height = screen.availHeight - document.body.offsetHeight - 150;
    this.lyricHeight = height;
  },
  destroyed() {
    localStorage.history = this.controls.ids.join(",");
    clearInterval(this.controls.timer);
  },
  watch: {
    "controls.duration"() {
      this.controls.duration > 0 && this.$_SongPlay();
    },
    "controls.currentTime"() {
      if (this.controls.currentTime >= this.controls.duration) {
        this.$_SongPause();
        this.controls.ids.length > 1 && this.$_SongNext();
      }
    },
    "song.id"() {
      if (this.song.lyric.length > 0) {
        this.song.lyric = this.$_FormatLrc(this.song.lyric);
      }
      clearInterval(this.controls.timer);
      this.controls.timer = setInterval(() => {
        this.controls.line = this.$_StartTimer();
      }, 1e3);
    }
  },
  methods: {
    $_StartTimer() {
      const duration = this.$refs.audio.duration;
      const currentTime = this.$refs.audio.currentTime;
      this.controls.duration = duration;
      this.controls.currentTime = currentTime;
      const lrc = [...this.song.lyric];
      lrc.push({ time: duration * 1e3 });
      if (currentTime < lrc[0].time / 1e3) {
        return 1e-3;
      }
      for (let i = 0; i < lrc.length - 1; i++) {
        if (
          currentTime >= lrc[i].time / 1e3 &&
          currentTime < lrc[i + 1].time / 1e3
        ) {
          return i;
        }
      }
    },
    $_SongPlay() {
      if (this.controls.duration > 0) {
        this.$refs.audio
          .play()
          .then(() => {
            this.controls.isPaused = !1;
          })
          .catch(err => {
            console.warn(err);
          });
      }
    },
    $_SongPause() {
      this.$refs.audio.pause();
      this.controls.isPaused = !0;
    },
    $_SongToggle() {
      this.controls.isPaused ? this.$_SongPlay() : this.$_SongPause();
    },
    $_SongLoad() {
      this.$refs.audio.load();
    },
    $_SongJump() {
      if (this.controls.currentTime < this.controls.duration) {
        this.$refs.audio.currentTime = this.controls.currentTime;
      }
    },
    $_SongNext() {
      this.controls.duration = 0;
      this.controls.ids.splice(0, 1);
      this.controls.ids.push(this.song.id);
      this.$_GetDetail(this.controls.ids[0]);
    },
    $_FormatLrc(lrc) {
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
    },
    $_GetDetail(id) {
      const that = this;
      that.axios
        .get(`${that.util.baseUrl}/detail?id=${id}`)
        .then(res => {
          // console.log(res.data);
          that.song = res.data;
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

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.detail {
  position: relative;
  width: 100%;
  color: @base-color;
  background: transparent;
  overflow: hidden;
}
.song_wrap {
  padding-top: 63px;
  .song_disc {
    position: relative;
    margin: 0 auto;
    width: 248px;
    height: 248px;
    background-image: url("@{assets}disc_plus.png");
    background-size: 100% 100%;
    &:after {
      content: " ";
      position: absolute;
      top: -71px;
      left: 107px;
      width: 84px;
      height: 128px;
      background-image: url("@{assets}disc_needle.png");
      background-size: 100% 100%;
      transform-origin: 15.15% 6.18%;
      transition: 0.2s;
    }
  }
  .song_needle {
    &:after {
      transform: rotate(-24deg);
    }
  }
  .song_turn {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-image: url("@{assets}disc_light.png");
    background-size: 100% 100%;
  }
  .song_rotate {
    animation: rotate 20s infinite linear;
  }
  .song_paused {
    animation-play-state: paused;
  }
  .song_cover {
    padding: 48px;
    width: 152px;
    height: 152px;
    border-radius: 50%;
  }
  .song_play {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("@{assets}icon_play.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50px 50px;
    z-index: 9;
  }
  .song_pause {
    opacity: 0.01;
  }
}
.song_range {
  position: relative;
  margin-top: 6px;
  width: 100%;
  height: 20px;
  small {
    position: absolute;
    top: -0.3em;
    right: 0.6em;
    font-size: 0.6em;
    color: fade(@base-color, 60%);
  }
  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    border-radius: 2px;
    background: fade(@base-color, 20%);
    &:focus {
      outline: none;
    }
    &::-webkit-slider-runnable-track {
      height: 1px;
      border-radius: 50%;
    }
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      margin-top: -2px;
      height: 5px;
      width: 10px;
      background: @base-color;
      border-radius: 3px;
    }
  }
}
.lyric {
  margin: 24px auto 10px auto;
  width: 248px;
  min-height: 130px;
  overflow: hidden;
  h3 {
    margin-bottom: 10px;
    font-weight: normal;
    text-align: center;
    overflow: hidden;
  }
  .lyric_txt {
    overflow: hidden;
    ul,
    li {
      transition: 0.5s;
    }
    li {
      height: 2em;
      line-height: 2em;
      color: fade(@base-color, 60%);
      text-align: center;
      overflow: hidden;
      &.hover {
        color: @base-color;
      }
    }
  }
}
.song_bg {
  position: fixed;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  background-color: #000;
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  filter: blur(24px) brightness(0.6);
  z-index: -1;
}

@media screen and (min-width: 360px) {
  .song_wrap {
    padding-top: 70px;
    .song_disc {
      width: 296px;
      height: 296px;
      &:after {
        top: -79px;
        left: 133px;
        width: 96px;
        height: 146px;
      }
    }
    .song_cover {
      padding: 56px;
      width: 184px;
      height: 184px;
    }
    .song_play {
      background-size: 56px 56px;
    }
  }
  .lyric {
    width: 296px;
  }
}

@media screen and (min-width: 414px) {
  .song_wrap {
    padding-top: 80px;
    .song_disc {
      width: 342px;
      height: 342px;
      &:after {
        top: -90px;
        left: 150px;
        width: 110px;
        height: 167px;
      }
    }
    .song_cover {
      padding: 65px;
      width: 212px;
      height: 212px;
    }
    .song_play {
      background-size: 66px 66px;
    }
  }
  .lyric {
    width: 342px;
  }
}
</style>
