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
public class UserRoleChangePortalCacheBoImpl extends BaseSqlCodeChangCacheeBoImpl {

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
			for (Map<String, Object> m : rs) {
				addRows(m);
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
	private void addRows(Map<String, Object> m) {
		List<String> roleCodes = (List<String>) m.get("role_code");
		String userCode = (String) m.get("user_code");
		if (roleCodes != null) {
			/** 获取角窗体 **/
			List<Map<String, Object>> winDatas = commonBo.selectList("SDP-PORTAL-WIN-003", roleCodes);
			if (winDatas != null) {
				for (Map<String, Object> data : winDatas) {
					String roleCode = (String) data.get("role_code");
					Map<String, Object> userDatas = (Map<String, Object>) cache.get(roleCode);
					if (userDatas == null) {
						userDatas = new HashMap<String, Object>(50);
					}
					List<Map<String, Object>> userData = (List<Map<String, Object>>) userDatas.get(userCode);
					if (userData == null) {
						userData = (List<Map<String, Object>>) data.get("wins");
						userDatas.put(userCode, userData);
					} else {
						userData.addAll((List<Map<String, Object>>) data.get("wins"));
					}
					cache.update(roleCode, userDatas);
				}
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
			for (Map<String, Object> m : rs) {
				removeRows(m);
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
	private void removeRows(Map<String, Object> m) {
		List<String> roleCodes = (List<String>) m.get("role_code");
		String userCode = (String) m.get("user_code");
		if (roleCodes != null) {
			for (String roleCode : roleCodes) {
				Map<String, Object> userDatas = (Map<String, Object>) cache.get(roleCode);
				if (userDatas == null) {
					continue;
				}
				List<Map<String, Object>> userData = (List<Map<String, Object>>) userDatas.get(userCode);
				if (userData == null) {
					continue;
				} else {
					userDatas.remove(userCode);
					cache.put(roleCode, userDatas);
				}
			}
		}
	}

	/**
	 * 更新
	 * 
	 * @param sqlCode
	 * @param data
	 */
	@Override
	protected void doUpdate(String sqlCode, Object data) {

	}
}
