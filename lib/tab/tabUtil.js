
var netUtil=require("../../utils/netUtil.js");
/**
 * tab相关的字段在data中必须封装成tabInfo.
 * @param page
 * @param tabStrs
 * @param initTabIndex
 * @param getNewLvBean function:getNewLvBean(i),使用者应调用lvUtil.initLv(...)方法:
 *
 * example:
 *
 *  var tabStrs = [' ',' ','推荐','学业成绩','行为问题','亲子关系','人际关系','情绪困扰'];
 * tabUtil.initTab(that,tabStrs,2,function(i){
      var params = {};
      params.type=1;
      params.labelIds ="1,2,3,4,5";
      params.sourceType=0;
      params.priceType=0;
      params.categoryIds = i-2;
      params.pageIndex = 1;
      params.pageSize = 20;
      var lvBean = lvUtil.initLv(that,API.Lesson.SEARCH,params,i,'',{
        getListFromNetData:function(netData){
          return netData;
        },
        handleItemInfo:function(item){
          // utils.showVoiceItemPriceText(item);
        }
      });
      return lvBean;
    });
 *
 *
 */
function  initTab(page,tabStrs,initTabIndex,getNewLvBean){
    var tabInfo = {};
    tabInfo.tabStrs = [];
    tabInfo.indicators = [];
    tabInfo.tabIndex = initTabIndex;
    page.data.tabDatas = [];
    for(var i in tabStrs) {
        var obj = {};
        obj.str = tabStrs[i];
        obj.indicator = (i == initTabIndex ? 'item-selected' : 'item-unselected');
        tabInfo.tabStrs.push(obj);

        var lvBean = getNewLvBean(i);
        page.data.tabDatas.push(lvBean);

        if(i ==initTabIndex){
            console.log("lvBean.onFristIn()----------------------");
            lvBean.onFristIn();
        }
    };



 /*   tabInfo.tabDatas =[];//item中有一个字段为pageStateMsg,另一个为各listview模板封的字段.{pageStateMsg:'加载中...',datas:[],pageIndex:1}
    for(var i in tabStrs){
        var data = {
            pageStateMsg:'加载中...',
            datas:[],
            pageIndex:1,
            action:0
        };
        tabInfo.tabDatas.push(data);
    }*/

    page.onClickTab = function(e){
        var tabIndex = e.currentTarget.dataset.index;
        console.log("index:----------------------------------------"+tabIndex);
        var tabInfo = page.data.tabInfo;
        tabInfo.tabIndex = tabIndex;


        var tabStrs =  tabInfo.tabStrs ;

        for(var i in tabStrs) {
            var obj =  tabStrs[i];
            obj.indicator = tabIndex == i ? 'item-selected' : 'item-unselected';
        };



        if(typeof (page.onChangeTab) == "function" ){
            page.onChangeTab(tabIndex);//回调
        }

        page.setData({
            tabInfo:tabInfo
        });
    };

    page.onPullDownRefresh = function(){
        page.data.tabDatas[page.data.tabInfo.tabIndex].onRefresh();
    };

    page.onRefresh = function(e){
        page.data.tabDatas[page.data.tabInfo.tabIndex].onRefresh();
    };

    page.onReachBottom = function(){
        page.data.tabDatas[page.data.tabInfo.tabIndex].onLoadMore();
    };

    page.onLoadMore = function(){
        page.data.tabDatas[page.data.tabInfo.tabIndex].onLoadMore();
    };
    page.onRetry = function(){
        page.data.tabDatas[page.data.tabInfo.tabIndex].onRetry();
    };

    page.onChangeTab = function(index){
        page.data.tabDatas[index].onStart();
    };


    page.setData({
        tabInfo:tabInfo
    });

}

function refreshAll(page){
   var lvInfos =  page.data.tabDatas;

    for(var index in lvInfos){
        var lvInfo = lvInfos[index];
        lvInfo.onRefresh();
    }


}

/**
 * 需要各tab种listview 的数组名都是datas
 * @param page
 * @param tabIndex
 * @param action
 * @param urlTail
 * @param params
 * @param listener
 */
function requestTab(page,action,urlTail,params,listener){
    var itemInfo = page.data.tabDatas[page.tabInfo.tabIndex];
   netUtil.sendRequestByAction(page,urlTail,params,action,itemInfo.pageIndex,itemInfo.datas,false,{
       onPreFirstIn: function(){
           setPageStateMsg(page,itemInfo,'加载中...');
       },
       onPreRefresh: function(){
           setPageStateMsg(page,itemInfo,'加载中...');
       },
       onPreLoadMore: function(){
           setPageStateMsg(page,itemInfo,'加载中...');
       },

       onEnd: function(){
           netUtil.hideLoadingDialog(page);
           setPageStateMsg(page,itemInfo,'加载完成');
       },


       getRealDataFromNetData:function(netData){
           return  listener.getRealDataFromNetData(netData);
       },
       washItem:function(item){
           listener.washItem(item);
       },


       onSuccessFirstIn:function (data){
           itemInfo.datas =   itemInfo.datas.concat(data);
           var info = page.tabInfo;
           page.setData({
               tabInfo:info
           });

       },
       onSuccessRefresh:function (data){
           itemInfo.datas = [];
           itemInfo.datas =   itemInfo.datas.concat(data);
           var info = page.data.tabInfo;
           page.setData({
               tabInfo:info
           });

       },
       onSuccessLoadMore:function (data,hasMore){
           itemInfo.datas =   itemInfo.datas.concat(data);
           var info = page.data.tabInfo;
           page.setData({
               tabInfo:info
           });

           if(!hasMore){
               setPageStateMsg(page,itemInfo,'没有了...');
           }
       },

       onEmptyFirstIn : function(){
           setPageStateMsg(page,itemInfo,'没有内容');
       },
       onEmptyRefresh : function(){
           setPageStateMsg(page,itemInfo,'没有内容');
       },
       onEmptyLoadMore : function(){
           setPageStateMsg(page,itemInfo,'没有了...');
       },


       onErrorFirstIn : function(msgCanShow,code,hiddenMsg){
           setPageStateMsg(page,itemInfo,'加载错误,请下拉重试');
       },
       onErrorRefresh : function(msgCanShow,code,hiddenMsg){

           setPageStateMsg(page,itemInfo,'加载错误,请下拉重试');
       },
       onErrorLoadMore : function(msgCanShow,code,hiddenMsg){
           setPageStateMsg(page,itemInfo,'加载错误,请上拉重试');
       }
   });
}

function  setPageStateMsg(page,itemInfo,str){
    itemInfo.pageStateMsg = str;
    var info = page.data.tabInfo;
    page.setData({
        tabInfo:info
    });
}

module.exports = {
    initTab:initTab,
    requestTab:requestTab,
    refreshAll:refreshAll
}