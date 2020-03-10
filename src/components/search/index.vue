<template>
    <div class='search-component' v-show="show.show">
        <div class='search-header'>
            <div class='close' @click="show.show=false"></div>
            <div class='search-wrap'>
                <div class='search-input-wrap'>
                    <input type="text" class='search' placeholder="请输入宝贝名称" v-model="keyword" />
                </div>
                <button type="button" class='search-btn' @click="goSearch()"></button>
            </div>
        </div>
        <div class='search-main' v-if="historyKeywords.length>0">
            <div class='search-title-wrap'>
                <div class='search-title'>最近搜索</div>
                <div class='bin' @click="clearHistory()"></div>
            </div>
            <div class='search-keywords-wrap'>
                <div class='keywords' v-for="(item,index) in historyKeywords" :key="index" @click="goSearch(item)">{{item}}</div>
            </div>
        </div>
        <div class='search-main'>
            <div class='search-title-wrap'>
                <div class='search-title'>热门搜索</div>
            </div>
            <div class='search-keywords-wrap'>
                <div class='keywords' v-for="(item,index) in hotKeywords" :key="index" @click="goSearch(item.title)">{{item.title}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations,mapState,mapActions} from 'vuex';
    import { Dialog } from 'vant';
    export default {
        name: "my-search",
        data(){
            return {
                keyword:""
            }
        },
        props:{
            show:{
                type:Object,
                default:{}
            },
            isLocal:{
                type: Boolean,
                default: false
            }
        },
        created(){
          this.keywords=this.historyKeywords?this.historyKeywords:[]; //定义一个全局变量，用来存储搜索记录
          this.getHotKeyword();
        },
        computed:{
            ...mapState({ //取出historyKeywords中存放的值
                "historyKeywords":state=>state.search.historyKeywords,
                "hotKeywords":state=>state.search.hotKeywords  //此处获取的是vuex中SET_HOTKEYWORD中state.hotKeywords的值
            }),
        },
        methods:{
            ...mapMutations({
               "SET_KEYWORDS":"search/SET_KEYWORDS", //使用vuex中的SET_KEYWORDS
               "CLEAR_KEYWORDS":"search/CLEAR_KEYWORDS"
            }),
            ...mapActions({//调用vuex actions中的方法，获取api传入的接口数据
               "getHotKeyword":"search/getHotKeyword"
            }),
            goSearch(keyword){//搜索按钮,keyword为热门搜索的值
                let tmpKeyword=keyword || this.keyword || "";
                if(tmpKeyword){//当keyword不为空时才会继续执行
                    if(this.keywords.length>0){//当历史记录存在时才会执行
                        for(let i = 0; i < this.keywords.length;i++){//循环当前存储的历史记录
                            if(this.keywords[i]===tmpKeyword){//如果查询与历史记录一致，则删除
                                this.keywords.splice(i--,1)
                            }
                        }
                    }
                    this.keywords.unshift(tmpKeyword); //将搜索记录存储到keywords数组中
                    this.SET_KEYWORDS({historyKeywords:this.keywords}) //传值到vuex
                }
                this.show.show=false; //点击搜索后关闭搜索界面
                if(this.isLocal){
                    this.$router.replace("/goods/search?keyword="+tmpKeyword)
                }else{
                    this.$router.push("/goods/search?keyword="+tmpKeyword)
                }

            },
            clearHistory(){
                if(this.historyKeywords.length>0){ //存在数据时才会执行删除操作
                    Dialog.confirm({
                        title: '',
                        message: '确认要删除吗？'
                    }).then(() => {
                        this.CLEAR_KEYWORDS()
                    }).catch(()=>{

                    })
                }
            }
        }
    }
</script>

<style scoped>
    .search-component{width:100%;height:100%;position: fixed;z-index:99;left:0px;top:0px;background-color:#ffffff;}
    .search-component .search-header{width:100%;height:1rem;border-bottom:#EFEFEF solid 1px;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
    .search-component .search-header .close{width:0.5rem;height: 0.5rem;background-image:url("../../assets/images/common/search_x.png");background-size:100%;background-repeat: no-repeat;background-position: center;margin-left:0.2rem;margin-right:0.2rem;}
    .search-component .search-header .search-wrap{width:78%;height:0.64rem;border:#B2B2B2 solid 1px;border-radius: 0.1rem;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;}
    .search-component .search-header .search-wrap .search-input-wrap{width:85%;height:100%;border-right: #B2B2B2 solid 1px;}
    .search-component .search-header .search-wrap .search{width:100%;height:93%;margin-left:0.2rem;font-size:0.28rem;border:none;}
    .search-component .search-header .search-wrap .search-btn{width:0.5rem;height:0.5rem;background-image:url("../../assets/images/common/search_icon.png");background-size:100%;background-repeat: no-repeat;background-position: center;background-color:#ffffff;border:0px none;outline: none;margin-left:0.15rem;}

    .search-component .search-main{width:100%;margin-top:0.2rem;}
    .search-component .search-main .search-title-wrap{width:auto;display:flex;display:-webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;padding-left:0.4rem;padding-right:0.4rem;}
    .search-component .search-main .search-title-wrap .search-title{width:auto;font-size:0.28rem;}
    .search-component .search-main .search-title-wrap .bin{width:0.4rem;height:0.4rem;background-image:url('../../assets/images/common/bin.png');background-size:100%;background-repeat: no-repeat;background-position: center;}
    .search-component .search-main .search-keywords-wrap{width:auto;display:flex;display:-webkit-flex;justify-content: flex-start;-webkit-justify-content: flex-start;padding-left:0.4rem;padding-right:0.4rem;margin-top:0.3rem;flex-wrap: wrap;-webkit-flex-wrap: wrap;}
    .search-component .search-main .search-keywords-wrap .keywords{width:26%;height:0.6rem;color:#717376;border:#EFEFEF solid 1px;border-radius: 0.64rem;font-size:0.28rem;text-align: center;overflow:hidden;line-height:0.6rem;margin-right:1.3%;margin-left:1.3%;margin-bottom:0.2rem;padding-left:0.1rem;padding-right:0.1rem;}

</style>
