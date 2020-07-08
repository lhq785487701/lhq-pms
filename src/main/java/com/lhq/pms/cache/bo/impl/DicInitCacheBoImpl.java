package com.lhq.pms.cache.bo.impl;

import java.util.List;
import java.util.Map;

import com.lhq.pms.sys.bo.impl.BaseSystemInitBoImpl;

/**
 * 数据字典缓存初始化
 * 
 * @author lhq
 *
 */
public class DicInitCacheBoImpl extends BaseSystemInitBoImpl {

	/**
	 * 处理缓存数据
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void doCache(List<Map<String, Object>> rows) {
		if (rows != null) {
			for (Map<String, Object> row : rows) {
				String dicCode = (String) row.get("dic_code");
				List<Map<String, Object>> items = (List<Map<String, Object>>) row.get("items");

				cache.put(dicCode, items);
			}
		}
	}

	/**
	 * 获取标题
	 */
	@Override
	public String getTile() {
		return "数据字典缓存";
	}
}
