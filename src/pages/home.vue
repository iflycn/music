<template>
  <div class="home">
    <h1 class="songs_title">推荐歌单</h1>
    <ul class="songs_list">
      <li v-for="(v, i) in slist" :key="i"><router-link :to="'/detail/' + v.id">
        <span>{{ $_CompleteNum(i) }}</span>
        <h4>{{ v.name }}</h4>
        <small>{{ v.artist }} - {{ v.name }}</small>
      </router-link></li>
    </ul>
    <a href="https://github.com/iflycn/music" class="copyright">Fork: Github.com/iflycn/music</a>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      slist: []
    };
  },
  created() {
    this.$_GetList();
  },
  methods: {
    $_CompleteNum(i) {
      i += 1;
      return ((1 << 2).toString(2) + i).slice(-2);
    },
    $_GetList() {
      const that = this;
      that.axios
        .get(that.util.baseUrl + "/slist")
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
.copyright{
  display: block;
  padding: 1em;
  font-size: 0.6em;
  color: #888;
  text-align: center;
}
</style>
