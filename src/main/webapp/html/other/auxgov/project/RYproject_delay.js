/**
 * 门户脚本
 * 
 * @文件名 portal
 * @作者 Diaozx
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {

	// 数据字典
	var dicConf = [ 'gpm_status', 'gpm_prj_units', 'gpm_prj_month',
			'gpm_newest_flag' ];

	var context1 = new SDP.SDPContext();
	// 使用者信息
	var user = context1.newDataStore("user");
	var pageUser = user.getPage();
	pageUser.setPageNumber(1);
	pageUser.setPageRowCount(10);
	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";

	var context = new SDP.SDPContext();
	// 主表
	var prjChange = context.newDataStore("prjChange");
	// 项目成员
	var prjMember = context.newDataStore("prjMember");

	prjChange.$keyField = "prj_id";
	prjChange.$queryUrl = "/api/common/selectList";
	prjChange.statement = "SDP-DELAY-001";
	prjChange.$update = 'SDP-DELAY-002';
	prjChange.$delete = 'SDP-DELAY-003';

	prjMember.setParentDS(prjChange);
	prjMember.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjMember.$queryUrl = "/api/common/selectList";
	prjMember.statement = "SDP-RYCHANGE-002";
	prjMember.$insert = "SDP-RYCHGMEMBER-001";
	prjMember.$update = "SDP-RYCHGMEMBER-002";
	prjMember.$delete = "SDP-RYCHGMEMBER-003";
	var page01 = prjMember.getPage();
	page01.setPageNumber(1);
	page01.setPageRowCount(20);

	// 成员表单
	var cols = [ {
		title : '序号',
		align : 'center',
		width : 60,
		type : 'index',

	}, {
		title : '姓名',
		key : 'user_name',
		type : 'render',
		render : function(h, row, column, index) {
			return h('i-input', {
				props : {
					type : 'text',
					value : row.user_name
				},
				on : {
					'on-focus' : function(val) {
						pageVue.curValue = val;
						pageVue.userQuery = true;
						pageVue.queryUserDatas();
						pageVue.rowIndex = index;
						pageVue.dif = 'member';
					},
				},
			}, []);
		},
	}, {
		title : '担任角色',
		key : 'prj_role',
		editRender : function(row, column) {
			return '<i-input v-model="row.prj_role"></i-input>';
		}
	}, {
		title : '主要职责',
		key : 'prj_duty',
		editRender : function(row, column) {
			return '<i-input v-model="row.prj_duty"></i-input>';
		}
	}, {
		title : '备注',
		key : 'remarks',
		editRender : function(row, column) {
			return '<i-input v-model="row.remarks"></i-input>';
		}
	}, {
		title : '操作',
		key : 'action',
		width : 50,
		type : 'render',
		render : actionRender
	}, ];

	var memberData = [ {
		user_name : '',
		prj_role : '',
		prj_duty : '',
		remarks : '',
	} ];

	// 使用者列表信息
	var colsUser = [ {
		title : '选择',
		type : 'selection',
		width : 60
	}, {
		title : '用户编码',
		key : 'user_code',
		width : 200
	}, {
		title : '用户名称',
		key : 'user_name',
		width : 200
	} ];

	// 字段验证
	var rules = {
		prj_end_time : [ {
			required : true,
			trigger : 'blur',
			message : '请确定项目结束时间'
		} ],
		delay_reson : [ {
			required : true,
			trigger : 'blur',
			message : '请输入项目说明'
		} ],
	};

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				prj_id : 239,
			},
			dicDatas : {},
			datas : [],
			rules : rules,
			loading : true,
			// 使用者
			userQuery : false,
			pageUser : pageUser,
			columnsUser : colsUser,
			userDatas : [],
			rowIndex : -1,
			// 表格多选的行
			rows : [],
			// 不同点选择的情况
			dif : ''
		},
	};

	// 初始化
	var methods_page = page_conf.methods = {};

	// 打开页面查询头表
	methods_page.queryDatas = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();// 动画加载,2, {time: 3*1000}
		prjChange.doQuery(function(data) {
			data.dataStore.rows[0].$index = 1;
			prjChange.setCurRow(data.dataStore.rows[0]);
			g.queryDatas01();
			layer.close(loading);
			g.updateDatas();
			console.log(pageVue.datas)
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 设置数据
	methods_page.updateDatas = function() {
		var vs = prjChange.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs[0];
		}
	};

	// 查询人员
	methods_page.queryDatas01 = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		var loading = layer.load();// 动画加载,2, {time: 3*1000}
		prjMember.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas01();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 设置人员数据
	methods_page.updateDatas01 = function() {
		var vs = prjMember.$rowSet.$views;
		if (vs.length == 0) {
			this.memberData.splice(0, this.memberData.length);
		} else {
			this.memberData = vs;
		}
	};

	// 上传延期材料附件
	methods_page.projectDelay = function() {
		SDP.layer.open({
			title : '上传附件',
			type : 2,
			area : [ '700px', '450px' ],
			content : SDP.URL.getUrl('/html/common/commonUpload.html')
		}, {
			doc_type : 'L',
			file_type : 'D',
			main_id : pageVue.params.prj_id,
		}, function(val) {
		}, true);
	}

	// 点击取消变更
	methods_page.cancle = function() {
		var g = this;
		var loading = layer.load();
		var tindex = layer.confirm('确定取消[' + pageVue.datas.prj_name + ']变更', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.statement = 'SDP-RYCHANGE-004';
			context.$deletes = [ 'SDP-RYCHGMEMBER-003' ];
			context.clearParam();
			context.put({
				prj_id : pageVue.datas.prj_id
			});
			context.doData('/api/common/delete', function(data) {
				layer.close(loading);
				pageVue.enablePre();
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};

	// 取消变更修改上个版本信息
	methods_page.enablePre = function() {
		var g = this;
		var loading = layer.load();
		context.doAction({
			statement : 'SDP-RYCHANGE-005',
			params : {
				prj_id : pageVue.datas.from_prj_id,
				newest_flag : 'Y',
			}
		}, '/api/common/update', function(data) {
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 点击提交
	methods_page.submit = function() {
		var g = this;
		pageVue.datas.prj_year = format_year(pageVue.datas.prj_year);
		pageVue.datas.prj_start_time = format_date(pageVue.datas.prj_start_time);
		pageVue.datas.prj_end_time = format_date(pageVue.datas.prj_end_time);
		this.$refs['RYprjChangeForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doDataStores("/api/common/save", function() {
					layer.close(loading);
					g.queryDatas();
					layer.msg('数据保存成功');
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
			} else {
				return false;
			}
		});
	};

	// 使用者信息查询
	methods_page.queryUserDatas = function() {
		var loading = layer.load();
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		user.doQuery(function(data) {
			g.updateDatasUser();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}

	// 设置使用者数据
	methods_page.updateDatasUser = function() {
		var vs = user.$rowSet.$views;
		if (vs.length == 0) {
			this.userDatas.splice(0, this.userDatas.length);
		} else {
			this.userDatas = vs;
		}
	};

	// 项目负责人点击选择
	methods_page.selectUserLeader = function() {
		this.userQuery = true;
		this.queryUserDatas();
		this.dif = 'leader'
	};

	// 结项确认人点击选择
	methods_page.selectUserConfirm = function() {
		this.userQuery = true;
		this.queryUserDatas();
		this.dif = 'confirmor'

	};

	// 使用者查询
	methods_page.searchDatasUser = function() {
		this.queryUserDatas();
	};

	// 取消使用者选择
	methods_page.searchUserCancel = function() {
		var g = this;
		g.userQuery = false;
	};

	// 在多项的情况下勾线一行数据是触发
	methods_page.userSelection = function(rows) {
		this.rows = rows;
	};

	// 点击用户列表的选择按钮是
	methods_page.selectUserSave = function() {
		if (this.rows.length > 0) {
			// 当选择的是项目成员时
			if (this.dif == 'member') {
				this.curValue.target.value = this.rows[0].user_name;
				this.memberData[this.rowIndex].user_name = this.rows[0].user_name;
				// 当选择的是项目负责人时
			} else if (this.dif == 'leader') {
				this.datas.prj_leader = this.rows[0].user_name;
				// 当选择的是结项确认人时
			} else if (this.dif == 'confirmor') {
				this.datas.acknowledgement = this.rows[0].user_name;
			}
			this.userQuery = false;
			// this.dif = '';
			this.rows = [];
		} else {
			layer.alert('请选择一行！');
		}
	};

	// 使用者改变当前页号
	methods_page.handleCurrentChangeUser = function(val) {
		pageUser.setPageNumber(val);
		if (pageUser.getIsChange()) {
			this.queryUserDatas();
		}
	};
	// 使用者改变页大小
	methods_page.handleSizeChangeUser = function(val) {
		pageUser.setPageRowCount(val);
		if (pageUser.getIsChange()) {
			this.queryUserDatas();
		}
	};

	// 改变成员当前页号
	methods_page.handleCurrentChange01 = function(val) {
		page01.setPageNumber(val);
		if (page01.getIsChange()) {
			this.queryDatas01();
		}
	};
	// 改变成员页大小
	methods_page.handleSizeChange01 = function(val) {
		page01.setPageRowCount(val);
		if (page01.getIsChange()) {
			this.queryDatas01();
		}
	};

	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function() {
			this.queryDatas();
		});
	};

	// 添加成员表格的一行
	methods_page.addRowMem = function() {
		var r = prjMember.newRow();
		r.set('user_name', '');
		r.set('prj_role', '');
		r.set('prj_duty', '');
		r.set('remarks', '');
		this.updateDatas01();
	};

	// 删除成员信息数据
	methods_page.deleteRow = function(scope) {
		var r = scope;
		var g = this;
		var tindex = layer.confirm('是否删除成员[' + r.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-CHGMEMBER-003',
				params : {
					prj_id : pageVue.params.prj_id,
					menber_id : r.menber_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas01();
				layer.msg("删除成功！！！");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};

	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});

	function actionRender(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow(row);
		}));
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
	;

	// 格式化时间
	function format_date(date) {
		var myDate = new Date(Date.parse(date));
		var month = (myDate.getMonth() + 1) < 10 ? '0'
				+ (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
		var day = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate
				.getDate();
		return myDate.getFullYear() + '-' + month + '-' + day;
	}
	;

	function format_year(date) {
		var myDate = new Date(Date.parse(date));
		return myDate.getFullYear();
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
	;
});