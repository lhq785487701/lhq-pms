package com.lhq.pms.plugin.spring.security;

import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.util.StringUtils;


public class PMSCookieClearingLogoutHandler implements LogoutHandler {
	private List<String> cookiesToClear;

	/**
	 * @param cookiesToClear
	 *            the cookiesToClear to set
	 */
	public void setCookiesToClear(List<String> cookiesToClear) {
		this.cookiesToClear = cookiesToClear;
	}

	/**
	 * @return the cookiesToClear
	 */
	public List<String> getCookiesToClear() {
		return cookiesToClear;
	}

	private String cookiePath;

	/**
	 * @return the cookiePath
	 */
	public String getCookiePath() {
		return cookiePath;
	}

	/**
	 * @param cookiePath
	 *            the cookiePath to set
	 */
	public void setCookiePath(String cookiePath) {
		this.cookiePath = cookiePath;
	}

	public PMSCookieClearingLogoutHandler() {

	}

	/**
	 * 退出
	 */
	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		for (String cookieName : this.cookiesToClear) {
			Cookie cookie = new Cookie(cookieName, null);
			String cp = request.getContextPath();
			if (StringUtils.hasLength(cookiePath)) {
				cp = cookiePath;
			}
			cookie.setPath(cp);
			cookie.setMaxAge(0);
			response.addCookie(cookie);
		}
	}

}

