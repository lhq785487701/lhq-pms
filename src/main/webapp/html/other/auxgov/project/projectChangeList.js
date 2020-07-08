"use strict";
$(function() {

	var dicConf = [ 'gpm_prj_type','gpm_prj_class' ];
	// 项目
	var context = new SDP.SDPContext();
	var projectChange = context.newDataStore("projectChange");
	var page = projectChange.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	projectChange.$queryUrl = "/api/common/selectList";
	projectChange.statement = "SDP-CHANGE-001";

	// 项目列表信息
	var cols = [ {
		align: 'center',
		title : '全选',
		type : 'selection',
		key : 'prj_id',
		width : 40,
		fixed: 'left',
	}, {
		title : '项目编号',
		key : 'prj_code',
		width : 120,
		sortable: true
	}, {
		title : '项目名称',
		key : 'prj_name',
		width : 120,
		sortable: true
	}, {
		title : '版本号',
		key : 'prj_version',
		width : 120
	}, {
		title : '立项年份',
		key : 'prj_year',
		width : 120
	}, {
		title : '立项月份',
		key : 'prj_month',
		width : 120
	}, {
		title : '项目类别',
		key : 'prj_type',
		width : 120
	}, {
		title : '项目级别',
		key : 'prj_level',
		width : 120
	}, {
		title : '项目开始时间',
		key : 'prj_start_time',
		width : 150
	}, {
		title : '项目结项时间',
		key : 'prj_end_time',
		width : 150
	} ];

	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				prj_code:'',
				prj_name:'',
				prj_type:''
			},
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			datas : [],
			page : page,
		}
	};

	var methods_page = page_conf.methods = {};

	// 项目信息查询
	methods_page.queryDatas = function() {
		var loading = layer.load();
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		projectChange.doQuery(function(data) {
			g.updateDatas();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 设置项目数据
	methods_page.updateDatas = function() {
		var vs = projectChange.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
			console.log(this.datas)
		}
	};

	// 项目查询
	methods_page.searchDatas = function() {
		this.queryDatas();
	}

	// 项目选择
	methods_page.searchCancel = function() {

	}

	// 使用者改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};
	// 使用者改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
		}
	};

	// 初始化
	page_conf.mounted = function() {
		// 查询项目数据
		this.$nextTick(function() {
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
