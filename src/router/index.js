import Vue from 'vue';
import VueRouter from 'vue-router'
import vueAudioPlayer from '../components/VueAudioPlayer'
Vue.use(VueRouter)
const routes = [
    {
        path:'/',
        name:'vueAudioPlayer',
        component:vueAudioPlayer,
    }
];
const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
export default router