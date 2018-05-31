const state = {
  ids: [],
  timer: -1,
  isPaused: !0,
  line: 1e-3,
  duration: 0,
  currentTime: 0,
  song: {
    id: -1,
    name: null,
    artist: null,
    url: null,
    picUrl: require("../assets/disc_default.png"),
    lyric: ""
  }
}

const getters = {
  formatLrc: state => {
    const lrc = state.song.lyric
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
          time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 10,
          txt
        });
      }
    }
    lines.sort((a, b) => {
      return a.time - b.time;
    });
    return lines;
  }
}

const mutations = {
  setAudioIds(state, payload) {
    state.ids = payload;
  },
  setAudioTimer(state, payload) {
    state.timer = payload;
  },
  setAudioIsPaused(state, payload) {
    state.isPaused = payload;
  },
  setAudioLine(state, payload) {
    state.line = payload;
  },
  setAudioDuration(state, payload) {
    state.duration = payload;
  },
  setAudioCurrentTime(state, payload) {
    state.currentTime = payload;
  },
  setAudioSong(state, payload) {
    state.song = payload;
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
