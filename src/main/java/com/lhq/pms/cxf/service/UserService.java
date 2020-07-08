package com.lhq.pms.cxf.service;

import javax.jws.WebService;

import com.lhq.pms.cxf.domain.User;

@WebService
public interface UserService {
    public User getUser(String name);
}