<template>
    <div class="Login">
        <div  class="LoginBox">
            <div class="LoginImg"><img src="../assets/logo.png"></div>
            
            <el-form  ref="FormRef" :model="ruleForm" status-icon :rules="FormRules" class="LoginForm">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-xingmingyonghumingnicheng" v-model="ruleForm.username" placeholder="请输入用户名..."></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mima" v-model="ruleForm.password" type="password" placeholder="请输入密码..."></el-input>
                </el-form-item>
                 <el-form-item class="formbtns">
                    <el-button type="primary" @click="SubmitLogin">登录</el-button>
                    <el-button @click="Reset">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data(){
      
        return{
               ruleForm:{
               
                 username:'admin',
                 password:'123456'
               },
               //字段验证规则
               FormRules:{
                  username: [
                                {required: true,message: '请输入登录名称', trigger: 'blur' },
                                { min: 5, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                            ],  
                  password: [
                                {required: true,message: '请输入密码', trigger: 'blur' },
                                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                            ],      
                        }

               
           
        

             }
             
   
    
    },
    methods:{
        //提交登录
        SubmitLogin(){
           //调用属性验证成功的方法
            this.$refs.FormRef.validate(async valid=>{
               
                if(!valid) return;
                //接受api接口返回得数据
                const { data : res}=await this.$http.post("login",this.ruleForm);
                console.log(res)
                 //判断返回的数据状态，如果不是200登陆失败
                if(res.meta.status !== 200) return this.$message.error("登录失败");
                this.$message.success("登录成功");
                //登录成功跳转到首页
              
                //将登录成功之后的token值保存到sessionStorage中
                window.sessionStorage.setItem("token",res.data.token);
                //编程式导航执行跳转到首页
                this.$router.push("/home");
             

            }


            );


        },
        Reset(){
            //重置方法
           this.$refs.FormRef.resetFields() ;
        }
    }
}
</script>
<style lang="less" scoped>
.Login{height: 100%;background: #66B1FF;}
  
 
  .LoginBox{
      width: 550px;
      height: 400px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
       .LoginImg{
          width: 200px;
          height: 200px;
          border: 1px solid #eee;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 0%;
          transform: translate(-50%,-50%);
          box-shadow: 0 0 10px #eee;
          background: #fff;
          }

          .LoginImg img{
            background-size:100% 100% ;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            border-radius: 50%;
      }
  }
  .LoginForm{
    position: absolute;
    bottom: 50px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

  }
  .formbtns{
      display: flex;
      justify-content: flex-end;
  }


</style>