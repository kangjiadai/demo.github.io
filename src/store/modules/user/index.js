import {loginData,safeUserData,safeOutLoginData,CheckVcodeData,isRegData,regUserData,getUserInfoData,uploadHeadData,updataUserInfoData,updataCepllphoneData,updataPwdData,getFavData,delFavData} from "../../../api/user";
let modules={
    namespaced:true,
    state:{

        uid:localStorage['uid']?localStorage['uid']:"",
        nickname:localStorage['nickname']?localStorage['nickname']:"",
        isLogin:localStorage['isLogin']?Boolean(localStorage['isLogin']):false,
        authToken:localStorage["authToken"]?localStorage["authToken"]:"",
        head:"",
        points:0,
        favs:[]
    },
    mutations:{
        ["SET_LOGIN"](state,payload){
            state.uid=payload.uid;
            state.nickname=payload.nickname;
            state.isLogin=payload.isLogin;
            state.authToken=payload.authToken;
            localStorage["uid"]=payload.uid;
            localStorage['nickname']=payload.nickname;
            localStorage['isLogin']=payload.isLogin;
            localStorage["authToken"]=payload.authToken;
        },
        ["OUT_LOGIN"](state){
            state.uid="";
            state.nickname="";
            state.isLogin=false;
            state.authToken="";
            state.head="";
            state.points=0;
            localStorage.removeItem("uid");
            localStorage.removeItem("nickname");
            localStorage.removeItem("isLogin");
            localStorage.removeItem("authToken");
            localStorage.removeItem("cartData");
            sessionStorage.removeItem("addsid")
        },
        ["SET_USER_INFO"](state,payload){
            state.head=payload.head;
            state.points=payload.points;
            state.nickname=payload.nickname;
        },
        //设置我的收藏
        ["SET_FAVS"](state,payload){
            state.favs=payload.favs
        },
        //我的收藏分页
        ["SET_FAVS_PAGE"](state,payload){
            state.favs.push(...payload.favs)
        },
        //删除收藏
        ["DEL_FAVS"](state,payload){
            state.favs.splice(payload.index,1)
        }
    },
    actions:{
        //会员登录
        login(conText,payload){
            loginData(payload).then(res=>{
                if (res.code===200){
                    conText.commit("SET_LOGIN",{uid:res.data.uid,nickname:res.data.nickname,isLogin:true,authToken:res.data.auth_token});
                }
                if (payload.success) {
                    payload.success(res)
                }
            })
        },
        //安全退出
        outLogin(conText){
            safeOutLoginData({uid:conText.state.uid}).then(res=>{
                // console.log(res);
            });
            //组件跨页面，用户退出后购物车不刷新问题
            conText.rootState.cart.cartData=[];
            conText.commit("OUT_LOGIN");
        },
        //会员安全认证
        safeUser(conText,payload){
            // console.log(conText.state.uid);
            safeUserData({uid:conText.state.uid,auth_token:conText.state.authToken}).then(res=>{
                // console.log(res);
                if(res.code!==200){
                    conText.rootState.cart.cartData=[];
                    conText.commit("OUT_LOGIN");
                }
                if (payload.success){
                    payload.success(res)
                }
            });
        },
        //检测图文验证码
        checkCode(conText,payload){
            return CheckVcodeData(payload.vcode).then(res=>{
                return res;
            })
        },
        //是否注册过会员
        isReg(conText,payload){
            return isRegData(payload.username).then(res=>{
                return res;
            })
        },
        //注册会员
        regUser(conText,payload){
            regUserData(payload).then(res=>{
                if(payload.success){
                    payload.success(res)
                }
            })
        },
        //获取会员信息
        getUserInfo(conText,payload){
            getUserInfoData(conText.state.uid).then(res=>{
                if(res.code===200){
                    conText.commit("SET_USER_INFO",{head:res.data.head,points:res.data.points,nickname:res.data.nickname});
                    if(payload && payload.success){
                        payload.success(res.data)
                    }
                }
            })
        },
        //修改头像
        uploadHead(conText,payload){
            uploadHeadData(payload).then(res=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //修改个人信息
        updataUserInfo(conText,payload){
            updataUserInfoData({uid:conText.state.uid,...payload}).then(res=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //绑定手机号码
        updataCepllphone(conText,payload){
            updataCepllphoneData({uid:conText.state.uid,...payload}).then(res=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //修改密码
        updataPwd(conText,payload){
            updataPwdData({uid:conText.state.uid,...payload}).then(res=>{
                if(payload.success){
                    payload.success(res);
                }
            })
        },
        //我的收藏
        getFav(conText,payload){
            getFavData({uid:conText.state.uid,...payload}).then(res=>{
                let pageNum=0;
                if(res.code===200){
                    conText.commit("SET_FAVS",{favs:res.data});
                    pageNum=res.pageinfo.pagenum; //如果api中有数据
                }else{
                    conText.commit("SET_FAVS",{favs:[]})
                    pageNum=0;
                }
                if(payload.success){
                    payload.success(pageNum);
                }
            })
        },
        //我的收藏分页
        getFavPage(conText,payload){
                getFavData({uid:conText.state.uid,...payload}).then(res=>{
                    if(res.code===200) {
                        conText.commit("SET_FAVS_PAGE", {favs: res.data});
                    }
                    if(payload.success){
                        payload.success();
                    }
                })
            },
        //删除收藏
        delFav(conText,payload){
            delFavData({uid:conText.state.uid,...payload}).then(res=>{
                if(res.code===200){
                    conText.commit("DEL_FAVS",{index:payload.index});
                    if(payload.success){
                        payload.success();
                    }
                }
            })

        }
    }
}
export default modules;