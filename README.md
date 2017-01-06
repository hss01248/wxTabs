# wxTabs
tabs for wechat app



# 特点:

各页面状态(空白,错误,加载中)已自动处理

页面下拉刷新和上拉加载更多的方法已实现,并封装在tabUtil中,无需在page中书写.

tab之间的切换逻辑已处理.



# 使用时需要做的:

## 拷贝

netUtil.js拷贝到utils目录下

lib文件夹拷贝到根目录下



##  修改

针对具体项目微调netUtil里的一些字段,比如将用于分批加载的pagesize和pageIndex改成自己网络请求里的相应字段.

tab颜色和最小宽度,以及高度可在tabs.wxss里修改.

## 使用(参考pages\index)

写每个页面的wxml和wxss,模板化,并在具体页面导入

```
<!--tab标题-->
  <import src="../../lib/tab/tabs.wxml"/>
  <view  style="width: 100%">
    <template is="tabs" data="{{...tabInfo}}" />
  </view>

  <!--tab下方的listview-->

  <import src="../../lib/listview/albumlv.wxml"/>
  <block wx:for-items="{{tabInfo.tabStrs}}" wx:for-item="str" wx:for-index="i" wx:key="unique">

    <view  wx:if="{{tabInfo.tabIndex == i}}" style="width: 100%;height: 60%">
      <template is="albumlv" data="{{...tabDatas[i]}}" />
    </view>
  </block>
```

引入js:

```
var netUtil=require("../../utils/netUtil.js");
var tabUtil=require("../../lib/tab/tabUtil.js");
var lvUtil=require("../../lib/tab/lvUtil.js");
```



调用:

```
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
```







