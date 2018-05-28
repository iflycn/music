<template>
  <div class="detail">
    <div class="song_wrap">
      <div class="song_disc" :class="{ song_needle: controls.isPaused }" @click="$_SongToggle()">
        <div class="song_turn circling" :class="{ paused: controls.isPaused }">
          <img :src="song.picUrl" class="song_cover">
        </div>
        <span class="song_play" :class="{ song_pause: !controls.isPaused }"></span>
      </div>
    </div>
    <div class="song_range">
      <small>{{ range }}</small>
      <input type="range" disabled :max="controls.duration" :value="controls.currentTime">
    </div>
    <div class="lyric">
      <h3>{{ song.name }} - {{ song.artist }}</h3>
      <div class="lyric_txt">
        <ul :style="{ marginTop: '-' + ~~controls.line * 2 + 'em'}">
          <li v-for="(v, i) in song.lyric" :key="i" :class="{ hover: controls.line == i }">{{ v.txt }}</li>
        </ul>
      </div>
    </div>
    <audio ref="audio" :src="song.url" preload></audio>
    <div class="song_bg" :style="{ backgroundImage: 'url(' + song.picUrl + ')' }"></div>
  </div>
</template>

<script>
export default {
  name: "detail",
  data() {
    return {
      controls: {
        id: -1,
        isPaused: !0,
        line: 1e-3,
        duration: 0,
        currentTime: 0
      },
      song: {
        id: -1,
        name: "未知",
        artist: "未知",
        url: "",
        picUrl: require("../assets/disc_default.png"),
        lyric: []
      }
    };
  },
  computed: {
    range: function() {
      const currentTime = ~~(this.controls.currentTime / 1e3);
      const duration = ~~(this.controls.duration / 1e3);
      return (
        ((1 << 2).toString(2) + ~~((currentTime / 60) % 60)).slice(-2) +
        ":" +
        ((1 << 2).toString(2) + currentTime % 60).slice(-2) +
        "/" +
        ((1 << 2).toString(2) + ~~((duration / 60) % 60)).slice(-2) +
        ":" +
        ((1 << 2).toString(2) + duration % 60).slice(-2)
      );
    }
  },
  created() {
    const id = this.$route.params.id;
    console.log("[PARAMS] detail?id=" + id);
    this.$_GetDetail(id);
  },
  destroyed() {
    clearInterval(this.controls.id);
  },
  watch: {
    "controls.duration"() {
      console.warn("Can NOT autoplay on mobile, wait to find another way.");
      // this.controls.duration > 0 && this.$_SongToggle();
    },
    "controls.currentTime"() {
      this.controls.currentTime >= this.controls.duration &&
        this.$_SongToggle();
    },
    "song.id"() {
      if (this.song.lyric.length > 0) {
        this.song.lyric = this.$_FormatLrc(this.song.lyric);
      }
      clearInterval(this.controls.id);
      this.controls.id = setInterval(() => {
        this.controls.line = this.$_StartTimer();
      }, 1e3);
    }
  },
  methods: {
    $_StartTimer() {
      const duration = this.$refs.audio.duration * 1e3;
      const currentTime = this.$refs.audio.currentTime * 1e3;
      this.controls.duration = duration;
      this.controls.currentTime = currentTime;
      const lrc = [].concat(this.song.lyric);
      lrc.push({ time: duration });
      if (currentTime < lrc[0].time) {
        return 1e-3;
      }
      for (let i = 0; i < lrc.length - 1; i++) {
        if (currentTime >= lrc[i].time && currentTime < lrc[i + 1].time) {
          return i;
        }
      }
    },
    $_SongToggle() {
      this.controls.isPaused
        ? this.$refs.audio.play()
        : this.$refs.audio.pause();
      this.controls.isPaused = !this.controls.isPaused;
    },
    $_FormatLrc(lrc) {
      const lines = lrc.split("\n");
      const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g;
      lrc = [];
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let result = timeExp.exec(line);
        let txt = line.replace(timeExp, "").trim();
        if (result && txt) {
          lrc.push({
            time:
              result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
            txt
          });
        }
      }
      lrc.sort((a, b) => {
        return a.time - b.time;
      });
      return lrc;
    },
    $_GetDetail(id) {
      const that = this;
      that.axios
        .get(that.util.baseUrl + "/detail?id=" + id)
        .then(res => {
          console.log(res.data);
          that.song = res.data;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
.circling {
  -webkit-animation: circling 20s infinite linear;
  animation: circling 20s infinite linear;
}
.paused {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}
@keyframes circling {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(1turn);
    transform: rotate(1turn);
  }
}

.detail {
  position: relative;
  width: 100%;
  color: #fff;
  background: transparent;
  overflow: hidden;
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
.song_wrap {
  padding-top: 63px;
}
.song_disc {
  position: relative;
  margin: 0 auto;
  width: 248px;
  height: 248px;
  background-image: url(../assets/disc_plus.png);
  background-size: 100% 100%;
}
.song_disc:after {
  content: " ";
  position: absolute;
  top: -71px;
  left: 107px;
  width: 84px;
  height: 128px;
  background-image: url(../assets/disc_needle.png);
  background-size: 100% 100%;
  transform-origin: 15.15% 6.18%;
  transition: 0.2s;
}
.song_needle:after {
  transform: rotate(-24deg);
}
.song_turn {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-image: url(../assets/disc_light.png);
  background-size: 100% 100%;
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
  background-image: url(../assets/icon_play.png);
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50px 50px;
  z-index: 9;
}
.song_pause {
  opacity: 0.01;
}
.song_range {
  position: relative;
  margin-top: 0px;
  width: 100%;
  height: 20px;
}
.song_range small {
  position: absolute;
  top: -0.3em;
  right: 0.6em;
  font-size: 0.6em;
  color: hsla(0, 0%, 100%, 0.6);
}
.song_range input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  border-radius: 2px;
  background: hsla(0, 0%, 100%, 0.2);
}
.song_range input[type="range"]:focus {
  outline: none;
}
.song_range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
}
.song_range input[type="range"]::-webkit-slider-runnable-track {
  height: 1px;
  border-radius: 50%;
}
.song_range input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin-top: -2px;
  height: 5px;
  width: 10px;
  background: hsla(0, 0%, 100%, 0.6);
  border-radius: 3px;
}
.lyric {
  margin: 30px auto 10px auto;
  width: 248px;
}
.lyric h3 {
  margin-bottom: 0.8em;
  font-weight: normal;
  text-align: center;
  overflow: hidden;
}
.lyric_txt {
  height: 6em;
  overflow: hidden;
}
.lyric_txt ul,
.lyric_txt li {
  transition: 0.5s;
}
.lyric_txt li {
  height: 2em;
  line-height: 2em;
  color: hsla(0, 0%, 100%, 0.6);
  text-align: center;
  overflow: hidden;
}
.lyric_txt li.hover {
  color: #fff;
}

@media screen and (min-width: 360px) {
  .song_wrap {
    padding-top: 70px;
  }
  .song_disc:after {
    top: -79px;
    left: 133px;
    width: 96px;
    height: 146px;
  }
  .song_disc {
    width: 296px;
    height: 296px;
  }
  .song_cover {
    padding: 56px;
    width: 184px;
    height: 184px;
  }
  .song_play {
    background-size: 56px 56px;
  }
  .lyric {
    width: 296px;
  }
}

@media screen and (min-width: 414px) {
  .song_wrap {
    padding-top: 80px;
  }
  .song_disc:after {
    top: -90px;
    left: 150px;
    width: 110px;
    height: 167px;
  }
  .song_disc {
    width: 342px;
    height: 342px;
  }
  .song_cover {
    padding: 65px;
    width: 212px;
    height: 212px;
  }
  .song_play {
    background-size: 66px 66px;
  }
  .lyric {
    width: 342px;
  }
}
</style>
