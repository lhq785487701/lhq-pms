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
	prjChange.statement = "SDP-CHANGE-001";
	prjChange.$update = 'SDP-CHANGE-007';
	prjChange.$delete = 'SDP-CHANGE-008';

	prjMember.setParentDS(prjChange);
	prjMember.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjMember.$queryUrl = "/api/common/selectList";
	prjMember.statement = "SDP-CHANGE-003";
	prjMember.$insert = "SDP-CHGMEMBER-001";
	prjMember.$update = "SDP-CHGMEMBER-002";
	prjMember.$delete = "SDP-CHGMEMBER-003";
	var page01 = prjMember.getPage();
	page01.setPageNumber(1);
	page01.setPageRowCount(20);

	prjIncentive.setParentDS(prjChange);
	prjIncentive.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjIncentive.$queryUrl = "/api/common/selectList";
	prjIncentive.statement = "SDP-CHANGE-005";
	prjIncentive.$insert = "SDP-CHGINCENTIVE-001";
	prjIncentive.$update = "SDP-CHGINCENTIVE-002";
	prjIncentive.$delete = "SDP-CHGINCENTIVE-003";
	var page02 = prjIncentive.getPage();
	page02.setPageNumber(1);
	page02.setPageRowCount(20);

	prjContact.setParentDS(prjChange);
	prjContact.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjContact.$queryUrl = "/api/common/selectList";
	prjContact.statement = "SDP-CHANGE-004";
	prjContact.$insert = "SDP-CHGCONTACT-001";
	prjContact.$update = "SDP-CHGCONTACT-002";
	prjContact.$delete = "SDP-CHGCONTACT-003";
	var page03 = prjContact.getPage();
	page03.setPageNumber(1);
	page03.setPageRowCount(20);

	prjConsultant.setParentDS(prjChange);
	prjConsultant.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjConsultant.$queryUrl = "/api/common/selectList";
	prjConsultant.statement = "SDP-CHANGE-002";
	prjConsultant.$insert = "SDP-CHGCONSULTANT-001";
	prjConsultant.$update = "SDP-CHGCONSULTANT-002";
	prjConsultant.$delete = "SDP-CHGCONSULTANT-003";
	var page04 = prjConsultant.getPage();
	page04.setPageNumber(1);
	page04.setPageRowCount(20);

	prjMaterial.setParentDS(prjChange);
	prjMaterial.$parentKeys = {
		'prj_id' : 'prj_id'
	};
	prjMaterial.$queryUrl = "/api/common/selectList";
	prjMaterial.statement = "SDP-CHANGE-006";
	prjMaterial.$insert = "SDP-CHGMATERIAL-001";
	prjMaterial.$update = "SDP-CHANGE-006";
	prjMaterial.$delete = "SDP-CHGMATERIAL-002";
	var page05 = prjMaterial.getPage();
	page05.setPageNumber(1);
	page05.setPageRowCount(20);

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
	// 计划及奖励
	var planCols = [ {
		title : '序号',
		align : 'center',
		width : 60,
		type : 'index',

	}, {
		title : '阶段',
		key : 'phase',
		editRender : function(row, column) {
			return '<i-input v-model="row.phase"></i-input>';
		}
	}, {
		title : '完成目标',
		key : 'finish_goal',
		editRender : function(row, column) {
			return '<i-input v-model="row.finish_goal"></i-input>';
		}
	}, {
		title : '完成时间',
		key : 'end_time',
		type : 'render',
		render : function(h, row, column, index) {
			return h('Date-Picker', {
				attrs : {
					type : 'date',
					transfer : 'true'
				},
				props : {
					type : 'date',
					value : row.end_time
				},
				on : {
					'on-change' : function(val) {
						row.end_time = val;
					}
				}

			});
		},
	}, {
		title : '责任人',
		key : 'leader',
		editRender : function(row, column) {
			return '<i-input v-model="row.leader"></i-input>';
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
		render : actionRender1
	}, ];

	// 联系人
	var connectCols = [ {
		title : '序号',
		align : 'center',
		width : 60,
		type : 'index',

	}, {
		title : '部门',
		key : 'depart_desc',
		editRender : function(row, column) {
			return '<i-input v-model="row.depart_desc"></i-input>';
		}
	}, {
		title : '姓名',
		key : 'per_name',
		editRender : function(row, column) {
			return '<i-input v-model="row.per_name"></i-input>';
		}
	}, {
		title : '手机号',
		key : 'mobile',
		editRender : function(row, column) {
			return '<i-input v-model="row.mobile"></i-input>';
		}
	}, {
		title : 'Email',
		key : 'email',
		editRender : function(row, column) {
			return '<i-input v-model="row.email"></i-input>';
		}
	}, {
		title : '座机号',
		key : 'telephone',
		editRender : function(row, column) {
			return '<i-input v-model="row.telephone"></i-input>';
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
		render : actionRender2
	}, ];

	// 咨询机构
	var referCols = [ {
		title : '序号',
		align : 'center',
		width : 60,
		type : 'index',

	}, {
		title : '公司',
		key : 'org_name',
		editRender : function(row, column) {
			return '<i-input v-model="row.org_name"></i-input>';
		}
	}, {
		title : '姓名',
		key : 'user_name',
		editRender : function(row, column) {
			return '<i-input v-model="row.user_name"></i-input>';
		}
	}, {
		title : '手机号',
		key : 'phone',
		editRender : function(row, column) {
			return '<i-input v-model="row.phone"></i-input>';
		}
	}, {
		title : 'Email',
		key : 'email',
		editRender : function(row, column) {
			return '<i-input v-model="row.email"></i-input>';
		}
	}, {
		title : '座机号',
		key : 'tele',
		editRender : function(row, column) {
			return '<i-input v-model="row.tele"></i-input>';
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
		render : actionRender3
	}, ];

	// 材料清单
	var materialCols = [
			{
				title : '序号',
				align : 'center',
				width : 60,
				type : 'index',

			},
			{
				title : '材料名称',
				key : 'mate_name',
				editRender : function(row, column) {
					return '<i-input v-model="row.mate_name"></i-input>';
				}
			},
			{
				title : '上传日期',
				key : 'upload_date',
				editRender : function(row, column) {
					return '<date-picker type="date" transfer="true" v-model="row.upload_date"></date-picker>';
				}
			},
			{
				title : '上传人员',
				key : 'upload_user',
				editRender : function(row, column) {
					return '<i-input v-model="row.upload_user"></i-input>';
				}
			},
			{
				title : '确认人',
				key : 'confirm_user',
				editRender : function(row, column) {
					return '<i-input v-model="row.confirm_user"></i-input>';
				}
			},
			{
				title : '确认日期',
				key : 'confirm_date',
				editRender : function(row, column) {
					return '<date-picker type="date" transfer="true" v-model="row.confirm_date"></date-picker>';
				}
			}, {
				title : '说明',
				key : 'confirm_desc',
				editRender : function(row, column) {
					return '<i-input v-model="row.confirm_desc"></i-input>';
				}
			}, {
				title : '操作',
				key : 'action',
				width : 50,
				type : 'render',
				render : actionRender4
			}, ];

	var memberData = [ {
		user_name : '',
		prj_role : '',
		prj_duty : '',
		remarks : '',
	} ];

	var incentiveData = [ {
		phase : '',
		finish_goal : '',
		end_time : '',
		leader : '',
		remarks : '',
	} ];

	var contactData = [ {
		depart_desc : '',
		per_name : '',
		mobile : '',
		email : '',
		telephone : '',
		remarks : '',
	} ];

	var consultantData = [ {
		org_name : '',
		user_name : '',
		phone : '',
		email : '',
		tele : '',
		remarks : '',
	} ];

	var materialData = [ {
		mate_name : '',
		upload_date : '',
		upload_user : '',
		confirm_user : '',
		confirm_date : '',
		confirm_desc : '',
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

	// 项目立项字段校验
	var rules = {
		prj_name : [ {
			required : true,
			message : '请输入项目名称',
			trigger : 'blur'
		}, {
			max : 40,
			message : '长度在 0到 840个字符',
			trigger : 'blur'
		} ],
		/*
		 * prj_year : [ { required : true, trigger : 'blur', message : '请选择立项月份' } ],
		 */
		prj_month : [ {
			required : true,
			trigger : 'blur',
			message : '请选择立项月份'
		} ],
		prj_desc : [ {
			required : true,
			trigger : 'blur',
			message : '请输入项目说明'
		} ],
		dominant_unit : [ {
			required : true,
			trigger : 'blur',
			message : '请选择主导单位'
		} ],
		declaration_company : [ {
			required : true,
			trigger : 'blur',
			message : '请选择申报公司'
		} ],
		prj_leader : [ {
			required : true,
			trigger : 'change',
			message : '请选择项目负责人'
		} ],
		acknowledgement : [ {
			required : true,
			trigger : 'change',
			message : '请选择结项确认人'
		} ],
		policy_no : [ {
			required : true,
			trigger : 'blur',
			message : '请输入政策文号'
		} ],
	};

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				prj_id : 259,
			},
			dicDatas : {},
			datas : [],
			rules : rules,
			loading : true,
			page01 : page01,
			page02 : page02,
			page03 : page03,
			page04 : page04,
			page05 : page05,
			memberData : memberData,
			incentiveData : incentiveData,
			contactData : contactData,
			consultantData : consultantData,
			materialData : materialData,
			columns : cols,
			columnsPlan : planCols,
			columnsConnect : connectCols,
			columnsRefer : referCols,
			columnsMaterial : materialCols,
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
			g.queryDatas02();
			g.queryDatas03();
			g.queryDatas04();
//			g.queryDatas05();
			layer.close(loading);
			g.updateDatas();
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
		prjMember.doQuery(function(data) {
			g.updateDatas01();
		}, function(data) {
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

	// 查询激励
	methods_page.queryDatas02 = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		prjIncentive.doQuery(function(data) {
			g.updateDatas02();
		}, function(data) {
			layer.alert(data.msg);
		});
	};

	// 设置激励数据
	methods_page.updateDatas02 = function() {
		var vs = prjIncentive.$rowSet.$views;
		if (vs.length == 0) {
			this.incentiveData.splice(0, this.incentiveData.length);
		} else {
			this.incentiveData = vs;
		}
	};

	// 查询联系人
	methods_page.queryDatas03 = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		prjContact.doQuery(function(data) {
			g.updateDatas03();
		}, function(data) {
			layer.alert(data.msg);
		});
	};

	// 设置联系人数据
	methods_page.updateDatas03 = function() {
		var vs = prjContact.$rowSet.$views;
		if (vs.length == 0) {
			this.contactData.splice(0, this.contactData.length);
		} else {
			this.contactData = vs;
		}
	};

	// 查询机构
	methods_page.queryDatas04 = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		prjConsultant.doQuery(function(data) {
			g.updateDatas04();
		}, function(data) {
			layer.alert(data.msg);
		});
	};

	// 设置机构数据
	methods_page.updateDatas04 = function() {
		var vs = prjConsultant.$rowSet.$views;
		if (vs.length == 0) {
			this.consultantData.splice(0, this.consultantData.length);
		} else {
			this.consultantData = vs;
		}
	};

	// 查询材料
	methods_page.queryDatas05 = function() {
		var obj = pageVue.params;
		context.clearParam();// 清空参数列表
		context.put(obj);
		var g = this;
		prjMaterial.doQuery(function(data) {
			g.updateDatas05();
		}, function(data) {
			layer.alert(data.msg);
		});
	};

	// 设置材料数据
	methods_page.updateDatas05 = function() {
		var vs = prjMaterial.$rowSet.$views;
		if (vs.length == 0) {
			this.materialData.splice(0, this.materialData.length);
		} else {
			this.materialData = vs;
		}
	};
	
	// 上传采集取证附件
	methods_page.collecEvidence = function() {
		SDP.layer.open({
			title : '上传附件',
			type : 2,
			area : [ '700px', '450px' ],
			content : SDP.URL.getUrl('/html/common/commonUpload.html')
		}, {
			doc_type : 'L',
			file_type : 'C',
			main_id : pageVue.params.prj_id,
		}, function(val) {
		}, true);
	}
	
	// 上传项目说明附件
	methods_page.projectDescript = function() {
		SDP.layer.open({
			title : '上传附件',
			type : 2,
			area : [ '700px', '450px' ],
			content : SDP.URL.getUrl('/html/common/commonUpload.html')
		}, {
			doc_type : 'L',
			file_type : 'X',
			main_id : pageVue.params.prj_id,
		}, function(val) {
		}, true);
	};
	
	// 上传材料附件
	methods_page.projectDescript = function() {
		SDP.layer.open({
			title : '上传附件',
			type : 2,
			area : [ '700px', '450px' ],
			content : SDP.URL.getUrl('/html/common/commonUpload.html')
		}, {
			doc_type : 'L',
			file_type : 'X',
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
		},function() {
			var loading = layer.load();
			context.statement = 'SDP-CHANGE-008';
			context.$deletes = [ 'SDP-CHGMEMBER-003','SDP-CHGINCENTIVE-003',
			'SDP-CHGCONSULTANT-003','SDP-CHGCONTACT-003','SDP-CHGMATERIAL-002' ];
			context.clearParam();
			context.put({prj_id : pageVue.datas.prj_id});
			context.doData('/api/common/delete',function(data) {
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
		this.$refs['prjChangeForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doDataStores("/api/common/save", function() {
					layer.close(loading);
					g.queryDatas();
					g.queryDatas01();
					g.queryDatas02();
					g.queryDatas03();
					g.queryDatas04();
					// g.queryDatas05();
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

	// 改变计划奖励当前页号
	methods_page.handleCurrentChange02 = function(val) {
		page02.setPageNumber(val);
		if (page02.getIsChange()) {
			this.queryDatas02();
		}
	};
	// 改变计划奖励页大小
	methods_page.handleSizeChange02 = function(val) {
		page02.setPageRowCount(val);
		if (page02.getIsChange()) {
			this.queryDatas02();
		}
	};

	// 改变联系人当前页号
	methods_page.handleCurrentChange03 = function(val) {
		page03.setPageNumber(val);
		if (page03.getIsChange()) {
			this.queryDatas03();
		}
	};
	// 改变联系人页大小
	methods_page.handleSizeChange03 = function(val) {
		page03.setPageRowCount(val);
		if (page03.getIsChange()) {
			this.queryDatas03();
		}
	};

	// 改变机构当前页号
	methods_page.handleCurrentChange04 = function(val) {
		page04.setPageNumber(val);
		if (page04.getIsChange()) {
			this.queryDatas04();
		}
	};
	// 改变机构页大小
	methods_page.handleSizeChange04 = function(val) {
		page04.setPageRowCount(val);
		if (page04.getIsChange()) {
			this.queryDatas04();
		}
	};

	// 改变机构当前页号
	methods_page.handleCurrentChange05 = function(val) {
		page05.setPageNumber(val);
		if (page05.getIsChange()) {
			this.queryDatas05();
		}
	};
	// 改变机构页大小
	methods_page.handleSizeChange05 = function(val) {
		page05.setPageRowCount(val);
		if (page05.getIsChange()) {
			this.queryDatas05();
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

	// 添加成员表格的一行
	methods_page.addRowMem = function() {
		var r = prjMember.newRow();
		r.set('user_name', '');
		r.set('prj_role', '');
		r.set('prj_duty', '');
		r.set('remarks', '');
		this.updateDatas01();
	};

	// 添加计划及激励表格一行
	methods_page.addRowInt = function() {
		var r = prjIncentive.newRow();
		r.set('phase', '');
		r.set('finish_goal', '');
		r.set('end_time', '');
		r.set('leader', '');
		r.set('remarks', '');
		this.updateDatas02();
	};

	// 添加联系人表格一行
	methods_page.addRowContact = function() {
		var r = prjContact.newRow();
		r.set('depart_desc', '');
		r.set('per_name', '');
		r.set('mobile', '');
		r.set('email', '');
		r.set('telephone', '');
		r.set('remarks', '');
		this.updateDatas03();
	};

	// 添加咨询机构表格一行
	methods_page.addRowConsult = function() {
		var r = prjConsultant.newRow();
		r.set('org_name', '');
		r.set('user_name', '');
		r.set('phone', '');
		r.set('email', '');
		r.set('tele', '');
		r.set('remarks', '');
		this.updateDatas04();
	};

	// 添加材料清单一行
	methods_page.addRowMaterial = function() {
		var r = prjMaterial.newRow();
		r.set('mate_name', '');
		r.set('upload_date', '');
		r.set('upload_user', '');
		r.set('confirm_user', '');
		r.set('confirm_date', '');
		r.set('confirm_desc', '');
		this.updateDatas05();
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

	// 删除计划奖励数据
	methods_page.deleteRow01 = function(scope) {
		var r = scope;
		var g = this;
		var tindex = layer.confirm('是否删除成员[' + r.phase + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-CHGINCENTIVE-003',
				params : {
					prj_id : pageVue.params.prj_id,
					inc_id : r.inc_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas02();
				layer.msg("删除成功！！！");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};

	// 删除联系人数据
	methods_page.deleteRow02 = function(scope) {
		var r = scope;
		var g = this;
		var tindex = layer.confirm('是否删除成员[' + r.per_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-CHGCONTACT-003',
				params : {
					prj_id : pageVue.params.prj_id,
					contact_id : r.contact_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas03();
				layer.msg("删除成功！！！");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};

	// 删除咨询机构数据
	methods_page.deleteRow03 = function(scope) {
		var r = scope;
		var g = this;
		var tindex = layer.confirm('是否删除成员[' + r.org_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-CHGCONSULTANT-003',
				params : {
					prj_id : pageVue.params.prj_id,
					advisory_org_id : r.advisory_org_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas04();
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

	function actionRender1(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow01(row);
		}));
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
	;

	function actionRender2(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow02(row);
		}));
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
	;

	function actionRender3(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			pageVue.deleteRow03(row);
		}));
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
	;

	function actionRender4(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "删除", "fa fa-remove", function() {
			var tindex = layer.confirm('是否删除数据[' + row.mate_name + ']', {
				btn : [ '是', '否' ]
			}, function() {
				pageVue.materialData.splice(index, 1);
				layer.close(tindex);
			});
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