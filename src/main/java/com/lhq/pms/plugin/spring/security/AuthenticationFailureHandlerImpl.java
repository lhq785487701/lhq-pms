package com.lhq.pms.plugin.spring.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;

import com.lhq.pms.common.bo.CommonBo;
import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.ExceptionUtils;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.RequestBaseUtils;
import com.lhq.pms.utils.SpringUtils;
import com.lhq.pms.utils.UuidUtils;
import com.lhq.pms.utils.json.JsonParseUtils;


public class AuthenticationFailureHandlerImpl implements AuthenticationFailureHandler {

	@Resource(name = "loginLogBo")
	private LogBo log;
	@Resource(name = "commonBo")
	private CommonBo commonBo;

	/**
	 * 登录验证失败
	 */
	@Override
	public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse res, AuthenticationException exec) throws IOException, ServletException {
		Map<String, Object> m = new HashMap<String, Object>(2);
		m.put("code", 0);
		if (exec instanceof BadCredentialsException) {
			m.put("msg", SpringUtils.getMessage("exp-sdp-login-0004", req.getLocale()));
		} else if (exec instanceof InternalAuthenticationServiceException) {
			m.put("msg", ExceptionUtils.getException(exec));
		} else {
			m.put("msg", SpringUtils.getMessage("exp-sdp-login-0001", req.getLocale()));
		}

		byte[] bytes = JsonParseUtils.readJson(m);
		res.setHeader("Content-Type", "text/plain;charset=utf-8");
		res.getOutputStream().write(bytes);

		if (log != null) {
			Map<String, Object> data = new HashMap<String, Object>(20);
			data.put("nodeId", GlobalUtils.getNode().getNodeCode());
			data.put("logId", UuidUtils.getUuid());
			data.put("serverIp", GlobalUtils.getServerIp());
			data.put("system", GlobalUtils.getSystemCode());
			String userId = req.getParameter("userCode");
			if (userId != null) {
				data.put("userId", userId);
				String userName = "";
				data.put("userName", userName);
			}

			data.put("create", DateUtils.now());
			data.put("message", m.get("msg"));
			data.put("type", "登录");
			data.put("$client_ip", RequestBaseUtils.getIpAddr(req));

			RequestBaseUtils.initUserAgent(data, req);

			log.doLog(data);
		}
	}
}
