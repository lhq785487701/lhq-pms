"use strict";
$(function() {
	var context = new SDP.SDPContext();
	
	var tree = context.newDataStore("tree");
	var reqParam = getURLParam();
	var module = reqParam['module'] == null ? 'test' : reqParam['module'];
	tree.$queryUrl = "/api/common/selectList";
	tree.statement = "SDP-COMMONTREE-001";
	
	//测试数据
	var test = context.newDataStore("test");
	var page = test.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(20);
	test.$queryUrl = "/api/common/selectList";
	test.statement = "PMS-TEST-001";
	
	
	var setting = {
		view : {
		    fontCss : getFontCss,
		    selectedMulti : false,
		    addHoverDom:addHoverDom,
			removeHoverDom:removeHoverDom
		},
		check:{
			enable:true
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
	/*编辑状态下的设置，由于目前为弹出框编辑所以不需要
	 * setting.edit = {
		drag : {
		    prev : true,
		    next : true,
		    inner : dropInner
		},
		enable : true,
		removeTitle:'删除节点', 
		showRemoveBtn : showRemoveBtn,
		showRenameBtn : false
	};*/
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
		    "font-weight" : "normal",
		    "margin": "0px 4px 10px 5px",
		};
    }
    
    //测试单表
    var cols = [
		{
			title : '测试id',
			key : 'test_id',
			width : 160
		},
		{
			title : '测试名称',
			key : 'test_name',
			width : 160
		},
		{
			title : '测试正文',
			key : 'test_content',
			width : 200
		},
		{
			title : '功能节点',
			key : 'node_code',
			width : 150
		}];
    
    //校验节点编码
    var validateNodeCode  = (rule, value, callback) => {
      	 if (!value) {
               return callback(new Error('节点编码不能为空!'));
           }
           setTimeout(() => {
              if (value.length < 1 || value.length > 100) {
                  callback(new Error('节点编码在1~100字符内！'));
              } else {
            	  context.doAction({
	      				statement : "SDP-COMMONTREE-005",
	      				params : {node_code : value}
	      			}, '/api/common/selectList', function(data) {
	      				if(data.data[0].node_count == 0) {
	      					callback();
	      				} else {
	      					callback(new Error('编码已存在！'));
	      				}
	      			}, function(data) {
	      				layer.alert(data.msg);
	      			});
              }
          }, 1000);
      };
    
   // 字段验证
  	var rules = {
  		node_name : [ {
  			required : true,
  			message : '节点名称',
  			trigger : 'blur'
  		}, {
  			max : 100,
  			message : '长度在 0到 100个字符',
  			trigger : 'blur'

  		} ]
  	};
  	
  	// 新增
  	var ruleAdd = $.extend({
  		node_code : [ {
  			validator: validateNodeCode,
  			trigger : 'blur'
  		} ]
  	}, rules);
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			params : {
				test_name : '',
				test_content : ''
			},
			datas : [],
			page : page,
			funAction : {},
			columns : cols,
			curRow : {},
			curNode:null,
			nodeAdd : false,
			nodeEdit : false,
			rules : rules,
			ruleAdd : ruleAdd,
			moduleMaps : {},
			module : '',
			//当前节点原名
			curNodeName : '',
			//测试模块数据（可从url中传入）
			node_module : module,
		}
	};
	
	var methods_page = page_conf.methods = {};
	
	//更根据模块查询
	methods_page.searchTree = function() {
		this.node_module = this.module;
		this.queryDatas();
	}
	
	//查询树
	methods_page.queryDatas = function() {
		var loading = layer.load();
		this.curRow = {};
		context.clearParam();
		context.put({node_module : this.node_module});
		var g=this;
		tree.doQuery(function(data) {
			var d = initTree(tree.$rowSet.$views);
			nodeList=[];
			zTree = $.fn.zTree.init($("#commonTree"), setting, d);
			// 展开第一层菜单
			g.$nextTick(function(){
				var nodes = zTree.getNodes();
				$.each(nodes,function(index,itm){
					zTree.expandNode(itm,true,false,false,false);
				});				
			})
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	//查询所有模块
	methods_page.queryAllModule = function () {
		var g = this;
		context.doAction({
				statement : "SDP-COMMONTREE-006"
			}, '/api/common/selectList', function(data) {
				//赋予模块
				g.moduleMaps = data.data;
			}, function(data) {
				layer.alert(data.msg);
			});
	}
	
	//查询用户
	methods_page.queryUser = function() {
		var g = this;
		SDP.layer.open({
			title : '选择用户',
			type : 2,
			area : [ '500px', '420px' ],
			content : SDP.URL.getUrl('/html/admin/common/selectUser.html')
		}, {}, function(val) {
		} , true);
	}
	
	//测试数据查询
	methods_page.queryTestDatas = function() {
		var loading = layer.load();
		var obj = {
			node_code : this.curRow.node_code,
			test_name : this.params.test_name,
			test_content :  this.params.test_content
		}
		context.clearParam();
		context.put(obj);
		var g=this;
		test.doQuery(function(data) {
			g.updateDatas();
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	// 测试设置数据
	methods_page.updateDatas = function() {
		var vs = test.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas = vs;
		}
	};
	//测试查询
	methods_page.searchDatas = function() {
		this.queryTestDatas();
	}
	
	//测试新增
	methods_page.addData = function() {
	}
	
	//取消新增节点
	methods_page.addNodeCancel = function() {
		var g = this;
		var nodes = zTree.getSelectedNodes()[0];
		onRemove(nodes);
		zTree.removeNode(nodes,false);	
		g.curNode=null;
		g.$refs['nodeAddForm'].resetFields();
		g.nodeAdd = false;
	}
	
	//取消编辑节点
	methods_page.editNodeCancel = function() {
		var g = this;
		//g.$refs['nodeEditForm'].resetFields();
		//还原原来的名字
		g.curRow.node_name = g.curNodeName;
		g.nodeEdit = false;
	}
	
	//保存新增节点
	methods_page.addNodeSave = function() {
		var g=this;
		this.$refs['nodeAddForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				tree.$saveUrl = "/api/common/insert";
				tree.$insert = 'SDP-COMMONTREE-002';
				tree.doSave(function() {
					layer.close(loading);
					//g.queryDatas();
					layer.msg('节点新增成功');
					g.nodeAdd = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "insert");
			} else {
				return false;
			}
		});
	}
	
	//保存编辑节点
	methods_page.editNodeSave = function() {
		var g=this;
		this.$refs['nodeEditForm'].validate(function(valid) {
			if (valid) {
				var loading = layer.load();
				tree.$saveUrl = "/api/common/update";
				tree.$update = 'SDP-COMMONTREE-004';
				tree.doSave(function() {
					layer.close(loading);
					//g.queryDatas();
					layer.msg('节点编辑成功');
					g.nodeEdit = false;
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				}, "update");
			} else {
				return false;
			}
		});
	}
	
	//删除节点
	methods_page.delTree = function(r) {
		var g=this;
		var loading = layer.load();
		context.doAction({
			statement : 'SDP-COMMONTREE-003',
			params : {
				node_code : r.node_code
			}
		}, '/api/common/delete', function(data) {
			layer.close(loading);
			layer.msg("成功删除");
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
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

	 // 初始化功能列表	
	SDP.FUNCTION.initDatas(window.location.pathname, function(data) {
		pageVue.funAction = data;
	});
    
	// 初始化
	page_conf.mounted = function() {
		this.$nextTick(function(){
			// 查询树数据
			this.queryDatas();
			//查询所有模块
			this.queryAllModule();
		});	
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
	
	
	//它用于观察Vue实例上的数据变动
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
		'curRow.node_name':function(val){			
			if (this.curNode!=null) {
				this.curNode.name = val;
			    zTree.updateNode(this.curNode);
			}
		},
		'curRow.node_code':function(val){
			if (this.curNode!=null) {
				this.curNode.id = val;
			    zTree.updateNode(this.curNode);
			}
		}
	};

	
	var pageVue = new Vue(page_conf);
	
	// 树选择
    function onSelect(event, treeId, treeNode, clickFlag) {
    	if(pageVue.curNode!=treeNode){
    		if(pageVue.curNode!=null && pageVue.curNode.entity.isNewState()){
    			var tmp=pageVue.curNode.entity;
    			if(tmp.node_code==null || tmp.node_name==null){
    				zTree.selectNode(pageVue.curNode,false,false);
    				layer.alert("当前节点必须维护编码和名称后才能切换到其它节点");
    				return;
    			}
    		}
    		pageVue.curNode= treeNode;
    		pageVue.curRow = pageVue.curNode.entity;
    		
    		
    		//测试单表数据
    		pageVue.queryTestDatas();
    	}
    }
    
    // 拖动前
    function beforeDrag(treeId, treeNodes) {
    	if (treeNodes.length > 1) {
    		return false;
    	}
    	var tmp=treeNodes[0];
    	var entity=tmp.entity;
    	if(entity.node_code==null || entity.node_name==null){
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
			    		if (itm != node && itm.entity.node_order > c) {
			    			c = itm.entity.node_order;
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
			    	return a.entity.node_order - b.entity.node_order;
			    });
			    var r = $.inArray(node, nodes);
			    var i = nodes.length;
			    while (r < i) {
			    	if (nodes[r] != node) {
			    		c++;
			    		nodes[r].entity.node_order = nodes[r].entity.node_order - 1;
			    	}
			    	r++;
			    }
			    node.pid = targetNode.id;
			    node.entity.node_pcode = node.pid;
			    node.entity.node_level = targetNode.entity.node_level + 1;

			    if (p == p1) {
			    	var cc = 0;
			    	nodes = targetNode.children;
			    	$.each(nodes, function(index,itm) {
			    		if (itm.entity.node_order > cc) {
			    			cc = itm.entity.node_order;
			    		}
			    	});
			    	cc++;
			    	node.entity.node_order = cc;
			    } else {
			    	c++;
			    	node.entity.node_order = c;
			    }
			    return;
			}

			initNodesPosition(node, targetNode, moveType, p);
		    return true;
		}
		return false;
    }
	
	// 初始化树
	function initTree(trees) {
		var arr = [];
		$.each(trees, function(index, itm) {
			if(itm.node_icon == null) {
				arr.push({id:itm.node_code,pid:itm.node_pcode,name:itm.node_name,entity:itm})
			} else {
				arr.push({id:itm.node_code,pid:itm.node_pcode,name:itm.node_name,icon:itm.node_icon,entity:itm})
			}
			
		});
		return arr;
	}
	
	// 添加按钮的位置
    function addHoverDom(treeId, treeNode) {
    	var entity=treeNode.entity;
    	if(entity.isNewState()){
    		return false;
    	}
		var sObj = $("#" + treeNode.tId + "_span");
		if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
		var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
			+ "' title='新增子节点' onfocus='this.blur();'></span>";
		var editStr =  "<span class='button edit' id='editBtn_" + treeNode.tId
		+ "' title='编辑子节点' onfocus='this.blur();'></span>";
		var remove =  "<span class='button remove' id='removeBtn_" + treeNode.tId
		+ "' title='删除子节点' onfocus='this.blur();'></span>";
		sObj.after(remove);
		sObj.after(editStr);
		sObj.after(addStr);
		var btnAdd = $("#addBtn_"+treeNode.tId);
		var btnEdit = $("#editBtn_"+treeNode.tId);
		var btnRemove = $("#removeBtn_"+treeNode.tId);
		if (btnAdd) btnAdd.bind("click", function(){
			if(isNewNode()) {addNode(treeNode);}
			return false;
		});
		if (btnEdit) btnEdit.bind("click", function(){
			if(isNewNode()) {editNode(treeNode);}
			return false;
		});
		if (btnRemove) btnRemove.bind("click", function(){
			if(isNewNode()) {beforeRemove('commonTree', treeNode);}
			return false;
		});
	}
    
    //判断是否新建
    function isNewNode(){
    	if(pageVue.curNode!=null && pageVue.curNode.entity.isNewState()){
			var tmp=pageVue.curNode.entity;
			if(tmp.node_code==null || tmp.node_name==null){
				zTree.selectNode(pageVue.curNode,false,false);
				layer.alert("当前节点必须维护编码和名称后才能切换到其它节点");
				return false;
			}
		}
    	return true;
    }
    
    
    
    // 移除按钮
    function removeHoverDom(treeId, treeNode) {
		$("#addBtn_"+treeNode.tId).unbind().remove();
		$("#editBtn_"+treeNode.tId).unbind().remove();
		$("#removeBtn_"+treeNode.tId).unbind().remove();
	}
    
    // 添加删除按钮
    function showRemoveBtn(treeId, treeNode) {
    	var itm=treeNode.entity;
		return itm.isdel=='Y' || itm.isNewState();
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
    
    // 删除节点
    function onRemove(treeNode) {
    	var r=treeNode.entity;
    	r.del();
    	pageVue.curRow={};
    	if(!r.isNewState()) {
    		pageVue.delTree(r);
    	}
	}
    
    // 删除前提示
	function beforeRemove(treeId, treeNode) {
		//没有子节点才可以删除
		if(treeNode.children != null) {
			layer.msg('存在子节点！');
			return;
		}
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
	function addNode(treeNode) {
		var entity=treeNode.entity;
		
		var cur1 = tree.newRow();
		cur1.set("node_pcode", entity.node_code);
		cur1.set("node_level", entity.node_level+1);
		cur1.set('node_code', null);
		cur1.set('node_name', null);
		cur1.set('node_sts', 'Y');
		cur1.set('node_module', pageVue.node_module);
		cur1.set('node_icon', null);
		var order = 1, nodes = treeNode.children,len=nodes==null?0:nodes.length;
		if (len > 0) {
			order = nodes[len-1].entity.node_order + 1;
		}
		cur1.set("node_order", order);
		var d = {
			id : null,
			name : '',
			pid : entity.node_code,
			entity:cur1
		};
		pageVue.curRow = cur1;
		zTree.addNodes(treeNode,d);
		pageVue.curNode=d;
		zTree.selectNode(pageVue.curNode,false,false);
		pageVue.nodeAdd = true;
	}
	
	//编辑子组织
	function editNode(treeNode) {
		var entity=treeNode.entity;
		pageVue.curRow = entity;
		pageVue.curNodeName = entity.node_name;
		pageVue.curNode = treeNode;
		zTree.selectNode(treeNode,false,false);
		pageVue.nodeEdit = true;
	}
	
	function getURLParam() {
		var json={};
		var url = window.location.href;
		if(url.split("?").length > 1) {
			var rs=url.split("?")[1];
			var arr=rs.split("&");
			for(var i=0;i<arr.length;i++){
				if(arr[i].indexOf("=")!=-1){
			   		json[arr[i].split("=")[0]]=arr[i].split("=")[1];
			   } else {
			   		json[arr[i]]="undefined";
			   }
			}
		} 
		return json;
	}
});