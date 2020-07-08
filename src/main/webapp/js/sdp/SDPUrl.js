/**
 * 地址
 * 
 * @文件名 SDPUrl
 * @作者 李浩祺
 * @创建日期 2017-04-18
 * @版本 V 1.0
 */
"use strict";
$(function() {
	window.SDP = $.SDP = $.SDP || {};

	var curUrls = window.location.pathname.split("/");
	var pageUrl = curUrls[0];
	var root = curUrls[1];

	var baseURL = getBasePath();

	function getBasePath() {
		return pageUrl + "/" + root;
	}

	function getUrlVars() {
		var vars = {}, hash;
		var u = window.location.href;
		var i = u.indexOf("?");
		if (i > 0) {
			var hashes = u.slice(i + 1).split('&');
			var v;
			$(hashes).each(function(index, itm) {
				hash = itm.split('=');
				if (hash && hash.length > 0) {
					v = hash[1];
					vars[hash[0]] = v;
				}
			});
		}
		return vars;
	}

	var vars = SDP.params = getUrlVars();

	SDP.URL = new (function() {
		this.getUrl = function(url) {
			if (url == null) {
				return null;
			}
			if (url.indexOf("/") == 0) {
				return baseURL + url;
			}
			return baseURL + "/" + url;
		};
		this.getSystemUrl = function(url, systemCode) {
			if (url == null) {
				return null;
			}
			if (url.indexOf("/") == 0) {
				return pageUrl + "/" + systemCode + url;
			}
			return pageUrl + "/" + systemCode + "/" + url;
		};
		this.getVar = function(name) {
			return vars[name];
		};
		this.getvars = function() {
			return vars;
		};
	});

	SDP.callback = (function() {
		console.debug("-----页面传入参数结束");
	});

	$.sendParams = function(ps) {
		for ( var n in ps) {
			SDP.params[n] = ps[n];
		}
		SDP.callback();
	}
});