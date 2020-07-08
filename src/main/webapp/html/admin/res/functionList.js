"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_function_sts','sdp_system' ];
	var context = new SDP.SDPContext();
	var functionlist = context.newDataStore("functionlist");
	functionlist.$keyField = "function_code";
	var page = functionlist.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	functionlist.$queryUrl = "/api/common/selectList";
	functionlist.statement = "SDP-FUNCTION-002";
	// 字段验证
	var rules = {
			function_name : [ {
				required : true,
				message : '请输入功能名称',
				trigger : 'blur'
			}, {
				max : 40,
				message : '长度在 0到 840个字符',
				trigger : 'blur'
				
			} ],
			menu_code : [{
				required : true,
				trigger : 'blur',
				message : '请输入菜单编码'
			},{
				min : 1,
				max : 100,
				trigger : 'blur'
			} ]
		};
	
	var rulesAdd=$.extend({
		function_code : [ {
				required : true,
				message : '请输入功能编码',
				trigger : 'blur'
			}, {
				max : 40,
				message : '长度在 0到 40 个字符',
				trigger : 'blur'
			} ]
		},rules);
	
	var cols = [
			{
				title : '功能编码',
				key : 'function_code',
				width : 160
			},
			{
				title : '菜单名称',
				key : 'menu_name',
				width : 160
			},
			{
				title : '功能名称',
				key : 'function_name',
				width : 120
			},
			{
				title : '功能状态',
				key : 'function_sts',
				width : 80,
				format:function(row,val){
					return pageVue.stsFormat('sdp_function_sts', row,
					'function_sts');
				}
			},
			 {
				title : '系统',
				key : 'system_code',
				width : 100,
				format:function(row,val){
					return pageVue.stsFormat('sdp_system', row,
					'system_code');
				}
			}, {
				title : '创建人' ,
				key : 'create_user',
				width : 120
			},{
				title : '创建时间' ,
				key : 'create_date',
				width : 160
			},{
				title : '更新人' ,
				key : 'update_user',
				width : 120
			}, {
				title : '更新时间' ,
				key : 'update_date',
				width : 160
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				width : 120,
				fixed : 'right',
				type:'render',
				render : actionRender
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				function_code : '',
				function_name : '',
				function_sts : ''
			},
			f_action :  {},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			menuMaps:{},
			curRow : {},
			columns : cols,
			rules : rules,
			rulesAdd : rulesAdd,
			dataAdd : false,
			dataEdit : false,
			dataCopy : false
		}
	};

	var methods_page = page_conf.methods = {};

	
	//查询页面与页面编码
	methods_page.queryMenuCode = function() {
        var g =this;
		context.doAction({
			statement : 'SDP-FUNCTION-014',
		}, '/api/common/selectList', function(data) {
			g.menuMaps = data.data;
		}, function(data) {
			layer.alert(data.msg);
		});
		
	};
	
	//查询功能
	methods_page.queryFunction = function() {
          var g =this;
			context.doAction({
				statement : 'SDP-FUNCTION-002',
			}, '/api/common/selectList', function(data) {
				var obj = {};
				$.each(data.data, function(index, item) {
					obj[item.function_code] = item.function_sts == 'Y' ? true : false;
				});
				g.f_action = obj;
			}, function(data) {
				layer.alert(data.msg);
			});
		
	};
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
		functionlist.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = functionlist.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增业务
	methods_page.addData = function() {
		var r = functionlist.newRow();
		r.set('function_sts', 'Y');
		r.set('function_code', '');
		r.set('menu_code', '');
		r.set('function_name', '');
		r.set('system_code','');
		this.curRow = r;
		this.dataAdd = true;
	};
	
	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		g.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-FUNCTION-016',
					params : {
						function_code : g.curRow.function_code,
						menu_code : g.curRow.menu_code
					}
				}, '/api/common/selectList', function(data) {
					if(data.data[0].count == 1 ){
						layer.close(loading);
						layer.msg('此菜单中功能编码重复');
						return false;
					}
					functionlist.$saveUrl = "/api/common/insert";
					functionlist.$insert = 'SDP-FUNCTION-003';
					functionlist.doSave(function() {
						g.queryDatas();
						layer.msg('数据新增成功');
						g.dataAdd = false;
					}, function(data) {
						layer.alert(data.msg);
					}, "insert");
				}, function(data) {
					layer.alert(data.msg);
				});
				layer.close(loading);
			} else {
				return false;
			}
		});
	};
	// 新增取消
	methods_page.addDataCancel = function() {
		this.dataAdd = false;
		this.$refs['dataAddForm'].resetFields();
		functionlist.delCurRow();
		this.curRow = {};
	}
	
	// 禁用业务类型
	methods_page.disableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否禁用功能[' + row.function_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-FUNCTION-006',
				params : {
					function_code : row.function_code
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功禁用");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	// 启用业务类型
	methods_page.enableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否启用业务类型[' + row.function_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-FUNCTION-007',
				params : {
					function_code : row.function_code
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功解禁");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	// 删除角色
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除功能[' + row.function_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-FUNCTION-008',
				params : {
					function_code : row.function_code,
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
	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		g.$refs['dataEditForm'].validate(function(valid) {
			 if (valid) {
				var loading = layer.load();
				functionlist.$saveUrl = "/api/common/update";
				functionlist.$update = 'SDP-FUNCTION-004';
				functionlist.doSave(function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据保存成功');
					g.dataEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "update");
			 } else {
				 return false;
			 }
		});
	};
	// 修改取消
	methods_page.editDataCancel = function() {
		this.curRow = {};
	}
	// 新增取消
	methods_page.copyRow = function(row) {
		var r = functionlist.newRow();
		r.set('function_code','');
		r.set('menu_code','');
		r.set('function_name',row.function_name);
		r.set('function_sts',row.function_sts);
		r.set('system_code','');
		this.curRow=r;
		this.dataCopy=true;
	}
	// 修改取消
	methods_page.copyDataCancel = function() {
		functionlist.delRow(this.curRow);
		this.curRow = {};
	}
	
	
	
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
	// 编辑业务数据
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			//this.queryFunction();
			this.queryDatas();
			this.queryMenuCode();
		});	
	};

	var pageVue = new Vue(page_conf);
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	// 初始化功能列表	
	SDP.FUNCTION.initDatas(window.location.pathname, function(data) {
		pageVue.f_action = data;
	});

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		if (row.function_sts == 'Y') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));

			arr.push(initBtn(h, "禁用", "fa fa-ban", function() {
				pageVue.disableRow(row);
			}));

			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
			
		} else if (row.function_sts == 'D') {
			arr.push(initBtn(h, "启用", "fa fa-check-circle", function() {
				pageVue.enableRow(row);
			}));
		}
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