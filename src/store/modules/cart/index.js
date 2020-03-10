import Vue from 'vue';
export default {
    namespaced:true,
    state:{
        cartData:localStorage['cartData']?JSON.parse(localStorage['cartData']):[]
    },
    mutations:{
        ["ADD_ITEM"](state,payload){
            let isSame = false;
            if(state.cartData.length>0){ //判断是否重复
                for(let i = 0;i < state.cartData.length;i++){
                    //判断，如果添加进来的商品gid已经存在，但是规格不相同除外
                    if(state.cartData[i].gid===payload.cartData.gid && JSON.stringify(state.cartData[i].attrs)===JSON.stringify(payload.cartData.attrs)){
                        isSame=true;
                        //如果重复，则数量+1
                        state.cartData[i].amount=parseInt(state.cartData[i].amount)+parseInt(payload.cartData.amount);
                        break;
                    }
                }
            }
            if(!isSame){ //如果不重复，则直接添加商品到购物车
                state.cartData.push(payload.cartData);
            }
            //解决vuex在页面刷新后数据丢失问题，将数据存储到localStorage中
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        //删除商品
        ["DEL_ITEM"](state,payload){
            state.cartData.splice(payload.index,1);
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        //更改数量
        ["SET_AMOUNT"](state,payload){
            state.cartData[payload.index].amount=payload.amount;
            state.cartData[payload.index].amount=parseInt(state.cartData[payload.index].amount.replace(/[^\d]/g,""));
            if(!state.cartData[payload.index].amount){ //当数量为空则为1
                state.cartData[payload.index].amount=1
            }
        },
        //增加数量
        ["INC_AMOUNT"](state,payload){
            state.cartData[payload.index].amount+=1;
            Vue.set(state.cartData,payload.index,state.cartData[payload.index]);
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        //减少数量
        ["DEC_AMOUNT"](state,payload){
            state.cartData[payload.index].amount--;
            if(state.cartData[payload.index].amount<1){
                state.cartData[payload.index].amount=1
            }
            Vue.set(state.cartData,payload.index,state.cartData[payload.index]);
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        //选择商品checked属性
        ["SELECT_ITEM"](state,payload){
            state.cartData[payload.index].checked=!state.cartData[payload.index].checked;
            Vue.set(state.cartData,payload.index,state.cartData[payload.index]);
            localStorage['cartData']=JSON.stringify(state.cartData);
        },
        //全选/反选
        ["ALL_SELECT_ITEM"](state,payload){
            if(state.cartData.length>0){
                for(let i = 0;i < state.cartData.length;i++){
                    state.cartData[i].checked=payload.checked;
                }
            }
            localStorage['cartData']=JSON.stringify(state.cartData);
        }
    },
    //购物车商品计算
    getters:{
        //计算总金额
        total(state){
            if(state.cartData.length>0){
                let total = 0;
                for(let i = 0;i < state.cartData.length;i++){
                    if(state.cartData[i].checked){ //当商品选中时才计算结果
                        total += state.cartData[i].price * state.cartData[i].amount;
                    }
                }
                return parseFloat(total.toFixed(2));
            }else{
                return 0;
            }
        },
        //运费
        freight(state){
            if(state.cartData.length>0){
                let freight = [];
                for(let i = 0;i < state.cartData.length;i++){
                    if(state.cartData[i].checked) { //当商品选中时才计算结果
                        freight.push(state.cartData[i].freight)
                    }
                }
                //取出所有运费中最高的数值
                return freight.length>0?Math.max.apply(null,freight):0;
            }else{
                return 0;
            }
        }
    }
}