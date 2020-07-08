/**
 * 门户脚本
 * 
 * @文件名 portal
 * @作者 李浩祺
 * @创建日期 2017-11-17
 * @版本 V 1.0
 */
"use strict";
$(function() {

	// 数据字典
	var dicConf = [ 'gpm_prj_type', 'gpm_prj_level', 'gpm_status',
			'gpm_material_comfirm_state', 'gpm_newest_flag',
			'gpm_prj_allocation', 'gpm_prj_units', 'gpm_prj_month',
			'gpm_department' ];
	var table = "gpm_prj_allocation";

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
	// 计划及激励
	var prjIncentive = context.newDataStore("prjIncentive");
	// 联系人
	var prjContact = context.newDataStore("prjContact");
	// 机构
	var prjConsultant = context.newDataStore("prjConsultant");
	// 材料清单
	var prjMaterial = context.newDataStore("prjMaterial");

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
	prjMember.statement = "SDP-CHANGE-003";
	prjMember.$insert = "SDP-CHGMEMBER-001";
	prjMember.$update = "SDP-CHGMEMBER-002";
	prjMember.$delete = "SDP-CHGMEMBER-003";

	prjIncentive.setParentDS(prjChange);
	prjIncentive.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjIncentive.$queryUrl = "/api/common/selectList";
	prjIncentive.statement = "SDP-CHANGE-005";
	prjIncentive.$insert = "SDP-CHGINCENTIVE-001";
	prjIncentive.$update = "SDP-CHGINCENTIVE-002";
	prjIncentive.$delete = "SDP-CHGINCENTIVE-003";

	prjContact.setParentDS(prjChange);
	prjContact.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjContact.$queryUrl = "/api/common/selectList";
	prjContact.statement = "SDP-CHANGE-004";
	prjContact.$insert = "SDP-CHGCONTACT-001";
	prjContact.$update = "SDP-CHGCONTACT-002";
	prjContact.$delete = "SDP-CHGCONTACT-003";

	prjConsultant.setParentDS(prjChange);
	prjConsultant.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjConsultant.$queryUrl = "/api/common/selectList";
	prjConsultant.statement = "SDP-CHANGE-002";
	prjConsultant.$insert = "SDP-CHGCONSULTANT-001";
	prjConsultant.$update = "SDP-CHGCONSULTANT-002";
	prjConsultant.$delete = "SDP-CHGCONSULTANT-003";

	prjMaterial.setParentDS(prjChange);
	prjMaterial.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjMaterial.$queryUrl = "/api/common/selectList";
	prjMaterial.statement = "SDP-CHANGE-006";
	prjMaterial.$insert = "SDP-CHGMATERIAL-001";
	prjMaterial.$update = "SDP-CHANGE-006";
	prjMaterial.$delete = "SDP-CHGMATERIAL-002";

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

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				prj_id : 254,
			},
			dicDatas : {},
			datas : [],
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
			g.updateDatas();
			console.log(pageVue.datas)
			layer.close(loading);
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
	};

	// 点击取消变更
	methods_page.cancle = function() {
		var g = this;
		var tindex = layer.confirm('确定取消[' + pageVue.datas.prj_name + ']延期', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.statement = 'SDP-DELAY-003';
			context.$deletes = [ 'SDP-CHGMEMBER-003', 'SDP-CHGINCENTIVE-003',
					'SDP-CHGCONSULTANT-003', 'SDP-CHGCONTACT-003',
					'SDP-CHGMATERIAL-002' ];
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
			statement : 'SDP-CHANGE-009',
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
		pageVue.datas.info_acq_time = format_date(pageVue.datas.info_acq_time);
		pageVue.datas.prj_start_time = format_date(pageVue.datas.prj_start_time);
		pageVue.datas.prj_end_time = format_date(pageVue.datas.prj_end_time);
		pageVue.datas.material_plan_date = format_date(pageVue.datas.material_plan_date);
		var loading = layer.load();
		context.doDataStores("/api/common/save", function() {
			layer.close(loading);
			g.queryDatas();
			layer.msg('数据保存成功');
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		}, "save");
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
		debugger;
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

	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function() {
			this.queryDatas();
		});
	};

	// 激励总金额
	methods_page.changeStimulate = function() {
		var number = pageVue.datas.ratio.replace("%", "");
		pageVue.datas.stimulate_sum = parseInt(pageVue.datas.prj_goal)
				* parseInt(number) / 100;
		if (!pageVue.datas.stimulate_sum) {
			pageVue.datas.stimulate_sum = 0;
		}
	}

	// 改变激励比例
	methods_page.changeRatio = function() {
		this.datas.ratio = this.stsFormatDetail(this.datas.prj_type);
		this.changeStimulate();
	};

	methods_page.stsFormatDetail = function(col) {
		var m = this.dicMaps[table];
		if (typeof (col) != "undefined" && m[col] != null && m[col] != "") {
			return m[col];
		}
		return "";
	};

	var pageVue = new Vue(page_conf);

	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});

	// 格式化时间
	function format_date(date) {
		var myDate = new Date(date);
		var month = (myDate.getMonth() + 1) < 10 ? '0'
				+ (myDate.getMonth() + 1) : (myDate.getMonth() + 1);
		var day = myDate.getDate() < 10 ? '0' + myDate.getDate() : myDate
				.getDate();
		return myDate.getFullYear() + '-' + month + '-' + day;
	}
	;

	function format_year(date) {
		var myDate = new Date(date);
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