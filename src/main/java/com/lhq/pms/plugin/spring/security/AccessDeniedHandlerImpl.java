package com.lhq.pms.plugin.spring.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;

import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.RequestBaseUtils;
import com.lhq.pms.utils.SpringUtils;
import com.lhq.pms.utils.UuidUtils;
import com.lhq.pms.utils.json.JsonParseUtils;

/**
 * @author lhq
 *
 */
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {

	@Resource(name = "loginLogBo")
	private LogBo log;

	/**
	 * 权限阻止
	 */
	@Override
	public void handle(HttpServletRequest req, HttpServletResponse res, AccessDeniedException accessDeniedException) throws IOException, ServletException {
		Map<String, Object> m = new HashMap<String, Object>(2);
		m.put("code", 0);
		m.put("msg", SpringUtils.getMessage("exp-sdp-login-0003", new String[] { req.getRequestURI() }, req.getLocale()));
		byte[] bytes = JsonParseUtils.readJson(m);
		res.setHeader("Content-Type", "text/plain;charset=utf-8");
		res.getOutputStream().write(bytes);

		if (log != null) {
			Map<String, Object> data = new HashMap<String, Object>(20);
			data.put("nodeId", GlobalUtils.getNode().getNodeCode());
			data.put("logId", UuidUtils.getUuid());
			data.put("serverIp", GlobalUtils.getServerIp());
			data.put("system", GlobalUtils.getSystemCode());
			data.put("create", DateUtils.now());
			data.put("message", m.get("msg"));
			data.put("type", "访问");
			data.put("$client_ip", RequestBaseUtils.getIpAddr(req));

			RequestBaseUtils.initUserAgent(data, req);
			SecurityContext context = SecurityContextHolder.getContext();
			if (context != null) {
				Authentication auth = context.getAuthentication();
				if (auth != null) {
					UserInfo userInfo = (UserInfo) auth.getPrincipal();
					data.put("userId", userInfo.getUsername());
					data.put("userName", userInfo.getAttr("user_name"));
				}
			}

			log.doLog(data);
		}
	}
}
