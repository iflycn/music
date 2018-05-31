import Vue from "vue"
import axios from "axios"
import router from "./router"
import store from "./store"
import util from "./utils"
import app from "./app"

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.prototype.util = util

new Vue({
  el: "#app",
  render: h => h(app),
  router,
  store,
  components: {
    app
  },
  data: {
    bus: new Vue()
  },
  template: "<app/>"
})
