"use strict";
$(function() {
	// 菜单查询
	var context = new SDP.SDPContext();	//得到context对象
	
	var rulesPwd = {
			oldPwd : [ {
				required : true,
				message : '请输入原密码',
				trigger : 'blur'
			} ],
			newPwd : [ {
				validator : validatePass,
				trigger : 'blur,change'
			} ],
			newPwd1 : [ {
				validator : validatePass1,
				trigger : 'blur,change'
			} ]
		};

	// 页面配置
	var config_main = {
		el : "#pedEdit",
		data : {
			rulesPwd : rulesPwd,
			pwd : {
				oldPwd : '',
				newPwd : '',
				newPwd1 : ''
			}	
		}
	
	};

	// 组件创建
	config_main.created = function() {
		var g = this;
		var url = "/api/user/getUserInfo?t=" + new Date().getTime();
		context.doAction({}, url, function(data) {
			if (data.data != null) {
				SDP.loginUser = data.data;
				$.each(data.data.attrs, function(index, itm) {
					for ( var n in itm) {
						SDP.loginUser[n] = itm[n];
					}
				});
				g.user = SDP.loginUser;
				

			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};

	var methods_main = config_main.methods = {};

	// 密码修改保存
	methods_main.pwdDataSave = function() {
		var g = this;
		this.$refs['pwdForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-USER-009',
					params : {
						oldPwd : hex_md5(g.pwd.oldPwd),
						user_pwd :hex_md5(g.pwd.newPwd)
					}
				}, '/api/user/updateUserPwd', function(data) {
					layer.close(loading);
					layer.msg("成功修改密码");
					//g.pwdEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	}
/*	methods_main.pwdDataSave = function() {
	
		var g = this;
		this.$refs['pwdForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					statement : 'SDP-USER-009',
					params : {
						oldPwd : hex_md5(g.oldPwd),
						user_pwd : hex_md5(g.newPwd),
						user_code:'luoxingxing'
					}
				}, '/api/user/update', function(data) {
					layer.close(loading);
					layer.msg("成功修改密码");
					g.pwdEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};*/

	// 重置
	methods_main.pwdDataCancel = function() {
		this.pwd.oldPwd = '';
		this.pwd.newPwd = '';
		this.pwd.newPwd1 = '';
	};

	var mainVue = new Vue(config_main);

	// 验证密码
	function validatePass(rule, value, callback) {
		if (!value) {
			return callback(new Error('请输入密码'));
		}
		if (value.length < 6 || value.length > 20) {
			return callback(new Error('长度在 6到 20 个字符'));
		}

		if (mainVue.pwd.newPwd1 !== '') {
			mainVue.$refs.pwdForm.validateField('newPwd1');
		}
		return callback();
	}

	// 验证确认密码
	function validatePass1(rule, value, callback) {
		if (!value) {
			return callback(new Error('请再次输入密码'));
		}
		if (value !== mainVue.pwd.newPwd) {
			return callback(new Error('两次输入密码不一致!'));
		}
		return callback();
	}

});