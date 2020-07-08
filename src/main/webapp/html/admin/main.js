/**
 * 数据容器脚本
 * 
 * @文件名 SDPContext
 * @作者 lihaoqi
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 菜单查询
	var menu = new SDP.SDPContext();
	// 菜单数据
	var menus = null;
	var openMenus = {};// 已打开菜单
	var dataMenus = {};// 菜单数据
	var initMenu = SDP.params["menuCode"];
	// 索赔大小
	var setLockBackSize = function() {
		var x = document.body.clientWidth;
		var y = document.body.clientHeight;
		var r = Math.sqrt(x * x + y * y);
		return parseInt(r);
	};
	//页面单tab或多tab选项
	var isOnlyTab = false;
	var commonCode = "commonCode";

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

	// 页面配置
	var config_main = {
		el : "#mainContainer",
		data : {
			sysMenus : null,
			menus : null,
			curMenu : "",
			menuTabs : [],
			curSystem : {},
			rulesPwd : rulesPwd,
			shrink : false,
			isFullscreen : false,
			lockScreenSize : null,
			activeMenu : null,
			openChildMenu : [],
			avatorPath : '../../css/images/person.jpg',
			pwd : {
				oldPwd : '',
				newPwd : '',
				newPwd1 : ''
			},
			pwdEdit : false,
			userEdit : false,
			avatorLeft : '0px',
			inputLeft : '400px',
			password : '',
			user : {},
			isShowSysMenus : false,
			showUnlock : false,
			msgNum : 0,
			theme : 'dark',
			iconColor : '',
			rulesUser : rulesUser,
			parentNode : '',
		}
	};
	// 组件创建
	config_main.created = function() {
		// 初始化是否全屏
		var isFs = document.fullscreenElement || document.mozFullScreenElement
				|| document.webkitFullscreenElement || document.fullScreen
				|| document.mozFullScreen || document.webkitIsFullScreen;
		this.isFullscreen = !!isFs;

		var g = this;
		var url = "/api/user/getUserInfo?t=" + new Date().getTime();
		menu.doAction({}, url, function(data) {
			if (data.data != null) {
				SDP.loginUser = data.data;
				$.each(data.data.attrs, function(index, itm) {
					for ( var n in itm) {
						SDP.loginUser[n] = itm[n];
					}
				});
				g.user = SDP.loginUser;
				g.queryMenu();
			}
		}, function(data) {
			layer.alert(data.msg);
		});
		
		var g=this;

		document.addEventListener('fullscreenchange', function() {
			g.isFullscreen = !g.isFullscreen;
		});
		document.addEventListener('mozfullscreenchange', function() {
			g.isFullscreen = !g.isFullscreen;
		});
		document.addEventListener('webkitfullscreenchange', function() {
			g.isFullscreen = !g.isFullscreen;
		});
		document.addEventListener('msfullscreenchange', function() {
			g.isFullscreen = !g.isFullscreen;
		});
	};

	var computed = config_main.computed = {};
	computed.showFullScreenBtn = function() {
		return window.navigator.userAgent.indexOf('MSIE') < 0;
	};
	computed.bgColor = function() {
		return this.theme === 'dark' ? '#495060' : '#fff';
	};
	computed.shrinkIconColor = function() {
		return this.theme === 'dark' ? '#fff' : '#495060';
	};

	config_main.mounted = function() {
		var lockScreenBack;
		var g = this;
		var ls = Cookies.get("loclScreen");
		if (!document.getElementById('lock_screen_back')) {
			var lockdiv = document.createElement('div');
			lockdiv.setAttribute('id', 'lock_screen_back');
			lockdiv.setAttribute('class', 'lock-screen-back');
			document.body.appendChild(lockdiv);
			lockScreenBack = document.getElementById('lock_screen_back');
			window.addEventListener('resize', function() {
				var size = setLockBackSize();
				g.lockScreenSize = size;
				lockScreenBack.style.transition = 'all 0s';
				lockScreenBack.style.width = lockScreenBack.style.height = size
						+ 'px';
			});
		} else {
			lockScreenBack = document.getElementById('lock_screen_back');
		}
		var size = setLockBackSize();
		g.lockScreenSize = size;
		lockScreenBack.style.transition = 'all 3s';
		lockScreenBack.style.display = "none";
		lockScreenBack.style.width = lockScreenBack.style.height = size + 'px';
		if (ls === '1') {
			this.lockScreen();
		}
	};

	var methods_main = config_main.methods = {};
	methods_main.handleClickAvator = function() {
		this.avatorLeft = '-180px';
		this.inputLeft = '0px';
		this.$refs.inputEle.focus();
	};
	methods_main.handleUnlock = function() {
		if (this.validator()) {
			this.avatorLeft = '0px';
			this.inputLeft = '400px';
			this.password = '';
			this.showUnlock = false;
			var lockScreenBack = document.getElementById('lock_screen_back');
			lockScreenBack.style.zIndex = -1;
			lockScreenBack.style.boxShadow = '0 0 0 0 #667aa6 inset';
			lockScreenBack.style.display = "none";
			Cookies.set("loclScreen", "0");
		} else {
			layer.msg('密码错误,请重新输入。如果忘了密码，清除浏览器缓存重新登录即可，这里没有做后端验证');
		}
	};
	methods_main.unlockMousedown = function() {
		this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn';
	};
	methods_main.unlockMouseup = function() {
		this.$refs.unlockBtn.className = 'unlock-btn';
	};
	methods_main.validator = function() {
		var pwd = this.user.userPwd;
		var pwd_tmp = hex_md5(this.password);
		if (pwd == pwd_tmp) {
			return true;
		}
		return false;
	};
	// 是否全屏
	methods_main.handleFullscreen = function() {
		var main = document.body;
		if (this.isFullscreen) {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		} else {
			if (main.requestFullscreen) {
				main.requestFullscreen();
			} else if (main.mozRequestFullScreen) {
				main.mozRequestFullScreen();
			} else if (main.webkitRequestFullScreen) {
				main.webkitRequestFullScreen();
			} else if (main.msRequestFullscreen) {
				main.msRequestFullscreen();
			}
		}
	};
	// 是否锁屏
	methods_main.lockScreen = function() {
		var lockScreenBack = document.getElementById('lock_screen_back');
		lockScreenBack.style.display = "";
		lockScreenBack.style.transition = 'all 3s';
		lockScreenBack.style.zIndex = 10000;
		lockScreenBack.style.boxShadow = '0 0 0 ' + this.lockScreenSize
				+ 'px #667aa6 inset';
		this.showUnlock = true;
		Cookies.set("loclScreen", "1");
		setTimeout(function() {
			lockScreenBack.style.transition = 'all 0s';
		}, 800);
	};
	// 查询菜单
	methods_main.queryMenu = function() {
		var g = this;
		var url = "/api/menu/queryUserMenus?t=" + new Date().getTime();
		menu.doAction({}, url, function(data) {
			if (data.data != null && data.data.length > 0) {
				menus = data.data;
				g.curSystem = menus[0];
				var tmp = [].concat(menus);
				tmp.splice(0, 1);
				g.sysMenus = tmp;
				g.isShowSysMenus = tmp.length > 0;
				g.menus = g.curSystem['$chinldrens'];
				initMenus(menus);
				g.$nextTick(function() {
					if (initMenu != null) {
						g.menuSelect(initMenu);
					}
				});
			}
		}, function(data) {
			layer.alert(data.msg);
		});
	};
	// 改变当前系统菜单
	methods_main.changeSystem = function(item) {
		var itx = menus.indexOf(item);
		if (itx >= 0) {
			var tmp = [].concat(menus);
			tmp.splice(itx, 1);
			this.sysMenus = tmp;
			this.curSystem = item;
			this.menus = item['$chinldrens'];
			//切换时去掉所有tab页
			this.menuTabs.splice(0, this.menuTabs.length);
			openMenus = {};
		}
	};
	
	//切换页面tab选项
	methods_main.handleOneOrMoreTab = function() {
		this.menuTabs.splice(0, this.menuTabs.length);
		openMenus = {};
		//如果是单页面的
		if(isOnlyTab) {
			isOnlyTab = false;
			layer.msg("已切换多tab");
		} else {
			isOnlyTab = true;
			layer.msg("已切换单tab");
		}
	}
	
	// 修改用户信息
	methods_main.updateUserInfo = function() {
		this.userEdit = true;
	};
	// 修改密码
	methods_main.updatePwd = function() {
		this.pwdEdit = true;
	};
	// 密码修改保存
	methods_main.pwdDataSave = function() {
		var g = this;
		this.$refs['pwdForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				menu.doAction({
					statement : 'SDP-USER-009',
					params : {
						oldPwd : hex_md5(g.pwd.oldPwd),
						user_pwd : hex_md5(g.pwd.newPwd)
					}
				}, '/api/user/updateUserPwd', function(data) {
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
	};
	// 取消密码修改弹窗
	methods_main.pwdDataCancel = function() {
		this.pwd.oldPwd = '';
		this.pwd.newPwd = '';
		this.pwd.newPwd1 = '';
		this.pwdEdit = false;
	};
	// 用户信息修改
	methods_main.userDataSave = function() {
		var g = this;
		this.$refs['userForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				menu.doAction({
					statement : 'SDP-USER-003',
					params : {
						user_name : g.user.userName,
						user_email : g.user.user_email,
						user_mobile : g.user.user_mobile,
						user_code : g.user.userCode
					}
				}, '/api/common/update', function(data) {
					layer.close(loading);
					layer.msg("成功更新");
					g.userEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			} else {
				return false;
			}
		});
	};
	// 取消用户修改弹窗
	methods_main.pwdDataCancel = function() {
		this.pwd.oldPwd = '';
		this.pwd.newPwd = '';
		this.pwd.newPwd1 = '';
		this.userEdit = false;
	};
	// 退出
	methods_main.loginout = function() {
		var tindex = layer.confirm('是否退出系统', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			menu.doAction({}, "/user/logout", function(data) {
				layer.close(loading);
				window.location.href = "../../backIndex.html";
			}, function(data) {
				layer.close(loading);
				layer.msg(data.msg);
			});
		});
	};
	
	//展开菜单
	methods_main.openChildMenus = function(name) {
		//判断是否是当前的子菜单
		if(dataMenus[name].menu_pcode != this.openChildMenu[this.openChildMenu.length-1]) {
			this.openChildMenu = [dataMenus[name].menu_pcode];
			this.$nextTick(function(){
                this.$refs.mainMenu.updateOpened();
                this.$refs.mainMenu.updateActiveName();
            })
		} else {
			this.$nextTick(function(){
                this.$refs.mainMenu.updateOpened();
                this.$refs.mainMenu.updateActiveName();
            })
		}
	}
	
	
	//选择tab页
	methods_main.changeTab = function(name) {
		if(name != null && dataMenus[name] != null) {
			this.activeMenu = name;
			this.openChildMenus(name);
		}
	}
	
	// 选择打开菜单
	methods_main.menuSelect = function(code) {
		//单tab时
		if(isOnlyTab) {
			var item = openMenus[commonCode];
			if (item == null) {
				item = dataMenus[code];
				if (item == null) {
					layer.error("没有权限访问菜单:" + code);
					return;
				}
				openMenus[commonCode] = item;
				this.menuTabs.push(item);
			} else {
				item = dataMenus[code];
				if (item == null) {
					layer.error("没有权限访问菜单:" + code);
					return;
				}
				this.menuTabs = this.menuTabs.map(function(t) {
					if(t.menu_code == openMenus[commonCode].menu_code) {
						return item;
					}
					
				})
				openMenus[commonCode] = item;
			}
			this.curMenu = item.menu_code;
		} else {//多tab页时
			var item = openMenus[code];
			//是在未打开的tab页中时
			if (item == null) {
				item = dataMenus[code];
				if (item == null) {
					layer.error("没有权限访问菜单:" + code);
					return;
				}
				openMenus[code] = item;
				this.menuTabs.push(item);
			} else {//是在已打开的tab页中时
				if(dataMenus[code].menu_url !=  item.menu_url) {
					this.menuTabs = this.menuTabs.map(function(t) {
						return t.menu_code == dataMenus[code].menu_code ? 
								dataMenus[code] : t;
					})
					openMenus[code] = dataMenus[code];
					//dataMenus[code].menu_url = item.menu_url;
				}
			}
			this.curMenu = item.menu_code;
			this.changeTab(item.menu_code);
		}
		
	};

	// 移除tab页
	methods_main.removeTab = function(code) {
		var item = openMenus[code];
		if (item == null) {
			return;
		}
		var i = this.menuTabs.indexOf(item);
		this.menuTabs.splice(i, 1);
		var itm, len = this.menuTabs.length;
		if (len > 0) {
			if (len <= i) {
				itm = this.menuTabs[len - 1];
			} else {
				itm = this.menuTabs[i];
			}
			this.curMenu = itm.menu_code;
			this.activeMenu = itm.menu_code;
			this.openChildMenus(itm.menu_code);
		} else {
			this.activeMenu = null;
		}
		/*this.$nextTick(function() {
            this.$refs.mainMenu.updateActiveName();
        })*/
		delete openMenus[code];
	};

	// 伸缩箭头
	methods_main.toggleClick = function() {
		this.shrink = !this.shrink;
	};

	// 配置首页
	methods_main.homeConfig = function() {
		var g = this;
		SDP.layer.open({
			title : '首页配置',
			type : 2,
			area : [ "600px", "430px" ],
			content : SDP.URL.getUrl('/html/admin/portal/portalConfig.html')
		}, {}, function() {
			var iframeWin = window.frames["pageFirstPortalWin"];
			if (iframeWin.$.freshData) {
				iframeWin.$.freshData();
			}
		});
	};

	// 页面加载完毕
	methods_main.tabPageLoad = function(event, code) {
		var $sef = event.target.contentWindow.self.$;
		console.log("tab--" + code + '加载完毕');
	};

	// 显示个人信息
	methods_main.showMessage = function() {

	};

	methods_main.handleClickUserDropdown = function(name) {
		if (name === 'userInfo') {
			this.updateUserInfo();
		} else if (name === 'userPwd') {
			this.updatePwd();
		} else if (name === "portConf") {
			this.homeConfig();
		} else if (name === 'loginout') {
			this.loginout();
		}
	};

	var mainVue = new Vue(config_main);

	// 初始化菜单
	function initMenus(ms) {
		$.each(ms, function(index, item) {
			dataMenus[item.menu_code] = item;
			initUrl(item);
			var clds = item['$chinldrens'];
			//当值配置了一级菜单而没有二级菜单时候
			if(typeof(clds) == "undefined" && item.menu_level == 2) {
				item.$chinldrens = [];
				layer.msg('菜单{'+ item.menu_name +'}配置错误，不支持一级菜单目录，请联系管理员处理！');
			}
			if (clds != null && clds.length > 0) {
				initMenus(clds);
			}
			
		});
	}

	// 初始化地址
	function initUrl(item) {
		var url = item.menu_url;
		if (url == null || url.length <= 0) {
			return;
		}
		var u = "sdp_user_code=" + SDP.loginUser.userCode + "&sdp_menu_code="
				+ item.menu_code
		if (url.indexOf("?") > 0) {
			url = url + "&" + u;
		} else {
			url = url + "?" + u;
		}
		if (item.menu_system != null && item.menu_system != '') {
			if (url.indexOf('/') == 0) {
				url = '/' + item.menu_system + url;
			} else {
				url = '/' + item.menu_system + '/' + url;
			}
		}
		item.menu_url = url;
	}

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

	$.addTab = function(menu) {
		var code = menu.menu_code;
		if (code == null || menu.menu_name == null || menu.menu_url == null) {
			layer.error('菜单编码/名称/地址不能为空');
			return;
		}
		var item = dataMenus[code];
		if (item == null) {
			initUrl(menu);
			dataMenus[code] = menu;
		}
		mainVue.menuSelect(code);
	};
	
	$.changeTab = function(menu) {
		var code = menu.menu_code;
		if (code == null || menu.menu_name == null || menu.menu_url == null) {
			layer.error('菜单编码/名称/地址不能为空');
			return;
		}
		initUrl(menu);
		dataMenus[code] = menu;
		mainVue.menuSelect(code);
	};
	
	$.removeTab = function(code) {
		mainVue.removeTab(code);
	};
});