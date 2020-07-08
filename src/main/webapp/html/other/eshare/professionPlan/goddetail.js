$(function() {
	// 数据字典
	var dicConf = [ 'sdp_esp_godtail' ];
	// 上下文
	// 角色数据
	var context = new SDP.SDPContext();
	var godtail= context.newDataStore("godtail");
	godtail.$queryUrl = "/api/common/selectList";
	godtail.statement = "SDP-God-001";//个人
	var project= context.newDataStore("project");
	project.$queryUrl = "/api/common/selectList";
	project.statement = "SDP-God-002";//项目	
	var page = project.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	var note= context.newDataStore("note");
	note.$queryUrl = "/api/common/selectList";
	note.statement = "SDP-God-003";//笔记
	var page = note.getPage();
	page.setPageNumber(1);
	page.setPageRowCount(5);
	var skillBar = context.newDataStore("skillBar");
	skillBar.$queryUrl = "/api/common/selectList";
	skillBar.statement = "SDP-BAR-001";
	var cols1 = [{
							title: '主要笔记',
							key: 'note_title'
					},
						{
							title: '点击数量',
							key: 'read_num'
						},
						{
							title: '笔记评分',
							key: 'score_num'
						},
						{
                        title: '笔记详情',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        type: 'render',
                        render: actionRender
                    }
                ];
	var data1 = [{
		note_title:'深入浅出Java',
		read_num: '600',
		score_num: '34'	
	}];
	
	var cols2 = [{	title: '项目规模(人/天)',
							key: 'proj_scale'
						},
						{
							title: '项目名称',
							key: 'proj_name'
						},
						{
							title: '项目职责',
							key: 'proj_major'
						},
						{
							
		                        title: '客户评价',
		                        key: 'remark',
		                       /* width: 150,
		                        align: 'center',
		                        type: 'render',
		                        render: projRender*/
		                    
	                    }
					];
	var data2 = [{
		proj_scale:'30人/天',
		proj_name: '小明',
		proj_major: '打酱油',
		remark:'非常感谢赛意团队'
		
	}];
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data: {
			    params: {
			    	user_id:''/*,	
		            name: '',
		            department: '',
		            mail: '',
		            self_remark:'',
		            posd_know:''*/           
		        },
		        datas: [],
		        godatas: [],
		        page : page,
				dicDatas : {},
				dicMaps : {},
				curRow : {},
                columns1: cols1,
                datas1:[],
                columns2: cols2, 
                datas2: [],
				value3: 'value4',
				value1: 'value2',
				value5: 'value6'
				}}		
	var methods_page = page_conf.methods = {};	
	page_conf.mounted = function() {
		// 查询角色数据
		this.$nextTick(function(){
			this.queryDatas();
		});	
	};

	// 初始化数据，
	methods_page.queryDatas = function() {
		pageVue.queryGod();
		pageVue.queryProject();
		pageVue.queryBarDatas();
    	pageVue.queryNotes();
    	pageVue.params.user_id = getUrlParam("user_id")
	};
	
	//查询个人信息
	methods_page.queryGod = function(){
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		godtail.doQuery(function(data) {
			layer.close(loading);
			g.updategodDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
		}
	
	// 设置数据
	methods_page.updategodDatas = function() {
		var vs = godtail.$rowSet.$views;
		if (vs.length == 0) {
			this.godatas.splice(0, this.godatas.length);
		} else {
			this.godatas = vs
		}
	};
	// 查看笔记数据
	methods_page.queryRow = function(note_id) {
		var url="../note_plan/noteDetail/noteDetail.html?uuid="+note_id;
		if(this.params.data_sort != null &&this.params.data_sort != ''){
			url=url+'&dataSort='+this.params.data_sort;
		}
		if(this.params.note_name != null&&this.params.note_name != ''){
			url=url+'&noteName='+this.params.note_name;
		}
		console.log(url);
		window.location.href=url;
	};
	// 查看笔记长度
	methods_page.noteLength = function(text) {
		if( text != null && text.length > 183){          /* 一行大概60个字,5行302*/
			return true;
		}
			return false;
	};
	// 查看笔记是否分享
	methods_page.ifShare = function(note_share) {
		if(note_share=="Y"){
			return true;
		}else{
			return false;
		}
	};
	methods_page.queryProject = function(){
		page.setPageNumber(1);
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		project.doQuery(function(data) {
			layer.close(loading);
			g.updateprojectDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};	
	// 设置数据
	methods_page.updateprojectDatas = function() {
		var vs = project.$rowSet.$views;
		if (vs.length == 0) {
			this.datas2.splice(0, this.datas2.length);
		} else {
			this.datas2 = vs;
		}
	};
	methods_page.queryNotes = function(){
		page.setPageNumber(1);
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		note.doQuery(function(data) {
			layer.close(loading);
			g.updatenoteDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	// 编辑角色数据
	methods_page.editRow = function(row) {
		this.curRow = row;
		var path=row.path;
		window.open("http://www.cnblogs.com/wangfupeng1988/p/3988422.html"); 
		this.dataEdit = true;		
	};
	
	// 设置数据
	methods_page.updatenoteDatas = function() {
		var vs = note.$rowSet.$views;
		if (vs.length == 0) {
			this.datas1.splice(0, this.datas.length);
		} else {
			this.datas1= vs;
			console.log(this.datas1);
		}
	};
	// 改变当前页号
	methods_page.handleCurrentChange = function(val) {
		page.setPageNumber(val);
		if (page.getIsChange()) {
			this.queryProject();
		}
	};
	// 改变页大小
	methods_page.handleSizeChange = function(val) {
		page.setPageRowCount(val);
		if (page.getIsChange()) {
			this.queryProject();
		}
	};
	
	//加载个人能力柱状图
	methods_page.updateskillDatas = function() {
		var vs = skillBar.$rowSet.$views;
		if (vs.length == 0) {
			this.datas.splice(0, this.datas.length);
		} else {
			this.datas= vs;
				var dataList = this.datas;
				var dataName = new Array();
				var dataNum = new Array();
				for(var i in dataList){
					dataName[i] = dataList[i]["skillName"];
					dataNum[i] = dataList[i]["skillScore"];
				};
				var myChart = echarts.init(document.getElementById("bar"));
				var option = {
					
					tooltip: {
						trigger: 'item' //axis以X轴线触发,item以每一个数据项触发
					},
					legend: {
						data: ['个人技能']
					},
					dataZoom : {
				        show : true,
				        realtime : true,
				        y: 36,
				        height: 20,
				        start : 10,
				        end : 90
				    },

					xAxis: [{
						type: 'category',
						axisLabel: {
							interval: 0,
							rotate: -20
						},
						axisTick: { // 轴标记
							show: true,
							length: 10,
							lineStyle: {
								color: 'green',
								type: 'solid',
								width: 1
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: 'darkblue',
								type: 'dashed',
								width: 1
							}
						},
//						data: ['Java', 'AngulaJs', 'Android', 'Hadoop', 'OpenResty', '.Net', 'jquery easyUI', 'JavaScript', 'mySql', 'Oracle', 'redis', 'ActiveMQ']
						data : dataName
					}],
					yAxis: [{
						type: 'value',
						axisLabel: {
							formatter: '{value}'
						},
						axisLine: { // 轴线
							show: true,
							lineStyle: {
								color: 'purple',
								type: 'dashed',
								width: 2
							}
						},
						splitLine: {
							show: true,
							lineStyle: {
								color: '#483d8b',
								type: 'dotted',
								width: 2
							}
						},
					}],
					series: [{
							name: '个人技能',
							type: 'bar',
							barWidth:20,
//							data: [2.0, 3.0, 3.0, 1.0, 1.2, 0.5, 2.0, 2.0, 3.0, 2.0, 1.5, 2.3],
							data : dataNum,
							itemStyle:{normal:{color:'#00CCFF'}},
							markPoint: {
								data: [{
										type: 'max',
										name: '评分最大值'
									},
									{
										type: 'min',
										name: '评分最小值'
									}
								]
							},
							markLine: {
								data: [{
									type: 'average',
									name: '个人平均值'
								}]
							}
						}
					]
				};
				myChart.setOption(option); 
			}		
	};
	methods_page.queryBarDatas = function(){
		var obj = pageVue.params;
		context.clearParam();
		context.put(obj);
		var loading = layer.load();
		var g = this;
		skillBar.doQuery(function(data) {
			layer.close(loading);
			g.updateskillDatas();
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	};
	
	var pageVue = new Vue(page_conf);
	function getUrlParam(name){
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null)
			return unescape(r[2]);
		return null;
	}
  
	// 笔记按钮操作
	function actionRender(h, row, column, index) {
		var arr = [];
		debugger;
		arr.push(initBtn(h, "查看", "fa fa-edit", function() {
			pageVue.editRow(row);
		}));
		
		return h('button-group', {
		attrs : {
				size : 'small'
			}
		}, arr);
	};
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
	};
	// 初始化数据字典
	SDP.DIC.initDatas(dicConf, function(data) {
		pageVue.dicDatas = data.data;
		pageVue.dicMaps = data.map;
	});
});
	
	
