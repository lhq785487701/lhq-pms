package com.lhq.pms.plugin.spring.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;

import com.lhq.pms.logging.Log;


public class PMSAuthenticationEntryPoint extends LoginUrlAuthenticationEntryPoint {
	protected final static Log log = Log.get();

	private static final String API = "/api/";

	/**
	 * @param loginFormUrl
	 */
	public PMSAuthenticationEntryPoint(String loginFormUrl) {
		super(loginFormUrl);
	}

	/**
	 * 授权点拦截
	 */
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		String url = request.getRequestURI();

		log.debug("Spring Security授权拦截地址:{0}", url);

		if (url.contains(API)) {

		} else {
			super.commence(httpRequest, httpResponse, authException);
		}
	}
}
