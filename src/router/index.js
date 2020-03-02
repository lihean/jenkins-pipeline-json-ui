import Vue from 'vue'
import Router from 'vue-router'
import Demo from '../views/demo/demo.vue'
import Index from '../views/index.vue'

Vue.use(Router)

export default new Router({
  base: '/cip/',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: '/demo',
          name: '示例',
          component: Demo
        }
      ]
    }
  ]
})
