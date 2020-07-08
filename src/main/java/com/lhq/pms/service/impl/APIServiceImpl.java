package com.lhq.pms.service.impl;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import javax.annotation.Resource;

import com.lhq.pms.common.bo.CommonBo;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.service.APIService;
import com.lhq.pms.utils.SpringUtils;
import com.lhq.pms.utils.StringUtils;

/**
 * 接口服务实现
 */
public class APIServiceImpl implements APIService {

	@Resource(name = "commonBo")
	private CommonBo commonBo = null;

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.sie.sdp.service.APIService#doAction(com.sie.sdp.data.SDPContext)
	 */
	@SuppressWarnings("rawtypes")
	@Override
	public void doAction(PMSContext context) throws IllegalAccessException, IllegalArgumentException,
			InvocationTargetException, UnsupportedEncodingException {
		String beanId = context.getBoId();
		CommonBo bbo = this.commonBo;
		if (!"common".equalsIgnoreCase(beanId)) {
			if (StringUtils.isNotEmpty(beanId)) {
				beanId = beanId + "Bo";
				bbo = (CommonBo) SpringUtils.getBean(beanId);
			}
			if (bbo == null) {
				throw new PMSException("1001100", beanId);
			}
		}

		Class cls = bbo.getClass();
		String mn = context.getBoMethod();
		String mn1 = mn + "Tran";

		Method method = getClassMethod(cls, mn);
		if (method == null) {
			method = getClassMethod(cls, mn1);
			if (method == null) {
				throw new PMSException("1001101", beanId, mn, mn1);
			}
		}
		method.invoke(bbo, new Object[] { context });
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected static Method getClassMethod(Class cls, String name) {
		Method method;
		try {
			method = cls.getMethod(name, new Class[] { PMSContext.class });
			return method;
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		}

		return null;
	}
}

