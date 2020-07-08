"use strict";
$(function() {
	/*debugger;
	var request = $.ajax({
		cache : false,
		url : SDP.URL.getUrl("/hr/user"),
		contentType : "application/json; charset=utf-8",
		method : "post",
		dataType : 'json'
	});
	request.done(function(data) {
		debugger;
	});*/
	
	/*jQuery.i18n.properties({// 加载properties文件  
		name:'getpro', // properties文件名称  
		path:'i18n/', // properties文件路径  
		mode:'map', // 用 Map 的方式使用资源文件中的值  
		callback: function() {// 加载成功后设置显示内容  
			alert($.i18n.prop("oaAddress"));//其中isp_index为properties文件中需要查找到的数据的key值  
		}  
	});  */
	
	var config = {
		el : "#app",
		data : {
			user : {
				userCode : "lihaoqi",
				userPwd : "111111"
			},
			errorTip : "",
			loading : false,
			ruleUser : {
				userCode : [ {
					required : true,
					message : '请填写帐号',
					trigger : 'blur'
				} ],
				userPwd : [ {
					required : true,
					message : '请填写密码',
					trigger : 'blur'
				}, {
					type : 'string',
					min : 6,
					message : '密码长度不能小于6位',
					trigger : 'blur'
				} ]
			}
		}
	};

	var methods = config.methods = {
		cancel : function() {
			this.user.userCode = '';
			this.user.userPwd = '';
			this.errorTip = '';
			this.loading = false;
		}
	};

	// 登录
	methods.login = function() {
		var g = this;
		this.$refs['loginForm'].validate(function(valid) {
			if (valid) {
				g.loading = true;
				var request = $.ajax({
					cache : false,
					url : SDP.URL.getUrl("/user/login?userCode=")
							+ g.user.userCode + "&userPwd="
							+ hex_md5(g.user.userPwd),
					contentType : "application/json; charset=utf-8",
					method : "post",
					dataType : 'json'
				});
				request.done(function(data) {
					g.loading = false;
					if (data.code == 1) {
						window.location.href = "html/user/main.html";
					} else {
						g.errorTip = data.msg;
					}
				});

				request.fail(function(jqXHR, textStatus) {
					g.errorTip = textStatus;
					g.loading = false;
				});
			}
		});
	};

	var indexVue = new Vue(config);

	var t = SDP.params["timeout"];
	if (t > 0) {
		g.errorTip = "超时";
	}
});