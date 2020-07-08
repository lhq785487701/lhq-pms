
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system','sdp_system_node_sts' ];
	var context = new SDP.SDPContext();
	var sysnode = context.newDataStore("sysnode");
	sysnode.$keyField = "node_code";
	var page = sysnode.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	sysnode.$queryUrl = "/api/common/selectList";
	sysnode.statement = "SDP-SYSTEM-NODE-001";
	
	var cols = [
			{
				title : '节点编码',
				key : 'node_code',
				width : 260
			},
			{
				title : '服务器',
				key : 'server_ip',
				width : 160,
			},
			{
				title : '系统名称',
				key : 'system_code',
				width : 190,
				format:function(row,val){
					return pageVue.stsFormat('sdp_system', row,
					'system_code');
				}
			},{
				title : '节点状态',
				key : 'node_sts',
				width : 100,
				format:function(row,val){
					return pageVue.stsFormat('sdp_system_node_sts', row,
					'node_sts');
				}
				
			},{
				title : '最新节点编码',
				key : 'node_code_next',
				width : 260
			},{
				title : '启动时间',
				key : 'create_date',
				width : 160
			},{
				title : '关闭时间',
				key : 'update_date',
				width : 160
			},{
				title : '操作',
				key : 'action',
				align : 'left',
				width : 100,
				fixed : 'right',
				/*type:'render',
				render : actionRender*/
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				system_code : 'sdp'
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols
		}
	};

	var methods_page = page_conf.methods = {};
	
	// 点击查询按钮
	methods_page.searchDatas=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		sysnode.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = sysnode.$rowSet.$views;
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
			this.queryDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	
	// 系统名称格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.system_code;
	};
	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			 this.queryDatas();
		});	
	};

	var pageVue = new Vue(page_conf);
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
});