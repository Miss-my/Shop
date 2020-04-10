<template>
  <el-container class="home-container">
  <el-header>
      <div class="head-logo"><img src="../assets/logo.png">电商后台管理系统</div>
      <el-button type="info" @click="ClearLogin" class="clearbtns">退出登录</el-button>
  </el-header>
  <el-container>
    <el-aside :width="Iscollapse?'64px':'200px'" class="Homeleft">
        <div class="taggle-btns" @click="TaggleCollapse">|||</div>
        <el-menu class="el-menu-vertical-demo" background-color="#313743" active-text-color="#66B1FF" text-color="#fff" unique-opened :collapse="Iscollapse" 
         :collapse-transition="false" router>

        <el-submenu :index="menulist.id+''" v-for="menulist in menulists" :key="menulist.key" >  
            <template slot="title">
            <i :class="icosObj[menulist.id]"></i>
            <span>{{menulist.authName}}</span>
            </template>

                <el-menu-item :index="'/'+subitem.path"   v-for="subitem in menulist.children" :key="subitem.id" >
                    <template slot="title" >
                        <i class="el-icon-menu"></i>
                        <span>{{subitem.authName}}</span>
                    </template>          
                 </el-menu-item>

 
      
         </el-submenu>


   
         </el-menu>
    </el-aside>
    <el-main class="Homeright">
        <!--路由占位符-->
    <router-view></router-view>
    </el-main>
  </el-container>
</el-container>

</template>
<script>
export default {
    data(){
        return{
            
         menulists:[],
         icosObj:{
             '125':'iconfont icon-yonghuicon',
             '103':'iconfont icon-quanxian',
             '101':'iconfont icon-shangpin-tianchong',
             '102':'iconfont icon-dingdan',
             '145':'iconfont icon-tongji'
             
         },
        Iscollapse:false
         

        }
    },
    created(){
        this.GetMenuList();
        
    },
    methods:{
        //退出登录
        ClearLogin(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        //获取菜单列表
       async GetMenuList(){
        const  { data : res }=await this.$http.get('menus');
      
        if(res.meta.status!==200) return this.$message.error(res.meta.msg);
        this.menulists=res.data;
         console.log(res);

        },

        TaggleCollapse(){
         this.Iscollapse=!this.Iscollapse;
          
           
        }


   


    
    
    }
}
</script>
<style lang="less" scoped>

.home-container{height: 100%;}
.el-header{
    background:#363D40;
    display: flex;
    justify-content:space-between ;
    font-size: 22px;
    color: #fff;
    align-items: center;

    >div{
        display: flex;
        align-items: center;
        }
   

    
    }
     .head-logo img{
         width: 50px;
         height: 50px;
   }
.el-aside{
    background: #313743;
 }
.el-main{
    background: #E9EDF1;
}

.el-menu{
    border-right: 0;
 }
.iconfont{
    margin-right: 10px;
}
.taggle-btns{
    background: #000;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    font-size: 10px;
    line-height: 24px;
}

</style>