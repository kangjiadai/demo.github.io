import {getReviewsData} from '../../../api/goods/review';
export default {
    namespaced:true,
    state:{
        reviews:[],
        total:0
    },
    mutations:{
        ["SET_REVIEWS"](state,payload){
            state.reviews=payload.reviews;
            state.total = payload.total;
        },
        ["SET_REVIEWS_PAGE"](state,payload){
            state.reviews.push(...payload.reviews); //数据合并
        }
    },
    actions:{
        getReviews(conText,payload){
            getReviewsData(payload.gid).then(res=>{
                let pageNum=0;
                if(res.code===200){
                    conText.commit("SET_REVIEWS",{reviews:res.data,total:res.pageinfo.total});
                    pageNum=res.pageinfo.pagenum; //如果api中有数据
                }else{
                    conText.commit("SET_REVIEWS",{reviews:[],total:0})
                    pageNum=0;
                }
                if(payload.success){
                    payload.success(pageNum);
                }
            })
        },
        getReviewsPage(conText,payload){
            getReviewsData(payload.gid,payload.page).then(res=>{
                if(res.code===200){
                    conText.commit("SET_REVIEWS_PAGE",{reviews:res.data});

                }
            })
        }
    }
}