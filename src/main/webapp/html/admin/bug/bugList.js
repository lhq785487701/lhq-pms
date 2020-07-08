/**
 * 用户脚本
 * 
 * @文件名 bugList
 * @作者 xly
 * @创建日期 2018-3-12 *
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_bug_status' ];
	var context = new SDP.SDPContext();
	/* var user = context.newDataStore("user"); */
	var bug = context.newDataStore("bug");
	/* user.$keyField = "user_code"; */
	bug.$keyField = "bug_code";
	var page = bug.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	bug.$queryUrl = "/api/common/selectList";
	bug.statement = "SDP-BUG-002";
	// 字段验证
	var rulesEdit = {
		bug_code : [ {
			required : true,
			validator : checkCode,
			trigger : 'blur'
		} ],
		bug_grade : [ {
			required : true,
			validator : checkGrade,
			trigger : 'blur'
		} ],
		bug_status : [ {
			required : true
		} ]
	};

	var rulesAdd = $.extend({

	}, rulesEdit);

	var cols = [ {
		title : 'bug编码',
		key : 'bug_code',
		width : 180
	}, {
		title : 'bug描述',
		key : 'bug_description',
		width : 180
	}, {
		title : 'bug等级',
		key : 'bug_grade',
		width : 180
	}, {
		title : 'bug状态',
		key : 'bug_status',
		width : 180,
		format : function(row, val) {
			return pageVue.stsFormat('sdp_bug_status', row, 'bug_status');
		}
	}, {
		title : 'bug所属模块',
		key : 'bug_module',
		width : 180
	}, {
		title : '发现人',
		key : 'find_user',
		width : 180
	}, {
		title : '提交人',
		key : 'create_user',
		width : 180
	}, {
		title : '处理人',
		key : 'manage_user',
		width : 180
	}, {
		title : '发现时间',
		key : 'find_date',
		width : 180
	}, {
		title : '提交时间',
		key : 'create_date',
		width : 180
	}, {
		title : '期望解决时间',
		key : 'expectsolve_date',
		width : 180
	}, {
		title : '实际解决时间',
		key : 'actualsolve_date',
		width : 180
	}, {
		title : '解决方案',
		key : 'bug_description',
		width : 180
	}, {
		title : '修改人',
		key : 'update_user',
		width : 180
	}, {
		title : '修改时间',
		key : 'update_date',
		width : 180
	}, {
		title : '操作',
		key : 'action',
		align : 'left',
		width : 80,
		fixed : 'right',
		type : 'render',
		render : actionRender
	} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			y : 'Y',
			n : 'N',
			params : {
				bug_code : null
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
			dataEdit : false,
			impUrl : SDP.URL.getUrl('/api/excelImport/doImport'),
			impData : {},
			impFormat : [ 'xls', 'xlsx' ]
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
		bug.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = bug.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增
	methods_page.addData = function() {
		var r = bug.newRow();
		r.set('bug_code', '');
		/* r.set('bug_description', ''); */
		// r.set('bug_finddate','2018-03-11');
		this.curRow = r;
		this.dataAdd = true;
	};

	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		if (g.curRow.find_date != null && g.curRow.find_date != '') {
			var date = g.curRow.find_date;
			g.curRow.find_date = date.getFullYear() + "-"
					+ (date.getMonth() + 1) + "-" + date.getDate();
		} else {
			g.curRow.find_date = null;
		}
		if (g.curRow.expectsolve_date != null
				&& g.curRow.expectsolve_date != '') {
			var expectsolve_date = g.curRow.expectsolve_date;
			g.curRow.expectsolve_date = expectsolve_date.toLocaleDateString();
		} else {
			g.curRow.expectsolve_date = null;
		}
		if (g.curRow.actualsolve_date != null
				&& g.curRow.actualsolve_date != '') {
			var actualsolve_date = g.curRow.actualsolve_date;
			g.curRow.actualsolve_date = actualsolve_date.toLocaleDateString();
		} else {
			g.curRow.actualsolve_date = null;
		}
		debugger;
		g.curRow.bug_status
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				bug.$saveUrl = "/api/common/insert";
				bug.$insert = 'SDP-BUG-001';
				bug.doSave(function() {
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
		bug.delRow(this.curRow);
		this.curRow = {};
	}

	// 编辑用户数据
	methods_page.editRow = function(row) {
		this.curRow = row;
		this.dataEdit = true;
	};
	
	// 修改保存
	methods_page.editDataSave = function() {
		var g = this;
		if (g.curRow.find_date != null && g.curRow.find_date != '') {
			var date = g.curRow.find_date;
			g.curRow.find_date = date.getFullYear() + "-"
					+ (date.getMonth() + 1) + "-" + date.getDate();
			layer.msg(g.curRow.find_date);
		} else {
			g.curRow.find_date = null;
		}

		if (g.curRow.expectsolve_date != null
				&& g.curRow.expectsolve_date != '') {
			var expectsolve_date = g.curRow.expectsolve_date;
			g.curRow.expectsolve_date = expectsolve_date.toLocaleDateString();
		} else {
			g.curRow.expectsolve_date = null;
		}
		if (g.curRow.actualsolve_date != null
				&& g.curRow.actualsolve_date != '') {
			var actualsolve_date = g.curRow.actualsolve_date;
			g.curRow.actualsolve_date = actualsolve_date.toLocaleDateString();
		} else {
			g.curRow.actualsolve_date = null;
		}
		this.$refs['dataEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				bug.$saveUrl = "/api/common/update";
				bug.$update = 'SDP-BUG-003';
				bug.doSave(function() {
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
	methods_page.changeDate = function() {

		var time = $("#date").val();
		alter(time);
	}

	// 删除
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-BUG-004',
				params : {
					bug_code : row.bug_code,
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

	// 格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
	};
	
	/**/
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
		this.$nextTick(function() {
			this.queryDatas();
		});
	};

	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});

	// 检查等级
	function checkGrade(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入等级'));
		}
		var reg = /^[1-4]{1}$/;
		var flag = reg.test(value); // true
		if (flag) {
			callback();
		} else {
			return callback(new Error('等级1-4'));
		}
	}
	// 检查编号
	function checkCode(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入'));
		}

		for (var i = 0, l = pageVue.datas.length - 1; i < l; i++) {
			if (value == pageVue.datas[i].bug_code) {
				return callback(new Error('已经有编号' + value));
			}
		}
		callback();
	}

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
