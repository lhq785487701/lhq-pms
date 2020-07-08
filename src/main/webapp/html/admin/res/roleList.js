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
	var dicConf = [ 'sdp_role_sts' ,'sdp_role_type'];
	// 上下文
	var context = new SDP.SDPContext();
	// 角色数据
	var role = context.newDataStore("role");
	role.$keyField = "role_id";
	var page = role.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	role.$queryUrl = "/api/common/selectList";
	role.statement = "SDP-ROLE-001";

	// 字段验证
	var rulesEdit = {
		role_name : [ {
			required : true,
			message : '请输入名称',
			trigger : 'blur'
		}, {
			min : 2,
			max : 120,
			message : '长度在 2 到 120 个字符',
			trigger : 'blur'
		} ]
	};

	var rulesAdd = $.extend({
		role_code : [ {
			required : true,
			message : '请输入编码',
			trigger : 'blur'
		}, {
			min : 3,
			max : 40,
			message : '长度在 3到 40 个字符',
			trigger : 'blur'
		} ]
	}, rulesEdit);

	var cols = [
			{
				title : '角色编码',
				key : 'role_code',
				width : 180
			},
			{
				title : '角色名称',
				key : 'role_name',
				width : 200
			},
			{
				title : '角色类型',
				key : 'role_type',
				width : 160,
				format:function(row,val){
					return pageVue.stsFormat('sdp_role_type', row,
					'role_type');
				}
			},
			{
				title : '角色状态',
				key : 'role_sts',
				width : 120,
				format : function(row, val) {
					return pageVue.stsFormat('sdp_role_sts', row,
							'role_sts');
				}
			}, {
				title : '创建时间',
				key : 'create_date',
				width : 190
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				type:'render',
				render : actionRender
			} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				role_code : '',
				role_name : '',
				role_type:'',
				role_sts : []
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			rulesEdit : rulesEdit,
			rulesAdd : rulesAdd,
			columns : cols,
			dataAdd : false,
			dataEdit : false
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
		role.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = role.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增角色
	methods_page.addData = function() {
		var r = role.newRow();
		r.set('role_sts', 'Y');
		r.set('role_code', '');
		r.set('role_name', '');
		this.curRow = r;
		this.dataAdd = true;
	};

	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				role.$saveUrl = "/api/common/insert";
				role.$insert = 'SDP-ROLE-002';
				role.doSave(function() {
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
		role.delRow(this.curRow);
		this.curRow = {};
	}

	// 编辑角色数据
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};

	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				role.$saveUrl = "/api/common/update";
				role.$update = 'SDP-ROLE-003';
				role.doSave(function() {
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

	// 禁用角色
	methods_page.disableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否禁用角色[' + row.role_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-ROLE-004',
				params : {
					role_code : row.role_code
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
	// 启用角色
	methods_page.enableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否解禁角色[' + row.role_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-ROLE-005',
				params : {
					role_code : row.role_code
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
		var tindex = layer.confirm('是否删除角色[' + row.role_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-ROLE-006',
				params : {
					role_code : row.role_code
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

	// 角色状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.role_sts;
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
		if (row.role_sts == 'Y') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));

			arr.push(initBtn(h, "禁用", "fa fa-user-times", function() {
				pageVue.disableRow(row);
			}));

			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
		} else if (row.role_sts == 'D') {
			arr.push(initBtn(h, "启用", "fa fa-user-o", function() {
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