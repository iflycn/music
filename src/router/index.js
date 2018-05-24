import Vue from "vue"
import Router from "vue-router"
import home from "@/pages/home"
import detail from "@/pages/detail"

Vue.use(Router)

export default new Router({
  routes: [{
    path: "/",
    name: "home",
    component: home
  }, {
    path: "/detail/:id",
    name: "detail",
    component: detail
  }],
  scrollBehavior() {
    return { x: 0, y: 0 }
  }
})
