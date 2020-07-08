
"use strict";
$(function() {
	var context = new SDP.SDPContext();
	var excelexp = context.newDataStore("excelexp");
	excelexp.setDefaultCurRowIndex(1);
	
	var excelexp01 = context.newDataStore("excelexp01");
	
	var exp_code=SDP.params["expcode"];
	
	var page = excelexp.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	
	excelexp.$queryUrl = "/api/common/selectList";
	excelexp.statement = "SDP-EXCEL-EXP-001";
	excelexp.$update = "SDP-EXCEL-EXP-007";
	
	
	excelexp01.setParentDS(excelexp);
	excelexp01.$parentKeys = {
		'exp_code' : 'exp_code'
	};
	excelexp01.$queryUrl = "/api/common/selectList";
	excelexp01.statement = "SDP-EXCEL-EXP-002";
	excelexp01.$insert = "SDP-EXCEL-EXP-004";
	excelexp01.$delete = "SDP-EXCEL-EXP-009";
	excelexp01.$update = "SDP-EXCEL-EXP-008";
	
	// 验证
	var rulesEdit = {
			exp_name : [ {
				required : true,
				message : '请输入导出名称',
				trigger : 'blur'
			}, {
				min : 1,
				max : 80,
				message : '长度在 1到 80 个字符',
				trigger : 'blur'
			} ]
		};
	
	// 导出配置明细
	var cols01 = [
	  			{
	  				title : '排序',
	  				key : 'line_no',
	  				width : 100,
	  				editRender : function(row, column) {
	  					return '<input-number :min="1" v-model="row.line_no" style="width:90px;"></input-number>';
	  				}
	  			}, {
	  				title : 'excel列',
	  				key : 'excel_col',
	  				width : 80,
	  				editRender : function(row, column) {
	  					return '<input-number v-model="row.excel_col" style="width:70px;" ></input-number>';
	  				}
	  			}, {
	  				title : '导出字段',
	  				key : 'exp_col',
	  				width : 140,
	  				editRender : function(row, column) {
	  					return '<i-input v-model="row.exp_col" style="width:130px"></i-input>';
	  				}
	  			}, {
	  				title : '列宽',
	  				key : 'col_width',
	  				width : 80,
	  				editRender : function(row, column) {
	  					return '<input-number v-model="row.col_width" style="width:70px;"></input-number>';
	  				}
	  			}, {
	  				title : '列名',
	  				key : 'col_name',
	  				width : 140,
	  				editRender : function(row, column) {
	  					return '<i-input v-model="row.col_name" style="width:130px"></i-input>';
	  				}
	  			}, {
	  				title : '对应字典',
	  				key : 'dic_code',
	  				width : 140,
	  				editRender : function(row, column) {
	  					return '<i-input v-model="row.dic_code" style="width:130px"></i-input>';
	  				}
	  			},{
	  				title : '操作',
	  				key : 'action',
	  				align : 'left',
	  				width : 100,
	  				type:'render',
	  				render : actionRender01
	  			} ];
	
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
			curRow : {},
			curRows : {},
			datas01 : [],
			columns01 : cols01,
			rulesEdit : rulesEdit
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
		var obj = pageVue.curRow;
		var loading = layer.load();
		excelexp.clearParam();
		excelexp.set('exp_code', exp_code);
		var g=this;
		excelexp.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
			g.queryDatas01();
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
		this.curRows=this.datas[0];
	};
	// 查询导出配置明细数据
	methods_page.queryDatas01=function() {
		var obj = pageVue.curRow;
		var loading = layer.load();
		excelexp01.clearParam();
		excelexp01.set('exp_code', exp_code);
		var g=this;
		excelexp01.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas01();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 设置导出配置明细数据
	methods_page.updateDatas01 = function() {
		var vs = excelexp01.$rowSet.$views;
		if (vs.length == 0) {
			this.datas01.splice(0, this.datas01.length);
		}
		this.datas01 = vs;
	};
	
	// 新增导出配置明细
	methods_page.addData01 = function() {
		var r = excelexp01.newRow();
		var order = excelexp01.$rowSet.findByMaxValue('line_no');
		order++;
		var orders = excelexp01.$rowSet.findByMaxValue('excel_col');
		orders++;
		r.set('line_no', order);
		r.set('excel_col',orders);
		r.set('col_width',80);
		r.set('exp_col', '');
		r.set('col_name', '');
	};
	
	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doDataStores("/api/common/save", function() {
					layer.close(loading);
					layer.msg('数据保存成功');
					g.$nextTick(function(){
						parent.layer.close(parent.layer.getFrameIndex(window.name));
					});	
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
			} else {
				return false;
			}
		});
	};
	
	// 取消
	methods_page.editDataCancel = function() {
		this.curRow = {};
		var index = parent.layer.getFrameIndex(window.name); // 先得到当前iframe层的索引
		parent.layer.close(index);
	}
	
	// 初始化
	page_conf.mounted = function() {
		// 查询字典数据
		this.$nextTick(function(){
			this.queryDatas();			
		});	
	};

	var pageVue = new Vue(page_conf);
	
	// 初始化明细删除按钮
	function actionRender01(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			var tindex = layer.confirm('是否删除[' + row.exp_col + ']字段', {
				btn : [ '是', '否' ]
			}, function() {
				row.del();
				layer.close(tindex);
			});
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