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
	var porRole = context.newDataStore("porRole");
	porRole.$queryUrl = "/api/common/selectList";
	porRole.statement = "SDP-PORTAL-WIN-022";
	

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			wins : [],
			callback:null
		}
	};

	var methods_page = page_conf.methods = {};
	// 查询
	methods_page.queryDatas = function() {
		var g = this;
		var loading = layer.load();
		porRole.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas(data.data);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = porRole.$rowSet.$views;
		 if (vs.length == 0) {
			this.wins.splice(0, this.wins.length);
		 } else {
			this.wins = vs;
		}
	};
	
	// 向上移动
	methods_page.preOrder=function(itm){
		var index=$.inArray(itm, this.wins);
		var preItm=this.wins[index-1];
		var olOrder=preItm.line_no;
		preItm.set('line_no',itm.line_no);
		itm.set('line_no',olOrder);
		this.wins.splice(index-1,1,itm);
		this.wins[index]=preItm;
	}
	
	// 向下移动
	methods_page.nextOrder=function(itm){
		var index=$.inArray(itm, this.wins);
		var nextItm=this.wins[index+1];
		var olOrder=nextItm.line_no;
		nextItm.set('line_no',itm.line_no);
		itm.set('line_no',olOrder);
		this.wins.splice(index+1,1,itm);
		this.wins[index]=nextItm;
	}
	
	// 可否向上移动
	methods_page.isUpMove=function(itm){
		var index=porRole.$rowSet.getIndex(itm);
		return index<=0?true:false;
	};	// 可否向下移动
	methods_page.isUpDown=function(itm){
		var index=porRole.$rowSet.getIndex(itm);
		return (index>=porRole.$rowSet.$views.length-1?true:false);
	};
	
	
	// 保存数据
	methods_page.saveWin=function(){
		var g=this;
		var loading = layer.load();
		porRole.$saveUrl = "/api/common/update";
		porRole.$update = 'SDP-PORTAL-WIN-017';
		porRole.doSave(function() {
			layer.close(loading);
			g.queryDatas();
			layer.msg('数据更新成功');
			g.freshPage();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		}, "update");
	};
	
	// 关闭窗口
	methods_page.closeWin=function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	
	// 刷新首页
	methods_page.freshPage=function(){
		if(this.callback){
			this.callback();
		}
	};
	
	// 初始化
	page_conf.mounted = function() {

	};

	var pageVue = new Vue(page_conf);
	
	$.sendParams = function(obj) {
		pageVue.callback=obj.callback;
		pageVue.$nextTick(function(){
			pageVue.queryDatas();
		});
	};
});