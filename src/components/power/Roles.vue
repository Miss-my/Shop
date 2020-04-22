<template>
    <div>
 <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button type="primary" @click="AddrolesVisible = true">添加角色</el-button>
            <el-table :data="roleslist" border stripe>
                <el-table-column  type="expand">
                    <template slot-scope="scope">
                    
                        <!--一级循环-->
                        <el-row v-for="(item,i1) in scope.row.children" :key="item.id" :class="['bobottom',i1===0?'botop':'']" > 
                            <el-col :span="4">
                              <el-tag closable @close="RemoveRightById(scope.row,item.id)">
                                {{item.authName}}
                              </el-tag><i class="el-icon-caret-right"></i>
                            </el-col>
                            
                            <el-col :span="19" >
                                <el-row v-for="(item1,i2) in item.children" :key="item1.id" :class="[i2===0?'':'botop']">
                                    <el-col :span="5">
                                        <el-tag type="success" closable @close="RemoveRightById(scope.row,item1.id)">
                                        {{item1.authName}}
                                        </el-tag><i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="30">
                                        <el-tag v-for="item2 in item1.children" :key="item2.id" type="warning" closable @close="RemoveRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>

                                    </el-col>
                            
                                </el-row>
                            </el-col>
                        </el-row>
                       
                    </template>
                </el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                         <el-button type="primary" icon="el-icon-edit" size="small" @click="GetEditRoles(scope.row)">编辑</el-button>
                         <el-button type="danger" icon="el-icon-delete" size="small" @click="RemoveRoles(scope.row)">删除</el-button>
                         <el-button type="warning" icon="el-icon-setting" size="small" @click="GetRightsDialog(scope.row)">分配权限</el-button>
                    </template>

                </el-table-column>
            </el-table>
        
           
        </el-card>
        <!--添加角色-->
        <el-dialog title="添加角色" :visible.sync="AddrolesVisible" @close="CloseAddForm">
            <el-form :model="RolesForm" tatus-icon :rules="Rolesrules" ref="RolesruleForm" label-width="100px"> 
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="RolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="RolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="AddrolesVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddRoles">确 定</el-button>
        </span>
        </el-dialog>
        <!--修改角色-->
        <el-dialog title="修改角色" :visible.sync="EditrolesVisible" @close="CloseEditForm">
            <el-form :model="EditRolesForm" tatus-icon :rules="Rolesrules" ref="RolesruleForm" label-width="100px"> 
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="EditRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="EditRolesForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="EditrolesVisible = false">取 消</el-button>
            <el-button type="primary" @click="EditRoles">确 定</el-button>
        </span>
        </el-dialog>
        <!--分配权限-->
        <el-dialog title="分配权限" :visible.sync="SetRightsVisible" @close="SetRightsDialogClose">
         <el-tree :data="GetrightsData" :props="rightsProps" 
         @node-click="GetrightsData" show-checkbox default-expand-all 
         node-key="id" :default-checked-keys="Dekeys" ref="TreeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
            <el-button @click="SetRightsVisible = false">取 消</el-button>
            <el-button type="primary" @click="AllowRights">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            roleslist:[],
            AddrolesVisible:false,
            EditrolesVisible:false,
            SetRightsVisible:false,
            RolesForm:{
                roleName:'',
                roleDesc:''



            },
            Rolesrules:{
                roleName:[
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { min: 4, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }                   
                ],
                roleDesc:[
                    { required: true, message: '请输入角色描述', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }                   
                ],
            },
            EditRolesForm:{
                roleId:'',
                roleName:'',
                roleDesc:''
                


            },
            GetrightsData:[],
            rightsProps:{
                children:'children',
                label:'authName'
            },
            Dekeys:[],
            //当前即将分配权限的id
            roleId:''



        }
    },
    created(){
        this.GetRolesList();
    },
    methods:{

        //获取角色列表
       async GetRolesList(){
           const {data:res} =  await this.$http.get('roles');  
           if(res.meta.status!==200){
               return;
               this.$message.error('获取角色列表失败');
           }
           this.roleslist=res.data;

          
           


           
        },
        //添加角色
        AddRoles(){
          
            this.$refs.RolesruleForm.validate(async volid=>{
              const {data:res}= await this.$http.post('roles',this.RolesForm);
          
 
              if(res.meta.status !==201){
                  return this.$message.error('添加角色失败');

              }
 
              this.GetRolesList();

            })
        
            
        },
        //监听关闭添加弹框后的重置操作
        CloseAddForm(){
            this.$refs.RolesruleForm.resetFields();
            
        },
        CloseEditForm(){
         this.$refs.RolesruleForm.resetFields();   
        },
        //点击修改弹框出现后的查询事件
        async GetEditRoles(eid){
       
           const {data:res}=await this.$http.get('roles/'+eid)
           if(res.meta.status!==200){
               return;
               this.$message.error('获取角色列表失败');
           }
            
            this.EditRolesForm=res.data;
            this.EditrolesVisible=true;
        },
        //修改角色
        EditRoles(id){
  
            this.$refs.RolesruleForm.validate(async valid=>{
              if(!valid) return;
              const {data:res}=await this.$http.put('roles/'+this.EditRolesForm.roleId,{
                  roleName:this.EditRolesForm.roleName,
                  roleDesc:this.EditRolesForm.roleDesc

              });
             
              if(res.meta.status!==200){
                  return this.$message.error('修改角色失败')
              }
              this.GetRolesList();
              this.EditrolesVisible=false;
            })

        },
        //删除角色
        async RemoveRoles(rid){
            const rrres=await this.$confirm('此操作将永久删除数据，确定要继续吗','提示',{
                
                type:'warning'

                }).catch(error=>error)

                    if(rrres!='confirm'){
                        return this.$message.info('取消删除');
                  
                }
               const {data:res}=await this.$http.delete('roles/'+rid);
               if(res.meta.status!==200){
                   return this.$message.error('删除失败');
               }
               this.GetRolesList();

          

        },
        //定义是否删除权限的方法
        async RemoveRightById(role,rightid){
            const ConfirmResult=await this.$confirm('此操作将永久删除数据，确定要继续吗','提示',{
                
                type:'warning'

                }).catch(error=>error)

                    if(ConfirmResult!='confirm'){
                        return this.$message.info('取消删除');
                  
                }
               const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightid}`);
               if(res.meta.status!==200){
                   return;
                   this.$message.error('删除权限失败')

               }
               //删除权限后依旧展开所有权限列表信息
               role.children=res.data;
           
        


        },
        //获取所有权限
        async GetRightsDialog(role){
          this.roleId=role.id;
          const {data:res}= await this.$http.get('rights/tree')
          
          if(res.meta.status!==200){
              return
              this.$message.error('获取权限列表失败');
          }
         
            this.GetrightsData=res.data;
            //递归获取三级节点的id
            this.GetLeafid(role, this.Dekeys);

            this.SetRightsVisible=true;

            
        },
        //定义一个递归函数，用来获取所有三级权限的id并保存到Dekeys数组中
        GetLeafid(node,arr){
            //1.判断该节点是否为三级节点(如何有children属性则说明不为三级属性，取反判断)
            if(!node.children){
                return arr.push(node.id);
               
            }
            node.children.forEach(item => 
                this.GetLeafid(item, arr)
                
           );

        },
        //监听权限弹框关闭后的监听事件
        SetRightsDialogClose(){
        this.Dekeys=[];

        },
        //请求给角色重新分配权限(新增或者删除权限)
        async AllowRights(){
           const keys=[
               ...this.$refs.TreeRef.getCheckedKeys(),
               ...this.$refs.TreeRef.getHalfCheckedKeys()
           ]
         
           const idStr=keys.join(',')
           const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{
              rids:idStr
            });
            if(res.meta.status!==200){
                return
                this.$message.error('分配权限失败')
            }
            this.GetRolesList();
            this.SetRightsVisible=false;
            
          
           

        }

        
    }
}
</script>
<style lang="less" scoped>
.el-tag{margin: 5px;}
.botop{border-top:1px solid #eee;}
.bobottom{border-bottom:1px solid #eee;}
.el-row{display:flex;align-items: center;}
</style>