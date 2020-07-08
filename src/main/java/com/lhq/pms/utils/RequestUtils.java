package com.lhq.pms.utils;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.security.core.context.SecurityContextHolder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.lhq.pms.data.LoginUser;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.plugin.spring.security.UserInfo;

/**
 * HttpServletRequest处理类
 * 
 * @author lhq
 */
public class RequestUtils extends RequestBaseUtils {
	/**
	 * 解析参数
	 * 
	 * @param req
	 * @param response
	 * @return
	 * @throws IOException
	 * @throws JsonProcessingException
	 * @throws FileUploadException
	 */
	@Override
	public PMSContext parseParams(HttpServletRequest req, HttpServletResponse res) throws JsonProcessingException, IOException, FileUploadException {
		PMSContext context = parseBaseParams(req, res);

		Object obj = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if (obj instanceof UserInfo) {
			UserInfo userInfo = (UserInfo) obj;
			LoginUser user = (LoginUser) SpringUtils.getBean("loginUser");

			user.setUserCode(userInfo.getUsername());
			user.parseMap(userInfo.getAttrs());
			user.setVisitTime(DateUtils.now());
			user.setLocale(req.getLocale());

			userInfo.addAttr("$client_ip", context.getParam("$client_ip"));
			userInfo.addAttr("$action_url", context.getParam("$action_url"));
			initUserAgent(userInfo.getAttrs(), req);

			HttpSession session = req.getSession();
			user.setSessionCode(session.getId().toString());
			context.setLoginUser(user);

			return context;
		} else {
			throw new PMSException("exp-sdp-login-0002");
		}
	}
}
