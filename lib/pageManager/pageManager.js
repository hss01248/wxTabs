

function netStateBean(){
        this.emptyMsg='暂时没有内容,去别处逛逛吧',
        this.emptyHidden = true,

        this.errorHidden=true,
        this.errorMsg='',

        this.loadmoreMsg='加载中...',
        this.loadmoreHidden=true,
        this.contentHidden = true,
        this.hasSuccessed = false,
        this.hasMore = true
}


function init(page){
    var bean = new netStateBean();
    page.data.netStateBean = bean;
    page.setData({
        netStateBean: bean
    });
}

function  loadMoreError(that,stateBean){
    var bean = stateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载出错,请上拉重试';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreStart(that){

    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '加载中...';
    that.setData({
        netStateBean: bean
    });

}

function loadMoreNoData(that){
    var bean = that.data.netStateBean;
    bean.loadmoreHidden = false;
    bean.loadmoreMsg= '没有了...';
    that.setData({
        netStateBean: bean
    });
}

function  hideLoadingDialog(that){
    wx.hideToast();

}

//以下三个方法是用于页面状态管理
function showEmptyPage(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.emptyHidden = false;
    bean.loadingHidden = true;
    var empty = that.data.emptyMsg;
    if (isOptStrNull(empty)){
        empty = "没有内容,去别的页面逛逛吧"
    }
    bean.emptyMsg= empty;
    bean.contentHidden=true;
    bean.errorHidden = true;
    that.setData({
        netStateBean: bean
    });
}

function showErrorPage(that,msg){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = false;
    bean.errorMsg= msg;
    bean.loadingHidden = true;
    bean.contentHidden=true;
    that.setData({
        netStateBean: bean
    });

}
function showContent(that){
    hideLoadingDialog(that);
    var bean = that.data.netStateBean;
    bean.errorHidden = true;
    bean.emptyHidden = true;
    bean.contentHidden=false;
    bean.loadingHidden = true;
    that.setData({
        netStateBean: bean
    });
}

