import Vue from 'vue';
import {getHotKeywordData,getSearchData,getAttrsData} from "../../../api/search";
export default {
    namespaced:true,
    state:{
        historyKeywords:localStorage['historyKeywords']?JSON.parse(localStorage['historyKeywords']):[],
        hotKeywords:[],
        priceData:{ //筛选价格区间显示/隐藏
            isHide:false,
            items:[//价格区间数据
                {price1:1,price2:50,active:false},
                {price1:51,price2:99,active:false},
                {price1:100,price2:300,active:false},
                {price1:301,price2:1000,active:false},
                {price1:1001,price2:4000,active:false},
                {price1:4001,price2:9999,active:false},
            ]
        },
        minPrice:"",
        maxPrice:"",
        attrs:[],
        searchData:[],
        cid:"",
        params:[],
        total:0
    },
    mutations:{
        ["SET_KEYWORDS"](state,payload){
            state.historyKeywords=payload.historyKeywords; //将当前输入记录存放到历史记录中去
            //存在问题，当页面刷新后，历史记录丢失，为此，则将历史记录存放到浏览器localStorage中，直接调用localStorage中存放的值
            localStorage['historyKeywords']=JSON.stringify(state.historyKeywords); //将传过来的历史记录存储到localStorage中去
        },
        ["CLEAR_KEYWORDS"](state,payload){//清除搜索历史记录
            state.historyKeywords="";
            localStorage.removeItem("historyKeywords");
        },
        //设置热门关键词
        ["SET_HOTKEYWORD"](state,payload){
            state.hotKeywords=payload.hotKeywords;//payload.hotKeywords指向actions中hotKeywords:res.data
        },
        //隐藏价格
        ["HIDE_PRICE"](state,payload){
            state.priceData.isHide=!state.priceData.isHide
        },
        //选择价格
        ["SELECT_PRICE"](state,payload){
            if(state.priceData.items.length>0){//单选
                for(let i = 0;i < state.priceData.items.length;i++){
                    if(i!==payload.index){
                        if(state.priceData.items[i].active){
                            state.priceData.items[i].active=false
                            break;
                        }
                    }
                }
                state.priceData.items[payload.index].active=!state.priceData.items[payload.index].active;
                Vue.set(state.priceData.items,payload.index,state.priceData.items[payload.index]);
                //判断是否选中价格区间，如果选中了则显示选中价格，如果未选中则显示为空
                state.minPrice =state.priceData.items[payload.index].active?state.priceData.items[payload.index].price1:'';
                state.maxPrice =state.priceData.items[payload.index].active?state.priceData.items[payload.index].price2:'';
            }

        },
        //设置最低价格
        ["SET_MINPRICE"](state,payload){
            state.minPrice = payload.minPrice;
            state.minPrice = payload.minPrice.replace(/[^\d|\.]/g,'');//限制当输入的内容除了数字以外清空
        },
        //设置最高价格
        ["SET_MAXPRICE"](state,payload){
            state.maxPrice = payload.maxPrice;
            state.maxPrice = payload.maxPrice.replace(/[^\d|\.]/g,'');//限制当输入的内容除了数字以外清空
        },
        //显示/隐藏商品颜色属性
        ["HIDE_ATTR"](state,payload){
                state.attrs[payload.index].isHide=!state.attrs[payload.index].isHide;
                Vue.set(state.attrs,payload.index,state.attrs[payload.index])
        },
        //选择商品尺寸属性
        ["SELECT_ATTR"](state,payload){
            state.attrs[payload.index].param[payload.index2].active=!state.attrs[payload.index].param[payload.index2].active;
            Vue.set(state.attrs[payload.index].param,payload.index2,state.attrs[payload.index].param[payload.index2])
        },
        //设置搜索结果
        ["SET_SEARCH_DATA"](state,payload){
            state.searchData=payload.searchData;
            state.total=payload.total
        },
        //增加分页数据
        ["SET_SEARCH_DATA_PAGE"](state,payload){
            if(payload.searchData.length>0){
                for(let i = 0;i < payload.searchData.length;i++){
                    state.searchData.push(payload.searchData[i])
                }
            }
        },
        //商品分类cid
        ["SET_CID"](state,payload){
            state.cid = payload.cid;
        },
        ["SET_ATTRS"](state,payload){
            state.attrs=payload.attrs;
        },
        //设置属性的值
        ["SET_PARAMS"](state,payload){
            if(state.attrs.length>0){
                state.params=[];
                for(let i = 0;i < state.attrs.length;i++){
                    for(let j = 0;j < state.attrs[i].param.length;j++){
                        if(state.attrs[i].param[j].active){
                            state.params.push(state.attrs[i].param[j].pid)
                        }
                    }
                }
            }
        },
        ["RESET_SCREEN"](state,payload){
            state.cid="";
            //重置价格
            if(state.priceData.items.length>0){
                for(let i = 0;i < state.priceData.items.length;i++){
                        if(state.priceData.items[i].active){
                            state.priceData.items[i].active=false
                            break;
                        }
                }
                state.minPrice = "";
                state.maxPrice = "";
            }
            //重置属性
            if(state.attrs.length>0){
                for(let i = 0;i < state.attrs.length;i++){
                    for(let j = 0;j < state.attrs[i].param.length;j++){
                        if(state.attrs[i].param[j].active){
                            state.attrs[i].param[j].active = false;
                        }
                    }
                }
                let params = [];
            }
        }
    },
    actions:{//调用api中的接口数据
        getHotKeyword(conText,payload){
            getHotKeywordData().then(res=>{
                if(res.code===200){
                    conText.commit("SET_HOTKEYWORD",{hotKeywords:res.data})
                }
            })
        },
        //选择分类
        selectClassify(conText,payload){//筛选分类选择
            if(conText.rootState.goods.classifys.length>0){
                for(let i =0;i < conText.rootState.goods.classifys.length;i++){
                    if(i!==payload.index){//实现筛选分类单选
                        if(conText.rootState.goods.classifys[i].active){//只有为true的情况下才会执行
                            conText.rootState.goods.classifys[i].active = false;
                            break;
                        }
                    }
                }
                conText.rootState.goods.classifys[payload.index].active=!conText.rootState.goods.classifys[payload.index].active;
                Vue.set(conText.rootState.goods.classifys,payload.index,conText.rootState.goods.classifys[payload.index]);
                //如果筛选选项未选中，则cid为空
                let cid = conText.rootState.goods.classifys[payload.index]?conText.rootState.goods.classifys[payload.index].cid:"";
                conText.commit("SET_CID",{cid:cid});
            }
        },
        //获取商品搜索结果
        getSearch(conText,payload){
            getSearchData(payload).then(res=>{
                let pageNum=0;
                if(res.code===200){
                    pageNum=res.pageinfo.pagenum;
                    conText.commit("SET_SEARCH_DATA",{searchData:res.data,total:res.pageinfo.total});
                }else{
                    pageNum=0;
                    conText.commit("SET_SEARCH_DATA",{searchData:[],total:0}); //如果当前商品没有属性则为空
                }
                if(payload.success){
                    payload.success(pageNum);
                }
            })
        },
        //设置页码
        getSearchPage(conText,payload){
            getSearchData(payload).then(res=>{
                if(res.code===200){
                    conText.commit("SET_SEARCH_DATA_PAGE",{searchData:res.data});
                }
            })
        },
        //获取商品属性
        getAttrs(conText,payload){
            getAttrsData(payload.keyword).then(res=>{
                if(res.code===200){
                    for(let i = 0;i < res.data.length;i++){
                        res.data[i].isHide=false;
                        for(let j = 0;j < res.data[i].param.length;j++){
                            res.data[i].param.active=false;
                        }
                    }
                    conText.commit("SET_ATTRS",{attrs:res.data})
                }else{
                    conText.commit("SET_ATTRS",{attrs:[]})
                }
                if(payload.success){
                    payload.success();
                }
            })
        },
        //筛选面板重置数据
        resetScreen(conText){
            //重置分类
            if(conText.rootState.goods.classifys.length>0){
                for(let i =0;i < conText.rootState.goods.classifys.length;i++){
                    if(conText.rootState.goods.classifys[i].active){//只有为true的情况下才会执行
                        conText.rootState.goods.classifys[i].active = false;
                        break;
                    }
                }
            }
            conText.commit("RESET_SCREEN")
        }
    }
}