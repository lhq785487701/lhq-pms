package com.lhq.pms.plugin.spring.security.bo;

import java.util.List;
import java.util.Map;

/**
 * @author lhq
 *
 */
public interface SecurityRoleBo {
	public static final String RES_URL = "res_url";
	public static final String ROLES = "roles";
	public static final String ROLE_CODE = "res_code";

	/**
	 * 加载角色权限信息
	 * 
	 * @param systemCode
	 *            系统编码
	 * @return 角色信息
	 */
	public List<Map<String, Object>> loadRoleInfos(String systemCode);

	/**
	 * 获取资源地址
	 * 
	 * @param resCode
	 * @return
	 */
	public Map<String, Object> getResUrl(String resCode);
}
