"use strict";
$(function() {
	var dicConf = [ 'sdp_org_mdm_main' ];
	var context = new SDP.SDPContext();
	
	var mdms = context.newDataStore("mdms");
	mdms.$keyField = "mdm_code";
	var page = mdms.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	
	mdms.$queryUrl = "/api/common/selectList";
	mdms.statement = "SDP-ORG-MDM-002";
	
	
	var cols = [
		{
			title : '多维组织编码',
			key : 'mdm_code',
			width : 160
		}, {
			title : '多维组织名称',
			key : 'mdm_name',
			width : 160
		}, {
			title : '是否为主组织',
			key : 'mdm_main',
			width : 100,
			format:function(row,val){
				return pageVue.stsFormat('sdp_org_mdm_main', row,
				'mdm_main');
			}
		}];
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			curRow : {
			},
			curMdm:null,
			datas:[],
			columns : cols,
			page : page,
			dicDatas : {},
			dicMaps : {},
			mdmParam:{
				mdm_code:null
			},
			callback:null,
			selectMdm:[]
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	// 选择维度
	methods_page.mdmTableSelect = function(data) {
		if (this.selectMdm != data.item) {
			this.selectMdm = data.item;
		}
	};
	
	// 确认
	methods_page.saveMdm=function(){
		if(this.callback){
			if(this.selectMdm != null){
				this.callback(this.selectMdm);
				this.closeWindow();
			}
			
		}
	};
	
	// 关闭窗体
	methods_page.closeWindow=function(){
		var index = parent.layer.getFrameIndex(window.name);
		parent.layer.close(index);
	};
	
	// 点击查询按钮
	methods_page.searchMdm=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.mdmParam;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		mdms.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = mdms.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryMdmDatas();
		}
	};
	
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
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
		pageVue.$nextTick(function(){
			pageVue.queryDatas();
		});
	};
	
});