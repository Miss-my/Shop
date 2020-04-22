<template>
    <div>
         <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/rights' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-button type="primary" @click="AddCateDialog">添加分类</el-button>
            <tree-table :data="catelist"  :columns="Treecolumns" show-index border  :selection-type="false" :expand-type="false" index-text="#"  :show-row-hover="false">
                <!--自定义模板列之是否有效-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success  colorb" v-if="scope.row.cat_deleted===false"></i>
                    <i class="el-icon-circle-close colorb" v-else></i>
                </template>
                <!--自定义模板列之排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="info" v-else>三级</el-tag>
                </template>
          
             <!--自定义模板列之操作-->
                <template slot="opt"  slot-scope="scope">
                  
                   <el-button type="primary" icon="el-icon-edit" size="mini" @click="getCateById(scope.row.cat_id)">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
                </template>

              </tree-table>

            <!--分页区域-->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryinfo.pagenum"
            :page-sizes="[3, 5, 10, 15]"
            :page-size="queryinfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
            
        </el-card>

        <!--添加分类的弹窗-->
        <el-dialog title="添加分类" :visible.sync="AddCatedialogVisible" @closed="CateDialogClosed">
            <el-form :model="AddCateForm" :rules="AddCateRules" ref="CateruleForm" label-width="80px"> 
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="AddCateForm.cat_name"></el-input>
                    </el-form-item>
                    <!--opitons 用来指定数据源-->
                    <!--props 用来指定配置对象-->
                    <el-form-item label="父级分类">
                        <el-cascader
                        v-model="SelectKeys"
                        :options="catetypelist"
                        :props="CascaderProps"
                        @change="CateTypeChanged" clearable>
                        </el-cascader>
                    </el-form-item>
            
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="AddCatedialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="AddCate">确 定</el-button>
                </span>
        </el-dialog>

        <!--编辑分类弹窗-->
                <el-dialog title="编辑分类" :visible.sync="EditCatedialogVisible" @closed="CateDialogClosed">
                <el-form :model="EditCateForm" :rules="AddCateRules" ref="CateruleForm" label-width="80px"> 
                        <el-form-item label="分类名称" prop="cat_name">
                            <el-input v-model="EditCateForm.cat_name"></el-input>
                        </el-form-item>
                
                
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="EditCatedialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="EditCate()">确 定</el-button>
                </span>
        </el-dialog>
      


    </div>
</template>
<script>
export default {
    data(){
        return{
            //查询的条件
            queryinfo:{
                type:3,
                pagenum:1,
                pagesize:3

            },
            total:0,
            //商品分类列表，默认为空
            catelist:[],

            Treecolumns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    prop:'cat_deleted',
                    type:'template',
                    template:'isok'

                },
                {
                    label:'排序',
                    prop:'cat_level',
                    type:'template',
                    template:'order'


                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'
               
                  
                }
            ],
            AddCatedialogVisible:false,
            //添加分类的表单数据对象
            AddCateForm:{
          
                //分类名称
                cat_pid:0,
                //父级id
                cat_name:'',
                //分类的等级，默认添加一级分类
                cat_level:0

            },
            AddCateRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                                    
                ],
  
            },
            catetypelist:[],
            CascaderProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children',
                

            },
            //获取父级分类的id数组
            SelectKeys:[],
            EditCateForm:{
                cat_name:''
            },
            //编辑分类弹框
            EditCatedialogVisible:false,

        }

    },
    created(){
        
        this.getCateList();

    },
    methods:{
        //获取商品分类列表
        async getCateList(){
          const {data:res}=await  this.$http.get('categories',{params:this.queryinfo});
          
          if(res.meta.status!==200){
              return;
              this.$message.error('获取列表失败');
          }
          this.catelist=res.data.result;
          this.total=res.data.total;
          

        },
        //监听pagesize发生改变的事件
        handleSizeChange(newSize){
            this.queryinfo.pagesize=newSize;
            this.getCateList();
      


        },
        //监听pagenum页码发生改变的事件
        handleCurrentChange(newNum){
           this.queryinfo.pagenum=newNum;
           this.getCateList();  
        },
        //添加分类的弹框
        async AddCateDialog(){
            this.ParentCateList();
            this.AddCatedialogVisible=true;

        },
        //获取父级分类列表
        async ParentCateList(){
            const {data:res}=await this.$http.get('categories',{params:{type:2}})
          
            if(res.meta.status!==200){
                return this.$message.error('获取分类失败');
            }

            this.catetypelist=res.data;
            
        },

        //监听一个级联分类选择发生改变的事件
        CateTypeChanged(){
           
            //判断，如果SelectKeys数组中的length>0,说明选中的是父级分类
            //反之，说明没有选中任何父级分类
            if(this.SelectKeys.length>0){
                //父级分类的id
                this.AddCateForm.cat_pid=this.SelectKeys[this.SelectKeys.length-1];
                this.AddCateForm.cat_level=this.SelectKeys.length;
                return;
            }else{
                this.AddCateForm.cat_pid=0;
                this.AddCateForm.cat_level=0;
            }

        },
        //新增分类
        AddCate(){
            this.$refs.CateruleForm.validate(async valid=>{
              const {data:res}=await this.$http.post('categories',this.AddCateForm);
              if(res.meta.status!==201){
                  return this.$message.error('新增分类失败');
              }

              this.getCateList();
              this.AddCatedialogVisible=false;
            })
           
        },
        //监听添加分类表单重置事件
        CateDialogClosed(){
            this.$refs.CateruleForm.resetFields();
        },
        //根据id查询分类并赋值到修改分类输入框里面
        async getCateById(cid){
      
          const {data:res}=await this.$http.get('categories/'+cid);
          if(res.meta.status!==200){
               return this.$message.error('查询分类列表失败')
           }
           this.EditCateForm=res.data;
           this.EditCatedialogVisible=true;
         
        },
        //编辑分类数据
        EditCate(){
         this.$refs.CateruleForm.validate(async valid=>{
          const {data:res}=await this.$http.put('categories/'+this.EditCateForm.cat_id,{cat_name:this.EditCateForm.cat_name});
          if(res.meta.status !==200){
              return this.$message.error('更新分类失败')
          }
         });
         this.getCateList();
         this.EditCatedialogVisible=false;
        },
        //删除分类
        async removeCate(did){
         const removeCateInfo= await this.$confirm('此操作将永久删除数据，确定要继续吗','提示',{
                type:'waring'
                }).catch(error=>error)
                if(removeCateInfo!=='confirm'){
                    return this.$message.info('取消删除');
                }
               const {data:res}=await this.$http.delete('categories/'+did);
               if(res.meta.status!==200){
                   this.$message.error('删除分类失败')
               }
               this.getCateList();
        }

        

    }
}
</script>
<style lang="less" scoped>
.colorb{color: #409EFF;}
.zk-table{margin-top: 15px;}
.el-cascader{width: 100%;}
</style>