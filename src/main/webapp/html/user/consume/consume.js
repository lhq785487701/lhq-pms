"use strict";
$(function() {
	// 菜单查询
	var consume = new SDP.SDPContext();
	//数据字典
	var dicConf = [ 'pms_consume_time' ];
	
	var consumeMenu = consume.newDataStore("consumeMenu");
	var consumeDetail = consume.newDataStore("consumeDetail");
	var consumeStatistics = consume.newDataStore("consumeStatistics");
	consumeMenu.$keyField = "consume_id";
	consumeDetail.$keyField = "cons_detail_id"
		
	var page = consumeDetail.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	
	//消费table
	var consumeCols = [{
        type: 'index',
        width: 60,
        align: 'center'
    },{
    	title : '所属菜单',
    	align : 'center',
    	key : 'consume_menu_name',
    	width : 130
    },{
		title : '消费时间',
		align : 'center',
		key : 'consume_date',
		width : 100
	},{
		title : '消费金额',
		align : 'center',
		key : 'consume_money',
		width : 100
	},{
		title : '消费类型',
		align : 'center',
		key : 'consume_type',
		width : 100
	},{
		title : '消费方式',
		align : 'center',
		key : 'consume_way',
		width : 100
	},{
		title : '消费时段',
		align : 'center',
		key : 'consume_time',
		width : 100,
		type:'render',
		render : function(h, row, column, index) {
			var ele = h('span', pageVue.stsFormat('pms_consume_time', row,
					'consume_time'));
			return ele;
		}
	},{
		title : '消费描述',
		align : 'center',
		key : 'consume_desc',
		width : 230,
		ellipsis : true
	},{
		title : '操作',
		key : 'action',
		align : 'center',
		type:'render',
		width : 120 ,
		render : consumeAction
	} ];
	
	var statisticsCols =  [{
    	title : '所属菜单',
    	align : 'center',
    	key : 'consume_menu_name',
    	width : 310
    },{
		title : '消费类型',
		align : 'center',
		key : 'consume_type',
		width : 240
	},{
		title : '消费总金额',
		align : 'center',
		key : 'consume_money',
		width : 260
	},{
		title : '消费总条数',
		align : 'center',
		key : 'consume_count',
		width : 150
	}];
	
	
	//菜单树初始化
	var menuTree = [{ title: '我的消费',
		loading: false,
		expand : true,
		menu_id : null,
		menu_order : null,
		children: []
	}];
	
	//菜单列表初始化
	var menuList = [{
    	consume_id : 0,
    	consume_menu_name : "我的消费"
    }];
	
	//对孩子排序,数组对象排序的方法
	var compare = function (obj1, obj2) {
	    var val1 = obj1.consume_menu_order;
	    var val2 = obj2.consume_menu_order;
	    if (val1 < val2) {
	        return -1;
	    } else if (val1 > val2) {
	        return 1;
	    } else {
	        return 0;
	    }            
	} 
	
	//校验数字
	var validateNumber  = (rule, value, callback) => {
		if (value == null || value == "") {
			   callback();
        }
        setTimeout(() => {
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
            } 
            callback();
        }, 1000);
    };
    
    //校验金钱
    var validateMoney =  (rule, value, callback) => {
		if (value == null || value == "") {
				   callback(new Error('不能为空'));
	    }
	    setTimeout(() => {
	    	var exp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
	        if (!exp.test(value)) {
	            callback(new Error('请输入正确金额'));
	        } 
	        callback();
	    }, 1000);
	};
	
	//校验下拉框菜单Id
	var validateMenu =  (rule, value, callback) => {
		if (value == null || value == "") {
			   callback(new Error('消费菜单不能为空'));
		}
		callback();
	};
	
    //菜单新增规则
	var rulesMenuAdd = {
		menuName : [ {
			required : true,
			message : '名称不能为空！',
			trigger : 'blur'
		}, {
			min : 2,
			max : 50,
			message : '请输入2-50个字符！',
			trigger : 'blur'
		} ],
		menuOrder : [{
			validator: validateNumber,
			trigger : 'blur'
		} ]
	}
	
	//消费明细新增规则
	var rulesConsume = {
		consume_money : [ {
			validator: validateMoney,
			trigger : 'blur'
		}], 
		consume_date : [ {
			required : true,
			message : '消费日期不能为空！',
			trigger : 'change',
			type: 'date'
		}], 
		consume_type : [{
			required : true,
			message : '消费类型不能为空！',
			trigger : 'change'
		}],
		consume_menu : [{
			validator: validateMenu,
			trigger : 'change'
		}]
	}
	
	//菜单数据初始化
	var consumeMenuData = {
			menuName : "",
			menuDesc : "",
			menuOrder : "",
			menuPid : ""
	}
	
	//消费数据初始化
	var consumeAddData = {
			consume_money : "",
			consume_date : new Date(),
			consume_type : "支出",
			consume_menu : null,
			consume_way : "",
			consume_time : "",
			consume_desc : ""
	}
	
	// 页面配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			menuTree: menuTree,
            menuList: menuList,
            menuLastLevel : [],
            dicDatas : {},
			dicMaps : {},
            consumeMenuModal: false,
            consumeMenuModalEdit : false,
            consumeAddModal: false,
            consumeDetailModal : false,
            consumeEditModal : false,
            consumeMenuData: consumeMenuData,
            consumeAddData: consumeAddData,
            consumeDatas:[],
            consumeData : {},
            consumeStatistics:[],
            consumeParams : {},
            rulesMenuAdd: rulesMenuAdd,
            rulesConsumeAdd: rulesConsume,
            rulesConsumeEdit:rulesConsume,
            consumeCols:consumeCols,
            statisticsCols:statisticsCols,
            currentSelectMenuKey : "",
            currentSelectMenuId : "",
            currentSelectMenuName : "",
            currentMenuData : {},
            page : page,
		}
	};
	

	var methods_page = page_conf.methods = {};
	
	
	// 初始化查询
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryMenuTree();
		});	
	};
	
	//查询菜单
	methods_page.queryMenuTree = function() {
		var g = this;
		var url = "/api/consume/queryConsumeMenus?t=" + new Date().getTime();
		consume.doAction({}, url, function(data) {
			//初始化树
			g.initUserConsumeTree(data.data);
			//初始化菜单列表和最后一层菜单
			g.menuList = [{consume_id : 0,consume_menu_name : "我的消费"}];
			g.menuLastLevel.splice(0, g.menuLastLevel.length);
			g.getMenuList(data.data);
		}, function(data) {
			layer.alert(data.msg);
		});
	}
	
	//查询消费记录
	methods_page.queryConsumeDatas = function() {
		var g = this;
		if(g.currentSelectMenuId == null || g.currentSelectMenuId === "") {
			layer.msg("请选择菜单后再查询！");
		} else {
			page.setPageNumber(page.getPageNumber());
			var obj = pageVue.consumeParams;
			var loading = layer.load();
			var g = this;
			consumeDetail.$queryUrl = "/api/common/selectList";
			consumeDetail.statement = "PMS-CONSUME-003";
			consumeDetail.set('consume_date_e', g.changeDateFormat(obj.consumeEDate));
			consumeDetail.set('consume_date_s', g.changeDateFormat(obj.consumeSDate));
			consumeDetail.set('consume_desc', obj.consumeDesc);
			consumeDetail.set('consume_type', obj.consumeType);
			consumeDetail.set('consume_id', g.currentSelectMenuId);
			consumeDetail.doQuery(function(data) {
				layer.close(loading);
				g.updateDatas();
				g.countDats();
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		}
	}
	
	// 设置主列表数据
	methods_page.updateDatas = function() {
		var vs = consumeDetail.$rowSet.$views;
		if (vs.length == 0) {
			this.consumeDatas.splice(0, this.consumeDatas.length);
		} else {
			this.consumeDatas = vs;
		}
	};
	
	//计算消费统计信息
	methods_page.countDats = function() {
		var g = this;
		var consumeDatas = consumeDetail.$rowSet.$views;
		if(consumeDatas.length != 0) {
			var menuName = g.currentSelectMenuName == "" ? consumeDatas[0].consume_menu_name : g.currentSelectMenuName;
			var all = 0;
			var allName = "总";
			var obj = pageVue.consumeParams;
			consumeStatistics.$queryUrl = "/api/common/selectList";
			consumeStatistics.statement = "PMS-CONSUME-010";
			consumeStatistics.set('consume_date_e', g.changeDateFormat(obj.consumeEDate));
			consumeStatistics.set('consume_date_s', g.changeDateFormat(obj.consumeSDate));
			consumeStatistics.set('consume_desc', obj.consumeDesc);
			consumeStatistics.set('consume_id', g.currentSelectMenuId);
			consumeStatistics.doQuery(function(data) {
				var out = 0, get = 0, getName = "收入", outName = "支出", outCount = 0, getCount = 0;
				if(data.dataStore.rows.length == 2) {
					out = data.dataStore.rows[0].consume_money;
					get = data.dataStore.rows[1].consume_money;
					outCount = data.dataStore.rows[0].consume_count;
					getCount = data.dataStore.rows[1].consume_count;
				} else if(data.dataStore.rows.length == 1) {
					if(data.dataStore.rows[0].consume_type == "收入") {
						get = data.dataStore.rows[0].consume_money;
						getCount = data.dataStore.rows[0].consume_count;
					} else if(data.dataStore.rows[0].consume_type == "支出") {
						out = data.dataStore.rows[0].consume_money;
						outCount = data.dataStore.rows[0].consume_count;
					}
				}
				g.consumeStatistics.splice(0, g.consumeStatistics.length);
				g.consumeStatistics.push({consume_menu_name:menuName,consume_money:round(get,2),consume_type:getName,consume_count:getCount});
				g.consumeStatistics.push({consume_menu_name:menuName,consume_money:round(out,2),consume_type:outName,consume_count:outCount});
				all = get - out;
				allName += all > 0 ? getName : outName;
				g.consumeStatistics.push({consume_menu_name:menuName,consume_money:round(Math.abs(all),2),consume_type:allName,consume_count:outCount+getCount});
				//g.currentSelectMenuName = "";
			}, function(data) {
				layer.alert(data.msg);
			});
			/*for(var i = 0; i < consumeDatas.length; i++) {
				if(consumeDatas[i].consume_type == outName) {
					out += consumeDatas[i].consume_money;
				}
				if(consumeDatas[i].consume_type == getName) {
					get += consumeDatas[i].consume_money;
				}
			}*/
		} else {
			g.consumeStatistics.splice(0, g.consumeStatistics.length);
		}
	}
	
	//删除消费记录
	methods_page.deleteRow = function(row) {
		var g = this;
		var tindex = layer.confirm('是否删除此条消费记录', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			consumeDetail.$queryUrl = "/api/common/selectList";
			consumeDetail.statement = "PMS-CONSUME-004";
			consumeDetail.set('cons_detail_id', row.cons_detail_id);
			consumeDetail.doQuery(function(data) {
				layer.close(loading);
				layer.msg("删除成功！");
				g.queryConsumeDatas();
			}, function(data) {
				layer.close(loading);
				layer.alert(data.msg);
			});
		});
	}
	
	//获得菜单列表和最后一层菜单（列表，不是树，用来做下拉列表）
	methods_page.getMenuList = function(consumeMenu) {
		for(var i = 0; i < consumeMenu.length; i++) {
			this.menuList.push(consumeMenu[i]);
			if(consumeMenu[i].$chinldrens != null) {
				this.getMenuList(consumeMenu[i].$chinldrens);
			} else {
				this.menuLastLevel.push(consumeMenu[i]);
			}
		}
	}
	
	//建树
	methods_page.initUserConsumeTree = function(consumeMenu) {
		this.menuTree = [{ title: '我的消费',loading: false,menu_id:null,expand : true,children: []}];
		for(var i = 0; i < consumeMenu.length; i++) {
			this.loadTree(consumeMenu[i], this.menuTree[0]);
		}
	}
	
	//递归遍历树
	methods_page.loadTree = function(data, menuTree) {
		const children = menuTree.children || [];
        children.push({
            title: data.consume_menu_name,
            menu_id: data.consume_id,
            menu_order : data.consume_menu_order,
            expand: true,
            children: []
        });
        this.$set(menuTree, 'children', children);
        if(data.$chinldrens != null) {
        	//对孩子进行排序
        	data.$chinldrens.sort(compare);
        	for(var i = 0; i < data.$chinldrens.length; i++) {
        		this.loadTree(data.$chinldrens[i], children[children.length-1])
        	}
        }
    
	}
	
	//打开修改菜单modal
	methods_page.editConsumeMenu = function() {
		this.consumeMenuModalEdit = true;
	}
	
	//关闭修改菜单modal
	methods_page.editConsumeMenuCancel = function() {
		this.queryMenuTree();
		this.$refs['dataMenuEditForm'].resetFields();
		this.consumeMenuModalEdit = false;
	}
	
	//修改菜单信息保存（暂时只有名字和顺序）
	methods_page.editConsumeMenuSave = function() {
		var g = this;
		var loading = layer.load();
		consume.doAction({
			statement : 'PMS-CONSUME-007',
			params : {
				consume_menu_name : g.currentMenuData.title,
				consume_menu_order : g.currentMenuData.menu_order,
				consume_id : g.currentMenuData.menu_id,
			}
		}, '/api/common/update', function(data) {
			layer.close(loading);
			layer.msg("修改成功！");
			g.queryMenuTree();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
		g.consumeMenuModalEdit = false;
	}
	
	//打开新增菜单modal
	methods_page.addConsumeMenu = function() {
		this.consumeMenuModal = true;
	}
	
	//关闭新增菜单modal
	methods_page.addConsumeMenuCancel = function() {
		this.$refs['dataMenuAddForm'].resetFields();
		this.consumeMenuModal = false;
	}
	
	//保存新增菜单modal
	methods_page.addConsumeMenuSave = function() {
		var g = this;
		g.$refs['dataMenuAddForm'].validate(function(valid) {
			if (valid) {
				for(var i = 0; i < g.menuList.length; i++) {
					if(g.menuList[i].consume_menu_name == g.consumeMenuData.menuName) {
						layer.msg("菜单名字已存在！请重新填写");
						return;
					}
				}
				var loading = layer.load();
				consume.doAction({
					statement : 'PMS-CONSUME-002',
					params : {
						consume_menu_name : g.consumeMenuData.menuName,
						consume_menu_order : g.consumeMenuData.menuOrder == "" ? null : g.consumeMenuData.menuOrder,
						consume_menu_pid : g.consumeMenuData.menuPid == "" ? 0 : g.consumeMenuData.menuPid,
						consume_menu_desc : g.consumeMenuData.menuDesc
					}
				}, '/api/common/insert', function(data) {
					layer.close(loading);
					layer.msg("菜单生成成功！");
					g.queryMenuTree();
					g.$refs['dataMenuAddForm'].resetFields();
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
				g.consumeMenuModal = false;
			} else {
				layer.msg('数据新增失败!');
			}
		});
	}

	//计算目录下消费记录的数目
	methods_page.queryDetailCount = function(root, node, nodeData) {
		var loading = layer.load();
		var g = this;
		consumeDetail.$queryUrl = "/api/common/selectList";
		consumeDetail.statement = "PMS-CONSUME-009";
		consumeDetail.set('consume_id', nodeData.menu_id);
		consumeDetail.doQuery(function(data) {
			if(data.dataStore.rows[0].count_consume_detail == 0) {
				g.removeConsumeMenu(root, node, nodeData);
			} else {
				layer.alert('消费菜单中有数据，不可删除！！！');
			}
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	//删除消费菜单
	methods_page.removeConsumeMenu = function(root, node, data) {
		//获得纯净菜单名字
		//var menu_name = /\*([\s\S]*)\*/.test(data.title) == true 
		//			? data.title.substring(2, data.title.length-2) : data.title;
		var menu_name = data.title;
		var tindex = layer.confirm('是否删除消费菜单[' + menu_name + ']', {
			btn : [ '是', '否' ]
		}, function() {
			var loading = layer.load();
			consume.doAction({
				statement : 'PMS-CONSUME-008',
				params : {
					consume_id : data.menu_id
				}
			}, '/api/common/delete', function(data) {
				layer.close(loading);
				layer.close(tindex);
				const parentKey = root.find(el => el === node).parent;
		        const parent = root.find(el => el.nodeKey === parentKey).node;
		        const index = parent.children.indexOf(data);
		        parent.children.splice(index, 1);
				layer.msg("成功删除");
			}, function(data) {
				layer.close(loading);
				layer.close(tindex);
				layer.alert(data.msg);
			});
		});
	}
	
	//打开新增消费明细modal
	methods_page.addConsumeDatas = function() {
		this.consumeAddData.consume_menu = this.currentSelectMenuId;
		this.consumeAddModal = true;
	}
	
	//关闭消费新增页面
	methods_page.addConsumeDetailCancel = function() {
		this.$refs['dataDetailAddForm'].resetFields();
		this.consumeAddModal = false;
	}
	
	//提交新增消费记录
	methods_page.addConsumeDetailSave =  function() {
		var g = this;
		g.$refs['dataDetailAddForm'].validate(function(valid) {
			if (valid) {
				g.currentSelectMenuId = g.consumeAddData.consume_menu;
				var loading = layer.load();
				consume.doAction({
					statement : 'PMS-CONSUME-005',
					params : {
						consume_money : g.consumeAddData.consume_money,
						consume_type : g.consumeAddData.consume_type,
						consume_way : g.consumeAddData.consume_way,
						consume_desc : g.consumeAddData.consume_desc,
						consume_id : g.consumeAddData.consume_menu,
						consume_time : g.consumeAddData.consume_time,
						consume_date : g.changeDateFormat(g.consumeAddData.consume_date)
					}
				}, '/api/common/insert', function(data) {
					layer.close(loading);
					layer.msg("新增数据成功");
					g.$refs['dataDetailAddForm'].resetFields();
					g.queryConsumeDatas();
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
				g.consumeAddModal = false;
			} else {
				layer.msg('数据新增失败!');
			}
		});
	}
	
	//打开修改消费明细modal
	methods_page.editRow = function(row) {
		this.consumeData = row
		this.consumeEditModal = true;
	}
	
	//关闭消费修改页面
	methods_page.editConsumeDetailCancel = function() {
		this.$refs['dataDetailEditForm'].resetFields();
		this.queryConsumeDatas();
		this.consumeEditModal = false;
	}
	
	//保存消费修改
	methods_page.editConsumeDetailSave = function() {
		var g = this;
		g.$refs['dataDetailEditForm'].validate(function(valid) {
			if (valid) {
				g.currentSelectMenuId = g.consumeData.consume_menu;
				var loading = layer.load();
				consume.doAction({
					statement : 'PMS-CONSUME-006',
					params : {
						cons_detail_id : g.consumeData.cons_detail_id,
						consume_money : g.consumeData.consume_money,
						consume_type : g.consumeData.consume_type,
						consume_way : g.consumeData.consume_way,
						consume_desc : g.consumeData.consume_desc,
						consume_id : g.consumeData.consume_menu,
						consume_time : g.consumeData.consume_time,
						consume_date : g.changeDateFormat(g.consumeData.consume_date)
					}
				}, '/api/common/update', function(data) {
					layer.close(loading);
					layer.msg("更新数据成功");
					g.$refs['dataDetailEditForm'].resetFields();
					g.queryConsumeDatas();
				}, function(data) {
					layer.close(loading);
					layer.alert(data.msg);
				});
				g.consumeEditModal = false;
			} else {
				layer.msg('数据修改失败!');
			}
		});
	}
	
	//打开消费明细页面modal
	methods_page.detailRow = function(row) {
		this.consumeData = row;
		this.consumeDetailModal = true;
	}
	
	//关闭消费明细页面
	methods_page.seeConsumeDetailCancel = function() {
		this.queryConsumeDatas();
		this.consumeDetailModal = false;
	}
	
	
	//树的样式
	methods_page.actionRender = function(h, { root, node, data }) {
		return h('a', {
            style: {
                display: 'inline-block',
                width: '100%'
            },
            on: {
                click: () => {
                	//如果不是点击当前菜单，就是点进去了别的菜单，页面重置1
                	if(this.currentSelectMenuName != data.title) {
                		page.setPageNumber(1);
                	}
                	this.currentSelectMenuName = data.title;
                	//nodeKey是节点的key，不是菜单的key
//                	if(data.nodeKey != 0) {
//                		data.title = "* " + data.title + " *";
//                	}
//                	if (this.currentSelectMenuKey != "") {
//                		var preTitle = root.find(el => el.nodeKey === this.currentSelectMenuKey).node.title;
//                		if(/\*([\s\S]*)\*/.test(preTitle)) {
//                			root.find(el => el.nodeKey === this.currentSelectMenuKey).node.title = preTitle.substring(2, preTitle.length-2);
//                		}
//                	}
                	this.currentSelectMenuKey = data.nodeKey;
                	this.currentSelectMenuId = data.menu_id == null ? 0 : data.menu_id;
                	this.queryConsumeDatas();
                },
                dblclick: () => {
                	if(data.nodeKey != 0) {
                		this.currentMenuData = data;
                		this.editConsumeMenu()
                		
                		/*单独修改名字的（已废弃）
                		var oldTile = data.title;
                    	data.title = prompt("请编辑菜单名字", data.title);
                    	if (data.title != null && data.title != "") {
                    		this.editConsumeName(data.title, data.menu_id)
                    	} else if (data.title == "") {
                    		alert('菜单名字不能为空！');
                    		data.title = oldTile;
                    	} else {
                    		data.title = oldTile;
                    	}*/
                	}
                }
            }
        }, [
            h('span', [
                h('Icon', {
                    props: {
                        type: 'ios-paper-outline'
                    },
                    style: {
                        marginRight: '8px'
                    }
                }),
                h('span', data.title),
            ]),
            h('span', {
                style: {
                    display: 'inline-block',
                    float: 'right',
                    marginRight: '17px'
                }
            }, [
            	h('Button', {
                    props: Object.assign({}, this.buttonProps, {
                        icon: 'ios-minus-empty',
                        size : 'small'
                    }),
                    on: {
                        click: () => { this.queryDetailCount(root, node, data) }
                    }
                })
            ])
            
        ])
	}
	
	
	//转化日期格式
	methods_page.changeDateFormat = function(value) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		if(value != null && value != ""){
			if(value.toString().match(reg) == null) {
				return value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate();
			} 
		} else if (value == "") {
			return null;
		}
	}
	
	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryConsumeDatas();
		}
	}
	
	// 改变页大小(暂不使用)
	//<!--  @on-page-size-change="handleSizeChange" show-sizer -->
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryConsumeDatas();
		}
	}
	
	// 角色状态格式化(表格)
	methods_page.stsFormat = function(dic, row, col) {
		var m = this.dicMaps[dic]
		if (m) {
			return m[row[col]];
		}
		return row.user_state;
	};
	
	// 角色状态格式化(页面)
	methods_page.stsFormatDetail = function(col) {
		var m = this.dicMaps['pms_consume_time'];
		if (typeof(col) !="undefined" && m[col] != null && m[col] != "") {
			return m[col];
		}
		return "";
	};
	
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
	
	// 表格内行操作
	function consumeAction(h, row, column, index) {
		var arr = [];
		arr.push(initBtn(h, "详情", "clipboard", function() {
			pageVue.detailRow(row);
		}));
		arr.push(initBtn(h, "编辑", "edit", function() {
			pageVue.editRow(row);
		}));
		arr.push(initBtn(h, "删除", "android-delete", function() {
			pageVue.deleteRow(row);
		}));
		return h('button-group', {
			attrs : {size : 'small'}
		}, arr);
	}
	
	// 初始化按钮
	function initBtn(h, title, icon, click) {
		var ele = h('i-button', {
			attrs : {
				type : 'text',
				icon : icon,
				title : title
			},
			on : {
				click : click
			}
		});
		return ele;
	}
	
	//保留N位小数
	function round(v,e){
		var t=1;
		for(;e>0;t*=10,e--);
		for(;e<0;t/=10,e++);
		return Math.round(v*t)/t;
	}

	var pageVue = new Vue(page_conf);
	

});