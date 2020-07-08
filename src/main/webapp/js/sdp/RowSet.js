/**
 * 数据集脚本
 * 
 * @文件名 rowSet.js
 * @作者 李浩祺
 * @创建日期 2017-04-29
 * @版本 V 1.0
 */
"use strict";
$(function() {
	SDP.ds.RowSet = function(ds) {
		var $dataStore = ds;
		var $rows = [];
		var $count = 0;

		this.$views = [];

		this.$initData = function() {
			$rows.length = 0;
			this.$views.length = 0;
		};

		this.getRows = function() {
			return $rows;
		};
		this.getDataStore = function() {
			return $dataStore;
		};
		this.getIndex = function(r) {
			return $.inArray(r, this.$views);
		};
		this.getRowByIndex = function($index) {
			if ($rows.length == 0) {
				return null;
			}
			var r = null;
			$($rows).each(function(i, item) {
				if (item.$index == $index) {
					r = item;
					return false;
				}
			});

			return r;
		};
		this.getRowByPIndex = function($pInex) {
			if ($rows.length == 0) {
				return null;
			}
			var r = [];
			$($rows).each(function(i, item) {
				if (item.$pindex == $pInex) {
					r.push(item);
				}
			});
			return r;
		};
		this.getViewRowByPIndex = function($pInex) {
			if (this.$views.length == 0) {
				return null;
			}
			var r = [];
			$(this.$views).each(function(i, item) {
				if (item.$pindex == $pInex) {
					r.push(item);
				}
			});
			return r;
		};
		this.getRecordCount = function() {
			return $rows.length;
		};
		this.getViewCount = function() {
			return this.$views.length;
		};
		this.isModified = function() {
			var modified = false;
			$($rows).each(function(index, item) {
				if (item.$state != SDP.ds.Status.NONE) {
					modified = true;
					return false;
				}
			});

			return modified;
		};
		this.isState = function(state) {
			var b = false;
			$($rows).each(function(index, item) {
				if (item.$state == state) {
					b = true;
					return false;
				}
			});
			return b;
		};
		this.getStateViewRows = function(state) {
			var r = [];
			$(this.$views).each(function(index, item) {
				if (item.$state == state) {
					r.push(item);
				}
			});
			return r;
		};
		this.isChange = function() {
			var b = false;
			$($rows).each(
					function(index, item) {
						if (item.$state == SDP.ds.Status.UPDATE
								|| item.$state == SDP.ds.Status.NEW
								|| item.$state == SDP.ds.Status.DELETE) {
							b = true;
							return false;
						}
					});
			return b;
		};

		this.$loadData = function(data, pindex) {
			this.clear();
			var g = this;
			$count = 0;
			if (pindex >= 0) {

			} else {
				pindex = -1;
			}
			if (data && data.length > 0) {
				$(data).each(function(index, item) {
					if (item == null) {
						return;
					}
					$count++;
					var r = new SDP.ds.Row($count, g);
					r.$pindex = pindex;
					r.$loadData(item);
					$rows.push(r);

					if (r.$state == SDP.ds.Status.DELETE) {
						return;
					}
					g.$views.push(r);
				});
			}
		};

		this.newRow = function(index, defaultVal) {
			$count++;
			index = (isNaN(index) ? -1 : (index < 0 ? 0 : index));

			var r = new SDP.ds.Row($count, this);
			r.setRowStatus(SDP.ds.Status.NEW);
			if (defaultVal) {
				for ( var attr in defaultVal) {
					r[attr] = defaultVal[attr];
				}
			}
			$rows.push(r);
			if (index >= this.$views.length || index < 0) {
				this.$views.push(r);
			} else {
				this.$views.splice(index, 0, r);
			}

			return r;
		};

		this.addRow = function(r) {
			if (r == null) {
				return;
			}
			var index = $.inArray(r, this.$rows);
			if (index >= 0) {
				return;
			}
			$count++;
			$rows.push(r);
			this.$views.push(r);
			r.$index = $count;
		};

		this.delRow = function(r) {
			if (r) {
				var cls = $dataStore.getChildDS();
				if (cls != null) {
					$(cls).each(function(index, itm) {
						var rss = itm.$rowSet.getRowByPIndex(r.$index);
						if (rss != null && rss.length > 0) {
							itm.delRows(rss);
						}
					});
				}
				var index = $.inArray(r, this.$views);
				if (index >= 0) {
					this.$views.splice(index, 1);
				}
				if (r.$state == SDP.ds.Status.NEW) {
					index = $.inArray(r, $rows);
					if (index >= 0) {
						$rows.splice(index, 1);
					}
				} else {
					r.setRowStatus(SDP.ds.Status.DELETE);
				}
			}
		};

		this.freshDelRow = function(r) {
			var index = $.inArray(r, this.$views);
			if (index >= 0) {
				this.$views.splice(index, 1);
			}
			index = $.inArray(r, $rows);
			if (index >= 0) {
				$rows.splice(index, 1);
			}
		};

		this.delRows = function(rs) {
			if (rs && rs.length <= 0) {
				return;
			}
			var g = this;
			$(rs).each(function(index, r) {
				g.delRow(r);
			});
		};

		this.freshDelRows = function(rs) {
			if (rs && rs.length <= 0) {
				return;
			}
			var g = this;
			$(rs).each(function(index, r) {
				var rr = g.getRowByIndex(r.$index);
				if (rr != null) {
					g.freshDelRow(rr);
				}
			});
		};

		this.parent = function() {
			return $dataStore;
		};

		this.clear = function() {
			if ($rows != null) {
				$($rows).each(function(index, item) {
					item.clear();
				});
				$rows.length = 0;
				this.$views.length = 0;
			}
		};
		this.isEmpty = function() {
			return 0 == $rows.length;
		};

		this.findByValue = function(fld, val) {
			var itm = null;
			$($rows).each(function(index, item) {
				if (item[fld] == val) {
					itm = item;
					return false;
				}
			});
			return itm;
		};

		this.findViewByValue = function(fld, val) {
			var itm = this.findViewsByValue(fld, val);
			return itm.length > 0 ? itm[0] : null;
		};

		this.findViewsByValue = function(fld, val) {
			var itm = [];
			$(this.$views).each(function(index, item) {
				if (item[fld] == val) {
					itm.push(item);
				}
			});
			return itm;
		};

		this.findRows = function(fld, vals) {
			var itm = [];
			vals = $.isArray(vals) ? vals : [ vals ];
			$(this.$views).each(function(index, item) {
				if ($.inArray(item[fld] + '', vals) >= 0) {
					itm.push(item);
				}
			});
			return itm;
		}

		this.findByMaxValue = function(fld) {
			if ($rows.length <= 0) {
				return 0;
			}
			var rs = $rows.sort(function(a, b) {
				var i = (fld in a) ? a[fld] : 0;
				var j = (fld in b) ? b[fld] : 0;
				return i - j;
			});

			var r = rs[rs.length - 1];
			if (fld in r) {
				return r[fld];
			}

			return 0;
		};

		this.fresh = function(rs) {
			if (rs == null) {
				return;
			}
			var g = this;
			$(rs).each(function(index, item) {
				var r = g.getRowByIndex(item.$index);
				if (r != null) {
					r.fresh(item);
				}
			});
		};

		this.freshSave = function(rs) {
			var g = this;
			$(rs).each(function(index, item) {
				var r = g.getRowByIndex(item.$index);
				if (r != null) {
					if (r.$state == SDP.ds.Status.NONE) {

					} else if (r.$state == SDP.ds.Status.DELETE) {
						g.freshDelRow(r);
					} else {
						r.fresh(item);
					}
				}
			});
		};

		this.$apply = function() {
			$($rows).each(function(index, item) {
				if (item.$state == SDP.ds.Status.NONE) {
					item.$apply();
				}
			});
		};

		this.toObject = function(type) {
			var body = [];
			$($rows).each(
					function(index, item) {
						if (type == 'save') {
							if (item.$state == SDP.ds.Status.NONE) {
								item.$apply();
							}
							body.push(item);
						} else if (type == "update") {
							if (item.$state == SDP.ds.Status.NONE) {
								item.$apply();
							}
							if (item.$state == SDP.ds.Status.NEW
									|| item.$state == SDP.ds.Status.UPDATE
									|| item.$state == SDP.ds.Status.DELETE) {
								body.push(item);
							}
						} else if (type == "insert") {
							if (item.$state == SDP.ds.Status.NEW) {
								body.push(item);
							}
						} else if (type == "delete") {
							if (item.$state == SDP.ds.Status.DELETE) {
								body.push(item);
							}
						}
					});
			return body;
		};
	};
});