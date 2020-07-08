/**
 * 公共用户页面
 * 
 * @文件名 selectOrgUser
 * @作者 李浩祺
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var user = context.newDataStore("user");
	var page = user.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	user.$queryUrl = "/api/common/selectList";

	var cols=[
		{
			key : 'checked',
			type : "selection",
			width : 50
		},
		{
			title : '用户编码',
			key : 'user_code',
			width : 150
		},
		{
			title : '用户名称',
			key : 'user_name',
			width : 150
	}];	
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				user_code:null,
				role_code:null
			},
			datas : [],
			page : page,
			curRow:null,
			columns : cols,
			callback:null,
			selectUsers:[]
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	
	
	// 查询组织用户数据
	methods_page.queryDatas=function(){
		var g = this;
		var loading = layer.load();
		context.clearParam();
		context.put(g.params);
		user.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 初始化用户数据
	methods_page.updateDatas=function(){
		var vs = user.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	// 确认
	methods_page.saveUser=function(userCode){
		if(this.callback){
			var arr=[];
			var itms = this.$refs.userGrid.getSelection();
			if(itms && itms.length>0){
				$.each(itms,function(index,itm){
					arr.push({user_code:itm.user_code,user_name:itm.user_name});
				});
			}
			this.callback(arr);
			this.closeWindow();
		}
	};
	
	// 关闭窗体
	methods_page.closeWindow=function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	
	
	// 翻页改变
	methods_page.handleCurrentChange=function(val){
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 翻页每页大小改变
	methods_page.handleSizeChange=function(val){
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	var pageVue = new Vue(page_conf);
	
	$.sendParams = function(obj) {
		pageVue.callback=obj.callback;
		user.statement = obj.data.statement;
		pageVue.params.user_code = obj.data.user_code;
		pageVue.params.role_code = obj.data.role_code;
		pageVue.$nextTick(function(){
			pageVue.queryDatas();
		});
	};
});