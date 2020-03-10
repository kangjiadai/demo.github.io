import config from "../../assets/js/conf/config";
import {request} from "../../assets/js/utils/request";

//热门搜索
export function getHotKeywordData() {
    return request(config.baseApi+"/home/public/hotwords?token="+config.token);
}

//搜索商品结果
export function getSearchData(data) {
    let kwords=data.keyword?data.keyword:"";
    let page = data.page?data.page:1;
    let otype=data.otype?data.otype:"all"; //价格排序
    let cid=data.cid?data.cid:""; //筛选分类
    let price1 = data.price1?data.price1:"";
    let price2 = data.price2?data.price2:"";
    let param = data.param && data.param!=='[]'?data.param:"";

    let url = config.baseApi+"/home/goods/search?kwords="+kwords+"&param="+param+"&page="+page+"&price1="+price1+"&price2="+price2+"&otype="+otype+"&cid="+cid+"&token="+config.token;
    console.log(url)
    return request(url);
}

//商品属性（颜色，尺寸）
export function getAttrsData(keyword) {
    return request(config.baseApi+"/home/goods/param?kwords="+keyword+"&token="+config.token);
}