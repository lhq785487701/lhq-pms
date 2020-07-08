package com.lhq.pms.cxf.service.impl;

import com.lhq.pms.cxf.domain.User;
import com.lhq.pms.cxf.service.UserService;

public class UserServiceImpl implements UserService {

	@Override
	public User getUser(String name) {
		User u=new User();
		u.setUsername(name);
		u.setPassword("123456");
		return u;
	}

}
