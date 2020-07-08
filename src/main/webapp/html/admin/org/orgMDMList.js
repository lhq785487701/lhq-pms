
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_org_mdm_main' ];
	var context = new SDP.SDPContext();
	var mdms = context.newDataStore("mdms");
	mdms.$keyField = "mdm_code";
	var page = mdms.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	mdms.$queryUrl = "/api/common/selectList";
	mdms.statement = "SDP-ORG-MDM-002";
	
	// 字段验证
	var rules = {
			mdm_name : [ {
				required : true,
				message : '请输入组织名称',
				trigger : 'blur'
			}, {
				max : 80,
				message : '长度在 0到 80个字符',
				trigger : 'blur'
			} ]
		};
	//验证
	var rulesAdd = $.extend({
		mdm_code : [ {
			required : true,
			message : '请输入组织编码',
			trigger : 'blur'
		}, {
			min : 2,
			max : 80,
			message : '长度在 2到 80 个字符',
			trigger : 'blur'
		} ]
	}, rules);
	
	var cols = [
			{
				title : '多维组织编码',
				key : 'mdm_code',
				width : 160
			}, {
				title : '多维组织名称',
				key : 'mdm_name',
				width : 160
			}, {
				title : '是否为主组织',
				key : 'mdm_main',
				width : 100,
				format:function(row,val){
					return pageVue.stsFormat('sdp_org_mdm_main', row,
					'mdm_main');
				}
			}, {
				title : '组织描述',
				key : 'mdm_remark',
				width : 200
			}, {
				title : '创建时间' ,
				key : 'create_date',
				width : 160
			}, {
				title : '创建人',
				key : 'create_user',
				width : 120
			}, {
				title : '最后修改时间' ,
				key : 'update_date',
				width : 160
			}, {
				title : '最后修改人' ,
				key : 'update_user',
				width : 120
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				width : 100,
				fixed : 'right',
				type : 'render',
				render : actionRender
			}];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				mdm_code : ''
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
		mdms.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = mdms.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增组织
	methods_page.addData = function() {
		var r = mdms.newRow();
		r.set('mdm_code', '');
		r.set('mdm_name', '');
		r.set('mdm_main', '');
		r.set('mdm_remark', '');
		this.curRow = r;
		this.dataAdd = true;
	};
	// 新增组织保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				mdms.$saveUrl = "/api/common/insert";
				mdms.$insert = 'SDP-ORG-MDM-003';
				mdms.doSave(function() {
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
	// 新增组织取消
	methods_page.addDataCancel = function() {
		mdms.delRow(this.curRow);
		this.curRow = {};
	}
	
	// 编辑职务
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	// 编辑后保存
	methods_page.editDataSave = function() {
		var g = this;
		this.$refs['dataEditForm'].validate(function(valid) {
			 if (valid) {
				var loading = layer.load();
				mdms.$saveUrl = "/api/common/update";
				mdms.$update = 'SDP-ORG-MDM-004';
				mdms.doSave(function() {
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
	// 编辑取消
	methods_page.editDataCancel = function() {
		this.curRow = {};
	}
	
	// 删除组织
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除组织[' + row.mdm_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-ORG-MDM-005',
				params : {
					mdm_code : row.mdm_code,
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

	//格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
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