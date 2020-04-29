<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-col :span='15' class="colone">
                 <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getgoodslist"> 
                     <el-button slot="append" icon="el-icon-search" @click="getgoodslist"></el-button>
                 </el-input>
                </el-col>
                <el-col :span="5"><el-button type="primary" @click="goAddpage">添加商品</el-button></el-col>
            </el-row>
            <!--表格区域-->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removelistById(scope.row.goods_id)"></el-button>

                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 8, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>            
                   
            </el-card>

    </div>
</template>
<script>
export default {
    data(){
        return{
           queryInfo:{
                query:'',
                //当面页数
                pagenum:1,
                //当前每页显示多少条数据
                pagesize:5

               },
               total:0,
               goodslist:[],

        }
    },
    created(){
        this.getgoodslist();
    },
    methods:{
        //获取商品列表
        async getgoodslist(){
         const {data:res}=await this.$http.get('goods',{params:this.queryInfo});
         console.log(res);
         if(res.meta.status!==200){
             return;
             this.$message.error('获取商品列表失败')
         }
    
         this.goodslist=res.data.goods;
         this.total=res.data.total;


        },
        //pagesize发生改变得事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getgoodslist();
          
        },
        //页码发生改变得事件
        handleCurrentChange(newNum){
            this.queryInfo.pagenum=newNum;
            this.getgoodslist();
         
            
        },
        //根据id删除商品信息
        async removelistById(id){

          const RemoveUserinfo=await this.$confirm('此操作将永久删除数据，确定要继续吗','提示',{
                type:'warning'

            }).catch(error=>error)

              if(RemoveUserinfo!=='confirm'){
                  return  this.$message.info('已经取消删除');
             }
            const {data:res}=await this.$http.delete('goods/'+id);
            if(res.meta.status!==200){
                return;
                this.$message.error('删除失败')
            }
            this.getgoodslist();
     

        },
        //配置路由跳转到商品添加组件
        goAddpage(){
            this.$router.push('/goods/add');
        }
        
    }
}
</script>
<style lang="less" scoped>
.colone{margin-right: 15px;}
</style>