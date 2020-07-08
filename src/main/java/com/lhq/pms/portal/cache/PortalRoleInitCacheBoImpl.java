package com.lhq.pms.portal.cache;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lhq.pms.sys.bo.impl.BaseSystemInitBoImpl;

/**
 * 门户数据需要初始化到缓存中
 * 
 * @author lhq
 *
 */
public class PortalRoleInitCacheBoImpl extends BaseSystemInitBoImpl {

	/**
	 * 初始化缓存 存储格式 角色:{用户1:[窗体,窗体],用户2:[窗体,窗体]}
	 */
	@SuppressWarnings("unchecked")
	@Override
	public void doCache(List<Map<String, Object>> rows) {
		if (rows != null) {
			for (Map<String, Object> row : rows) {
				String roleCode = (String) row.get("role_code");
				List<Map<String, Object>> items = (List<Map<String, Object>>) row.get("users");
				if (items == null) {
					continue;
				}
				Map<String, List<Map<String, Object>>> wins = new HashMap<String, List<Map<String, Object>>>(50);
				for (Map<String, Object> map : items) {
					wins.put((String) map.get("user_code"), (List<Map<String, Object>>) map.get("wins"));
				}
				cache.put(roleCode, wins);
			}
		}
	}

	/**
	 * 获取标题
	 */
	@Override
	public String getTile() {
		return "门户授权缓存";
	}
}
