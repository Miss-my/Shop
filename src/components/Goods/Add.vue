<template>
    <div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>   
        <!--card视图区-->
        <el-card>
         <el-alert
            title="消息提示的文案"
            type="info"
            center
            show-icon>
         </el-alert>

         <el-steps :space="300" :active="Activeindex-0" finish-status="success" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
         </el-steps>
         <el-form :model="AddGoodsForm" :rules="AddGoodsrules" ref="AddGoodsruleForm"  :label-position=" 'top'"> 
         <el-tabs :tab-position="'left'"  v-model="Activeindex" :before-leave="beforeTabLeave" @tab-click="tabClicked">  
            <el-tab-pane label="基本信息" name='0'>
                <el-form-item label="商品名称" prop="goods_name" >
                    <el-input v-model="AddGoodsForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price" >
                    <el-input v-model="AddGoodsForm.goods_price" type="number"></el-input>
                </el-form-item>

                 <el-form-item label="商品重量" prop="goods_weight" >
                    <el-input v-model="AddGoodsForm.goods_weight" type="number"></el-input>
                </el-form-item>

                <el-form-item label="商品数量" prop="goods_number" >
                    <el-input v-model="AddGoodsForm.goods_number" type="number"></el-input>
                </el-form-item>

                 <el-form-item label="商品分类" prop="goods_cat" >
                      <el-cascader expand-trigger="hover"
                        v-model="AddGoodsForm.goods_cat"
                        :options="catelist"
                        :props="cateProps"
                        @change="handleChange">
                      </el-cascader> 
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane label="商品参数" name='1'>
                <el-form-item :label="item.attr_name" v-for="item in manyTabDate" :key="item.attr_id">
                      <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                      </el-checkbox-group>                  
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name='2'>
                <el-form-item :label="item.attr_name" v-for="item in olnyTabDate" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name='3'>
               
                <el-upload
                    :action="picUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                    <el-button type="primary">点击上传</el-button>
                </el-upload>
                
            </el-tab-pane>
            <el-tab-pane label="商品内容" name='4'>
                <quill-editor v-model="AddGoodsForm.goods_introduce"></quill-editor>
                <el-button type="primary" class="addbtn" @click="AddProduct">添加商品</el-button>
            </el-tab-pane>
    
         </el-tabs>
         </el-form>
        </el-card>   
         <!--缩略大图-->
        <el-dialog
            title="图片预览"
            :visible.sync="UploaddialogVisible"
            width="50%">
            <img :src="PreviewImg" class="imgSize">
       
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash';

export default {
    data(){
        return{
            Activeindex:'0',
            AddGoodsForm:{
                goods_name:'',
                goods_price:0,
                goods_weight:0,
                goods_number:0,
                goods_cat:[],
                pics:[],
                goods_introduce:'',
                attrs:[],
                



            },
            AddGoodsrules:{
                goods_name:[
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price:[
                   { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_number:[
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],               
                 goods_cat:[
                     { required: true, message: '请选择商品分类', trigger: 'blur' }
                 ]
                
            },
            //商品分类,默认为空
            catelist:[],
            cateProps:{
                label:'cat_name',
                value:'cat_id',
                children:'children'
            },
            //定义动态参数的数据，默认为空
            manyTabDate:[],
            //静态属性列表数据
            olnyTabDate:[],
            picUrl:'https://www.liulongbin.top:8888/api/private/v1/upload',
            //为图片上传设置一个请求头对象
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')

            },
            //图片弹框
            UploaddialogVisible:false,
            //缩略大图对象。默认为空
            PreviewImg:'',            
            


            }
    },
    created(){
        this.getcatelist();

    },

    methods:{
         //获取所有商品分类
         async  getcatelist(){
            const {data:res}=await this.$http.get('categories');
            if(res.meta.status!==200){
                return this.$message.error('获取分类失败')
            }
            this.catelist=res.data;

         },
         //级联选择框发生改变后得事件
         handleChange(){
             console.log(this.AddGoodsForm.goods_cat);
             if(this.AddGoodsForm.goods_cat.length!==3){
                 this.AddGoodsForm.goods_cat=[];
             }
         },
         //监听tab切换的处理函数
         //oldActiveName=>即将离开的标签页名字
         //activeName=>即将进入的标签页名字
         beforeTabLeave(activeName,oldActiveName){

             if(oldActiveName==='0' && this.AddGoodsForm.goods_cat.length!==3){                                            
                 this.$message.error('请选择分类');
                 return false;
             }
             
         },
         //定义一个tab切换激活的事件
         async tabClicked(){
             if(this.Activeindex==='1'){
      
                const {data:res}=await this.$http.get(`categories/${this.CateId}/attributes`,{params:{sel:'many'}})
                if(res.meta.status!==200){
                    return this.$message.error('获取参数失败')
                }
                res.data.forEach(item => {
                item.attr_vals=item.attr_vals.length===0?[]: item.attr_vals.split(' ')
                    
                });
     
                this.manyTabDate=res.data;
              }
              else if(this.Activeindex==='2'){
                 const {data:res}=await this.$http.get(`categories/${this.CateId}/attributes`,{params:{sel:'only'}})
                 console.log(res);
                 if(res.meta.status!==200){
                    return this.$message.error('获取静态属性失败')
                 }
                 console.log(res);
                 this.olnyTabDate=res.data;

              }
             
         },
         //点击标题弹出打图的事件
         handlePreview(file){
             console.log(file);
             this.PreviewImg=file.response.data.url;
             this.UploaddialogVisible=true;
 
             

         },
         //图片移除的事件
         handleRemove(file){
             //console.log(file);
             //1.获取将要删掉的临时路径
             const fileinfo=file.response.data.tmp_path;
             //2.从pics数组中找到这个图片对应的索引值
            const i= this.AddGoodsForm.pics.findIndex(x=>x.pic===fileinfo);
             //3.调用splice方法把图片信息对象从pics数组中移除出去
             this.AddGoodsForm.pics.splice(i,1)
            


         },
         //图片上传成功的钩子
         handleSuccess(response){
            
              //1.通过拼接得到一个图片数组对象
              const picinfo={
                  pics:response.data.tmp_path
              }
              //2.将图片信息对象push到pics数组对象中

              this.AddGoodsForm.pics.push(picinfo);

         },
         //添加商品
        AddProduct(){
             this.$refs.AddGoodsruleForm.validate(async valid=>{
                 if(!valid){
                     this.$message.error('请输入必填项')
                 }
              //执行添加的业务逻辑
              //loadsh cloneDeep(重新拷贝属性处理)
              const form=_.cloneDeep(this.AddGoodsForm);

              form.goods_cat=form.goods_cat.join(',')
              //处理动态参数
              this.manyTabDate.forEach(item=>{
                  const newinfo={attr_id:item.attr_id, attr_value:item.attr_vals};
                  this.AddGoodsForm.attrs.push(newinfo)

              })
              //处理静态属性
              this.olnyTabDate.forEach(item=>{
                  const newinfo={attr_id:item.attr_id, attr_value:item.attr_vals}
                  this.AddGoodsForm.attrs.push(newinfo)
              })
              form.attrs=this.AddGoodsForm.attrs;
         

              //发起添加商品的请求
             const {data:res}=await this.$http.post('goods',form);
             if(res.meta.status!==201){
                 return this.$message.error('创建商品失败');

             }
             this.$router.push('/goods')

                 
             })
         }



    },
    computed:{
        CateId(){
            //如果选择了分类，就返回分类的id
           if(this.AddGoodsForm.goods_cat.length===3){
             return  this.AddGoodsForm.goods_cat[2]
           }
             return null;
        },

    },
}
</script>
<style lang="less" scoped>
.el-checkbox{margin: 0px 5px 0px 0px !important;}
.imgSize{width:100%;}
.addbtn{margin-top: 15px;}
</style>