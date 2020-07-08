
"use strict";
$(function() {
	var dicConf = [ 'sdp_excel_imp_store','sdp_excel_imp_null' ];
	var context = new SDP.SDPContext();
	var excelimp = context.newDataStore("excelimp");
	
	var page = excelimp.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	
	excelimp.$queryUrl = "/api/common/selectList";
	excelimp.statement = "SDP-EXCEL-IMP-001";
	
	// 导入列表
	var cols = [
				{
					title : '导入编码',
					key : 'imp_code',
					width : 160
				},
				{
					title : '导入名称',
					key : 'imp_name',
					width : 140
				},
				{
					title : 'sql语句',
					key : 'imp_statement',
					width : 180
				}, {
					title : '起始行',
					key : 'start_line',
					width : 100
				}, {
					title : '是否存储',
					key : 'is_store',
					width : 120,
					format:function(row,val){
						return pageVue.stsFormat('sdp_excel_imp_store', row,
						'is_store');
					}
				},
				{
					title : '备注',
					key : 'imp_remark',
					width : 180
				},
				{
					title : '创建时间',
					key : 'create_date',
					width : 160
				}, {
					title : '创建人',
					key : 'create_user',
					width : 120
				}, {
					title : '更新时间',
					key : 'update_date',
					width : 160
				}, {
					title : '更新人',
					key : 'update_user',
					width : 120
				},{
					title : '操作',
					key : 'action',
					align : 'left',
					width : 80,
					fixed : 'right',
					type:'render',
					render : actionRender
				}
				];
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				imp_code : '',
				imp_name : '',
				is_store : []
			},
			dicDatas : {},
			dicMaps : {},
			datas : [],
			page : page,
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
		var g=this;
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		pageVue.curRow = {};
		var loading = layer.load();
		excelimp.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = excelimp.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		}
		this.datas = vs;
	};
	// 删除头表
	methods_page.deleteRow = function(row) {
		var g=this;
		var tindex = layer.confirm('是否删除配置[' + row.imp_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-EXCEL-IMP-005',
				deletes : [ 'SDP-EXCEL-IMP-006' ],
				params : {
					imp_code : row.imp_code
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 编辑导入配置
	methods_page.editRow = function(row) {
		parent.layer.open({
			title:'编辑导入配置',
			type: 2,
			end: function(){
				pageVue.queryDatas();
			  },
			area: ['900px', '510px'],
			fixed: false, // 不固定
			maxmin: true,
			content: 'base/excelImpEdit.html?impcode='+row["imp_code"]
		});
	};
	// 新增导入配置
	methods_page.addData = function() {
			parent.layer.open({
			title:'新增导入配置',
			type: 2,
			end: function(){
				pageVue.queryDatas();
			  },
			area: ['900px', '490px'],
			fixed: false, // 不固定
			maxmin: true,
			content: 'base/excelImpAdd.html'
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
	// 存储状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.is_store;
	};
	// 是否为空
	methods_page.stsFormats = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.is_null;
	};
	// 初始化
	page_conf.mounted = function() {
		// 查询字典数据
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
		arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
			pageVue.editRow(row);
		}));
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow(row);
		}));
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
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