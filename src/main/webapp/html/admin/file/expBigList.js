"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system','sdp_excel_exp_big_sts' ];
	// 上下文
	var context = new SDP.SDPContext();
	var bigfile=context.newDataStore("bigfile");
	var page = bigfile.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	bigfile.$queryUrl = "/api/common/selectList";
	bigfile.statement = "SDP-EXCEL-EXP-BIG-001";

	var cols = [
		 	{
				title : '导出编码',
				key : 'big_id',
				width : 180
			},{
				title : '导出标题',
				key : 'exp_title',
				width : 140
			},{
				title : '记录数',
				key : 'row_num',
				width : 60
			},{
				title : '导出状态',
				key : 'exp_sts',
				width : 80,
				format : function(row, val) {
					return pageVue.systemFormats('sdp_excel_exp_big_sts', row,
							'exp_sts');
				}
			},{
				title : '文件编码',
				key : 'file_id',
				width : 200
			},{
				title : 'SQL编码',
				key : 'sql_code',
				width : 100
			},{
				title : '线程编码',
				key : 'thread_code',
				width : 100
			},{
				title : '系统类型',
				key : 'system_code',
				width : 100,
				format : function(row, val) {
					return pageVue.systemFormats('sdp_system', row,
							'system_code');
				}
			},{
				title : '服务器地址',
				key : 'server_ip',
				width : 140
			},{
				title : '客户端地址',
				key :'client_ip',
				width : 140
			},{
				title : '菜单编码',
				key : 'menu_code',
				width :120
			},{
				title : '日志异常编码',
				key : 'error_code',
				width : 120
			},{
				title : '创建时间',
				key : 'create_date',
				width : 140
			},{
				title : '创建人',
				key : 'create_user',
				width : 120
			},{
				title : '更新时间',
				key : 'update_date',
				width : 140
			},{
				title : '更新人',
				key : 'update_user',
				width : 120
			},{
				title : '操作',
				key : 'action',
				align : 'left',
				width : 60,
				fixed : 'right',
				type:'render',
				render : actionRender
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				system_code : 'sdp',
				exp_title:'',
				exp_sts :''
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			columns : cols
			/**isAdmin:parent?parent.SDP.loginUser.systemAdmin:false**/
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
		var loading = layer.load();
		var g = this;
		bigfile.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = bigfile.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	// 格式化
	methods_page.systemFormats = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
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
		// 
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

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];

		arr.push(initBtn(h, "下载", "fa fa-download", function() {
			layer.msg("文件准备下载");
			context.downFile("/api/fileManage/downFile?file_id="+row.file_id);
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