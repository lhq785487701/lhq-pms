package com.lhq.pms.plugin.spring.security;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AbstractAuthenticationEvent;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.authentication.event.AuthenticationFailureExpiredEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.security.authentication.event.InteractiveAuthenticationSuccessEvent;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.lhq.pms.logging.bo.LogBo;
import com.lhq.pms.utils.DateUtils;
import com.lhq.pms.utils.GlobalUtils;
import com.lhq.pms.utils.UuidUtils;

/**
 * @author lhq spring security 事件处理
 *
 */
@Service("authenticationEvent")
public class AuthenticationEvent implements ApplicationListener<AbstractAuthenticationEvent> {
	@Resource(name = "loginLogBo")
	private LogBo log;

	@Override
	public void onApplicationEvent(AbstractAuthenticationEvent event) {
		Authentication auth = event.getAuthentication();
		if (event instanceof AuthenticationSuccessEvent || event instanceof InteractiveAuthenticationSuccessEvent || event instanceof AuthenticationFailureBadCredentialsEvent) {
			return;
		}
		if (log != null) {
			boolean b = false;
			Object user = auth.getPrincipal();
			UserInfo userInfo = null;
			String userId = "", userName = "";
			if (user instanceof UserInfo) {
				userInfo = (UserInfo) user;
				userId = userInfo.getUsername();
				userName = (String) userInfo.getAttr("user_name");
			} else if (user instanceof String) {
				userId = (String) user;
			}

			Map<String, Object> data = new HashMap<String, Object>(20);
			data.put("nodeId", GlobalUtils.getNode().getNodeCode());
			data.put("logId", UuidUtils.getUuid());
			data.put("serverIp", GlobalUtils.getServerIp());
			data.put("system", GlobalUtils.getSystemCode());

			data.put("userId", userId);
			data.put("userName", userName);
			data.put("create", DateUtils.now());

			if (userInfo != null) {
				data.put("$client_ip", userInfo.getAttr("$client_ip"));
				data.put("$action_url", userInfo.getAttr("$action_url"));

				data.put("$client_browser", userInfo.getAttr("$client_browser"));
				data.put("$client_system", userInfo.getAttr("$client_system"));
				data.put("$client_device", userInfo.getAttr("$client_device"));
			}

			if (event instanceof AuthenticationFailureExpiredEvent) {
				data.put("message", "时间超时");
				data.put("type", "超时");
				b = true;
			}

			if (b) {
				log.doLog(data);
			}
		}
	}
}
