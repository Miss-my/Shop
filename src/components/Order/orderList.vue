<template>
    <div>
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/orders' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区域-->
        <el-card>
            <el-row>
                <el-col :span='15' class="colone">
                 <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="orderslist"> 
                     <el-button slot="append" icon="el-icon-search" @click="orderslist"></el-button>
                 </el-input>
                </el-col>
        
            </el-row>
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column  label="订单编号" prop="order_number"></el-table-column>
                <el-table-column  label="订单价格" prop="order_price"></el-table-column>
                <el-table-column  label="是否付款" prop="order_pay">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.order_pay===1">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="是否发货" prop="is_send">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.is_send===1">已发货</el-tag>
                        <el-tag type="warning" v-else>未发货</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="下单时间" prop="create_time">
                      <template slot-scope="scope">
                        {{scope.row.create_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="getOrderInfo"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
        <!--修改订单-->
        <el-dialog
            title="修改地址"
            :visible.sync="EditdialogVisible"
            width="50%">
            <el-form ref="Editform" :rules="Editrules" :model="Editform" label-width="90px">
                <el-form-item label="省市区/县" prop="address1">
                  <el-cascader :options="cityData" v-model="Editform.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                <el-input v-model="Editform.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="EditdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="EditdialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>
<script>


export default {
    data(){
        return{
            //查询条件
            queryInfo:{
                query:'',
                //当前的页数
                pagenum:1,
                //默认每页显示的条数
                pagesize :5
            },
            total:0,
            //列表数据，默认为空
            orderlist:[],
            EditdialogVisible:false,
            Editform:{
                address1:[],
                address2:'',

            },
            Editrules:{
              address2:[
                   { required: true, message: '请填写详细的物流地址', trigger: 'blur' },
              ]
            },
            cityData


        }
    },
    created(){
        this.orderslist();

    },
    methods:{
        //获取订单列表
        async orderslist(){
         const {data:res}=await this.$http.get('orders',{params:this.queryInfo});
         console.log(res);
         if(res.meta.status!==200){
             return;
             this.$message.error('获取订单列表失败')
         }
    
         this.orderlist=res.data.goods;
         this.total=res.data.total;


        },
        //pageSzie发生改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.orderslist();

        },
        //pagenum发生改变的事件
        handleCurrentChange(newNum){
            this.queryInfo.pagenum=newNum;
            this.orderslist();
        },
        //修改订单数据
        getOrderInfo(){
           
            this.EditdialogVisible=true;

        }


        
    }
}
</script>