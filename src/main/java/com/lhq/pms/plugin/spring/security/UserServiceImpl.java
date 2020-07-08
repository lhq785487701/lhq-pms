package com.lhq.pms.plugin.spring.security;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.lhq.pms.common.bo.UserBo;
import com.lhq.pms.data.LoginUser;
import com.lhq.pms.logging.Log;

public class UserServiceImpl implements UserDetailsService {
	protected final static Log log = Log.get();

	@Resource(name = "userBo")
	private UserBo userBo;

	/**
	 * 加载用户信息
	 */
	@SuppressWarnings("unchecked")
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		/*
		单点登录
		username = AssertionHolder.getAssertion().getPrincipal().getName();
		if(username == null || username == "") {
			log.debug("帐号[" + username + "] 不存在");
			
			throw new UsernameNotFoundException("exp-sdp-login-0007");
		}*/
		
		Map<String, Object> user = userBo.findUser(username);
		if (user == null || user.isEmpty()) {
			log.debug("帐号[" + username + "] 不存在");

			throw new UsernameNotFoundException("exp-sdp-login-0007");
		} else {
			List<GrantedAuthority> combinedAuthorities = new ArrayList<GrantedAuthority>();
			List<Map<String, Object>> roles = (List<Map<String, Object>>) user.get(LoginUser.ROLES);
			if (roles != null && roles.size() > 0) {
				for (Map<String, Object> m : roles) {
					GrantedAuthority ga = new SimpleGrantedAuthority((String) m.get("role_code"));
					combinedAuthorities.add(ga);
				}
			}
			return createUserDetails(username, user, combinedAuthorities);
		}
	}

	protected UserDetails createUserDetails(String username, Map<String, Object> user, List<GrantedAuthority> combinedAuthorities) {
		String pwd = (String) user.get(LoginUser.USER_PWD);
		boolean enable = "Y".equalsIgnoreCase((String) user.get(LoginUser.USER_STS));
		UserInfo userInfo = new UserInfo(username, pwd.toLowerCase(), enable, true, true, true, combinedAuthorities);
		userInfo.setAttrs(user);
		return userInfo;
	}

}
