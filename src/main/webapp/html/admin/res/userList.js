/**
 * 用户脚本
 * 
 * @文件名 userList
 * @作者 李浩祺
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_user_sts' ];
	var context = new SDP.SDPContext();
	var user = context.newDataStore("user");
	var default_role = "ROLE_USER";
	user.$keyField = "user_id";
	var page = user.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";

	// 字段验证
	var rulesEdit = {
		user_name : [ {
			required : true,
			message : '请输入名称',
			trigger : 'blur'
		}, {
			min : 2,
			max : 60,
			message : '长度在 2 到 60 个字符',
			trigger : 'blur'
		} ],
		user_email : [ {
			required : true,
			message : '请输入邮箱',
			trigger : 'blur'
		}, {
			type : 'email',
			message : '请输入正确的邮箱地址',
			trigger : 'blur,change'
		}, {
			min : 3,
			max : 60,
			message : '长度在 3到 60 个字符',
			trigger : 'blur'
		} ],
		user_mobile : [ {
			validator : checkMobile,
			trigger : 'blur,change'
		} ]
	};

	var rulesAdd = $.extend({
		user_code : [ {
			required : true,
			message : '请输入编码',
			trigger : 'blur'
		}, {
			min : 3,
			max : 40,
			message : '长度在 3到 40 个字符',
			trigger : 'blur'
		} ],
		user_pwd : [ {
			validator : validatePass,
			trigger : 'blur,change'
		} ],
		user_pwd1 : [ {
			validator : validatePass1,
			trigger : 'blur,change'
		} ]
	}, rulesEdit);

	var cols = [
			{
				title : '用户编码',
				key : 'user_code',
				width : 180
			},
			{
				title : '用户名称',
				key : 'user_name',
				width : 180
			},
			{
				title : '用户状态',
				key : 'user_sts',
				width : 90,
				format : function(row, val) {
					return  pageVue.stsFormat('sdp_user_sts', row,
							'user_sts');
				}
			}, {
				title : '用户邮箱',
				key : 'user_email',
				width : 220
			}, {
				title : '用户手机',
				key : 'user_mobile',
				width : 200
			}, {
				title : '最后登录时间',
				key : 'login_date',
				width : 160
			}, {
				title : '注册时间',
				key : 'create_date',
				width : 160
			}, {
				title : '操作',
				key : 'action',
				align : 'left',
				width : 180,
				fixed : 'right',
				type:'render',
				render : actionRender
			} ];

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				user_name : null,
				user_sts : []
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
			impUrl:SDP.URL.getUrl('/api/excelImport/doImport'),
			impData:{},
			impFormat :['xls','xlsx']
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
		user.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = user.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 新增用户
	methods_page.addData = function() {
		var r = user.newRow();
		r.set('user_sts', 'Y');
		r.set('user_code', '');
		r.set('user_name', '');
		r.set('user_email', '');
		r.set('user_mobile', '');
		r.set('user_pwd', '');
		r.set('user_pwd1', '');
		this.curRow = r;
		this.dataAdd = true;
	};

	// 新增保存
	methods_page.addDataSave = function() {
		var g = this;
		this.$refs['dataAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				user.$saveUrl = "/api/common/insert";
				user.$insert = 'SDP-USER-008';
				g.curRow.set('user_pwd', hex_md5(g.curRow.user_pwd));
				user.doSave(function(data) {
					g.addDefUserRole();
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
	
	//新增默认用户权限
	methods_page.addDefUserRole = function() {
		var codes = [];
		codes.push(default_role);
		context.doAction({
			statement : 'SDP-USER-013',
			inserts:['SDP-PORTAL-WIN-012'],
			params : {
				user_code : this.curRow.user_code,
				role_code : codes
			}
		}, '/api/common/insert', function() {
			layer.msg('赋予用户权限成功');
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	// 新增取消
	methods_page.addDataCancel = function() {
		user.delRow(this.curRow);
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
		this.$refs['dataEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();

				user.$saveUrl = "/api/common/update";
				user.$update = 'SDP-USER-003';
				user.doSave(function() {
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

	// 禁用用户
	methods_page.disableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否禁用用户[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-USER-004',
				params : {
					user_code : row.user_code
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
	// 启用用户
	methods_page.enableRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否解禁用户[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-USER-005',
				params : {
					user_code : row.user_code
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
	// 锁定用户
	methods_page.lockRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否锁定用户[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-USER-006',
				params : {
					user_code : row.user_code
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功锁定");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	// 解锁用户
	methods_page.unlockRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否解锁用户[' + row.user_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-USER-007',
				params : {
					user_code : row.user_code
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryDatas();
				layer.msg("成功解锁");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	
	// 导入数据
	methods_page.impExcelData=function(){
		/*var tindex = layer.open({
			  type: 1,
			  title: "上传文件",
			  area: ['390px', '250px'],
			  zIndex: layer.zIndex,
			  offset:"100px",
			  content: $('#fileUpload')
		});
		$('#fileUpload').removeClass("hide");*/
		var g = this;
		SDP.layer.open({
			title : 'excel导入',
			type : 2,
			area : [ '400px', '300px' ],
			content : SDP.URL.getUrl('/html/admin/common/excelImport.html')
		}, {
			excelContent :  $('#fileUpload'),
			uploadParam : {
				'params' : {
					'imp_code' : 'sdp-user-import-001',
					'bus_type' : 'sdp-user-imp',
				},
				'dataStore': {
					'name':'user',
					'params' : {
						'paramA' : 'AAA',
						'paramB' : 'BBB'
					}
				}
			}
		}, function(val) {
			layer.msg(val);
			g.queryDatas();
		},true);
	};
	
	// 上传前
	methods_page.beforeUpload = function(f) {
		var data = {
				'params' : {
					'exp_code' : 'sdp-user-import-001',
					'bus_type' : 'sdp-user-imp',
					'dataStore':{'name':'user'}
				}
			};
			this.impData['sdpData'] = JSON.stringify(data, null, "");
	};
	
	// 上传成功
	methods_page.impSuccess=function(response, file, fileList){
		this.$refs.userUpload.clearFiles();
	};
	
	// 上传失败
	methods_page.impError=function(error, file, fileList){
		this.$refs.userUpload.clearFiles();
	}
	
	// 导出数据
	methods_page.downExcelData=function(){
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		context.statement="SDP-USER-002";
		context.put(obj);
		context.set("exp_code","sdp-user-export-001");
		context.set("bus_type","sdp-user-exp");
		var g = this;
		context.downFile("/api/excelExport/doExport.down",function(data){
			
		},function(data){
			layer.alert(data.msg);
		});
	};

	// 用户状态格式化
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

	// 检查手机号
	function checkMobile(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入手机号'));
		}
		if (value.length < 3 || value.length > 20) {
			return callback(new Error('长度在 3到 20 个字符'));
		}
		var reg = /^1[3|4|5|7|8][0-9]{9}$/;
		var flag = reg.test(value); // true
		if (flag) {
			callback();
		} else {
			return callback(new Error('输入正确的手机号'));
		}
	}

	// 验证密码
	function validatePass(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入密码'));
		}
		if (value.length < 6 || value.length > 20) {
			return callback(new Error('长度在 6到 20 个字符'));
		}

		if (pageVue.curRow.user_pwd1 !== '') {
			pageVue.$refs.dataAddForm.validateField('user_pwd1');
		}
		return callback();
	}

	// 验证确认密码
	function validatePass1(rule, value, callback) {
		if (!value) {
			return callback(new Error('请再次输入密码'));
		}
		if (value !== pageVue.curRow.user_pwd) {
			return callback(new Error('两次输入密码不一致!'));
		}
		return callback();
	}

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		if (row.user_sts == 'Y') {
			arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
				pageVue.editRow(row);
			}));

			arr.push(initBtn(h, "锁定", "fa fa-lock", function() {
				pageVue.lockRow(row);
			}));

			arr.push(initBtn(h, "禁用", "fa fa-user-times", function() {
				pageVue.disableRow(row);
			}));
		} else if (row.user_sts == 'L') {
			arr.push(initBtn(h, "解锁", "fa fa-unlock", function() {
				pageVue.unlockRow(row);
			}));
			arr.push(initBtn(h, "禁用", "fa fa-user-times", function() {
				pageVue.disableRow(row);
			}));
		} else if (row.user_sts == 'D') {
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