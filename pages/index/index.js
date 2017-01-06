
//此js针对纯listview数据,没有头部

var utils=require("../../utils/util.js");
var API=require("../../utils/API.js");
var netUtil=require("../../utils/netUtil.js");
var tabUtil=require("../../lib/tab/tabUtil.js");
var lvUtil=require("../../lib/tab/lvUtil.js");



var that;

var intentDatas;

var labelIds='0';

Page({
  data: {
    title:'',//todo 设置标题栏
    tabDatas:[],
    tabInfo:{},
    coverUrl:''

  },


//以下四个方法是生命周期方法,已封装好,无需改动
  onLoad: function(options) {
    that = this;
    intentDatas = options;

    that.parseIntent(options);
    var tabStrs = [' ',' ','推荐','学业成绩','行为问题','亲子关系','人际关系','情绪困扰'];

    tabUtil.initTab(that,tabStrs,2,function(i){
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

   /* var tabs = that.data.tabDatas;

    for(var i in tabStrs){
      var params = {};
      params.type=1;
      params.labelIds =0;
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
      tabs.push(lvBean);
      if(i ==2){
        console.log("lvBean.onFristIn()----------------------");
        lvBean.onFristIn();
      }
    }*/


  },
  onReady: function () {




  },
  onHide:function(){

  },
  onShow:function(){

  },


  //todo 滑动监听,各页面自己回调
  scroll: function(e) {
    console.log(e)
  },

  //todo 将intent传递过来的数据解析出来
  parseIntent:function(options){
    labelIds =options.labelIds;
    that.data.title = options.title;

  }

})
