/**
 * 分页脚本
 * 
 * @文件名 page.js
 * @作者 李浩祺
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	SDP.ds.Page = function(ds) {
		var pageNumber = 1;// 当前页
		var pageSize = 0;// 总页数

		var pageRowCount = 10;// 每页行数
		var dataStore = ds;
		var isChange = false;// 是否变化

		this.totalCount = 0;// 总行数

		this.getIsChange = function() {
			return isChange;
		};
		this.resetIsChange = function() {
			isChange = false;
		};
		this.getPageNumber = function() {
			return pageNumber;
		};
		this.setPageNumber = function(val) {
			if (val > 0 && pageNumber != val) {
				pageNumber = val;
				if (pageNumber > pageSize) {
					pageNumber = pageSize;
				} else if (pageNumber < 1) {
					pageNumber = 1;
				}
				isChange = true;
			}
		};
		this.getDataStore = function() {
			return dataStore;
		};
		this.setPageSize = function(val) {
			if (val >= 0 && pageSize != val) {
				pageSize = val;
			}
		};
		this.getPageSize = function() {
			return pageSize;
		};
		this.setTotal = function(val) {
			if (val >= 0) {
				this.totalCount = val;
				var p = (this.totalCount / pageRowCount) * 1.0;
				var i = p * 10;
				var j = parseInt(p) * 10;
				p = (i > j ? j + 10 : j) / 10;
				this.setPageSize(p);
			} else {
				pageSize = 0;
				this.totalCount = 0;
			}
		};
		this.getPageRowCount = function() {
			return pageRowCount;
		};
		this.setPageRowCount = function(val) {
			if (val > 0 && pageRowCount != val) {
				pageRowCount = val;
				this.setPageNumber(1);
				isChange = true;
			}
		};
		this.$initData = function(obj) {
			if ("total" in obj) {
				this.setTotal(obj["total"]);
			}
		};

		this.toObject = function() {
			return {
				startRow : pageRowCount * (pageNumber - 1),
				endRow : pageRowCount
			};
		};
	};
});