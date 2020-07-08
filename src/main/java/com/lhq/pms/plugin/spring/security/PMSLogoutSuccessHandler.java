package com.lhq.pms.plugin.spring.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.RequestBaseUtils;
import com.lhq.pms.utils.UuidUtils;
import com.lhq.pms.utils.json.JsonParseUtils;

/**
 * @author lhq
 *
 */
public class PMSLogoutSuccessHandler implements LogoutSuccessHandler {

	@Resource(name = "loginLogBo")
	private LogBo log;

	/**
	 * 成功退出
	 */
	@Override
	public void onLogoutSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication authentication) throws IOException, ServletException {
		Map<String, Object> m = new HashMap<String, Object>(2);
		m.put("code", 1);
		byte[] bytes = JsonParseUtils.readJson(m);
		resp.setHeader("Content-Type", "text/plain;charset=utf-8");
		resp.getOutputStream().write(bytes);

		if (log != null) {
			Map<String, Object> data = new HashMap<String, Object>(20);
			data.put("nodeId", GlobalUtils.getNode().getNodeCode());
			data.put("logId", UuidUtils.getUuid());
			data.put("serverIp", GlobalUtils.getServerIp());
			data.put("system", GlobalUtils.getSystemCode());
			data.put("create", DateUtils.now());
			data.put("message", "成功退出");
			data.put("type", "退出");
			data.put("$client_ip", RequestBaseUtils.getIpAddr(req));
			if (authentication != null) {
				UserInfo userInfo = (UserInfo) authentication.getPrincipal();
				data.put("userId", userInfo.getUsername());
				data.put("userName", userInfo.getAttr("user_name"));
			}

			RequestBaseUtils.initUserAgent(data, req);

			log.doLog(data);
		}
	}
}