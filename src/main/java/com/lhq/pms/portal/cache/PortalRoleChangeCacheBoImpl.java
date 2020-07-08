package com.lhq.pms.portal.cache;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.lhq.pms.common.bo.CommonBo;
import com.lhq.pms.sys.bo.impl.BaseSqlCodeChangCacheeBoImpl;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public class PortalRoleChangeCacheBoImpl extends BaseSqlCodeChangCacheeBoImpl {

	@Resource(name = "commonBo")
	private CommonBo commonBo;

	/**
	 * 新增
	 * 
	 * @param sqlCode
	 * @param data
	 */
	@SuppressWarnings("unchecked")
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
			Map<String, List<Map<String, Object>>> map = initRows(rs, true);
			for (Map.Entry<String, List<Map<String, Object>>> entry : map.entrySet()) {
				addRows(entry.getKey(), entry.getValue());
			}
		}
	}

	/**
	 * 批量
	 * 
	 * @param dicCode
	 * @param datas
	 */
	@SuppressWarnings("unchecked")
	private void addRows(String roleCode, List<Map<String, Object>> datas) {
		Map<String, Object> userDatas = (Map<String, Object>) cache.get(roleCode);
		List<Map<String, Object>> items = new ArrayList<Map<String, Object>>(20);
		int no = 1;
		for (Map<String, Object> r : datas) {
			Map<String, Object> m = new HashMap<String, Object>(8);
			m.put("win_title", r.get("win_title"));
			m.put("win_icon", r.get("win_icon"));
			m.put("col_span", r.get("col_span"));
			m.put("row_span", r.get("row_span"));
			m.put("win_url", r.get("win_url"));
			m.put("system_code", r.get("system_code"));
			m.put("win_code", r.get("win_code"));
			m.put("win_name", r.get("win_name"));
			m.put("line_no", no++);
			m.put("is_show", r.get("is_show"));
			items.add(m);
		}
		List<Object> users = (List<Object>) this.commonBo.selectList("SDP-USER-015", roleCode);
		if (userDatas == null) {
			if (users == null || users.size() <= 0) {
				return;
			}

			userDatas = new HashMap<String, Object>(50);

			for (Object tmp : users) {
				String user = (String) tmp;
				userDatas.put(user, items);
			}
		} else {
			for (Object tmp : users) {
				String user = (String) tmp;
				List<Map<String, Object>> m = (List<Map<String, Object>>) userDatas.get(user);
				if (m == null) {
					userDatas.put(user, items);
				} else {
					m.addAll(items);
				}
			}
		}

		cache.update(roleCode, userDatas);
	}

	/**
	 * 数据分类
	 * 
	 * @param rows
	 * @param b
	 *            true 需要初始化从当前数据库，false不需要
	 * @return
	 */
	protected Map<String, List<Map<String, Object>>> initRows(List<Map<String, Object>> rows, boolean b) {
		Map<String, List<Map<String, Object>>> map = new HashMap<String, List<Map<String, Object>>>(10);
		List<String> codes = new ArrayList<String>(10);
		for (Map<String, Object> m : rows) {
			String roleCode = (String) m.get("role_code");
			List<Map<String, Object>> ls = map.get(roleCode);
			if (ls == null) {
				ls = new ArrayList<Map<String, Object>>(10);
				map.put(roleCode, ls);
			}
			codes.add((String) m.get("win_code"));
			ls.add(m);
		}
		if (b) {
			initRowsInfo(rows, codes);
		}
		return map;
	}

	/**
	 * 初始化窗体信息
	 * 
	 * @param rows
	 * @param codes
	 */
	protected void initRowsInfo(List<Map<String, Object>> rows, List<String> codes) {
		List<Map<String, Object>> datas = this.commonBo.selectList("SDP-PORTAL-WIN-011", codes);
		for (Map<String, Object> map : datas) {
			String wCode = (String) map.get("win_code");
			for (Map<String, Object> tmp : rows) {
				if (wCode.equals((String) tmp.get("win_code"))) {
					tmp.put("win_title", map.get("win_title"));
					tmp.put("win_icon", map.get("win_icon"));
					tmp.put("col_span", map.get("col_span"));
					tmp.put("row_span", map.get("row_span"));
					tmp.put("win_url", map.get("win_url"));
					tmp.put("is_show", "Y");
					tmp.put("system_code", map.get("system_code"));
				}
				break;
			}
		}
	}

	/**
	 * 删除
	 * 
	 * @param sqlCode
	 * @param data
	 */
	@SuppressWarnings("unchecked")
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
			Map<String, List<Map<String, Object>>> map = initRows(rs, false);
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
	private void removeRows(String sqlCode, String roleCode, List<Map<String, Object>> datas) {
		Map<String, List<Map<String, Object>>> userDatas = (Map<String, List<Map<String, Object>>>) cache.get(roleCode);
		for (Map.Entry<String, List<Map<String, Object>>> entry : userDatas.entrySet()) {
			List<Map<String, Object>> items = entry.getValue();
			for (Map<String, Object> m : datas) {
				String winCode = (String) m.get("win_code");
				for (int index = 0, len = items.size(); index < len;) {
					Map<String, Object> itm = items.get(index);
					if (winCode.equals(itm.get("win_code"))) {
						items.remove(itm);
						break;
					} else {
						index++;
					}
				}
			}
		}

		cache.update(roleCode, userDatas);
	}

	/**
	 * 更新
	 * 
	 * @param sqlCode
	 * @param data
	 */
	@SuppressWarnings("unchecked")
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
			Map<String, List<Map<String, Object>>> map = initRows(rs, false);
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
	private void updateRows(String roleCode, List<Map<String, Object>> datas) {
		Map<String, List<Map<String, Object>>> userDatas = (Map<String, List<Map<String, Object>>>) cache.get(roleCode);
		if (userDatas == null) {
			return;
		}

		for (Map.Entry<String, List<Map<String, Object>>> entry : userDatas.entrySet()) {
			List<Map<String, Object>> items = entry.getValue();
			for (Map<String, Object> r : datas) {
				String tmp = (String) r.get("win_code");
				for (Map<String, Object> itm : items) {
					if (tmp.equals(itm.get("win_code"))) {
						Integer lineNo = (Integer) r.get("line_no");
						if (lineNo != null) {
							itm.put("line_no", lineNo);
						}
						String title = (String) r.get("win_title");
						if (title != null) {
							itm.put("win_title", title);
						}
						String icon = (String) r.get("win_icon");
						if (icon != null) {
							itm.put("win_icon", icon);
						}
						Integer colSpan = (Integer) r.get("col_span");
						if (colSpan != null) {
							itm.put("col_span", colSpan);
						}
						Integer rowSpan = (Integer) r.get("row_span");
						if (rowSpan != null) {
							itm.put("row_span", rowSpan);
						}
						String url = (String) r.get("win_url");
						if (url != null) {
							itm.put("win_url", url);
						}
						String system = (String) r.get("system_code");
						if (system != null) {
							itm.put("system_code", system);
						}
						String show = (String) r.get("is_show");
						if (show != null) {
							itm.put("is_show", show);
						}
						break;
					}
				}
			}
		}
		cache.update(roleCode, userDatas);
	}
}
