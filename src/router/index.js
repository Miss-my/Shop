import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Goods_cate from '../components/Goods/Goods_cate'
import Cate_params from '../components/Goods/Cate_params'
import Goods_list from '../components/Goods/Goods_list'
import Goods_Add from '../components/Goods/Add'
import Order from '../components/Order/orderList'
import Report from '../components/Report/report'


Vue.use(VueRouter)

Vue.filter('dateFormat',function(originVal){
  const dt=new Date(originVal);

  const y=dt.getFullYear();
  //padStart用0进行填充

  const m=(dt.getMonth()+1+'').padStart(2,'0');
  const d=(dt.getDate()+'').padStart(2,'0');

  const hh=(dt.getHours()+'').padStart(2,'0');
  const mm=(dt.getMinutes()+'').padStart(2,'0');
  const ss=(dt.getSeconds()+'').padStart(2,'0');

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

})

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
          
        },
        {
          path:'/params',
          component:Cate_params,
        },
        {
          path:'/goods',
          component:Goods_list,
        },
        {
          path:'/goods/add',
          component:Goods_Add
        },
        {
          path:'/orders',
          component:Order
        },
        {
          path:'/reports',
          component:Report
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
