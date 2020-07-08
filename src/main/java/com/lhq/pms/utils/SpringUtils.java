package com.lhq.pms.utils;

import java.util.Locale;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import com.lhq.pms.logging.Log;

/**
 * spring工具类
 */
@Service("springUtils")
@Lazy(false)
public final class SpringUtils implements ApplicationContextAware {
	private static final Log log = Log.get();

	/** Spring应用上下文环境 **/
	private static ApplicationContext applicationContext;

	public static Object getBean(String beanId) {
		Object o = null;
		try {
			o = applicationContext.getBean(beanId);
		} catch (BeansException e) {
			log.error("exp-sdp-core-0130", e, beanId);
		}
		return o;
	}

	public static Object getBean(Class<?> cls) {
		Object o = null;
		try {
			o = applicationContext.getBean(cls);
		} catch (BeansException e) {
			log.error("exp-sdp-core-0130", e, cls.getName());
		}
		return o;
	}

	public static String getMessage(String code, Object[] args, Locale locale) {
		String str = applicationContext.getMessage(code, args, "", locale);
		if (StringUtils.isEmpty(str)) {
			str = applicationContext.getMessage(code, args, "", Locale.SIMPLIFIED_CHINESE);
		}
		return str;
	}

	public static String getMessage(String code, Locale locale) {
		String str = applicationContext.getMessage(code, null, "", locale);
		if (StringUtils.isEmpty(str)) {
			str = applicationContext.getMessage(code, null, "", Locale.SIMPLIFIED_CHINESE);
		}
		return str;
	}

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		SpringUtils.applicationContext = applicationContext;
	}
}
