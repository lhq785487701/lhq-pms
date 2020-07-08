"use strict";
$(function() {
	
	var layout = new SDP.SDPContext();
	
	var layoutData = layout.newDataStore("layoutData");
	
	var openFloors = {};// 已打开楼层
	
	// 头部配置
	var page_conf = {
		el : "#mainContainer",
		data : {
			floor : [],
			floorTabs : [],
			headerName : '楼层',
			curFloor : {}
		}
	};
	
	var methods_page = page_conf.methods = {};

	// 初始化查询
	page_conf.mounted = function() {
		this.$nextTick(function(){
			this.queryLayoutData();
		});	
	};
	
	//选择楼层
	methods_page.floorSelect = function(level) {
		level -= 1;
		var item = openFloors[level];
		if (item == null) {
			item = this.floor[level];
			openFloors[level] = item;
			this.floorTabs.push(item);
		}
		this.curFloor = item.level;
	};
	
	// 移除tab页
	methods_page.removeTab = function(level) {
		level -= 1;
		var item = openFloors[level];
		if (item == null) {
			return;
		}
		var i = this.floorTabs.indexOf(item);
		this.floorTabs.splice(i, 1);
		var itm, len = this.floorTabs.length;
		if (len > 0) {
			if (len <= i) {
				itm = this.floorTabs[len - 1];
			} else {
				itm = this.floorTabs[i];
			}
			this.curFloor = itm.level;
		}

		delete openFloors[level];
	};
	
	//查询楼层信息
	methods_page.queryLayoutData = function(level) {
		var g = this;
		var loading = layer.load();
		layoutData.$queryUrl = "/api/common/selectList";
		layoutData.statement = "PMS-FINDROUTE-001";
		layoutData.set('level', level);
		layoutData.doQuery(function(data) {
			g.getFloorData(data.dataStore.rows);
			layer.close(loading);
		}, function(data) {
			layer.close(loading);
			layer.alert(data.msg);
		});
	}
	
	//获得每一楼层的数据
	methods_page.getFloorData = function(arr) {
		var g = this
		var map = {};
		for(var i = 0; i < arr.length; i++){
		    var ai = arr[i];
		    if(!map[ai.level]){
		        g.floor.push({
		            level: ai.level,
		            name : ai.level + '楼',
		            url : "floorLayout.html?level=" + ai.level,
		            data: [ai]
		        });
		        map[ai.level] = ai;
		    }else{
		        for(var j = 0; j < g.floor.length; j++){
		            var dj = g.floor[j];
		            if(dj.level == ai.level){
		                dj.data.push(ai);
		                break;
		            }
		        }
		    }
		}
	}
	
	var pageVue = new Vue(page_conf);
});