package com.lhq.pms.plugin.spring.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.lhq.pms.data.LoginUser;
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
public class AuthenticationSuccessHandlerImpl implements AuthenticationSuccessHandler {
	@Resource(name = "loginLogBo")
	private LogBo log;

	/**
	 * 验证成功
	 */
	@Override
	public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication exec) throws IOException, ServletException {
		UserInfo userInfo = (UserInfo) exec.getPrincipal();
		userInfo.addAttr(LoginUser.LOGIN_TIME, DateUtils.now());
		userInfo.setLocale(req.getLocale());
		
		
		Map<String, Object> m = new HashMap<String, Object>(2);
		m.put("code", 1);
		byte[] bytes = JsonParseUtils.readJson(m);
		res.setHeader("Content-Type", "text/plain");
		res.getOutputStream().write(bytes);

		Map<String, Object> data = new HashMap<String, Object>(20);
		data.put("nodeId", GlobalUtils.getNode().getNodeCode());
		data.put("logId", UuidUtils.getUuid());
		data.put("serverIp", GlobalUtils.getServerIp());
		data.put("system", GlobalUtils.getSystemCode());

		data.put("userId", userInfo.getUsername());
		data.put("userName", userInfo.getAttr("user_name"));
		data.put("create", DateUtils.now());

		data.put("$client_ip", RequestBaseUtils.getIpAddr(req));

		data.put("$action_url", userInfo.getAttr("$action_url"));

		RequestBaseUtils.initUserAgent(data, req);

		data.put("message", "成功登录");
		data.put("type", "登录");

		log.doLog(data);
		
		//验证成功跳转到对应页面
		//Object obj1 = req.getSession().getAttribute(AbstractCasFilter.CONST_CAS_ASSERTION);
		/*SavedRequest savedRequestObject =  (SavedRequest)req.getSession().getAttribute("SPRING_SECURITY_SAVED_REQUEST");
		String  redirectUrl = "../index.html"; //缺省的登陆成功页面  
		if(savedRequestObject != null) {    
			redirectUrl =   savedRequestObject.getRedirectUrl();    
			req.getSession().removeAttribute("SPRING_SECURITY_SAVED_REQUEST");    
	    }
		res.sendRedirect(redirectUrl); */
	}
}
