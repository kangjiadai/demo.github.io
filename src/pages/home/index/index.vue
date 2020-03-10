<template>
    <div class="page">
        <!--顶部搜索栏-->
       <div :class="{header:true,scroll:isScrollTop}">
            <div class="classify-icon" @click="$router.push('/goods/classify')"></div>
            <div class="serch-wrap" @click="searchShow.show=true">
                <div class="search-icon"></div>
                <div class="text">请输入宝贝名称</div>
            </div>
            <div class="login" v-if="!isLogin" @click="$router.push('/login')">登录</div>
           <div class="my-icon" v-else @click="$router.push('/my')"></div>
       </div>
        <!--轮播图-->
        <div class="banner-wrap">
            <div class="swiper-container" ref="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in swipers" :key="index">
                        <img :src="item.image" alt="">
                    </div>
                </div>
                <div class="swiper-pagination" ref="swiper-pagination"></div>
            </div>
        </div>
        <!--快速导航-->
        <div class="quick-nav">
            <ul class="item" v-for="(item,index) in navs" :key="index" @click="$router.push('/goods/classify/item?gid='+item.gid)">
                <li><img src="../../../assets/images/common/lazyImg.jpg" alt="" :data-echo="item.image"></li>
                <li>{{item.title}}</li>
            </ul>
        </div>

        <template v-for="(item,index) in goods">
            <!--潮流女装-->
            <div class="goods-main" :key="index" v-if="(index+1)%2!==0">
                <div :class="'classify-name color-'+index">—— {{item.title}} ——</div>
                <div class="goods-row-1">
                    <div class="goods-column" @click="$router.push('/goods/details?gid='+(item.items && item.items[0].gid))">
                        <div class="goods-title">{{item.items && item.items[0].title}}</div>
                        <div class="goods-tip">精品打折</div>
                        <div :class="'goods-price bg-color-'+index">{{item.items && item.items[0].price}}元</div>
                        <div class="goods-image">
                            <img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item.items && item.items[0].image" :alt="item.items && item.items[0].title">
                        </div>
                    </div>
                    <div class="goods-column">
                        <div class="goods-list" v-for="(item2,index2) in item.items.slice(1,3)" :key="index2"  @click="$router.push('/goods/details?gid='+(item2.gid))">
                            <div class="goods-list-title">{{item2.title}}</div>
                            <div class="goods-list-tip">品质精挑</div>
                            <div class="goods-list-image">
                                <img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image" alt="item2.title">
                            </div>
                        </div>
                    </div>
                </div>
                <!--主界面第二板块-->
                <div class="goods-row-2">
                    <div class="goods-list" v-for="(item,index) in item.items.slice(3,7)" :key="index"  @click="$router.push('/goods/details?gid='+(item.gid))">
                        <div class="goods-title">{{item.title}}</div>
                        <div class="goods-image">
                            <img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item.image" alt="">
                        </div>
                        <div class="goods-price">￥{{item.price}}</div>
                        <div class="goods-price-line">￥{{item.price*2}}</div>
                    </div>
                </div>
            </div>
            <!--品牌男装-->
            <div class="goods-main" v-else>
                <div class="classify-name color-1">—— {{item.title}} ——</div>
                <div class="goods-row-1">
                    <div class="goods-column-2" v-for="(item2,index2) in item.items.slice(0,2)" :key="index2" @click="$router.push('/goods/details?gid='+(item2.gid))">
                        <div class="goods-title">{{item2.title}}</div>
                        <div class="goods-tip">火爆开售</div>
                        <div class="goods-image">
                            <img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image" alt="">
                        </div>
                    </div>
                </div>
                <!--主界面第二板块-->
                <div class="goods-row-2">
                    <div class="goods-list" v-for="(item2,index2) in item.items.slice(2,6)" :key="index2" @click="$router.push('/goods/details?gid='+(item2.gid))">
                        <div class="goods-title">{{item2.title}}</div>
                        <div class="goods-image">
                            <img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image" alt="">
                        </div>
                        <div class="goods-price">{{item2.price}}元</div>
                        <div class="goods-price-line">￥{{item2.price*2}}</div>
                    </div>

                </div>
            </div>
        </template>
        <!--推荐商品-->
        <div class="goods-recom-nav">
            <div class="line"></div>
            <div class="recom-wrap">
                <div class="icon"></div>
                <div class="text">为您推荐</div>
            </div>
            <div class="line"></div>
        </div>
        <div class="goods-recom">
            <div class="goods-list" v-for="(item,index) in recomGoods" :key="index" @click="$router.push('/goods/details?gid='+(item.gid))">
                <div class="goods-image">
                    <img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item.image" :alt="item.title">
                </div>
                <div class="goods-title">{{item.title}}</div>
                <div class="goods-price">￥{{item.price}}元</div>
            </div>
        </div>
        <my-search :show="searchShow"></my-search>
    </div>
</template>

<script>
    import {mapActions,mapState} from 'vuex';
    import Swiper from "../../../assets/js/libs/swiper";
    import MySearch from '../../../components/search';
    export default {
        name: "index",
        data(){
            return {
                isScrollTop:false,
                searchShow:{show:false}, //利用引用类型传值
            }
        },
        components:{
            MySearch
        },
        created(){
            this.isScroll=true;
            window.addEventListener("scroll",this.eventScrollTop);//监听滑动事件
            this.getSwiper({success:()=>{//获取轮播图片
                this.$nextTick(()=>{//解决cerated中获取DOM问题
                    new Swiper(this.$refs['swiper-container'], {
                        autoplay: 2000,//可选选项，自动滑动
                        pagination : this.$refs['swiper-pagination'],//轮播图list-item
                        paginationClickable :true,
                        autoplayDisableOnInteraction : false,
                    })
                })
            }});
            this.getNavs({success:()=>{
                this.$nextTick(()=>{
                    this.$utils.lazyImg();//图片懒加载
                })
                }});
            this.getGoods({success:()=>{
                    this.$nextTick(()=>{
                        this.$utils.lazyImg();//图片懒加载
                    })
                }});
            this.getRecomGoods({success:()=>{
                    this.$nextTick(()=>{
                        this.$utils.lazyImg();//图片懒加载
                    })
                }});
        },
        mounted(){

        },
        computed:{
          ...mapState({
                swipers:(state)=>state.index.swipers,//读取swipers数据
                navs:(state)=>state.index.navs,
                goods:(state)=>state.index.goods,
                recomGoods:(state)=>state.index.recomGoods,
                isLogin:(state)=>state.user.isLogin
            }),
        },
        methods:{
            ...mapActions({
                getSwiper:"index/getSwiper",//对应store/index
                getNavs:"index/getNavs",
                getGoods:"index/getGoods",
                getRecomGoods:"index/getRecomGoods"
            }),
            eventScrollTop(){
                let scrollTop=document.body.scrollTop || document.documentElement.scrollTop;
                console.log(scrollTop)
                if(scrollTop>=150){//当高度大于150时，改变背景
                    if(this.isScroll){//阻止isScrollTop一直执行，优化性能
                        this.isScroll=false;
                        this.isScrollTop=true;//search栏背景
                    }
                }else{
                    if(!this.isScroll){
                        this.isScroll=true;
                        this.isScrollTop=false;
                    }

                }
            }
        },
        destroyed(){
            //解决页面跳转后滚动监听仍然生效的问题
            //单写destroyed不生效，因为keep-alive为true状态时页面跳转仍无法销毁事件，需配合deactivated钩子使用
            //如果keep-alive为false状态，不需配合deactivated钩子也能生效
            window.removeEventListener("scroll",this.eventScrollTop);
        },
        activated(){//当页面离开时destroyed将监听事件销毁后，从其他页面返回时会导致原本样式无法生效问题
            this.isScroll=true;
            window.addEventListener("scroll",this.eventScrollTop)
        },
        deactivated(){
            //keep-alive离开页面时触发
            window.removeEventListener("scroll",this.eventScrollTop);
        }
    }
</script>

<style scoped>
    @import "../../../assets/css/common/swiper.css";
    .page{width: 100%;min-height: 100%;margin-bottom: 1.4rem}
    /*外部DIV*/
    .header{width: 100%;height: 1rem;position: fixed;z-index: 10;left: 0px;top: 0px;background:linear-gradient(rgba(1,1,1,.2),hsla(0,0%,100%,0));display: flex;justify-content: space-between;align-items: center;padding: 0px 0.2rem;box-sizing: border-box}
    /*搜索栏*/
    .header.scroll{background:linear-gradient(#eb1625,hsla(0,0%,100%,0))}
    /*滚动背景阴影*/
    .header .classify-icon{width:0.6rem;height: 0.6rem;background-image:url("../../../assets/images/common/class.png");background-size: 100%;background-repeat:no-repeat;background-position: center }
    /*菜单按钮*/
    .header .serch-wrap{width: 5.26rem;height: 0.52rem;background:rgba(255,255,255,0.5);border-radius: 4px;display: flex;align-items: center}
    .header .serch-wrap .search-icon{width:0.44rem;height: 0.44rem;background-image: url("../../../assets/images/common/search.png");background-repeat: no-repeat;background-size: 100%;background-position: center;margin-right: 0.2rem;margin-left:0.2rem;}
    .header .serch-wrap .text{font-size:0.32rem;color:white;}
    /*搜索文字栏*/
    .header .login{width: auto;height: 0.44rem;font-size:0.32rem;color:white}
    .header .my-icon{width: 0.6rem;height: 0.6rem;background-image: url("../../../assets/images/home/index/my.png");background-size: 100%;background-repeat: no-repeat;background-position: center}
    /*登录*/
    .banner-wrap{width: 100%;height: 3.66rem;}
    .banner-wrap img{width: 100%;height: 100%}
    /*轮播图*/
    .quick-nav{width: 100%;height: 1.6rem;background: white;margin-top:0.2rem;display: flex;align-items: center;justify-content: space-between;padding: 0px 0.2rem;box-sizing: border-box}
    .quick-nav .item{width: 1.4rem;}
    .quick-nav .item li:nth-child(1){width: 0.8rem;height: 0.8rem;margin: 0 auto;}
    .quick-nav .item li:nth-child(1) img{width: 100%;height: 100%;}
    .quick-nav .item li:nth-child(2) {font-size:0.28rem;color:#7b7f82;text-align: center;margin-top:0.2rem; }
    /*主界面*/
    .goods-main{width: 100%;height: 7.36rem;background-color:white;margin-top: 0.2rem }
    .goods-main .classify-name{width: 100%;height: 0.64rem;border-bottom:1px solid #efefef;font-size:0.32rem;text-align: center;line-height: 0.64rem}
    .goods-main .classify-name.color-0{color: #f73b61}
    .goods-main .classify-name.color-1{color: #fe6719}
    .goods-main .classify-name.color-2{color: green}
    .goods-main .goods-row-1{width: 100%;height: 3.5rem;border-bottom: 1px solid #efefef;display: flex;overflow: hidden}
    .goods-main .goods-row-1 .goods-column{width: 50%;height: 100%;border-right:1px solid #efefef;position: relative}
    .goods-main .goods-row-1 .goods-column .goods-title{width: 95%;height: 0.32rem;overflow: hidden;position:absolute;left: 0.2rem;top:0.2rem;font-size: 0.26rem;font-weight: bold}
    .goods-main .goods-row-1 .goods-column .goods-tip{width: auto;height: auto;font-size: 0.28rem;color:#cb385d;position: absolute;left: 0.2rem;top: 0.6rem}
    .goods-main .goods-row-1 .goods-column .goods-price{width: auto;height: 0.4rem;border-radius: 10px;position: absolute;right: 1rem;top:0.6rem;color:white;font-size: 0.28rem}
    .goods-main .goods-row-1 .goods-column .goods-price.bg-color-0{background-color: #f21d4f}
    .goods-main .goods-row-1 .goods-column .goods-price.bg-color-1{background-color: #5fc600}
    .goods-main .goods-row-1 .goods-column .goods-image{width: 3rem;height:2rem;position: absolute;left: 0.3rem;bottom:0.2rem }
    .goods-main .goods-row-1 .goods-column .goods-image img{width: 100%;height: 100%}
    /*左侧商品*/
    .goods-main .goods-row-1 .goods-column .goods-list{width: 100%;height: 50%;border-bottom: 1px solid #efefef;position: relative}
    .goods-main .goods-row-1 .goods-column .goods-list .goods-list-title{width: 2.04rem;height: 0.32rem;overflow: hidden;font-size:0.26rem;font-weight: bold;position:absolute;left: 0.2rem;top:0.2rem}
    .goods-main .goods-row-1 .goods-column .goods-list-tip{width: auto;height: auto;font-size: 0.24rem;color:#7b7f82;position:absolute;left: 0.2rem;top: 0.6rem}
    .goods-main .goods-row-1 .goods-column .goods-list-image{width: 1.2rem;height: 1.2rem;position:absolute;right: 0.2rem;top: 0.2rem}
    .goods-main .goods-row-1 .goods-column .goods-list-image img{width: 100%;height: 100%}

    /*品牌男装*/
    .goods-main .goods-row-1 .goods-column-2{width: 50%;height: 100%;border-right:1px solid #efefef;position: relative}
    .goods-main .goods-row-1 .goods-column-2 .goods-title{width: 95%;height: 0.32rem;overflow: hidden;font-size: 0.26rem;font-weight: bold;text-align: center;margin: 0 auto;margin-top: 0.1rem }
    .goods-main .goods-row-1 .goods-column-2 .goods-tip{width: auto;height: auto;font-size: 0.26rem;color:#7b7f82;text-align: center;margin-top: 0.1rem}
    .goods-main .goods-row-1 .goods-column-2 .goods-image{width: 1.8rem;height:2rem;margin: 0 auto;margin-top: 0.22rem}
    .goods-main .goods-row-1 .goods-column-2 .goods-image img{width: 100%;height: 100%}

    /*主界面第二板块*/
    .goods-main .goods-row-2{width: 100%;height: 3.2rem;overflow: hidden;display: flex;}
    .goods-main .goods-row-2 .goods-list{width: 25%;height: 100%;border:1px solid #efefef;}
    .goods-main .goods-row-2 .goods-list .goods-title{width: 100%;height: 0.4rem;overflow: hidden;font-size: 0.28rem;font-weight: bold;text-align: center;margin-top: 0.2rem}
    .goods-main .goods-row-2 .goods-image{width: 1.5rem;height:1.5rem;margin: 0 auto;margin-top: 0.2rem}
    .goods-main .goods-row-2 .goods-image img{width: 100%;height: 100%}
    .goods-main .goods-row-2 .goods-price{width: 100%;height: auto;text-align: center;font-size: 0.26rem;color:#d32a4e;margin-top: 0.1rem}
    .goods-main .goods-row-2 .goods-price-line{color:#7b7f82;text-decoration: line-through;text-align: center;margin-top: 0px;font-size: 0.26rem}
    /*为您推荐*/
    .goods-recom-nav{width: 100%;height: 1rem;display: flex;justify-content: space-between;align-items: center}
    .goods-recom-nav .line{width: 35%;height: 1px;background-color: #d4d4d4}
    .goods-recom-nav .recom-wrap{width: 1.8rem;height: 0.44rem;display: flex;justify-content: space-between;align-items: center}
    .goods-recom-nav .recom-wrap .icon{width: 0.4rem;height: 0.4rem;background-image: url("../../../assets/images/home/index/recom.png");background-size: 100%;background-repeat: no-repeat;background-position: center}
    .goods-recom-nav .recom-wrap .text{width: auto;height: auto;font-size: 0.3rem;font-weight: bold}
    /*推荐商品*/
    .goods-recom{width: 100%;display: flex;justify-content: space-between;padding: 0px 0.2rem;box-sizing: border-box;flex-wrap: wrap;}
    .goods-recom .goods-list{width: 48%;height: 4.5rem;background: white;margin-top: 0.2rem}
    .goods-recom .goods-list .goods-image{width: 2.8rem;height: 2.8rem;margin: 0 auto;margin-top: 0.2rem}
    .goods-recom .goods-list .goods-image img{width: 100%;height: 100%}
    .goods-recom .goods-list .goods-title{width: 100%;height: 0.8rem;overflow: hidden;font-size: 0.28rem;margin-top: 0.1rem}
    .goods-recom .goods-list .goods-price{width: auto;height: auto;font-size: 0.32rem;color:#d32a4e;margin-top:0.1rem}
</style>