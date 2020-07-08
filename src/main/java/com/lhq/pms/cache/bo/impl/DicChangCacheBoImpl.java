package com.lhq.pms.cache.bo.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lhq.pms.sys.bo.impl.BaseSqlCodeChangCacheeBoImpl;

/**
 * 字典数据更新 需要更新缓存中字典数据
 * 
 * @author lhq
 *
 */
public class DicChangCacheBoImpl extends BaseSqlCodeChangCacheeBoImpl {

	private static final String DIC_MAIN_DEL = "SDP-DIC-012";

	/**
	 * 新增
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "unchecked" })
	@Override
	protected void doAdd(String sqlCode, Object data) {
		List<Map<String, Object>> rs = null;
		if (data instanceof Map) {
			Map<String, Object> m = (Map<String, Object>) data;
			rs = new ArrayList<Map<String, Object>>(1);
			rs.add(m);
		} else if (data instanceof List) {
			rs = (List<Map<String, Object>>) data;
		}
		if (rs != null) {
			Map<String, List<Map<String, Object>>> map = initRows(rs);
			for (Map.Entry<String, List<Map<String, Object>>> entry : map.entrySet()) {
				addRows(entry.getKey(), entry.getValue());
			}
		}
	}

	/**
	 * 批量新增行
	 * 
	 * @param dicCode
	 * @param datas
	 */
	@SuppressWarnings({ "unchecked" })
	private void addRows(String dicCode, List<Map<String, Object>> datas) {
		List<Map<String, Object>> items = (List<Map<String, Object>>) cache.get(dicCode);
		if (items == null) {
			items = new ArrayList<Map<String, Object>>(10);
			for (Map<String, Object> r : datas) {
				Map<String, Object> m = new HashMap<String, Object>(2);
				m.put("dic_value", r.get("dic_value"));
				m.put("dic_label", r.get("dic_label"));
				items.add(m);
			}
			cache.put(dicCode, items);
		} else {
			for (Map<String, Object> r : datas) {
				Map<String, Object> m = new HashMap<String, Object>(2);
				m.put("dic_value", r.get("dic_value"));
				m.put("dic_label", r.get("dic_label"));
				items.add(m);
			}
			cache.update(dicCode, items);
		}
	}

	/**
	 * 修改
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "unchecked" })
	@Override
	protected void doUpdate(String sqlCode, Object data) {
		List<Map<String, Object>> rs = null;
		if (data instanceof Map) {
			Map<String, Object> m = (Map<String, Object>) data;
			rs = new ArrayList<Map<String, Object>>(1);
			rs.add(m);
		} else if (data instanceof List) {
			rs = (List<Map<String, Object>>) data;
		}
		if (rs != null) {
			Map<String, List<Map<String, Object>>> map = initRows(rs);
			for (Map.Entry<String, List<Map<String, Object>>> entry : map.entrySet()) {
				updateRows(entry.getKey(), entry.getValue());
			}
		}
	}

	/**
	 * 批量修改行
	 * 
	 * @param dicCode
	 * @param datas
	 */
	@SuppressWarnings({ "unchecked" })
	private void updateRows(String dicCode, List<Map<String, Object>> datas) {
		List<Map<String, Object>> items = (List<Map<String, Object>>) cache.get(dicCode);
		for (Map<String, Object> r : datas) {
			String tmp = (String) r.get("dic_value");
			for (Map<String, Object> itm : items) {
				if (tmp.equals(itm.get("dic_value"))) {
					itm.put("dic_label", r.get("dic_label"));
					break;
				}
			}
		}

		cache.update(dicCode, items);
	}

	/**
	 * 删除
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "unchecked" })
	@Override
	protected void doDelete(String sqlCode, Object data) {
		List<Map<String, Object>> rs = null;
		if (data instanceof Map) {
			Map<String, Object> m = (Map<String, Object>) data;
			rs = new ArrayList<Map<String, Object>>(1);
			rs.add(m);
		} else if (data instanceof List) {
			rs = (List<Map<String, Object>>) data;
		}
		if (rs != null) {
			Map<String, List<Map<String, Object>>> map = initRows(rs);
			for (Map.Entry<String, List<Map<String, Object>>> entry : map.entrySet()) {
				removeRows(sqlCode, entry.getKey(), entry.getValue());
			}
		}
	}

	/**
	 * 批量删除数据
	 * 
	 * @param sqlCode
	 * @param m
	 */
	@SuppressWarnings("unchecked")
	private void removeRows(String sqlCode, String dicCode, List<Map<String, Object>> datas) {
		if (DIC_MAIN_DEL.equals(sqlCode)) {
			cache.remove(dicCode);
		} else {
			List<Map<String, Object>> items = (List<Map<String, Object>>) cache.get(dicCode);
			for (Map<String, Object> m : datas) {
				String dicValue = (String) m.get("dic_value");
				for (int index = 0, len = items.size(); index < len;) {
					Map<String, Object> itm = items.get(index);
					if (dicValue.equals(itm.get("dic_value"))) {
						items.remove(itm);
						break;
					} else {
						index++;
					}
				}
			}

			cache.update(dicCode, items);
		}
	}

	/**
	 * 数据分类
	 * 
	 * @param rows
	 * @return
	 */
	protected Map<String, List<Map<String, Object>>> initRows(List<Map<String, Object>> rows) {
		Map<String, List<Map<String, Object>>> map = new HashMap<String, List<Map<String, Object>>>(10);
		for (Map<String, Object> m : rows) {
			String dicCode = (String) m.get("dic_code");
			List<Map<String, Object>> ls = map.get(dicCode);
			if (ls == null) {
				ls = new ArrayList<Map<String, Object>>(10);
				map.put(dicCode, ls);
			}
			ls.add(m);
		}
		return map;
	}
}
