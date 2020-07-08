package com.lhq.pms.cache.bo.impl;

import java.util.List;
import java.util.Map;

import com.lhq.pms.sys.bo.impl.BaseSystemInitBoImpl;

/**
 * 菜单缓存初始化
 * 
 * @author lhq
 *
 */
public class BaseInitCacheBoImpl extends BaseSystemInitBoImpl {

	/**
	 * 处理缓存数据
	 */
	@Override
	public void doCache(List<Map<String, Object>> rows) {
		if (rows != null) {
			for (Map<String, Object> row : rows) {
				cache.put((String) row.get("code"), row.get("name"));
			}
		}
	}

	/**
	 * 获取标题
	 */
	@Override
	public String getTile() {
		return "菜单缓存";
	}
}
