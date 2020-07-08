package com.lhq.pms.plugin.spring.security;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedList;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.web.FilterInvocation;
import org.springframework.security.web.access.intercept.DefaultFilterInvocationSecurityMetadataSource;
import org.springframework.security.web.util.matcher.RequestMatcher;

/**
 * 处理当页面没有授权的时候默认给管理员角色权限
 * 
 * @author lhq
 *
 */
public class PMSFilterInvocationSecurityMetadataSource extends DefaultFilterInvocationSecurityMetadataSource {

	private static final String HTML = ".html";

	public PMSFilterInvocationSecurityMetadataSource(LinkedHashMap<RequestMatcher, Collection<ConfigAttribute>> requestMap) {
		super(requestMap);
	}

	/**
	 * 当获取不到角色配置权限是返回管理员角色权限
	 */
	@Override
	public Collection<ConfigAttribute> getAttributes(Object object) {
		Collection<ConfigAttribute> attrs = super.getAttributes(object);
		if (attrs == null) {
			final HttpServletRequest request = ((FilterInvocation) object).getRequest();
			String uri = request.getRequestURI();
			if (uri != null) {
				uri = uri.toLowerCase();
				if (uri.endsWith(HTML)) {
					Collection<ConfigAttribute> configAttributes = new LinkedList<ConfigAttribute>();
					configAttributes.add(new PMSConfigAttribute("ROLE_ADMIN"));
					configAttributes.add(new PMSConfigAttribute("ROLE_USER"));
					return configAttributes;
				}
			}
		}
		return attrs;
	}

}
