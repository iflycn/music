<template>
  <audio ref="audio" :src="audio.song.url || 'data:audio/mp3;base64,/+MYxAAAAANIAUAAAASEEB/jwOFM/0MM/90b/+RhST//w4NFwOjf///PZu////9lns5GFDv//l9GlUIEEIAAAgIg8Ir/JGq3/+MYxDsLIj5QMYcoAP0dv9HIjUcH//yYSg+CIbkGP//8w0bLVjUP///3Z0x5QCAv/yLjwtGKTEFNRTMuOTeqqqqqqqqqqqqq/+MYxEkNmdJkUYc4AKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'" preload></audio>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  name: "GAudio",
  computed: {
    ...mapState(["audio"]),
    ...mapGetters(["formatLrc"])
  },
  created() {
    this.$root.bus.$on("GAudioFixAutoplay", () => {
      this.$_FixAutoplay();
    });
    this.$root.bus.$on("GAudioSongToggle", () => {
      this.$_SongToggle();
    });
    this.$root.bus.$on("GAudioSongJump", () => {
      this.$_SongJump();
    });
    this.$_Init();
  },
  destroyed() {
    location.reload();
  },
  watch: {
    $route() {
      this.$_Init();
    },
    "audio.duration"() {
      this.audio.duration > 0 && this.$_SongPlay();
    },
    "audio.currentTime"() {
      if (this.audio.currentTime >= this.audio.duration) {
        this.audio.ids.length > 1 ? this.$_SongNext() : this.$_SongPause();
      }
    },
    "audio.song.id"() {
      clearInterval(this.audio.timer);
      this.setAudioTimer(setInterval(() => this.$_StartTimer(), 1e3));
    }
  },
  methods: {
    ...mapMutations([
      "setAudioIds",
      "setAudioTimer",
      "setAudioIsPaused",
      "setAudioLine",
      "setAudioDuration",
      "setAudioCurrentTime",
      "setAudioSong"
    ]),
    $_StartTimer() {
      const duration = this.$refs.audio.duration;
      const currentTime = this.$refs.audio.currentTime;
      this.setAudioDuration(duration);
      this.setAudioCurrentTime(currentTime);
      const lrc = [...this.formatLrc];
      if (!this.audio.isPaused) {
        lrc.push({ time: duration * 1e3 });
        if (currentTime < lrc[0].time / 1e3) {
          this.setAudioLine(1e-3);
        } else {
          for (let i = 0; i < lrc.length - 1; i++) {
            if (
              currentTime >= lrc[i].time / 1e3 &&
              currentTime < lrc[i + 1].time / 1e3
            ) {
              this.setAudioLine(i);
            }
          }
        }
      }
    },
    $_FixAutoplay() {
      this.$refs.audio
        .play()
        .then(() => {
          console.log("Autoplay has been repaired.");
        })
        .catch(err => {
          console.warn(err);
        });
    },
    $_SongPlay() {
      if (this.audio.duration > 0) {
        this.$refs.audio
          .play()
          .then(() => {
            this.setAudioIsPaused(!1);
          })
          .catch(err => {
            console.warn(err);
          });
      }
    },
    $_SongPause() {
      this.$refs.audio.pause();
      this.setAudioIsPaused(!0);
    },
    $_SongToggle() {
      this.audio.isPaused ? this.$_SongPlay() : this.$_SongPause();
    },
    $_SongLoad() {
      this.$refs.audio.load();
    },
    $_SongJump() {
      if (this.audio.currentTime < this.audio.duration) {
        this.$refs.audio.currentTime = this.audio.currentTime;
      }
    },
    $_SongNext() {
      this.setAudioDuration(0);
      this.audio.ids.splice(0, 1);
      this.audio.ids.push(this.audio.song.id);
      this.$_GetDetail(this.audio.ids[0]);
    },
    $_GetDetail(id) {
      this.axios
        .get(`${this.util.baseUrl}/detail?id=${id}`)
        .then(res => {
          this.setAudioSong(res.data);
          localStorage.history = this.audio.ids.join(",");
        })
        .catch(err => {
          console.error(err);
        });
    },
    $_Init() {
      const id = this.$route.params.id;
      if (id) {
        if (this.audio.ids.join(",").indexOf(id) === -1) {
          this.setAudioLine(1e-3);
        }
        this.setAudioIds(id.split(","));
        this.$_GetDetail(this.audio.ids[0]);
      }
    }
  }
};
</script>