var netUtil=require("../../utils/netUtil.js");

var actions = netUtil.action;



/*
{
 getListFromNetData:function(netData){
 return netData;
 },
 handleItemInfo:function(item){

 }
 }
 */
/**
 * data里的数据结构:tabDatas:[],里面都是bean
 * @param page
 * @param urlTail
 * @param params
 * @param tabIndex  这个listview属于哪个tab,一旦确定,不会更改
 * @param emptyMsg
 */
function initLv(page,urlTail,params,tabIndex,emptyMsg,callback){

    var bean = {};

    bean.currentPageIndex = 1;
    bean.currentAction = netUtil.action.request_none;
    bean.tabIndex = tabIndex;

    bean.stateBean = new netUtil.netStateBean();
    if(emptyMsg != undefined && emptyMsg !=null && emptyMsg.length>0){
        bean.stateBean.emptyMsg = emptyMsg;
    }

    bean.datas=[];



    bean.onStart = function(){
        if(!bean.stateBean.hasSuccessed){
            bean.onFristIn();
        }
    };

    bean.onFristIn = function(){
        params.pageIndex = 1;
        bean.request(page,bean,netUtil.action.request_firstIn,urlTail,params);
    };

   bean.onRefresh = function(){
       params.pageIndex = 1;
        bean.request(page,bean,netUtil.action.request_refresh,urlTail,params);
   };
    bean.onLoadMore = function(){
        if(bean.stateBean.hasSuccessed){
            params.pageIndex = bean.currentPageIndex +1;
            bean.request(page,bean,netUtil.action.request_loadmore,urlTail,params);
        }

    };

    bean.request = function(page,bean,action,urlTail,params){

        if( bean.currentAction  != actions.request_none){
            return;
        }

        if(netUtil.isFunction(callback.setParams)  ){
            callback.setParams(params);
        }


        bean.currentAction = action;
        netUtil.buildRequest(page,urlTail,params,{
            onPre: function(){
                if(action == actions.request_firstIn  ){
                    netUtil.showLoadingDialog(page);
                }else if (action == actions.request_loadmore){
                    loadMoreStart(page,bean.tabIndex);
                }else if(action == actions.request_refresh){
                    //netUtil.showLoadingDialog(page);
                }
            },
            onEnd: function(){
                bean.currentAction = actions.request_none;
                netUtil.hideLoadingDialog();
                netUtil.stopPullRefresh();
            },
            onSuccess:function (data){


                console.log("onsuccess-----------")

                var currentDatas = bean.getListFromNetData(data);//todo 如果是其中一个字段,需要取出.

                if (currentDatas.length==0){
                    this.onEmpty();
                    return;
                }
                showContent(page,tabIndex);

                if(action == actions.request_firstIn ){

                }else if (action == actions.request_refresh){
                    netUtil.showSuccessToast(page,"数据刷新成功");
                }
                //that.handleDataAndRefreshUI(data);
                //处理数据
                bean.currentPageIndex = params.pageIndex;



                //数据的一些处理,包括了一维和二维数组的处理,全部都解析到单个item层次返回
                currentDatas.forEach(function(info){
                    if(info instanceof Array){
                        info.forEach(function(item){
                            bean.handleItemInfo(item)
                        });
                    }else {
                        bean.handleItemInfo(info)
                    }
                });

                //根据操作的action不同而处理:
                if(action == actions.request_firstIn){
                    page.data.tabDatas[tabIndex].datas.length =0;
                }else if (action == actions.request_loadmore){

                }else if (action == actions.request_refresh){
                    page.data.tabDatas[tabIndex].datas.length =0;
                }



                page.data.tabDatas[tabIndex].datas = page.data.tabDatas[tabIndex].datas.concat(currentDatas);

                page.setData({
                    tabDatas:page.data.tabDatas
                });




            },
            onEmpty : function(){
                if(action == actions.request_firstIn  ){
                    showEmptyPage(page,tabIndex);
                }else if (action == actions.request_loadmore){
                    loadMoreNoData(page,tabIndex);
                }else if(action == actions.request_refresh){
                    //netUtil.showLoadingDialog(page);
                }
            },
            onError : function(msgCanShow,code,hiddenMsg){
                if(action == actions.request_firstIn  ){
                    showErrorPage(page,msgCanShow,tabIndex);
                }else if (action == actions.request_loadmore){
                    loadMoreError(page,tabIndex);
                }else if(action == actions.request_refresh){
                    //netUtil.showLoadingDialog(page);
                }
            },
            onUnlogin: function(){
                this.onError("您还没有登录或登录已过期,请登录",5,'')
            },
            onUnFound: function(){
                this.onError("您要的内容没有找到",2,'')
            }
        }).send();
    };

    bean.onRetry = function(){
        bean.onRefresh();
    };

    bean.handleItemInfo=callback.handleItemInfo;
    bean.getListFromNetData = callback.getListFromNetData;


    return bean;
}


function  loadMoreError(that,tabIndex){
    var datas = that.data.tabDatas;
    var bean = datas[tabIndex].stateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载出错,请上拉重试';
    console.log(datas);
    that.setData({
        tabDatas: datas
    });

}

function loadMoreStart(that,tabIndex){
    console.log(tabIndex+"-----------loadMoreStart");
    var datas = that.data.tabDatas;
    console.log(datas);
    var bean = datas[tabIndex].stateBean;

    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载中...';
    console.log(datas);
    that.setData({
        tabDatas: datas
    });

}

function loadMoreNoData(that,tabIndex){
    var datas = that.data.tabDatas;
    var bean = datas[tabIndex].stateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '没有了...';
    console.log(datas);
    that.setData({
        tabDatas: datas
    });
}

//以下三个方法是用于页面状态管理
function showEmptyPage(that,tabIndex){
    netUtil.hideLoadingDialog(that);
    var datas = that.data.tabDatas;
    var bean = datas[tabIndex].stateBean;
    bean.emptyHidden = false;

    bean.contentHidden=true;
    bean.errorHidden = true;
    console.log(datas);
    that.setData({
        tabDatas: datas
    });
}

function showErrorPage(that,msg,tabIndex){
    netUtil.hideLoadingDialog(that);
    var datas = that.data.tabDatas;
    var bean = datas[tabIndex].stateBean;
    bean.errorHidden = false;
    bean.errorMsg= msg;

    bean.contentHidden=true;
    console.log(datas);
    that.setData({
        tabDatas: datas
    });

}
function showContent(that,tabIndex){
    netUtil.hideLoadingDialog(that);
    var datas = that.data.tabDatas;
    var bean = datas[tabIndex].stateBean;
    bean.hasSuccessed = true;
    bean.errorHidden = true;
    bean.emptyHidden = true;
    bean.contentHidden=false;
    console.log(datas);
    that.setData({
        tabDatas: datas
    });
}

module.exports = {
    initLv: initLv
}