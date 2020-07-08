package com.lhq.pms.plugin.spring.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import com.lhq.pms.logging.Log;
import com.lhq.pms.plugin.spring.security.bo.SecurityRoleBo;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.StringUtils;

/**
 * @author lhq
 *
 */
public class SecurityRequestMapFactoryBean extends LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> {
	protected final static Log log = Log.get();
	/**
	 * 
	 */
	private static final long serialVersionUID = 6021396539846113868L;

	@Resource(name = "securityRoleBo")
	private SecurityRoleBo securityRoleBo;

	private Map<String, Collection<ConfigAttribute>> map = new HashMap<String, Collection<ConfigAttribute>>(50);

	@SuppressWarnings("unchecked")
	public void loadSecurityInfos() {
		String systemCode = GlobalUtils.getSystemCode();
		List<Map<String, Object>> modules = securityRoleBo.loadRoleInfos(systemCode);
		if (modules == null || modules.isEmpty()) {
			return;
		}
		this.clear();
		for (int i = 0, j = modules.size(); i < j; i++) {
			Map<String, Object> module = modules.get(i);
			String url = StringUtils.trim((String) module.get(SecurityRoleBo.RES_URL));
			String resCode = (String) module.get(SecurityRoleBo.ROLE_CODE);
			if (url.length() <= 0) {
				log.error("[{0}]地址为空！", resCode);
				continue;
			}
			RequestMatcher rm = new AntPathRequestMatcher(url);
			Collection<ConfigAttribute> configAttributes = new LinkedList<ConfigAttribute>();
			List<String> roles = (List<String>) module.get(SecurityRoleBo.ROLES);
			for (final String role : roles) {
				configAttributes.add(new PMSConfigAttribute(role));
				this.put(rm, configAttributes);
				map.put(resCode, configAttributes);
			}
		}
	}

	/**
	 * 新增授权
	 * 
	 * @param resCode
	 * @param role
	 * @param resUrl
	 */
	public void addResRole(String resCode, String role) {
		Map<String, Object> res = securityRoleBo.getResUrl(resCode);
		String systemCode = (String) res.get("system_code");
		if (!GlobalUtils.getSystemCode().equals(systemCode)) {
			return;
		}
		String resUrl = (String) res.get("res_url");
		resUrl = StringUtils.trim(resUrl);
		if (resUrl.length() <= 0) {
			log.error("[{0}]地址为空！", resCode);
			return;
		}
		Collection<ConfigAttribute> attrs = map.get(resCode);
		if (attrs == null) {
			attrs = new LinkedList<ConfigAttribute>();
			attrs.add(new PMSConfigAttribute(role));
			RequestMatcher rm = new AntPathRequestMatcher(resUrl);
			this.put(rm, attrs);
			map.put(resCode, attrs);
		} else {
			attrs.add(new PMSConfigAttribute(role));
		}
	}

	/**
	 * 移除资源角色权限
	 * 
	 * @param resCode
	 * @param role
	 */
	public void removeResRole(String resCode, String role) {
		Collection<ConfigAttribute> attrs = map.get(resCode);
		if (attrs != null) {
			Iterator<ConfigAttribute> iter = attrs.iterator();
			List<ConfigAttribute> tmps = new ArrayList<ConfigAttribute>();
			while (iter.hasNext()) {
				ConfigAttribute attr = iter.next();
				if (attr.getAttribute().equals(role)) {
					tmps.add(attr);
				}
			}
			for (ConfigAttribute attr : tmps) {
				attrs.remove(attr);
			}
		}
	}

	/**
	 * 批量移除资源权限
	 * 
	 * @param resCodes
	 * @param role
	 */
	public void removeResRole(List<String> resCodes, final String role) {
		if (resCodes != null && resCodes.size() > 0) {
			for (String code : resCodes) {
				removeResRole(code, role);
			}
		}
	}
}
