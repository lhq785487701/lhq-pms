
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system' , 'sdp_thread_sts' ];
	var context = new SDP.SDPContext();
	var threads = context.newDataStore("threads");
	threads.$keyField = "thread_code";
	var page = threads.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	threads.$queryUrl = "/api/common/selectList";
	threads.statement = "SDP-THREAD-001";
	
	var cols = [
			{
				title : '线程编码',
				key : 'thread_code',
				width : 100
			},
			{
				title : '线程标题',
				key : 'thread_title',
				width : 120,
			},
			{
				title : '开始日期',
				key : 'start_date',
				width : 110
			},
			{
				title : '结束日期',
				key : 'end_date',
				width : 110
			},  {
				title : '线程组名称',
				key : 'group_name',
				width : 120,
			}, {
				title : '线程名称',
				key : 'thread_name',
				width : 120
			}, {
				title : '服务器',
				key : 'server_ip',
				width : 110
			}, {
				title : '系统类型' ,
				key : 'system_code',
				width : 120,
				format:function(row,val){
					return pageVue.stsFormat('sdp_system', row,
					'system_code');
				}
			}, {
				title : '线程状态' ,
				key : 'thread_sts',
				width : 110
			}, {
				title : '创建时间',
				key :'create_date',
				width :110
			},{
				title : '创建人',
				key : 'create_user',
				width :110
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				width : 110,
				fixed : 'right',
				/*
				 * type:'render', render : actionRender
				 */
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				system_code : 'sdp',
				thread_title : '',
				thread_code : '',
				thread_sts:''
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
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
		threads.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = threads.$rowSet.$views;
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
	
	// 业务状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
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