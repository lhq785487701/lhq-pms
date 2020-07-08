"use strict";
$(function() {
	var context = new SDP.SDPContext();
	// role
	var role = context.newDataStore("role");
	var pageRole = role.getPage();
	pageRole.setPageNumber(1);
	pageRole.setPageRowCount(20);
	role.$queryUrl = "/api/common/selectList";
	role.statement = "SDP-ROLE-008";

	// porRole
	var porRole = context.newDataStore("porRole");
	var pagePorRole = porRole.getPage();
	pagePorRole.setPageNumber(1);
	pagePorRole.setPageRowCount(20);
	porRole.setParentDS(role);
	porRole.$parentKeys = {
		'role_code' : 'role_code'
	};
	porRole.$queryUrl = "/api/common/selectList";
	porRole.statement = "SDP-PORTAL-WIN-019";
	
	// portals
	var portals = context.newDataStore("portals");
	var pagePortals = portals.getPage();
	pagePortals.setPageNumber(1);
	pagePortals.setPageRowCount(20);
	portals.$queryUrl = "/api/common/selectList";
	portals.statement = "SDP-PORTAL-WIN-020";
	

	var colsRole = [ {
		key : 'checked',
		type : "radio",
		width : 47
	}, {
		title : '角色编码',
		key : 'role_code',
		width : 195
	}, {
		title : '角色名称',
		key : 'role_name',
		width : 195
	} ];

	var colsPorRole = [{
		key : 'checked',
		type : "selection",
		width : 50
	}, {
		title : '窗体名称',
		key : 'win_name',
		width : 120
	}, {
		title : '窗体标题',
		key : 'win_title',
		width : 150
	}, {
		title: '窗体地址',
		key : 'win_url',
		width : 200
	}, {
		title :'序号',
		key : 'line_no',
		width : 80,
	}, {
		title : '操作',
		key : 'action',
		align : 'left',
		width : 80,
		type:'render',
		render : actionRender
	}];
	
	var colsPortals =  [ {
		key : 'checked',
		type : "selection",
		width : 50
	}, {
		title : '窗体名称',
		key : 'win_name',
		width : 140
	}, {
		title : '窗体标题',
		key : 'win_title',
		width : 160
	}, {
		title : '窗体地址',
		key : 'win_url',
		width : 200
	}  ];
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			role_code : '',
			win_name : '',
			datasRole : [],
			datasPorRole : [],
			datasPortals : [],
			pageRole : pageRole,
			pagePorRole : pagePorRole,
			pagePortals : pagePortals,
			curRow : {},
			curWinRoleRow:{},
			columnsRole : colsRole,
			columnsPorRole : colsPorRole,
			columnsPortals : colsPortals,
			dataAdd : false,
			dataEdit : false
			
		}
	};

	var methods_page = page_conf.methods = {};
	// 点击查询按钮
	methods_page.searchDatas=function(){
		pageRole.setPageNumber(1);
		this.queryRoleData();
	};
	// 查询角色
	methods_page.queryRoleData = function() {
		var loading = layer.load();
		role.set('role_code', pageVue.role_code);
		var g=this;
		this.curRow={};
		role.doQuery(function(data) {
			layer.close(loading);
			g.updateRoleDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置角色数据
	methods_page.updateRoleDatas = function() {
		var vs = role.$rowSet.$views;
		 if (vs.length == 0) {
			this.datasRole.splice(0, this.datasRole.length);
		 } else {
			this.datasRole = vs;
		}
	};

	// 选择角色时,查询已经授权的窗体
	methods_page.tableSelectRole = function(data) {
		if (role.$curRow != data.item) {
			this.curRow = data.item;
			role.setCurRow(data.item);
			pagePorRole.setPageNumber(1);
			this.queryPorRoleDatas();
		}else{
			if(data.checked){
				role.setCurRow(data.item);
				pagePorRole.setPageNumber(1);
				this.queryPorRoleDatas();
			}else{
				role.setCurRow(null);
				pagePorRole.setPageNumber(1);
				this.queryPorRoleDatas();
			}
		}
	};
	// 查询选中角色已授权窗体
	methods_page.queryPorRoleDatas=function(){
		var loading = layer.load();
		porRole.set('role_code', pageVue.curRow.role_code);
		var g=this;
		porRole.doQuery(function(data) {
			g.updatePorRoleDatas();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置角色资源数据
	methods_page.updatePorRoleDatas = function() {
		var vs = porRole.$rowSet.$views;
		if (vs.length == 0) {
			this.datasPorRole.splice(0, this.datasPorRole.length);
		} else {
			this.datasPorRole = vs;
		}
	};	

	// 删除当前角色选中窗体
	methods_page.deletePorRole = function() {
		var itms = this.$refs.dataGridPorRole.getSelection();
		var g=this;
		if (itms != null && itms.length > 0) {
			var tindex = layer.confirm('是否删除选中窗体', {
				btn : [ '是', '否' ]
			}, function() {
				var loading = layer.load();
				var codes = [];
				$.each(itms, function(idx, itm) {
					codes.push(itm.win_role_id);
				});
				context.doAction({
					statement : 'SDP-PORTAL-WIN-021',
					inserts:['SDP-PORTAL-WIN-015'],
					params : {
						win_role_id : codes
					}
				},'/api/common/delete', function(data) {
					layer.close(loading);
					layer.close(tindex);
					g.queryPorRoleDatas();
					layer.msg("成功删除");
				}, function(data) {
					layer.close(loading);
					layer.close(tindex);
					layer.alert(data.msg);
				});
			});
		}
	};
	// 新增选中角色资源弹窗
	methods_page.addPorRole = function() {
		if ($.isEmptyObject(this.curRow)) {
			layer.msg('必须选择一个角色');
		} else {
			this.dataAdd = true;
			pagePortals.setPageNumber(1);
			this.queryPortalsDatas();
		}
	};
	// 选中角色未授权资源查询
	methods_page.queryPortalsDatas = function() {		
		var loading = layer.load();
		var g=this;
		portals.set('role_code', pageVue.curRow.role_code);
		portals.set('win_name', pageVue.win_name);
		portals.doQuery(function(data) {
			layer.close(loading);
			g.updatePortalsDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置资源数据
	methods_page.updatePortalsDatas = function() {
		var vs = portals.$rowSet.$views;
		if (vs.length == 0) {
			this.datasPortals.splice(0, this.datasPortals.length);
		} else {
			this.datasPortals = vs;
		}
	};
	// 授权窗体保存
	methods_page.listDataSave = function() {
		var order = porRole.$rowSet.findByMaxValue('line_no');
		order++;
		var g = this;
		var loading = layer.load();
		var itms = this.$refs.dataGridPortals.getSelection();
		if (itms != null && itms.length > 0) {
			var con=new SDP.SDPContext();
			var ds = con.newDataStore("portalRole");
			ds.$insert="SDP-PORTAL-WIN-007";
			ds.$inserts=['SDP-PORTAL-WIN-013'];
			$.each(itms, function(idx, itm) {
				var r=ds.newRow();
				r.set('win_code',itm.win_code);
				r.set('role_code',g.curRow.role_code);
				r.set('line_no',order++);
			});
			con.doDataStore('/api/common/insert', function() {
				layer.close(loading);
				g.queryPorRoleDatas();
				layer.msg('添加成功');
				g.dataAdd = false;
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			},ds,"insert");
		} else {
			this.dataAdd = false;
		}
	};
	// 编辑序号
	methods_page.editRow = function(row) {
		this.curWinRoleRow = row;
		this.dataEdit = true;
	};
	// 编辑后保存
	methods_page.lineSave = function() {
		var g = this;
		var loading = layer.load();
		porRole.$update = 'SDP-PORTAL-WIN-008';
		context.doAction({
			statement : 'SDP-PORTAL-WIN-008',
			params : {
				win_role_id : g.curWinRoleRow.win_role_id,
				line_no : g.curWinRoleRow.line_no
			}
		}, '/api/common/update', function() {
			layer.close(loading);
			console.log()
			layer.msg('修改成功');
			g.dataEdit = false;
			g.curWinRoleRow={};
		}, function(data) {
			layer.close(loading);
			g.dataEdit = false;
			layer.alert(data.msg);
			g.curWinRoleRow={};
		});
	};
	
	// 改变角色当前页号
	methods_page.handleCurrentChangeRole = function(val) {
		pageRole.setPageNumber(val);
		if (pageRole.getIsChange()) {
			this.queryRoleData();
		}
	};
	// 改变角色页大小
	methods_page.handleSizeChangeRole = function(val) {
		pageRole.setPageRowCount(val);
		if (pageRole.getIsChange()) {
			this.queryRoleData();
		}
	};
	// 已授权窗体
	methods_page.handleCurrentChangePorRole = function(val) {
		pagePorRole.setPageNumber(val);
		if (pagePorRole.getIsChange()) {
			this.queryPorRoleDatas();
		}
	};
	// 已授权窗体
	methods_page.handleSizeChangePorRole = function(val) {
		pagePorRole.setPageRowCount(val);
		if (pagePorRole.getIsChange()) {
			this.queryPorRoleDatas();
		}
	};
	// 未授权窗体
	methods_page.handleCurrentChangePortals = function(val) {
		portals.setPageNumber(val);
		if (portals.getIsChange()) {
			this.queryPortalsDatas();
		}
	};
	// 未授权窗体
	methods_page.handleSizeChangePortals = function(val) {
		portals.setPageRowCount(val);
		if (portals.getIsChange()) {
			this.queryPortalsDatas();
		}
	};
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryRoleData();
		});	
	};

	var pageVue = new Vue(page_conf);
	
	// 操作
	function actionRender(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "编辑", "fa fa-edit", function() {
			pageVue.editRow(row);
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