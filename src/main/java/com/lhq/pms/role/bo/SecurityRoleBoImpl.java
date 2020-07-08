package com.lhq.pms.role.bo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lhq.pms.common.bo.impl.CommonBoImpl;
import com.lhq.pms.plugin.spring.security.bo.SecurityRoleBo;

/**
 * @author lhq
 *
 */
public class SecurityRoleBoImpl extends CommonBoImpl implements SecurityRoleBo {

	/**
	 * 加载角色信息
	 */
	@Override
	public List<Map<String, Object>> loadRoleInfos(String systemCode) {
		Map<String, String> par = new HashMap<String, String>(1);
		par.put("system_code", systemCode);
		List<Map<String, Object>> authRes = this.selectList("SDP-RES-001", par);
		return authRes;
	}

	/**
	 * 查询资源地址
	 */
	@Override
	public Map<String, Object> getResUrl(String resCode) {
		return this.selectOne("SDP-RES-013", resCode);
	}

}
