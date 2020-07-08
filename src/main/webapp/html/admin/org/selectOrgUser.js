"use strict";
$(function() {
	var dicConf = [ 'sdp_org_mdm_manager' ];
	var context = new SDP.SDPContext();
	
	var mdms = context.newDataStore("mdms");
	
	//非组织用户
	var orgusers = context.newDataStore("orgusers");
	orgusers.$queryUrl = "/api/common/selectList";
	orgusers.statement = "SDP-MGR-004"
	var pageusers = orgusers.getPage();
	pageusers.setPageNumber(1);
	pageusers.setPageRowCount(20);
	
	//组织人员
    var colsusers = [
		{
			key : 'checked',
			type : 'selection',
			width : 40
		}, {
			title : '用户编码',
			key : 'user_code',
			width : 120
		}, {
			title : '用户名称',
			key : 'user_name',
			width : 120
		}, {
			title : '邮箱',
			key : 'user_email',
			width : 220
		}, {
			title : '手机',
			key : 'user_mobile',
			width : 120
		}];

	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			curRow : {
			},
			datas:[],
			columnsUsers : colsusers,
			usersdatas : [],
			pageusers : pageusers,
			dicDatas : {},
			dicMaps : {},
			callback:null,
			selectUser : [],
			usersParam : {
				user_code :''
			},
			org_code : ""
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 选择单个用户
	methods_page.userTableSelect = function(data) {
		if (this.selectUser != data.item) {
			this.selectUser = data.item;
		}
	};
	
	// 确认
	methods_page.saveUser=function(){
		var itms = this.$refs.dataUsersGrid.getSelection();
		if(this.callback){
			this.callback(itms);
			this.closeWindow();
		}
	};
	
	// 关闭窗体
	methods_page.closeWindow=function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	
	// 查询不在组织人员数据
	methods_page.queryUsersDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		orgusers.set('org_code',this.org_code);
		var g = this;
		var loading = layer.load();
		orgusers.doQuery(function(data) {
			layer.close(loading);
			g.updateUsersDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 设置人员数据
	methods_page.updateUsersDatas = function() {
		var vs = orgusers.$rowSet.$views;
		if (vs.length == 0) {
			this.usersdatas.splice(0, this.usersdatas.length);
		} else {
			this.usersdatas = vs;
		}
	};

	// 改变当前页号
	methods_page.handleCurrentChangeUsers = function(val) {
		pageusers.setPageNumber(val);
		if (pageusers.getIsChange()) {
			this.queryUsersDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChangeUsers = function(val) {
		pageusers.setPageRowCount(val);
		if (pageusers.getIsChange()) {
			this.queryUsersDatas();
		}
	};
	
	
	// 格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
	};

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	
	
	// 初始化
	page_conf.mounted = function() {
		
	};

	var pageVue = new Vue(page_conf);
	
	$.sendParams = function(obj) {
		pageVue.callback=obj.callback;
		pageVue.org_code = obj.data.org_code
		pageVue.$nextTick(function(){
			pageVue.queryUsersDatas();
		});
	};
	
});