/**
 * 笔记管理管理页面脚本
 * 
 * @文件名 information
 * @作者 谢良友
 * @创建日期 2017-10-13
 */
"use strict";
$(function() {
	
	var context = new SDP.SDPContext();	//得到context对象
	
	//var user = context.newDataStore("user");//datastore对象
	var user = context.newDataStore("user");
	user.$keyField = "user_id";
	//var page = user.getPage();
	//page.setPageNumber(1);
	//page.setPageRowCount(20);

	user.$queryUrl = "/api/common/selectList";
	user.statement = "SDP-USER-002";
	
	
	// 字段验证
	var rulesUser = {
		userName : [ {
			required : true,
			message : '请输入名称',
			trigger : 'blur'
		}, {
			min : 2,
			max : 60,
			message : '长度在 2 到 60 个字符',
			trigger : 'blur'
		} ],
		userQQ : [ {
			validator : checkQQ,
			trigger : 'blur,change'
		} ],
		userWeChat : [ {
			validator : checkWeChat,
			trigger : 'blur,change'
		}
		],
		user_mobile: [ {
		validator : checkMobile,
		trigger : 'blur,change'
		} ]
	};

	
	var config_main ={
		el:'#information',
		data:{
			src:'a.jpg',
			rulesUser:rulesUser,
			user:{},
			person:{},
			params : {
				u_code:''
			}
			
		}
		
	};
	

	var methods_main = config_main.methods = {};

	

	// 组件创建
	methods_main.created= function() {
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
				
			g.user=SDP.loginUser;
				//g.queryDatas();
				console.log(g.user);
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	
	

	
	
	// 用户信息修改
	methods_main.userSave = function() {
		var g = this;
		this.$refs['userForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				context.doAction({
					
					statement : 'SDP-USER-003',
					params : {
						user_name : g.user.userName,
						//user_email : g.user.userQQ,
						user_mobile : g.user.user_mobile
						//user_code : g.user.userWeChat
					}
				}, '/api/common/update', function(data) {
					alert("g.user.userName:"+g.user.userName+"g.user.user_mobile:"+g.user.user_mobile);
					
					
					layer.close(loading);
					g.queryDatas();
					layer.msg("成功更新");
					//g.userEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	}
	
	
	// 重置
	methods_main.userDataCancel = function() {
		this.user.userName='';
		this.user.userQQ='';
		this.user.userWeChat='';
		this.user.user_mobile='';
	};

	// 初始化
	config_main.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.created();
			console.log("1");
		});	
	};
	
	var pageVue=new Vue(config_main);

	
	// 检查手机号
	function checkMobile(rule, value, callback) {
		if (!value) {
			//return callback(new Error('请输入手机号'));
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
	
	// 检查QQ号
	function checkQQ(rule, value, callback) {
		if (!value) {
			//return callback(new Error('请输入QQ号'));
		}
		if (value.length < 5|| value.length > 11) {
			return callback(new Error('长度在 5到 11 个字符'));
		}
		var reg = /^[1|2|3][0-9]{4,10}$/;
		var flag = reg.test(value); // true
		if (flag) {
			callback();
		} else {
			return callback(new Error('输入正确QQ号'));
		}
	}
	
	function checkWeChat(rule, value, callback) {
		if (!value) {
			//return callback(new Error('请输入微信号'));
		}
		if (value.length < 6|| value.length > 20) {
			return callback(new Error('长度在 6到 20 个字符'));
		}
		var reg = /^[a-z|A-Z][0-9|a-z|A-Z|_|-]{5,19}$/;
		var flag = reg.test(value); // true
		if (flag) {
			callback();
		} else {
			return callback(new Error('输入正确微信号'));
		}
	}
	
});