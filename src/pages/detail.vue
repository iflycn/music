<template>
  <div class="detail">
    <div class="song_wrap">
      <div class="song_disc" @click="$_SongToggle()">
        <div class="song_turn circling" :class="{ paused: controls.isPaused }">
          <img :src="song.picUrl" class="song_cover">
        </div>
        <span v-show="controls.isPaused" class="song_play"></span>
      </div>
    </div>
    <div class="lyric">
      <h3>{{ song.name }} - {{ song.artist }}</h3>
      <div class="lyric_txt">
        <ul :style="{ margin: '-' + ~~controls.line * 2 + 'em 0 ' + ~~controls.line * 2 + 'em 0'}">
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
        line: 0.001,
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
      console.warn("Can not autoplay on mobile, wait to find another way.");
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
      }, 500);
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
        return 0.001;
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
  background-size: auto 100%;
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
  top: -63px;
  left: 107px;
  width: 84px;
  height: 122px;
  background-image: url(../assets/disc_needle.png);
  background-size: 100% 100%;
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-image: url(../assets/icon_play.png);
  background-size: 100% 100%;
  z-index: 9;
}
.lyric {
  margin: 40px auto 0 auto;
  width: 248px;
}
.lyric h3 {
  margin-bottom: 1em;
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
    top: -70px;
    left: 133px;
    width: 96px;
    height: 137px;
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
    width: 56px;
    height: 56px;
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
    top: -80px;
    left: 150px;
    width: 110px;
    height: 157px;
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
    width: 66px;
    height: 66px;
  }
  .lyric {
    width: 342px;
  }
}
</style>
