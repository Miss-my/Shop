import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Goods_cate from '../components/Goods/Goods_cate'

Vue.use(VueRouter)



const router = new VueRouter({
  routes:[
    {
      path:'/',
      redirect:'/login',
    }, 
    {
      path:'/login',
      component:Login,
    },
    {
      path: '/home',
      component: Home,
      redirect:'/welcome',
      children:[
        {
          path:'/welcome',
          
          component:Welcome,
        },
        {
          path:'/users',
          
          component:User,
        },
        {
          path:'/rights',
          component:Rights,
        },
        {
          path:'/roles',
          component:Roles,
        },
        {
          path:'/categories',
          component:Goods_cate,
          
        }
      ]
    
    },


   ]
});
//挂载路由导航首位，必须要登录后才能进入首页
//to表示将要访问的路径
//from 表示从哪个路径来
//next()是一个放行函数
router.beforeEach((to, from ,next)=>{
  
  if(to.path==='/login') return next();
     const TokenStr= window.sessionStorage.getItem('token');
     //如何没有登录成功的token强制跳转到登录页面
     if(!TokenStr) return next('/login');
     next();
 





})
export default router;
