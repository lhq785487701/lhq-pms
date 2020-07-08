/**
 * 用户脚本
 * 
 * @文件名 menuManager
 * @作者 李浩祺
 * @创建日期 2017-05-02
 * @版本 V 1.0
 */
"use strict";
$(function() {
	// 数据字典
	var dicConf = [ "sdp_menu_sts", "sdp_system" ];

	var context = new SDP.SDPContext();
	var menu = context.newDataStore("menu");

	menu.$queryUrl = "/api/common/selectList";
	menu.statement = "SDP-MENU-003";
	
	var setting = {
		 view : {
		    fontCss : getFontCss,
		    selectedMulti : false,
		    addHoverDom:addHoverDom,
		    removeHoverDom:removeHoverDom
		 }
	};
	setting.data = {
		key : {
		    title : "",
		    name : "name"
		},
		simpleData : {
		    enable : true,
		    idKey : "id",
		    pIdKey : "pid",
		    rootPId : null
		}
	};
	setting.edit = {
		drag : {
		    prev : true,
		    next : true,
		    inner : dropInner
		},
		enable : true,
		removeTitle:'删除节点',
		showRemoveBtn : showRemoveBtn,
		showRenameBtn : false
	};
	setting.callback={
		  onClick : onSelect,
		  beforeDrag:beforeDrag,
		  beforeDrop:beforeDrop,
		  beforeRemove:beforeRemove
	};
    var nodeList=[];
    var zTree,curDragNode=null;

    // 获取字体样式
    function getFontCss(treeId, treeNode) {
		return (!!treeNode.highlight) ? {
		    color : "#A60000",
		    "font-weight" : "bold"
		} : {
		    color : "#333",
		    "font-weight" : "normal"
		};
    }
    
    // 树选择
    function onSelect(event, treeId, treeNode, clickFlag) {
    	if(pageVue.curNode!=treeNode){
    		if(pageVue.curNode!=null && pageVue.curNode.entity.isNewState()){
    			var tmp=pageVue.curNode.entity;
    			if(tmp.menu_code==null || tmp.menu_name==null){
    				zTree.selectNode(pageVue.curNode,false,false);
    				layer.alert("当前节点必须维护编码和名称后才能切换到其它节点");
    				return;
    			}
    		}
    		pageVue.curNode=treeNode;
    		pageVue.curRow = pageVue.curNode.entity;
    	}
    }
    
    // 拖动前
    function beforeDrag(treeId, treeNodes) {
    	if (treeNodes.length > 1) {
    		return false;
    	}
    	var tmp=treeNodes[0];
    	var entity=tmp.entity;
    	if(entity.menu_code==null || entity.menu_name==null){
    		layer.alert('当前记录必须维护编码和名称后才能拖动');
    		return false;
    	}
    	curDragNode = tmp;
    	return true;
    }
    
    // 拖动放下前
    function beforeDrop(treeId, treeNodes, targetNode, moveType) {
		if (targetNode && targetNode.drop !== false) {
			var node = treeNodes[0];
			var c = -1;
			if (moveType === 'inner') {
			    var cr = targetNode.children;
			    if (cr == null) {
			    	c = 0;
			    } else {
			    	$.each(cr, function(index,itm) {
			    		if (itm != node && itm.entity.menu_order > c) {
			    			c = itm.entity.menu_order;
			    		}
			    	});
			    }
			    var p = targetNode.getParentNode();

			    var p1 = node.getParentNode();
			    var nodes = null;
			    if (p1 == null) {
			    	nodes = zTree.getNodes();
			    } else {
			    	nodes = p1.children;
			    }
			    if (nodes == null) {
			    	return;
			    }
			    nodes = nodes.sort(function(a, b) {
			    	return a.entity.menu_order - b.entity.menu_order;
			    });
			    var r = $.inArray(node, nodes);
			    var i = nodes.length;
			    while (r < i) {
			    	if (nodes[r] != node) {
			    		c++;
			    		nodes[r].entity.menu_order = nodes[r].entity.menu_order - 1;
			    	}
			    	r++;
			    }
			    node.pid = targetNode.id;
			    node.entity.menu_pcode = node.pid;
			    node.entity.menu_level = targetNode.entity.menu_level + 1;

			    if (p == p1) {
			    	var cc = 0;
			    	nodes = targetNode.children;
			    	$.each(nodes, function(index,itm) {
			    		if (itm.entity.menu_order > cc) {
			    			cc = itm.entity.menu_order;
			    		}
			    	});
			    	cc++;
			    	node.entity.menu_order = cc;
			    } else {
			    	c++;
			    	node.entity.menu_order = c;
			    }
			    return;
			}

			initNodesPosition(node, targetNode, moveType, p);
		    return true;
		}
		return false;
    }
    
    // 内拖动
    function dropInner(treeId, nodes, targetNode) {
		if (curDragNode) {
		    if (!targetNode && curDragNode.dropRoot === false) {
		    	return false;
		    } else if (curDragNode.parentTId && curDragNode.getParentNode() !== targetNode && curDragNode.getParentNode().childOuter === false) {
		    	return false;
		    }
		}
		return true;
	}
    
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
    
    // 初始化节点位置
    function initNodesPosition(node, targetNode, moveType, p) {
		var c = targetNode.entity.menu_order;
		var p = targetNode.getParentNode();
		var nodes = null;
		if (p == null) {
		    nodes = zTree.getNodes();
		} else {
		    nodes = p.children;
		}
		if (nodes == null) {
		    return;
		}

		nodes = nodes.sort(function(a, b) {
		    return a.entity.menu_order - b.entity.menu_order;
		});
		var r = $.inArray(targetNode, nodes);

		var p1 = node.getParentNode();
		var i = nodes.length;
		if (p == p1) {
		    if (moveType === 'prev') {
		    	node.entity.menu_order = c;
		    } else if (moveType === "next") {
		    	c++;
				node.entity.menu_order = c;
				r++;
		    }
		    while (r < i) {
		    	if (nodes[r] != node) {
		    		c++;
		    		nodes[r].entity.menu_order = c;
		    	}
		    	r++;
		    }
		    node.entity.menu_level = targetNode.entity.menu_level;
		    return;
		} else {
		    node.pid = targetNode.pid;
		    node.entity.menu_pcode = targetNode.entity.menu_pcode;
		    node.entity.menu_level = targetNode.entity.menu_level;
		    if (moveType === 'prev') {
		    	node.entity.menu_order = c;
		    } else if (moveType === "next") {
		    	c++;
		    	node.entity.menu_order = c;
		    	r++;
		    }

		    while (r < i) {
		    	if (nodes[r] != node) {
		    		c++;
		    		nodes[r].entity.menu_order = c;
		    	}
		    	r++;
		    }

		    if (p1 != null) {
		    	var ns = p1.children;
		    	var tr = ns.length;
		    	var i1 = $.inArray(node, ns);
		    	while (i1 < tr) {
		    		if (ns[i1] != node) {
		    			ns[i1].entity.menu_order = ns[i1].entity.menu_order - 1;
		    		}
		    		i1++;
		    	}
		    }
		}
    }
    
    // 添加新增按钮
    function addHoverDom(treeId, treeNode) {
    	var entity=treeNode.entity;
    	if(entity.isNewState() || $.trim(entity.menu_url)!=''){
    		return false;
    	}
		var sObj = $("#" + treeNode.tId + "_span");
		if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
		var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
			+ "' title='新增子节点' onfocus='this.blur();'></span>";
		sObj.after(addStr);
		var btn = $("#addBtn_"+treeNode.tId);
		if (btn) btn.bind("click", function(){
			addMenu(treeNode);
			return false;
		});
	}
    
    // 移除新增按钮
    function removeHoverDom(treeId, treeNode) {
		$("#addBtn_"+treeNode.tId).unbind().remove();
	}
    
    // 添加删除按钮
    function showRemoveBtn(treeId, treeNode) {
    	var itm=treeNode.entity;
		return itm.isdel=='Y' || itm.isNewState();
	}
    
    // 删除节点
    function onRemove(treeNode) {
    	var r=treeNode.entity;
    	r.del();
    	pageVue.curRow={};
    	if(r.isdel==='Y'){
    		pageVue.delMenu(r);
    	}
	}
    
    // 删除前提示
	function beforeRemove(treeId, treeNode) {
		var $index=layer.confirm("确认删除 当前节点:"+treeNode.name,{
			  btn: ['是','否'] // 按钮
		},function(){
			onRemove(treeNode);
			zTree.removeNode(treeNode,false);	
			pageVue.curNode=null;
			layer.close($index);
		},function(){
			layer.close($index);
		});
		return false;
	}
	
	 // 新增子组织
	function addMenu(treeNode) {
		var entity=treeNode.entity;
		
		var cur1 = menu.newRow();
		cur1.set("menu_pcode", entity.menu_code);
		cur1.set("menu_level", entity.menu_level+1);
		cur1.set('menu_code', null);
		cur1.set('menu_name', null);
		cur1.set('menu_sts', 'Y');
		var order = 1, nodes = treeNode.children,len=nodes==null?0:nodes.length;
		if (len > 0) {
			order = nodes[len-1].entity.menu_order + 1;
		}
		cur1.set("menu_order", order);
		var d = {
			id : null,
			name : '',
			pid : entity.menu_code,
			entity:cur1
		};
		pageVue.curRow = cur1;
		zTree.addNodes(treeNode,d);
		pageVue.curNode=d;
		zTree.selectNode(pageVue.curNode,false,false);
	}

	// 字段验证
	var rulesEdit = {
		menu_name : [ {
			required : true,
			message : '请输入名称',
			trigger : 'blur'
		}, {
			min : 2,
			max : 120,
			message : '长度在 2 到 120 个字符',
			trigger : 'blur'
		} ]
	};

	var rulesAdd = $.extend({
		menu_code : [ {
			required : true,
			message : '请输入编码',
			trigger : 'blur'
		}, {
			min : 3,
			max : 40,
			message : '长度在 3到 40 个字符',
			trigger : 'blur'
		} ],
		menu_system : [ {
			required : true,
			message : '请输入系统',
			trigger : 'blur'
		} ]

	}, rulesEdit);

	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			dicDatas : {},
			dicMaps : {},
			curRow : {},
			rulesEdit : rulesEdit,
			rulesAdd : rulesAdd,
			filterText : '',
			curNode:null
		}
	};

	var methods_page = page_conf.methods = {};
	// 点击刷新按钮
	methods_page.queryDatas = function() {
		var loading = layer.load();
		this.curRow = {};
		var g=this;
		menu.doQuery(function(data) {
			var d = initTreeMenu(menu.$rowSet.$views);
			nodeList=[];
			zTree = $.fn.zTree.init($("#menuTree"), setting, d);
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};

	// 菜单格式化显示
	methods_page.menuFormat = function(dic, col) {
		var row=this.curRow;
		var m = this.dicMaps[dic];
		if (m) {
			return m[row[col]];
		}
		return row[col];
	};

	// 新增系统
	methods_page.addMenuSystem = function() {
		var cur1 = menu.newRow();
		cur1.set("menu_pcode", null);
		cur1.set("menu_code", null);
		cur1.set("menu_name", null);
		cur1.set("menu_level", 1);
		cur1.set('menu_sts', 'Y');
		var order = 1, nodes = zTree.getNodes(),len=nodes==null?0:nodes.length;
		if (len > 0) {
			order = nodes[len-1].entity.menu_order + 1;
		}
		cur1.set("menu_order", order);
		var d = {
			id : null,
			name : '',
			pid : null,
			entity:cur1
		};
		this.curRow = cur1;
		zTree.addNodes(null,d);
		this.curNode=d;
		zTree.selectNode(this.curNode,false,false);
	};
	
	// 删除菜单
	methods_page.delMenu = function(r) {
		var g=this;
		var loading = layer.load();
		context.doAction({
			statement : 'SDP-MENU-007',
			params : {
				menu_code : r.menu_code
			}
		}, '/api/common/delete', function(data) {
			layer.close(loading);
			layer.close(tindex);
			layer.msg("成功删除");
		}, function(data) {
			layer.close(loading);
			layer.close(tindex);
			layer.alert(data.msg);
		});
	};
	// 禁用菜单
	methods_page.disableMenu = function(r) {
		if(r.isNewState()){
			return;
		}
		var g=this;
		var tindex = layer.confirm('是否禁用菜单[' + r.menu_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-MENU-005',
				params : {
					menu_code : r.menu_code
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
	// 启用菜单
	methods_page.enableMenu = function(r) {
		var g=this;
		var tindex = layer.confirm('是否启用菜单[' + r.menu_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			context.doAction({
				statement : 'SDP-MENU-006',
				params : {
					menu_code : r.menu_code
				}
			}, '/api/common/update', function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.msg("成功启用");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	};
	// 保存菜单数据
	methods_page.saveMenu = function() {
		var g=this;
		this.$refs['menuForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				menu.$saveUrl = "/api/common/save";
				menu.$update = 'SDP-MENU-004';
				menu.$insert = 'SDP-MENU-008';
				menu.doSave(function() {
					layer.close(loading);
					layer.msg("保存成功");
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "save");
			} else {
				return false;
			}
		});
	};

	// 节点渲染
	methods_page.renderContent = function(h, obj) {
		var data=obj.data;
		var itm = data.cur;
		var title = createMenuLabel(h, data);
		var bts = [];

		if ($.trim(itm.menu_url) == '') {
			if (itm.menu_sts == 'Y' && !itm.isNewState()) {
				bts.push(createBtn(h, 'android-add', '新增', function() {
					pageVue.addMenu(obj);
				}));
			}
		} else {
			if (itm.menu_sts == 'Y') {
				bts.push(createBtn(h, 'ios-locked', '禁用', function() {
					pageVue.disableMenu(itm);
				}));
			} else {
				bts.push(createBtn(h, 'ios-unlocked-outline', '解禁', function() {
					pageVue.enableMenu(itm);
				}));
			}
		}
		var btns = h('span', {
			style : {
				'float' : 'right'
			// 'margin-right' : '5px'
			}
		}, bts);
		return h('span', [ title, btns ]);
	};

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
		'curRow.menu_name':function(val){			
			if (this.curNode!=null) {
				this.curNode.name = val;
			    zTree.updateNode(this.curNode);
			}
		},
		'curRow.menu_code':function(val){
			if (this.curNode!=null) {
				this.curNode.id = val;
			    zTree.updateNode(this.curNode);
			}
		}
	};
	
	// 初始化
	page_conf.mounted = function() {
		// 查询菜单数据
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

	// 初始化菜单树
	function initTreeMenu(menus) {
		var arr = [];
		$.each(menus, function(index, itm) {
			arr.push({id:itm.menu_code,pid:itm.menu_pcode,name:itm.menu_name,entity:itm})
		});
		return arr;
	}
});