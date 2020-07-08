package com.lhq.pms.service;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;

import com.lhq.pms.data.PMSContext;

/**
 * 接口服务
 */
public interface APIService {
	public void doAction(PMSContext context) throws IllegalAccessException, IllegalArgumentException,
			InvocationTargetException, UnsupportedEncodingException;
}
