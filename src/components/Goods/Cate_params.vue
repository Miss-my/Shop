<template>
    <div>
          <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon> </el-alert>
           
            <el-row class="choose">
                <el-col>
                    <span>选择商品分类：</span>   
                    <el-cascader
                        v-model="SelectKeys"
                        :options="getseletcate"
                        :props="CascaderProps"
                        @change="CateTypeChanged" clearable>
                    </el-cascader>
                </el-col>
               
            </el-row>
            <!--tab选项区域-->
          
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="动态参数" name="many">
                        <el-button type="primary" size="mini" :disabled="IsBtnDisabled" @click="AddParamsdialogVisible =true">添加参数</el-button>
                        <el-table :data="manyTabData" border stripe>
                            <el-table-column type="expand" >
                                <template slot-scope="scope">
                                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClickClosed(i ,scope.row)">
                                        {{item}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="#"></el-table-column>
                            <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
                            <el-table-column  label="操作" >
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="GetEditParamsinfo(scope.row.attr_id)">编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="静态属性" name="only">
                        <el-button type="primary" size="mini" :disabled="IsBtnDisabled" @click="AddParamsdialogVisible =true">添加属性</el-button>
                            <el-table :data="onlyTabData" border stripe>
                            <el-table-column type="expand" >
                                   <template slot-scope="scope">
                                    <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClickClosed(i ,scope.row)">
                                        {{item}}
                                    </el-tag>
                                    <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)"
                                    >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column type="index" label="#"></el-table-column>
                            <el-table-column  label="属性名称" prop="attr_name"></el-table-column>
                            <el-table-column  label="操作" >
                                <template slot-scope="scope">
                                    <el-button type="primary" icon="el-icon-edit" @click="GetEditParamsinfo(scope.row.attr_id)">编辑</el-button>
                                    <el-button type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                </el-tabs>
       </el-card>
       <!--添加参数弹框区域-->
       
       <el-dialog
        :title="'添加'+titleText"
        :visible.sync="AddParamsdialogVisible"
        @close="AddParamsClosed">
        <el-form :model="AddParamsData" :rules="AddParamsRules" ref="AddParamsRef" label-width="80px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="AddParamsData.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="AddParamsdialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="AddParams">确 定</el-button>
            </span>
       </el-dialog>

       <!--修改参数弹框区域-->
              
       <el-dialog
        :title="'修改'+titleText"
        :visible.sync="EditParamsdialogVisible"
        @close="EditParamsClosed">
        <el-form :model="EditParamsData" :rules="EditParamsRules" ref="EditParamsRef" label-width="80px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="EditParamsData.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditParamsdialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="EditParams">确 定</el-button>
            </span>
       </el-dialog>


    </div>
</template>
<script>
export default {
    data(){
        return{
          //所有商品分类的数据，默认为空
          getseletcate:[],
          //所有商品分类的id数组
          SelectKeys:[],
          CascaderProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                

          },
          //tab默认显示的区块
          activeName:'many',
          //动态参数，默认为空
          manyTabData:[],
          //静态属性，默认为空
          onlyTabData:[],
          AddParamsdialogVisible:false,
          //添加参数的表单，默认为空
          AddParamsData:{
              attr_name:'',

          },
          //验证添加参数的规则
          AddParamsRules: {
            attr_name: [
                { required: true, message: '请输入', trigger: 'blur' },
                
            ],
         },
         EditParamsdialogVisible:false,
         EditParamsData:{
             attr_id:'',
             attr_name:'',
         },
         EditParamsRules:{
             attr_name:[
                 { required: true, message: '请输入', trigger: 'blur' },
             ]
         },



        }
    },
    created(){
        this.getSelectCate();
    },
    computed: {
        //如果按钮需要被禁用,则返回ture(没有选择分类的情况下)
        IsBtnDisabled(){
            if(this.SelectKeys.length!==3){
                return true;
            }
            return false;

        },
        CateId(){
            //如果选择了分类，就返回分类的id
           if(this.SelectKeys.length==3){
             return  this.SelectKeys[2]
           }
             return null;
        },
        titleText(){
            if(this.activeName==="many"){
                return "动态参数";
            }
            return "静态属性";

        },
        

    },
    methods:{
        //获取级联分类
        async  getSelectCate(){
         const {data:res}=await this.$http.get('categories');
         
          if(res.meta.status!==200){
              return;
              this.$message.error('获取失败');
          }
          this.getseletcate=res.data;

        },
        //监听分类级联发生变化的事件
        async CateTypeChanged(){

            this.getParamsData();
            console.log(this.SelectKeys);
       
      

        },
        async getParamsData(){

            if(this.SelectKeys.length!==3){
                        this.SelectKeys=[];
                        this.manyTabData=[];
                        this.onlyTabData=[];
                        return;
                    }

                const {data:res}=await this.$http.get(`categories/${this.CateId}/attributes`,{params:{sel:this.activeName}});
              
                if(res.meta.status!==200){
                    return;
                    this.$message.error('获取参数列表失败');
                }
              
                 res.data.forEach(item => {
                  item.attr_vals=item.attr_vals ? item.attr_vals.split(' '):[];
                  //控制文本框的显示与隐藏
                  item.inputVisible=false;
                  //文本框中输入的值
                  item.inputValue='';
                    
                });
                //判断属于什么类型的参数
                if(this.activeName=='many'){
                    this.manyTabData=res.data;
                }else{
                    this.onlyTabData=res.data;
                }
          

        },
        //选择项因为点击发生改变的事件
        handleClick(){
            this.getParamsData();
            
         

        },
        //添加功能重置事件
        AddParamsClosed(){
          this.$refs.AddParamsRef.resetFields();
        },
        //添加分类参数
         AddParams(){
          this.$refs.AddParamsRef.validate(async valid=>{
             const {data:res}=await this.$http.post(`categories/${this.CateId}/attributes`,{attr_name :this. AddParamsData.attr_name,attr_sel:this.activeName})
             if(res.meta.status!==201){
                 return this.$message.error('创建失败')

             }
             this.getParamsData();
             this.AddParamsdialogVisible=false;
          })
     

        },
        //修改参数的重置操作
        EditParamsClosed(){
          this.$refs.EditParamsRef.resetFields();
        },
        //获取修改操作的查询事件
        async GetEditParamsinfo(eid){
          const {data:res}=await this.$http.get(`categories/${this.CateId}/attributes/${eid}`,{
              params:{attr_sel:this.activeName}
          }
              
          )
          if(res.meta.status!==200){
              return this.$message.error('获取参数列表失败')
          }
          this.EditParamsData=res.data;
          this.EditParamsdialogVisible=true;

        },
        //修改操作
        EditParams(){
          this.$refs.EditParamsRef.validate(async valid=>{
               const {data:res}= await this.$http.put(`categories/${this.CateId}/attributes/${this.EditParamsData.attr_id}`,{
                    attr_name:this.EditParamsData.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status!==200){
                    return
                    this.$message.error('更新失败')
                }
                this.getParamsData();
                this.EditParamsdialogVisible=false;


            })
        },
        //删除操作
        async  removeParams(rid){
    
         const removeParamsResult= await this.$confirm('此操作将永久删除数据，确定要继续吗','提示',{
                type:'waring'
           }).catch(error=>error)

           if(removeParamsResult!=='confirm'){
                    return this.$message.info('取消删除');
           }
           const {data:res}=await this.$http.delete(`categories/${this.CateId}/attributes/${rid}`)
       
           if(res.meta.status!==200){
               return this.$message.error('删除失败')
           }
           this.getParamsData();
           
     

        },
        //文本框失去焦点，或者按下enter键会触发的事件
       async handleInputConfirm(row){
          if(row.inputValue.trim().length==0){
             row.inputValue=""
             row.inputVisible=false;
             return;

          }
          //如果没有return，进行后续累加操作
          row.attr_vals.push(row.inputValue.trim());
          row.inputValue="";
          row.inputVisible=false;
          //发送参数修改的请求
          this.saveAttrVals(row);



     
        },
        showInput(row){
            
            row.inputVisible=true;
            //让button文本框显示后自动获取焦点
            //$nextTick的作用，就是页面的元素被重新渲染后，才会自动回调函数的代码
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });



        },
        async saveAttrVals(row){
         //发送参数修改的请求
          const {data:res}=await this.$http.put(`categories/${this.CateId}/attributes/${row.attr_id}`,{
              attr_name:row.attr_name,
              attr_sel:row.attr_sel,
              attr_vals:row.attr_vals.join(' ')
           })
           if(res.meta.status!==200){
               return;
               this.$message.error('修改参数项失败');
           }
        },
        //删除参数可选项的操作
        handleClickClosed(i,row){
          row.attr_vals.splice(i,1)
          this.saveAttrVals(row);
        }


     
    }
}
</script>
<style lang="less" scoped>
.choose{margin-top: 15px;}
.el-tabs{margin-top: 15px;}
.el-tag{margin: 5px;}
.input-new-tag{width:100px;}
</style>