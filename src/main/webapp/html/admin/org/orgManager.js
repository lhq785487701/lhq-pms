/**
 * 组织维护脚本
 * 
 * @文件名 orgManager
 * @作者 李浩祺
 * @创建日期 2017-11-16
 * @版本 V 1.0
 */
"use strict";
$(function() {
	var dicConf = [ 'sdp_org_mdm_main' ];
	var context = new SDP.SDPContext();
	var org = context.newDataStore("org");

	org.$queryUrl = "/api/common/selectList";
	org.statement = "SDP-ORG-002";
	
	var mdms = context.newDataStore("mdms");
	mdms.$keyField = "mdm_code";
	var page = mdms.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);

	mdms.$queryUrl = "/api/common/selectList";
	mdms.statement = "SDP-ORG-MDM-002";
	
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
    var zTree,curNode,curDragNode=null;

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
    	if(curNode!=treeNode){
    		if(curNode!=null && curNode.entity.isNewState()){
    			var tmp=curNode.entity;
    			if(tmp.org_code==null || tmp.org_name==null){
    				zTree.selectNode(curNode,false,false);
    				layer.alert("当前节点必须维护编码和名称后才能切换到其它节点");
    				return;
    			}
    		}
    		curNode=treeNode;
    		pageVue.curRow = curNode.entity;
    		pageVue.isMdm=curNode.entity.org_pcode!=null;
    	}
    }
    
    // 拖动前
    function beforeDrag(treeId, treeNodes) {
    	if (treeNodes.length > 1) {
    		return false;
    	}
    	var tmp=treeNodes[0];
    	var entity=tmp.entity;
    	if(entity.org_code==null || entity.org_name==null){
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
			    		if (itm != node && itm.entity.org_order > c) {
			    			c = itm.entity.org_order;
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
			    	return a.entity.org_order - b.entity.org_order;
			    });
			    var r = $.inArray(node, nodes);
			    var i = nodes.length;
			    while (r < i) {
			    	if (nodes[r] != node) {
			    		c++;
			    		nodes[r].entity.org_order = nodes[r].entity.org_order - 1;
			    	}
			    	r++;
			    }
			    node.pid = targetNode.id;
			    node.entity.org_pcode = node.pid;
			    node.entity.org_level = targetNode.entity.org_level + 1;
			    node.entity.mdm_code=targetNode.entity.mdm_code;

			    if (p == p1) {
			    	var cc = 0;
			    	nodes = targetNode.children;
			    	$.each(nodes, function(index,itm) {
			    		if (itm.entity.org_order > cc) {
			    			cc = itm.entity.org_order;
			    		}
			    	});
			    	cc++;
			    	node.entity.org_order = cc;
			    } else {
			    	c++;
			    	node.entity.org_order = c;
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
		var c = targetNode.entity.org_order;
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
		    return a.entity.org_order - b.entity.org_order;
		});
		var r = $.inArray(targetNode, nodes);

		var p1 = node.getParentNode();
		var i = nodes.length;
		if (p == p1) {
		    if (moveType === 'prev') {
		    	node.entity.org_order = c;
		    } else if (moveType === "next") {
		    	c++;
				node.entity.org_order = c;
				r++;
		    }
		    while (r < i) {
		    	if (nodes[r] != node) {
		    		c++;
		    		nodes[r].entity.org_order = c;
		    	}
		    	r++;
		    }
		    node.entity.org_level = targetNode.entity.org_level;
		    return;
		} else {
		    node.pid = targetNode.pid;
		    node.entity.mdm_code=targetNode.entity.mdm_code;
		    node.entity.org_pcode = targetNode.entity.org_pcode;
		    node.entity.org_level = targetNode.entity.org_level;
		    if (moveType === 'prev') {
		    	node.entity.org_order = c;
		    } else if (moveType === "next") {
		    	c++;
		    	node.entity.org_order = c;
		    	r++;
		    }

		    while (r < i) {
		    	if (nodes[r] != node) {
		    		c++;
		    		nodes[r].entity.org_order = c;
		    	}
		    	r++;
		    }

		    if (p1 != null) {
		    	var ns = p1.children;
		    	var tr = ns.length;
		    	var i1 = $.inArray(node, ns);
		    	while (i1 < tr) {
		    		if (ns[i1] != node) {
		    			ns[i1].entity.org_order = ns[i1].entity.org_order - 1;
		    		}
		    		i1++;
		    	}
		    }
		}
    }
    
    // 添加新增按钮
    function addHoverDom(treeId, treeNode) {
    	var entity=treeNode.entity;
    	if(entity.isNewState()){
    		return false;
    	}
		var sObj = $("#" + treeNode.tId + "_span");
		if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
		var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
			+ "' title='新增子节点' onfocus='this.blur();'></span>";
		sObj.after(addStr);
		var btn = $("#addBtn_"+treeNode.tId);
		if (btn) btn.bind("click", function(){
			addOrg(treeNode);
			return false;
		});
	}
    
    // 移除新增按钮
    function removeHoverDom(treeId, treeNode) {
		$("#addBtn_"+treeNode.tId).unbind().remove();
	}
    
    // 添加删除按钮
    function showRemoveBtn(treeId, treeNode) {
		return treeNode.entity.isNewState();
	}
    
    // 删除节点
    function onRemove(e, treeId, treeNode) {
    	if (treeNode != null) {
    		treeNode.entity.del();
    	}
    	curNode=null;
    	//treeNode.entity.del();
    	pageVue.curRow={};
	}
    
    // 删除前提示
	function beforeRemove(treeId, treeNode) {
		var $index=layer.confirm("确认删除 当前节点:"+treeNode.name,{
			  btn: ['是','否'] // 按钮
		},function(){
			zTree.removeNode(treeNode,false);
			onRemove(treeNode);
			layer.close($index);
		},function(){
			layer.close($index);
		});
		return false;
	}
    
    // 新增子组织
	function addOrg(treeNode) {
		var entity=treeNode.entity;
		
		var cur1 = org.newRow();
		cur1.set("org_pcode", entity.org_code);
		cur1.set("org_level", entity.org_level+1);
		cur1.set('org_code', null);
		cur1.set('org_name', null);
		cur1.set('mdm_code', entity.mdm_code);
		cur1.set('org_path', entity.org_path);
		cur1.set('org_name_path', entity.org_name_path);
		var order = 1, nodes = entity.children,len=nodes==null?0:nodes.length;
		if (len > 0) {
			order = nodes[len-1].entity.org_order + 1;
		}
		cur1.set("org_order", order);
		var d = {
			id : null,
			name : '',
			pid : entity.org_code,
			entity:cur1
		};
		pageVue.curRow = cur1;
		zTree.addNodes(treeNode,d);
		curNode=d;
		zTree.selectNode(curNode,false,false);
	}
	


	// 字段验证
	var rulesEdit = {
		menu_name : [ {
			required : true,
			message : '请输入名称',
			trigger : 'blur'
		}, {
			min : 2,
			max : 100,
			message : '长度在 2 到 100 个字符',
			trigger : 'blur'
		} ]
	};

	var rulesAdd = $.extend({
		org_code : [ {
			required : true,
			message : '请输入编码',
			trigger : 'blur'
		}, {
			min : 3,
			max : 40,
			message : '长度在 3到 40 个字符',
			trigger : 'blur'
		}]
	}, rulesEdit);
	
	var cols = [
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


	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			curRow : {
			},
			rulesEdit : rulesEdit,
			rulesAdd : rulesAdd,
			filterText : '',
			curMdm:null,
			datas:[],
			columns : cols,
			page : page,
			dicDatas : {},
			dicMaps : {},
			mdmParam:{
				mdm_code:null
			}
		}
	};

	var methods_page = page_conf.methods = {};
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
		org.doQuery(function(data) {
			var d = initTreeOrg(org.$rowSet.$views);
			nodeList=[];
			zTree = $.fn.zTree.init($("#orgTree"), setting, d);
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	// 新增组织
	methods_page.addMainOrg = function() {
		if(this.curMdm==null){
			layer.alert('请先选择组织维度');
			return;
		}
		var cur1 = org.newRow();
		cur1.set("org_pcode", null);
		cur1.set("org_level", 1);
		cur1.set('org_code', null);
		cur1.set('org_name', null);
		cur1.set('mdm_code',this.curMdm.mdm_code);
		var order = 1, nodes = zTree.getNodes(),len=nodes==null?0:nodes.length;
		if (len > 0) {
			order = nodes[len-1].entity.org_order + 1;
		}
		cur1.set("org_order", order);
		var d = {
			id : null,
			name : '',
			pid : null,
			entity:cur1
		};
		this.curRow = cur1;
		zTree.addNodes(null,d);
		curNode=d;
		zTree.selectNode(curNode,false,false);
	};
	
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
		this.queryDatas();*/
		
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
		},true);
	};
	
	// 保存组织数据
	methods_page.saveOrg= function() {
		var g=this;
		this.$refs['orgForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				org.$saveUrl = "/api/common/save";
				org.$update = 'SDP-ORG-004';
				org.$insert = 'SDP-ORG-003';
				org.doSave(function() {
					layer.close(loading);
					g.queryDatas();
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
	
	// 选择维度
	methods_page.mdmTableSelect = function(data) {
		layer.close(mdmIndex);
		if (this.curMdm != data.item) {
			this.curMdm = data.item;
			mdms.setCurRow(data.item);
			this.queryOrgDatas();
		}
	};
	
	// 点击查询按钮
	methods_page.searchMdm=function(){
		page.setPageNumber(1);
		this.queryDatas();
	};
	// 查询
	methods_page.queryDatas = function() {
		var obj = pageVue.mdmParam;
		context.clearParam();
		context.put(obj);
		var g = this;
		var loading = layer.load();
		mdms.doQuery(function(data) {
			layer.close(loading);
			g.updateDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 设置数据
	methods_page.updateDatas = function() {
		var vs = mdms.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};

	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryMdmDatas();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryDatas();
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
	
	// 初始化路径,true初始化name, false初始化code
	function initPath(treeNode,b){
		var names=[],codes=[];
		var p1 = treeNode.getParentNode();
		if(treeNode.id!=null){
			names.push(treeNode.entity.org_name);
			codes.push(treeNode.entity.org_code);
		}
		while(p1!=null){
			names.push(p1.name);
			codes.push(p1.id);
			p1=p1.getParentNode();
		}
		names.reverse();
		codes.reverse();
		var entity=treeNode.entity;
		entity.org_path=codes.join('.')+'.';
		entity.org_name_path="/"+names.join('/');
	}
	
	// 初始化
	page_conf.mounted = function() {
	};

	var pageVue = new Vue(page_conf);

	// 初始化组织树
	function initTreeOrg(datas) {
		var arr = [];
		$.each(datas, function(index, itm) {
			arr.push({id:itm.org_code,pid:itm.org_pcode,name:itm.org_name,entity:itm})
		});
		return arr;
	}
	
	
});