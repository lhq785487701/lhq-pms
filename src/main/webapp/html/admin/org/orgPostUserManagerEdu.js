"use strict";
$(function() {
	// 数据字典
	var dicConf = [ 'sdp_org_mdm_main' ,'sdp_org_mdm_manager'];
	var context = new SDP.SDPContext();
	//组织维度
	var mdms = context.newDataStore("mdms");
	mdms.$keyField = "mdm_code";
	var pagemdm = mdms.getPage();
	pagemdm.setPageNumber(1);
	pagemdm.setPageRowCount(20);
	mdms.$queryUrl = "/api/common/selectList";
	mdms.statement = "SDP-ORG-MDM-002";
	
	
	//组织
	var orgs = context.newDataStore("orgs");
	orgs.$queryUrl = "/api/common/selectList";
	orgs.statement = "SDP-MGR-002";
	
	//组织用户
	var orguser = context.newDataStore("orguser");
	orguser.$queryUrl = "/api/common/selectList";
	orguser.statement = "SDP-MGR-003"
	var page = orguser.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	
	//非组织用户
	var orgusers = context.newDataStore("orgusers");
	orgusers.$queryUrl = "/api/common/selectList";
	orgusers.statement = "SDP-MGR-004"
	var pageusers = orgusers.getPage();
	pageusers.setPageNumber(1);
	pageusers.setPageRowCount(20);
	
	//客户组
	var customs = context.newDataStore("customs");
	customs.$queryUrl = "/api/common/selectList";
	customs.statement = "SDP-CUSTOMS-001"
	var pagecustoms = customs.getPage();
	pagecustoms.setPageNumber(1);
	pagecustoms.setPageRowCount(20);
	
	//职务
	var jobs = context.newDataStore("jobs");
	jobs.$queryUrl="/api/common/selectList";
	jobs.statement = "SDP-MGR-018"
	
	//TREE
    var setting = {
    	callback : {
    		 onClick : onSelect
    	},
    	view : {
    		 fontCss : getFontCss,
    		 selectedMulti : false
    	}
    };
    setting.data = {
    	key : {
    		 title : "",
    		 name : "org_name"
    	},
    	simpleData : {
    		 enable : true,
    		 idKey : "org_code",
    		 pIdKey : "org_pcode",
    		 rootPId : null
    	}
    };
    var nodeList=[];
    var zTree,curNode,curDragNode=null;

    //字体
    function getFontCss(treeId, treeNode) {
		return (!!treeNode.highlight) ? {
		    color : "#A60000",
		    "font-weight" : "bold"
		} : {
		    color : "#333",
		    "font-weight" : "normal"
		};
    }
    
    //选中
    function onSelect(event, treeId, treeNode, clickFlag) {
    	pageVue.menuItemChange(treeNode);
    }
    
    
    
    //组织人员
    var colsuser = [
    			{
    				title : '组织编码',
    				key : 'org_code',
    				width : 120
    			}, {
    				title : '用户编码',
    				key : 'user_code',
    				width : 120
    			}, {
    				title : '用户名称',
    				key : 'user_name',
    				width : 120
    			}, {
    				title : '岗位编码',
    				key : 'post_code',
    				width : 120
    			}, {
    				title : '是否负责人',
    				key : 'is_manager',
    				width : 120,
    				format:function(row,val){
	    				return pageVue.stsFormat('sdp_org_mdm_manager', row,
	    				'is_manager');
	    			}
    			}, {
    				title : '操作',
    				key : 'action',
    				align : 'left',
    				width : 120,
    				type:'render',
    				render : actionRender
    			}];
    //多维组织
	var colsmdm = [
	    		{
	    			title : '多维组织编码',
	    			key : 'mdm_code',
	    			width : 160
	    		}, {
	    			title : '多维组织名称',
	    			key : 'mdm_name',
	    			width : 160
	    		}, {
	    			title : '是否为主组织',
	    			key : 'mdm_main',
	    			width : 100,
	    			format:function(row,val){
	    				return pageVue.stsFormat('sdp_org_mdm_main', row,
	    				'mdm_main');
	    			}
	    		}];
	
	 //组织人员
    var colsusers = [
    			{
					key : 'checked',
					type : 'selection',
					width : 40
    			}, {
    				title : '用户编码',
    				key : 'user_code',
    				width : 120
    			}, {
    				title : '用户名称',
    				key : 'user_name',
    				width : 120
    			}, {
    				title : '邮箱',
    				key : 'user_email',
    				width : 220
    			}, {
    				title : '手机',
    				key : 'user_mobile',
    				width : 120
    			}];
    
    var colscus = [
				{
					type : 'index',
					width : 40
				}, {
					title : '客户组名称',
					key : 'customs_name',
					width : 100
				}, {
					title : '小组类型',
					key : 'group_type',
					width : 100
				}, {
					title : '管理销售部',
					key : 'org_names',
					width : 150
				}, {
					title : '创建时间',
					key : 'create_date',
					width : 150
				}, {
					title : '操作',
					key : 'action',
					align : 'left',
					width : 120,
					type:'render',
					render : actionRenderCus
				}];
    
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			curRow : {
				cur : {}
			},
			filterText : '',
			columnsUser : colsuser,
			columnsMdm : colsmdm,
			columnsUsers : colsusers,
			columnsCustom : colscus,
			params : {
				user_code : ''
			},
			usersParam : {
				user_code :''
			},
			page : page,
			pagemdm : pagemdm,
			pageusers : pageusers,
			pagecustoms : pagecustoms,
			userdatas : [],
			usersdatas : [],
			cusgroupdatas : [],
			jobsList : [],
			mdmdatas : [],
			curMdm:null,
			mdmParam:{
				mdm_code:null
			},
			customPage : false
		}
	};

	var methods_page = page_conf.methods = {};
	
	
	// 查询客户组数据
	methods_page.queryCustomsDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		customs.doQuery(function(data) {
			layer.close(loading);
			g.updateCustomsDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置人员数据
	methods_page.updateCustomsDatas = function() {
		var vs = customs.$rowSet.$views;
		if (vs.length == 0) {
			this.cusgroupdatas.splice(0, this.cusgroupdatas.length);
		} else {
			this.cusgroupdatas = vs;
		}
	};
	
	
	// 点击刷新按钮
	methods_page.queryOrgDatas = function() {
		if(this.curMdm==null){
			return;
		}
		context.clearParam();
		context.set("mdm_code",this.curMdm.mdm_code);
		var loading = layer.load();
		this.curRow = {};
		var g=this;
		orgs.doQuery(function(data) {
			/*var d = initTreeOrg(orgs.$rowSet.$views);*/
			var d = orgs.$rowSet.$views;
			nodeList=[];
			zTree = $.fn.zTree.init($("#orgTree"), setting, d);
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 选中菜单变化
	methods_page.menuItemChange = function(itm) {
		if (itm!=null && itm!=this.curRow) {
			if(this.curRow!=null && this.curRow.selected){
				this.curRow.selected=false;
			}
			this.curRow = itm;
		}
		this.searchUserDatas();
		
	};
	
	//改变成客服
	methods_page.changeTabs = function(code) {
		if(code == 'custom') {
			this.queryCustomsDatas();
			this.customPage = true;
		} else if (code == 'sale') {
			this.customPage = false;
		}
	}
	
	// 查询人员
	methods_page.searchUserDatas=function(){
		page.setPageNumber(1);
		this.queryUserDatas();
	};
	// 查询人员数据
	methods_page.queryUserDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		orguser.set('org_code', this.curRow.org_code);
		var g = this;
		var loading = layer.load();
		orguser.doQuery(function(data) {
			layer.close(loading);
			g.updateUserDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置人员数据
	methods_page.updateUserDatas = function() {
		var vs = orguser.$rowSet.$views;
		if (vs.length == 0) {
			this.userdatas.splice(0, this.userdatas.length);
		} else {
			this.userdatas = vs;
		}
	};
	
	// 页面监听
	page_conf.watch = {
		filterText : function(val) {
			if (val === '') {
			    return;
			}
			updateNodes(false);
			var node = zTree.getNodesByParamFuzzy("name", val);
			if (node === null) {
			    nodeList = [];
			} else {
			    nodeList = node;
			}

			updateNodes(true);
		},
		['curRow.org_name']:function(val){
			if(this.curRow && this.curRow.isNewState()){
				var code=pinyin.getCamelChars(val);
				var tmp=this.curRow.org_code;
				if(tmp==null || code.indexOf(tmp)==0){
					this.curRow.set("org_code",code);
				}
			}
			
			if (curNode!=null) {
				curNode.name = val;
			    zTree.updateNode(curNode);
			    initPath(curNode,true);
			}
		},
		['curRow.org_code']:function(val){
			if (curNode!=null) {
				curNode.id = val;
			    zTree.updateNode(curNode);
			    initPath(curNode,false);
			}
		}
	};
	 // 更新节点
    function updateNodes(highlight) {
		var node = null;
		var p = null;
		for (var i = 0, l = nodeList.length; i < l; i++) {
		    node = nodeList[i];
		    node.highlight = highlight;
		    zTree.updateNode(node);
		    if (highlight) {
				p = node.getParentNode();
				if (p && p.open == false) {
				    zTree.expandNode(p, true, false, false);
				}
				while (p != null) {
				    p = p.getParentNode();
				    if (p && p.open == false) {
				    	zTree.expandNode(p, true, false, false);
				    }
				}
		    }
		}
    }
    
	// 打开多维组织选择页面
	var mdmIndex;
	methods_page.openMdm=function(){
		/*mdmIndex=layer.open({
			title:'选择多维组织',
			type: 1,
			area: ['500px', '400px'],
			fixed: false, // 不固定
			maxmin: true,
			content:$("#orgMdmContainer")
		});
		$("#orgMdmContainer").removeClass("hide");
		this.queryMdmDatas();*/
		
		var g = this;
		SDP.layer.open({
			title : '选择多维组织',
			type : 2,
			area : [ '500px', '420px' ],
			content : SDP.URL.getUrl('/html/admin/org/selectOrgMdm.html')
		}, {}, function(val) {
			layer.close(mdmIndex);
			if (g.curMdm != val) {
				g.curMdm = val;
				mdms.setCurRow(val);
				g.queryOrgDatas();
			}
			if (val && val.length > 0) {
				g.datas = val;
			}
		},true);
	};
	
	// 选择维度
	methods_page.mdmTableSelect = function(data) {
		layer.close(mdmIndex);
		if (this.curMdm != data.item) {
			this.curMdm = data.item;
			mdms.setCurRow(data.item);
			this.queryOrgDatas();
		}
	};
	// 点击查询按钮 组织维度
	methods_page.searchMdm=function(){
		pagemdm.setPageNumber(1);
		this.queryMdmDatas();
	};
	// 查询
	methods_page.queryMdmDatas = function() {
		var obj = pageVue.mdmParam;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		mdms.doQuery(function(data) {
			layer.close(loading);
			g.updateMdmDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateMdmDatas = function() {
		var vs = mdms.$rowSet.$views;
		if (vs.length == 0) {
			this.mdmdatas.splice(0, this.mdmdatas.length);
		} else {
			this.mdmdatas = vs;
		}
	};
	
	// 打开选择人员界面
	var usersIndex;
	methods_page.openUserDatas=function(){
		/*usersIndex=layer.open({
			title:'选择用户',
			type: 1,
			closeBtn: 1,
			area: ['650px', '450px'],
			fixed: false, // 不固定
			maxmin: true,
			content:$("#orgUserContainer"),
		});
		$("#orgUserContainer").removeClass("hide");
		this.queryUsersDatas();*/
		
		var g = this;
		SDP.layer.open({
			title : '选择用户',
			type : 2,
			area : [ '650px', '450px' ],
			content : SDP.URL.getUrl('/html/admin/org/selectOrgUser.html')
		}, {
			org_code : g.curRow.org_code
		}, function(val) {
			g.addDataSave(val);
		},true);
		
	};
	// 查询不在组织人员数据
	methods_page.queryUsersDatas = function() {
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		orgusers.set('org_code',this.curRow.org_code);
		var g = this;
		var loading = layer.load();
		orgusers.doQuery(function(data) {
			layer.close(loading);
			g.updateUsersDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置人员数据
	methods_page.updateUsersDatas = function() {
		var vs = orgusers.$rowSet.$views;
		if (vs.length == 0) {
			this.usersdatas.splice(0, this.usersdatas.length);
		} else {
			this.usersdatas = vs;
		}
	};
	// 选中人员加入组织
	methods_page.addDataSave = function(users) {
		var g = this;
		var loading = layer.load();
		//var itms = this.$refs.dataUsersGrid.getSelection();
		var itms = users;
		if (itms != null && itms.length > 0) {
			$.each(itms, function(idx, itm) {
				context.doAction({
					statement : 'SDP-MGR-005',
					params : {
						org_code : g.curRow.org_code,
						user_code : itm.user_code,
						is_manager : 'NM'
					}
				}, '/api/common/insert', function() {
					
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
			});
			layer.close(loading);
			layer.msg('添加成功');
			g.queryUserDatas();
			layer.close(usersIndex);
		} else {
			return false;
		}
	};
	// 取消选中人员加入，关窗
	methods_page.addDataCancel = function() {
		layer.close(usersIndex);
	}
	
	//对当前组织人员的操作
	//设置主负责人
	methods_page.setMainManager = function(row) {
		var g = this;
		var tindex = layer.confirm('是否将用户[' + row.user_code + ']设为主负责人', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-MGR-006',
				params : {
					oup_id : row.oup_id
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryUserDatas();
				layer.msg("设置成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	}
	//设置负责人
	methods_page.setManager = function(row) {
		var g = this;
		var tindex = layer.confirm('是否将用户[' + row.user_code + ']设为负责人', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-MGR-007',
				params : {
					oup_id : row.oup_id
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryUserDatas();
				layer.msg("设置成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	}
	
	//取消负责人
	methods_page.cancelManager = function(row) {
		var g = this;
		var tindex = layer.confirm('是否将用户[' + row.user_code + ']取消负责人', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-MGR-008',
				params : {
					oup_id : row.oup_id
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryUserDatas();
				layer.msg("取消成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	}
	//删除当前成员
	methods_page.deleteOrgUser = function(row) {
		var g = this;
		var tindex = layer.confirm('是否将用户[' + row.user_code + ']移出组织', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-MGR-009',
				params : {
					oup_id : row.oup_id
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				g.queryUserDatas();
				layer.msg("移出成功");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	}
	
	//获取职务列表
	methods_page.queryJobsData = function() {
		var g = this;
		var loading = layer.load();
		jobs.doQuery(function(data) {
			layer.close(loading);
			g.updateJobsDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	//职务设置数据
	methods_page.updateJobsDatas = function() {
		var vs = jobs.$rowSet.$views;
		if (vs.length == 0) {
			this.jobsList.splice(0, this.jobsList.length);
		} else {
			this.jobsList = vs;
		}
	};
	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryOrgDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryOrgDatas();
		}
	};
	// 改变当前页号
	methods_page.handleCurrentChangeMDM = function(val) {
		pagemdm.setPageNumber(val);
		if (pagemdm.getIsChange()) {
			this.queryMdmDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChangeMDM = function(val) {
		pagemdm.setPageRowCount(val);
		if (pagemdm.getIsChange()) {
			this.queryMdmDatas();
		}
	};
	// 改变当前页号
	methods_page.handleCurrentChangeUsers = function(val) {
		pageusers.setPageNumber(val);
		if (pageusers.getIsChange()) {
			this.queryUsersDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChangeUsers = function(val) {
		pageusers.setPageRowCount(val);
		if (pageusers.getIsChange()) {
			this.queryUsersDatas();
		}
	};
	// 改变当前页号
	methods_page.handleCurrentChangeCus = function(val) {
		pagecustoms.setPageNumber(val);
		if (pagecustoms.getIsChange()) {
			this.queryCustomsDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChangeCus = function(val) {
		pagecustoms.setPageRowCount(val);
		if (pagecustoms.getIsChange()) {
			this.queryCustomsDatas();
		}
	};
	// 格式化
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.col;
	};
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});	
	// 初始化
	page_conf.mounted = function() {
		// 查询菜单数据
		this.$nextTick(function(){
			this.queryOrgDatas();
			this.queryJobsData();
		});	
	};

	var pageVue = new Vue(page_conf);
	

	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		if (row.is_manager == 'NM') {
			arr.push(initBtn(h, "设为主负责人", "fa fa-user-secret", function() {
				pageVue.setMainManager(row);
			}));
			arr.push(initBtn(h, "设为负责人", "fa fa-user-circle", function() {
				pageVue.setManager(row);
			}));
			arr.push(initBtn(h, "删除成员", "fa fa-close", function() {
				pageVue.deleteOrgUser(row);
			}));
		} else if (row.is_manager == 'FM') {
			arr.push(initBtn(h, "设为负责人", "fa fa-user-circle", function() {
				pageVue.setManager(row);
			}));
			arr.push(initBtn(h, "取消负责人", "fa fa-user-times", function() {
				pageVue.cancelManager(row);
			}));
			arr.push(initBtn(h, "删除成员", "fa fa-close", function() {
				pageVue.deleteOrgUser(row);
			}));
		} else if (row.is_manager == 'OM') {
			arr.push(initBtn(h, "设为主负责人", "fa fa-user-secret", function() {
				pageVue.setMainManager(row);
			}));
			arr.push(initBtn(h, "取消负责人", "fa fa-user-times", function() {
				pageVue.cancelManager(row);
			}));
			arr.push(initBtn(h, "删除成员", "fa fa-close", function() {
				pageVue.deleteOrgUser(row);
			}));
		}
		return h('button-group', {
			attrs : {
				size : 'small'
			}
		}, arr);
	}
	
	//客户组
	function actionRenderCus(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
			pageVue.editRow(row);
		}));
		arr.push(initBtn(h, "删除", "fa fa-close", function() {
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