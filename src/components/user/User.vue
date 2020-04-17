<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card class="box-card">
            <!--搜索框区域-->
           <el-row :gutter="20">
          

                <el-col :span="12">
                 <el-input placeholder="请输入内容"  class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserlist">
                 <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
                 </el-input>
                </el-col>
                <el-col :span="3">
                    <el-button type="primary" @click="AdddialogVisible = true">添加用户</el-button>
                </el-col>
          
            </el-row>
            <!--用户表格-->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="role_name" label="角色"> </el-table-column>
                <!--作用域插槽的渲染数据-->
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        
                        <el-switch v-model="scope.row.mg_state" @change="ChangeState(scope.row)"> </el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="ShowEditdialog(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small"  @click="DeleteUser(scope.row.id)"></el-button>
                        <el-tooltip  content="角色分配" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="small" @click="ResetRoles(scope.row)"></el-button>
                        </el-tooltip>
                    
                        
                    </template>
                </el-table-column>
        
            </el-table>
         
            <!--分页-->
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 3, 4]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>

        </el-card>
        <!--添加用户的弹框-->
        <el-dialog title="添加用户" :visible.sync="AdddialogVisible" @close="CloseAddForm">
            <el-form :model="AddUserForm" status-icon :rules="AddUserrules" ref="AddUserrule" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input type="input" v-model="AddUserForm.username"></el-input>
                </el-form-item>
                 <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="AddUserForm.password"></el-input>
                </el-form-item>
                 <el-form-item label="电话" prop="mobile">
                    <el-input type="input" v-model="AddUserForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="input" v-model="AddUserForm.email"></el-input>
                </el-form-item>

            </el-form>

       
        <span slot="footer" class="dialog-footer">
            <el-button @click="AdddialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddUser">确 定</el-button>
        </span>
        </el-dialog>
        <!--修改用户的弹框-->
          <el-dialog title="修改用户信息" :visible.sync="EditdialogVisible" @close="CloseEditForm">
            <el-form :model="EditUserForm" status-icon :rules="AddUserrules" ref="EditUserrule" label-width="100px">
                <el-form-item label="用户名">
                    <el-input type="input" v-model="EditUserForm.username" disabled></el-input>
                </el-form-item>
   
                 <el-form-item label="电话" prop="mobile">
                    <el-input type="input" v-model="EditUserForm.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="input" v-model="EditUserForm.email"></el-input>
                </el-form-item>

            </el-form>

       
         <span slot="footer" class="dialog-footer">
            <el-button @click="EditdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditUser">确 定</el-button>
        </span>
        </el-dialog>
        <!--角色分配-->
        <el-dialog title="分配角色" :visible.sync="ResetRolesdialogVisible">
          <div>
              <p>当前的用户:&nbsp;&nbsp;{{RuserInfo.username}}</p>
              <p>当前的角色:&nbsp;&nbsp;{{RuserInfo.role_name}}</p>
              <p>新分配的角色:&nbsp;&nbsp;
                <el-select v-model="SelectRoles" placeholder="请选择">
                <el-option
                v-for="item in roleslist"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
                </el-option>
            </el-select>  


              </p>
          </div>

       
         <span slot="footer" class="dialog-footer">
            <el-button @click="ResetRolesdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="SaveRoleInfo">确 定</el-button>
        </span>
        </el-dialog> 

       

    </div>
</template>
<script>
export default {
    data(){
        //验证手机号的合法性
        var checkMobile=(rule,value,callback)=>{
            const regMoblie=/^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
            if(regMoblie.test(value)){
                return callback();

            }
            callback(new Error('请输入合法的手机号'));

        }
        //验证邮箱的合法性
        var checkEmail=(rule,value,callback)=>{
            const regEmail=/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;
            if(regEmail.test(value)){
                return callback();
            }
            callback(new Error('请输入合法的邮箱'));
            
        }

        return{
            //获取用户列表的参数
            queryInfo:{
                query:'',
                //当面页数
                pagenum:1,
                //当前每页显示多少条数据
                pagesize:2

            },
            userlist: [],
            total:0,
            AdddialogVisible:false,
            EditdialogVisible:false,
            ResetRolesdialogVisible:false,
            AddUserForm:{
                username:'',
                password:'',
                mobile:'',
                email:'',

            } ,
            AddUserrules:{
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                mobile:[
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
                email:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],                                

            },
            EditUserForm:{

            },
            //需要被分配角色的用户信息
            RuserInfo:{},
            //所有角色列表
            roleslist:[
         
            ],
            SelectRoles: ''

            

        }
    },
    created(){
        this.getUserlist();

    },
    methods:{
        async getUserlist(){
         const {data:res} =  await this.$http.get('users',{params:this.queryInfo})
         if(res.meta.status!==200)return this.$message.error(res.meta.msg);
         this.$message.success(res.meta.msg)
        // console.log(res);
         //获取用户信息
         this.userlist=res.data.users;
         this.total=res.data.total;
        
        },
        //监听pageSize改变的事件(每页显示的条数)
        handleSizeChange(newSize){
         this.queryInfo.pagesize=newSize;
         this.getUserlist();
        },
        //监听页码值改变的事件<值>
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getUserlist();
        },
        //监听状态发生改变的函数
        async ChangeState(userinfo){
        const {data: res}=  await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
        if(res.meta.status!== 200) {
            userinfo.mg_state =! userinfo.mg_state;
            return this.$message.error(res.meta.msg);
            } 
            this.$message.success(res.meta.msg);
         },
        //监听关闭对话后的重置操作
        CloseAddForm(){
            this.$refs.AddUserrule.resetFields();

        },
        //添加用户的方法
        AddUser(){
            this.$refs.AddUserrule.validate(async valid=>{
              const {data:res}= await this.$http.post('users',this.AddUserForm);
              if(res.meta.status !==201){
                  return this.$message.error('添加用户失败');

              }
              this.$message.success('添加用户成功');
              this.AdddialogVisible=false;
              this.getUserlist();
            })

        },
        //修改弹框显示后查询用户信息的方法
        async ShowEditdialog(id){
          //console.log(id);
          const {data:res}=await this.$http.get('users/'+id);
          if(res.meta.status!==200){
              return ;
              this.$message.error('展示信息失败');


          }
          //把查询出来的值赋值到修改文本框里面
          this.EditUserForm=res.data;
          this.EditdialogVisible=true;

        },
       //监听关闭修改对话后的重置操作
        CloseEditForm(){
            this.$refs.EditUserrule.resetFields();
       },
        
        //修改用户的方法
        EditUser(){
            this.$refs.EditUserrule.validate(async valid=>{
              
                if(!valid) return;
                const {data:res}=await this.$http.put('users/'+this.EditUserForm.id,
                {email:this.EditUserForm.email,mobile:this.EditUserForm.mobile});
                console.log(res);
                return;
                if(res.meta.status!==200){
                    return this.$message.error('更新用户信息失败');

                }
                this.EditdialogVisible=false;
                this.getUserlist();

            })
            


        },
        //删除用户的方法
        async DeleteUser(uid){
          const RemoveUserinfo=await this.$confirm('此操作将永久删除数据，确定要继续吗','提示',{
                type:'warning'

            }).catch(error=>error)
             if(RemoveUserinfo!=='confirm'){
                  return  this.$message.info('已经取消删除');
            }
            
           
             
             const {data:res}=await this.$http.delete('users/'+uid);
             
             if(res.meta.status!==200){
                 return;
                 this.$message.error('删除用户失败');

             }
             this.$message.success('删除用户成功');
             this.getUserlist();

           
            
             
         

        },
        //分配角色
        async ResetRoles(ruinfo){
    
 
            this.RuserInfo=ruinfo;

            const {data:res} =  await this.$http.get('roles')
            if(res.meta.status!==200){
                return;
                this.$message.error('获取角色列表失败');
            }
            this.roleslist=res.data;
           
            

            this.ResetRolesdialogVisible=true;

        },
        //提交重新选择角色后的方法
        async SaveRoleInfo(){

     
            if(!this.SelectRoles){
                return;
                this.$message.error('请选择要分配的角色')
            }
            const {data:res}=await  this.$http.put(`users/${this.RuserInfo.id}/role`,{rid:this.SelectRoles})

           if(res.meta.status!==200){
               return this.$message.error('分配角色失败');
            }

            this.getUserlist();
            this.ResetRolesdialogVisible=false;

        }

        


    },
}
</script>
<style lang="less" scoped>

</style>