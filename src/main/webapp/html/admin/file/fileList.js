/**
 * 用户脚本
 * 
 * @文件名 roleList
 * @作者 李浩祺
 * @创建日期 2017-05-02
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system', 'sdp_bus_type_sts' ];
	// 上下文
	var context = new SDP.SDPContext();
	var file = context.newDataStore("file");
	var page = file.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	var busType = context.newDataStore("busType");

	file.$queryUrl = "/api/common/selectList";
	file.statement = "SDP-FILE-002";

	busType.$queryUrl = "/api/common/selectList";
	busType.statement = "SDP-BUS-TYPE-001";

	var cols = [ {
		title : '系统',
		key : 'system_code',
		width : 180,
		format : function(row, val) {
			return pageVue.systemFormat('sdp_system', row, 'system_code');
		}
	}, {
		title : '业务类型',
		key : 'bus_type_name',
		width : 160
	}, {
		title : '业务编码',
		key : 'business_no',
		width : 120
	}, {
		title : '序号',
		key : 'lin_no',
		width : 60
	}, {
		title : '文件',
		key : 'file_name',
		width : 160
	}, {
		title : '创建时间',
		key : 'create_date',
		width : 125
	}, {
		title : '创建人',
		key : 'create_user',
		width : 120
	}, {
		title : '文件ID',
		key : 'file_id',
		width : 180
	}, {
		title : '操作',
		key : 'action',
		align : 'left',
		width : 80,
		fixed : 'right',
		type : 'render',
		render : actionRender
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				bus_type : '',
				system_code : '',
				file_name : '',
				create_user : '',
				business_no : ''
			},
			isAdmin : parent ? parent.SDP.loginUser.systemAdmin : false,
			datas : [],
			busTypeDatas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols
		}
	};

	var methods_page = page_conf.methods = {};
	// 点击查询按钮
	methods_page.searchDatas = function() {
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;

		file.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 设置数据
	methods_page.updateDatas = function() {
		var vs = file.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 系统格式化
	methods_page.systemFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.role_sts;
	};

	// 系统选择变化
	methods_page.systemChange = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		this.busTypeDatas = [];
		var loading = layer.load();
		var g = this;

		busType.doQuery(function(data) {
			layer.close(loading);
			g.busTypeDatas = busType.$rowSet.$views;
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
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

	// 初始化
	page_conf.mounted = function() {
		// 查询角色数据
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

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];

		arr.push(initBtn(h, "下载", "fa fa-download",
				function() {
					layer.msg("文件准备下载");
					context.downFile("/api/fileManage/downFile?file_id="
							+ row.file_id);
				}));

		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}

	// 初始化按钮
	function initBtn(h, title, icon, click) {
		var ele = h('i-button', {
			attrs : {
				type : 'text',
				img : icon,
				title : title
			},
			on : {
				click : click
			}
		});
		return ele;
	}
});