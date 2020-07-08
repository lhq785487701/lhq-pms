
"use strict";
$(function() {
	// 数据字典
	var context = new SDP.SDPContext();
	var sysconf = context.newDataStore("sysconf");
	sysconf.$keyField = "conf_code";
	var page = sysconf.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	sysconf.$queryUrl = "/api/common/selectList";
	sysconf.statement = "SDP-SYS-CONF-002";
	
	var rulesEdit = {
			conf_name : [ {
				required : true,
				message : '请配置名称',
				trigger : 'blur'
			}, {
				max : 50,
				message : '长度在 0到 840个字符',
				trigger : 'blur'
				
			} ]
	};
	var rulesAdd = $.extend({
		conf_code : [ {
			required : true,
			message : '请输入配置编码',
			trigger : 'blur'
		}, {
			min : 3,
			max : 50,
			message : '长度在 3到 50 个字符',
			trigger : 'blur'
		} ]
	}, rulesEdit);
	
	
	var cols = [
			{
				title : '配置编码',
				key : 'conf_code',
				width : 200
			},
			{
				title : '配置名称',
				key : 'conf_name',
				width : 220,
			},
			{
				title : '配置内容',
				key : 'conf_value',
				width : 120
			},
			{
				title : '配置描述',
				key : 'conf_remark',
				width : 260
			},  {
				title : '创建人',
				key : 'create_user',
				width : 120,
			}, {
				title : '创建时间',
				key : 'create_date',
				width : 160
			}, {
				title : '更新人',
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
				width : 100,
				fixed : 'right',
				type:'render',
				render : actionRender
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				conf_code : '',
				conf_name : ''
			},
			datas : [],
			page : page,
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			columns : cols,
			rulesEdit : rulesEdit,
			rulesAdd : rulesAdd,
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
		var g = this;
		var loading = layer.load();
		sysconf.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = sysconf.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	
	// 新增配置
	methods_page.addData = function() {
		var r = sysconf.newRow();
		r.set('conf_code', '');
		r.set('conf_name', '');
		r.set('conf_value', '');
		r.set('conf_remark', '');
		this.curRow = r;
		this.dataAdd = true;
	};
	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				sysconf.$saveUrl = "/api/common/insert";
				sysconf.$insert = 'SDP-SYS-CONF-003';
				sysconf.doSave(function() {
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
		sysconf.delRow(this.curRow);
		this.curRow = {};
	}
	// 删除配置
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除配置[' + row.conf_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-SYS-CONF-005',
				params : {
					conf_code : row.conf_code
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
				sysconf.$saveUrl = "/api/common/update";
				sysconf.$update = 'SDP-SYS-CONF-004';
				sysconf.doSave(function() {
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
	// 编辑
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
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