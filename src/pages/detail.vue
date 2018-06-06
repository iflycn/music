<template>
  <div class="detail">
    <g-loading v-if="audio.duration === 0"></g-loading>
    <div class="song_wrap">
      <div class="song_disc" :class="{ song_needle: audio.isPaused }" @click="$root.bus.$emit('GAudioSongToggle')">
        <div class="song_turn song_rotate" :class="{ song_paused: audio.isPaused }">
          <img :src="audio.song.picUrl" class="song_cover">
        </div>
        <span v-show="audio.duration > 0" class="song_play" :class="{ song_pause: !audio.isPaused || audio.duration === 0 }"></span>
      </div>
    </div>
    <div v-show="rangeShow" class="song_range">
      <small>{{ rangeTxt }}</small>
      <input type="range" v-model="audio.currentTime" :max="audio.duration" :style="{ background: rangeStyle }" @input="$root.bus.$emit('GAudioSongJump')">
    </div>
    <div v-show="rangeShow" class="lyric" :style="{ height: `${lyricHeight}px` }">
      <h3>{{ audio.song.name }} - {{ audio.song.artist }}</h3>
      <div class="lyric_txt">
        <ul :style="{ marginTop: `-${~~audio.line * 2}em`}">
          <li v-for="(v, i) in formatLrc" :key="i" :class="{ hover: audio.line === i }">{{ v.txt }}</li>
        </ul>
      </div>
    </div>
    <div class="song_bg" :style="{ backgroundImage: `url(${audio.song.picUrl})` }"></div>
  </div>
</template>

<script>
import GLoading from "@/components/loading";
import { mapState, mapGetters } from "vuex";

export default {
  name: "detail",
  components: { GLoading },
  data() {
    return {
      lyricHeight: 0
    };
  },
  mounted() {
    let height = document.body.offsetHeight / 2 - 128;
    height = ~~((height - 43) / 32) * 32 + 43; // LH 32 PT 43
    this.lyricHeight = height >= 139 ? height : 139;
  },
  computed: {
    ...mapState(["audio"]),
    ...mapGetters(["formatLrc"]),
    rangeStyle: function() {
      const percent =
        ~~(this.audio.currentTime / this.audio.duration * 100) + 1;
      const color = "rgba(255, 255, 255, 0.2)";
      return `linear-gradient(to right, ${color}, #fff ${percent}%, ${color} ${percent}%, ${color})`;
    },
    rangeTxt: function() {
      const currentTime = ~~this.audio.currentTime;
      const duration = ~~this.audio.duration;
      return `${this.util.fillZero(
        ~~((currentTime / 60) % 60)
      )}:${this.util.fillZero(currentTime % 60)}/${this.util.fillZero(
        ~~((duration / 60) % 60)
      )}:${this.util.fillZero(duration % 60)}`;
    },
    rangeShow: function() {
      return (
        this.audio.song.name && this.audio.song.artist && this.lyricHeight > 0
      );
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
      border-radius: 3px;
      background: @base-color;
    }
  }
}
.lyric {
  margin: 24px auto 10px auto;
  width: 248px;
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
