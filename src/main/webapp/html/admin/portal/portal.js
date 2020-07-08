/**
 * 门户脚本
 * 
 * @文件名 portal
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			rows : [],
			isSingle:false,
			curItem:null
		}
	};

	var methods_page = page_conf.methods = {};
	// 查询
	methods_page.queryDatas = function() {
		var g = this;
		var loading = layer.load();
		context.doAction({},"/api/portalCache/queryPortalCache",function(data) {
			layer.close(loading);
			g.updateDatas(data.data);
			// $(".iframeClass").load(function(){
				// var mainheight =
				// $(this).contents().find("#mainContainer").height();
				// $(this).height(mainheight);
			// });
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function(vs) {
		if(vs!=null && vs.length>0){
			if(vs.length==1){
				this.isSingle=false;
				this.curItem=vs[0];
				this.curItem.win_url=SDP.URL.getSystemUrl(this.curItem.win_url,this.curItem.system_code);
				return;
			}
			this.isSingle=true;
			var rowItems=[];
			initRows(vs);// 初始化窗体数据
			var datas=$.extend([],vs);// 拷贝数据
			var b=true;
			var rowSpans=[];// 占行数据
			
			while(b){
				var col=0;// 当前行占列
				var row=[];// 行数据
				while(datas.length>0){
					var itm=datas[0];
					var t=col+getCols(rowSpans,false)+itm.col_span;
					if(t>20){
						rowItems.push(row);
						getCols(rowSpans,true);// 减1行
						break;
					}if(t<=20){
						datas.splice(i,1);
						if(itm.row_span>1){
							rowSpans.push(itm);// 行数>1放入占行数据
						}else{
							col=col+itm.col_span;
						}				
						t=col+getCols(rowSpans,false);
						row.push(itm);

						if(t==20 || datas.length<=0){
							rowItems.push(row);// 生成行
							getCols(rowSpans,true);// 减1行
							break;
						}
					}
				}
				if(datas.length<=0){
					b=false;
					break;
				}
			}
			var maxRow=0;
			// 计算行
			$.each(rowSpans,function(index,item){
				if(item.tmp_row_span>maxRow){
					maxRow=item.tmp_row_span;
				}
			});
			// 完整行信息
			for(var i=0;i<maxRow;i++){
				rowItems.push([]);
			}
			this.rows=rowItems;
		}
	};
	// 计算卡片高度
	methods_page.getCardStyle=function(itm){
		var h=(itm.height+(itm.showTitle?45:0));
		return {height:h+"px",width:'100%'};
	};
	// 卡片内容高度
	methods_page.getCardContentStyle=function(itm){
		if(itm==null){
			return;
		}
		var h=itm.height;
		return {height:h+"px"};
	};
	// 初始化页面
	methods_page.pageLoad=function(evt,itm){
		if(itm==null){
			return;
		}
		var frame=$(evt.target);
		var frameContent=frame.contents();
		var mainheight = frameContent.find("#mainContainer").height(); 
		var h=itm.height;
		if(mainheight<h){
			mainheight=h;
		}
		frame.height(mainheight);
		// frameContent.find("body").height(mainheight);
		// frameContent.find("html").height(mainheight);
	}
	
	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.queryDatas();
		});
	};

	var pageVue = new Vue(page_conf);
	
	// 初始化窗体数据
	function initRows(vs){
		$.each(vs,function(index,itm){
			if(itm.col_span>20){
				itm.col_span=20;
			}
			if(itm.col_span<=0){
				itm.col_span=5;
			}
			if(itm.row_span<=0){
				itm.row_span=5;
			}
			itm.win_url=SDP.URL.getSystemUrl(itm.win_url,itm.system_code);
			itm.tmp_row_span=itm.row_span;
			itm.width=itm.col_span*5;
			itm.height=itm.row_span*25;
			itm.showTitle=itm.win_title?true:false;
			itm.showIcon=itm.win_icon?true:false;
		});
	}
	
	// 获取占行列
	function getCols(vs,b){
		var col=0;
		$.each(vs,function(index,itm){
			if(itm.tmp_row_span>0){
				col=col+itm.col_span;
				if(b){
					itm.tmp_row_span=itm.tmp_row_span-1;
				}
			}
		});
		return col;
	}
	
	// 刷新页面
	$.freshData=function(){
		pageVue.queryDatas();
	};
});