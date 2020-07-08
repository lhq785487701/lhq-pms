"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_system', 'sdp_bus_type_sts' ];
	var context = new SDP.SDPContext();
	var bustype = context.newDataStore("bustype");
	bustype.$keyField = "system_code";
	var page = bustype.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	bustype.$queryUrl = "/api/common/selectList";
	bustype.statement = "SDP-BUS-TYPE-002";

	// 字段验证
	var rules = {
		bus_type_name : [ {
			required : true,
			message : '请输入业务名称',
			trigger : 'blur'
		}, {
			max : 40,
			message : '长度在 0到 840个字符',
			trigger : 'blur'

		} ],
		bus_type_sts_name : [ {
			required : true,
			trigger : 'blur',
			message : '请选择业务状态'
		}, {
			min : 1,
			max : 100
		} ]
	};

	var rulesAdd = {
		system_code : [ {
			required : true,
			message : '请输入系统编码',
			trigger : 'blur'
		}, {
			max : 40,
			message : '长度在 0到 40 个字符',
			trigger : 'blur'
		} ],
		bus_type : [ {
			required : true,
			message : '请输入业务编码',
			trigger : 'blur'
		}, {
			max : 40,
			message : '长度在 0到 40 个字符',
			trigger : 'blur'

		} ],
		bus_type_name : [ {
			required : true,
			message : '请输入业务名称',
			trigger : 'blur'
		}, {
			max : 40,
			message : '长度在 0到 840个字符',
			trigger : 'blur'

		} ],
		bus_type_sts : [ {
			required : true,
			message : '请选择业务状态'
		} ],
		system_name : [ {
			required : true,
			trigger : 'blur'
		}, {
			min : 1,
			max : 100
		} ],
		bus_type_sts_name : [ {
			required : true,
			trigger : 'blur',
			message : '请选择业务状态'
		}, {
			min : 1,
			max : 100
		} ]
	};
	var cols = [ {
		title : '序号',
		key : 'line_no',
		width : 50
	}, {
		title : '系统名称',
		key : 'system_code',
		width : 120,
		format : function(row, val) {
			return pageVue.stsFormats('sdp_system', row, 'system_code');
		}
	}, {
		title : '业务编码',
		key : 'bus_type',
		width : 120
	}, {
		title : '业务名称',
		key : 'bus_type_name',
		width : 140
	}, {
		title : '业务状态',
		key : 'bus_type_sts',
		width : 100,
		format : function(row, val) {
			return pageVue.stsFormats('sdp_bus_type_sts', row, 'bus_type_sts');
		}
	}, {
		title : '创建时间',
		key : 'create_date',
		width : 180
	}, {
		title : '创建人',
		key : 'create_user',
		width : 120
	}, {
		title : '最后修改时间',
		key : 'update_date',
		width : 180
	}, {
		title : '最后修改人',
		key : 'update_user',
		width : 120
	}, {
		title : '操作',
		key : 'action',
		align : 'left',
		width : 110,
		fixed : 'right',
		type : 'render',
		render : actionRender
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				system_code : 'sdp',
				bus_type : '',
				bus_type_name : '',
				bus_type_sts : []
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
		var g = this;
		var loading = layer.load();
		bustype.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = bustype.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增业务
	methods_page.addData = function() {
		var r = bustype.newRow();
		var order = bustype.$rowSet.findByMaxValue('line_no');
		order++;
		r.set('bus_type_sts', 'Y');
		r.set('system_code', 'sdp');
		r.set('bus_type', '');
		r.set('bus_type_name', '');
		r.set('line_no', order);
		this.curRow = r;
		this.dataAdd = true;
	};
	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				bustype.$saveUrl = "/api/common/insert";
				bustype.$insert = 'SDP-BUS-TYPE-003';
				bustype.doSave(function() {
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
		bustype.delRow(this.curRow);
		this.curRow = {};
	};

	// 禁用业务类型
	methods_page.disableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否禁用业务类型[' + row.bus_type_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-BUS-TYPE-006',
				params : {
					system_code : row.system_code,
					bus_type : row.bus_type
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
		var tindex = layer.confirm('是否启用业务类型[' + row.bus_type_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-BUS-TYPE-007',
				params : {
					system_code : row.system_code,
					bus_type : row.bus_type
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
		var tindex = layer.confirm('是否删除业务类型[' + row.bus_type_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-BUS-TYPE-008',
				params : {
					system_code : row.system_code,
					bus_type : row.bus_type
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
				bustype.$saveUrl = "/api/common/update";
				bustype.$update = 'SDP-BUS-TYPE-004';
				bustype.doSave(function() {
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
	// 业务状态格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.bus_type_sts;
	};
	// 系统名称格式化
	methods_page.stsFormats = function(dic, row, col) {
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
		this.$nextTick(function() {
			this.queryDatas();
		});
	};

	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	// 状态
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		if (row.bus_type_sts == 'Y') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));

			arr.push(initBtn(h, "禁用", "fa fa-ban", function() {
				pageVue.disableRow(row);
			}));

			arr.push(initBtn(h, "删除", "fa fa-remove", function() {
				pageVue.deleteRow(row);
			}));
		} else if (row.bus_type_sts == 'D') {
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