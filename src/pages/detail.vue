<template>
  <div class="detail">
    <div class="song_wrap">
      <div class="song_disc">
        <div class="song_turn" :class="{ circling: isPlay }">
          <img :src="song.picUrl" class="song_cover">
        </div>
      </div>
    </div>
    <div class="song_bg" :style="{ backgroundImage: 'url(' + song.picUrl + ')' }"></div>
  </div>
</template>

<script>
export default {
  name: "detail",
  components: {},
  data() {
    return {
      isPlay: !1,
      song: {
        name: "未知",
        artist: "未知",
        picUrl: require("../assets/disc_default.png"),
        lyric: "[00:00.00]无歌词"
      }
    };
  },
  created() {
    const id = this.$route.params.id;
    console.log("[PARAMS] detail?id=" + id);
    this.$_GetDetail(id);
  },
  methods: {
    $_GetDetail(id) {
      const that = this;
      that.axios
        .get(that.util.baseUrl + "/detail?id=" + id)
        .then(res => {
          console.table(res.data);
          that.isPlay = !0;
          that.song = res.data;
        })
        .catch(err => {
          console.error(err);
          that.isPlay = !1;
        });
    }
  }
};
</script>

<style scoped>
.circling {
  animation: circling 20s infinite linear;
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
  color: #fff;
  background: transparent;
}
.song_bg {
  position: fixed;
  top: -5%;
  left: -5%;
  width: 110%;
  height: 110%;
  background-color: #000;
  background-size: auto 100%;
  background-position: center center;
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
}
</style>
