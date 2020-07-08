
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var excelexp = context.newDataStore("excelexp");
	var page = excelexp.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	
	excelexp.$queryUrl = "/api/common/selectList";
	excelexp.statement = "SDP-EXCEL-EXP-001";
	
	// 导出列表
	var cols = [
				{
					title : '导出编码',
					key : 'exp_code',
					width : 160
				},
				{
					title : '导出名称',
					key : 'exp_name',
					width : 140
				},
				{
					title : '起始行',
					key : 'start_row',
					width : 100,
					
				}, {
					title : '标题',
					key : 'exp_title',
					width : 160
				}, {
					title : '导出备注',
					key : 'exp_remark',
					width : 200
				}, {
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
				}, {
					title : '操作',
					key : 'action',
					align : 'left',
					width : 80,
					fixed : 'right',
					type:'render',
					render : actionRender
				}];
	
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				exp_code : '',
				exp_name : '',
				exp_title : ''
			},
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
		excelexp.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = excelexp.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		}
		this.datas = vs;
	};
	
	// 删除头表
	methods_page.deleteRow = function(row) {
		var g=this;
		var tindex = layer.confirm('是否删除配置[' + row.exp_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-EXCEL-EXP-005',
				deletes : [ 'SDP-EXCEL-EXP-006' ],
				params : {
					exp_code : row.exp_code
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
	
	// 编辑导出配置
	methods_page.editRow = function(row) {
		parent.layer.open({
			title:'编辑导出配置',
			type: 2,
			end: function(){
				pageVue.queryDatas();
			  },
			area: ['900px', '490px'],
			fixed: false, // 不固定
			maxmin: true,
			content: 'base/excelExpEdit.html?expcode='+row["exp_code"]
		});
	};
	
	// 新增导出配置
	methods_page.addData = function() {
			parent.layer.open({
			title:'新增导出配置',
			type: 2,
			end: function(){
				pageVue.queryDatas();
			  },
			area: ['900px', '490px'],
			fixed: false, // 不固定
			maxmin: true,
			content: 'base/excelExpAdd.html'
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
		// 查询字典数据
		this.$nextTick(function(){
			this.queryDatas();
		});	
	};

	var pageVue = new Vue(page_conf);
	
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