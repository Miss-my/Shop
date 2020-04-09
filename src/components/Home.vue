<template>
    <div>
        <el-button type="info" @click="ClearLogin">退出登录</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        ClearLogin(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        }

    }
}
</script>
<style lang="less" scoped>

</style>