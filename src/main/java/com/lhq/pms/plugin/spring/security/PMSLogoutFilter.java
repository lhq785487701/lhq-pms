package com.lhq.pms.plugin.spring.security;

import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

public class PMSLogoutFilter extends LogoutFilter {

	/**
	 * @param logoutSuccessHandler
	 * @param handlers
	 */
	public PMSLogoutFilter(LogoutSuccessHandler logoutSuccessHandler, LogoutHandler[] handlers) {
		super(logoutSuccessHandler, handlers);
	}
}
