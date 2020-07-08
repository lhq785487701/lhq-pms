"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_res_sts','sdp_system' ];
	var context = new SDP.SDPContext();
	var reslist = context.newDataStore("reslist");
	reslist.$keyField = "res_code";
	var page = reslist.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	reslist.$queryUrl = "/api/common/selectList";
	reslist.statement = "SDP-RES-002";
	
	// 字段验证
	var rules = {
			res_name : [ {
				required : true,
				message : '请输入资源名称',
				trigger : 'blur'
			}, {
				max : 40,
				message : '长度在 0到 840个字符',
				trigger : 'blur'
				
			} ],
			res_sts : [{
				required : true,
				trigger : 'blur',
				message : '请选择资源状态'
			},{
				min : 1,
				max : 100,
				trigger : 'blur'
			} ],
			res_url : [{
				required : true,
				trigger : 'blur',
				message : '请输入资源地址'
			},{
				min : 1,
				max : 100,
				trigger : 'blur'
			} ]
		};
	
	var rulesAdd=$.extend({
			res_code : [ {
				required : true,
				message : '请输入资源编码',
				trigger : 'blur'
			}, {
				max : 40,
				message : '长度在 0到 40 个字符',
				trigger : 'blur'
			} ]
		},rules);
	
	var cols = [
			{
				title : '资源编码',
				key : 'res_code',
				width : 160
			},
			{
				title : '资源名称',
				key : 'res_name',
				width : 120
			},
			{
				title : '资源状态',
				key : 'res_sts',
				width : 80,
				format:function(row,val){
					return pageVue.stsFormat('sdp_res_sts', row,
					'res_sts');
				}
			},
			{
				title : '资源地址',
				key : 'res_url',
				width : 210
			},  {
				title : '排序',
				key : 'res_order',
				width : 80
			}, {
				title : '系统',
				key : 'system_code',
				width : 100,
				format:function(row,val){
					return pageVue.stsFormat('sdp_system', row,
					'system_code');
				}
			},{
				title : '备注',
				key : 'res_remark',
				width : 180
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
				res_code : '',
				res_name : '',
				res_sts : ''
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
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
		reslist.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = reslist.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增业务
	methods_page.addData = function() {
		var r = reslist.newRow();
		r.set('res_code', '');
		r.set('res_name', '');
		r.set('res_url', '');
		r.set('res_order',1);
		r.set('res_remark','');
		r.set('system_code','');
		this.curRow = r;
		this.dataAdd = true;
	};
	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				reslist.$saveUrl = "/api/common/insert";
				reslist.$insert = 'SDP-RES-003';
				reslist.doSave(function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据新增成功');
					g.dataAdd = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");
			} else {
				return false;
			}
		});
	};
	// 新增取消
	methods_page.addDataCancel = function() {
		reslist.delRow(this.curRow);
		this.curRow = {};
	}
	
	// 禁用业务类型
	methods_page.disableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否禁用资源[' + row.res_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-RES-006',
				params : {
					res_code : row.res_code
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
		var tindex = layer.confirm('是否启用业务类型[' + row.res_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-RES-007',
				params : {
					res_code : row.res_code
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
		var tindex = layer.confirm('是否删除业务类型[' + row.res_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-RES-008',
				params : {
					res_code : row.res_code,
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
		this.$refs['dataEditForm'].validate(function(valid) {
			 if (valid) {
				var loading = layer.load();
				reslist.$saveUrl = "/api/common/update";
				reslist.$update = 'SDP-RES-004';
				reslist.doSave(function() {
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
		var r = reslist.newRow();
		r.set('res_code','');
		r.set('res_name',row.res_name);
		r.set('res_sts',row.res_sts);
		r.set('res_url',row.res_url);
		r.set('res_order',row.res_order);
		r.set('system_code','');
		r.set('res_remark',row.res_mark);
		this.curRow=r;
		this.dataCopy=true;
	}
	// 修改取消
	methods_page.copyDataCancel = function() {
		reslist.delRow(this.curRow);
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
		if (row.res_sts == 'Y') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));

			arr.push(initBtn(h, "禁用", "fa fa-ban", function() {
				pageVue.disableRow(row);
			}));

			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
			
			arr.push(initBtn(h, "复制本行", "fa fa-copy", function() {
				pageVue.copyRow(row);
			}));
		} else if (row.res_sts == 'D') {
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