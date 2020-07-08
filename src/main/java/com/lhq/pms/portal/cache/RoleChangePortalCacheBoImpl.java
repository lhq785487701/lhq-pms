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
public class RoleChangePortalCacheBoImpl extends BaseSqlCodeChangCacheeBoImpl {

	@Resource(name = "commonBo")
	private CommonBo commonBo;

	/** 角色禁用 **/
	private static final String ROLE_STS_D = "SDP-ROLE-004";
	/** 角色解禁 **/
	private static final String ROLE_STS_Y = "SDP-ROLE-005";

	/**
	 * 新增
	 * 
	 * @param sqlCode
	 * @param data
	 */
	@Override
	protected void doAdd(String sqlCode, Object data) {

	}

	/**
	 * 更新动作
	 */
	@SuppressWarnings("unchecked")
	@Override
	protected void doUpdate(String sqlCode, Object data) {
		if (data instanceof Map) {
			Map<String, Object> m = (Map<String, Object>) data;
			String roleCode = (String) m.get("role_code");
			if (ROLE_STS_D.equals(sqlCode)) {
				if (cache.containsKey(roleCode)) {
					cache.remove(roleCode);
				}
			} else if (ROLE_STS_Y.equals(sqlCode)) {
				addRows(roleCode);
			}
		}
	}

	/**
	 * 角色解禁
	 * 
	 * @param roleCode
	 */
	@SuppressWarnings("unchecked")
	private void addRows(String roleCode) {
		List<String> roleCodes = new ArrayList<String>(1);
		roleCodes.add(roleCode);

		/** 获取角窗体 **/
		List<Map<String, Object>> winDatas = commonBo.selectOne("SDP-PORTAL-WIN-003", roleCodes);
		if (winDatas != null) {
			for (Map<String, Object> data : winDatas) {
				Map<String, Object> userDatas = (Map<String, Object>) cache.get(roleCode);
				if (userDatas == null) {
					userDatas = new HashMap<String, Object>(50);
				}
				List<Object> users = (List<Object>) this.commonBo.selectList("SDP-USER-015", roleCode);
				if (users == null || users.size() <= 0) {
					continue;
				}
				for (Object tmp : users) {
					String userCode = (String) tmp;
					List<Map<String, Object>> userData = (List<Map<String, Object>>) userDatas.get(userCode);
					if (userData == null) {
						userData = (List<Map<String, Object>>) data.get("wins");
						userDatas.put(userCode, userData);
					} else {
						userData.addAll((List<Map<String, Object>>) data.get("wins"));
					}
				}
				cache.update(roleCode, userDatas);
			}
		}
	}

	/**
	 * 删除动作
	 */
	@Override
	protected void doDelete(String sqlCode, Object data) {

	}
}
