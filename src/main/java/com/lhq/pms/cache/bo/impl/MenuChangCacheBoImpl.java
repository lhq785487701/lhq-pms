package com.lhq.pms.cache.bo.impl;

import java.util.List;
import java.util.Map;

import com.lhq.pms.sys.bo.impl.BaseSqlCodeChangCacheeBoImpl;

/**
 * 菜单数据更新 需要更新缓存中菜单数据
 * 
 * @author lhq
 *s
 */
public class MenuChangCacheBoImpl extends BaseSqlCodeChangCacheeBoImpl {

	/**
	 * 新增
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void doAdd(String sqlCode, Object data) {
		if (data instanceof List) {
			List<Map> rs = (List<Map>) data;
			for (Map m : rs) {
				cache.put((String) m.get("menu_code"), (String) m.get("menu_name"));
			}
		} else if (data instanceof Map) {
			Map m = (Map) data;
			cache.put((String) m.get("menu_code"), (String) m.get("menu_name"));
		}
	}

	/**
	 * 修改
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void doUpdate(String sqlCode, Object data) {
		if (data instanceof List) {
			List<Map> rs = (List<Map>) data;
			for (Map m : rs) {
				cache.update((String) m.get("menu_code"), (String) m.get("menu_name"));
			}
		} else if (data instanceof Map) {
			Map m = (Map) data;
			cache.update((String) m.get("menu_code"), (String) m.get("menu_name"));
		}
	}

	/**
	 * 删除
	 * 
	 * @param data
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	protected void doDelete(String sqlCode, Object data) {
		if (data instanceof List) {
			List<Map> rs = (List<Map>) data;
			for (Map m : rs) {
				cache.remove((String) m.get("menu_code"));
			}
		} else if (data instanceof Map) {
			Map m = (Map) data;
			cache.remove((String) m.get("menu_code"));
		}
	}
}
