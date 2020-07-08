package com.lhq.pms.plugin.bundle;

import javax.annotation.Resource;

import org.springframework.core.io.DefaultResourceLoader;

/**
 * 类功能描述
 */
public class PMSResourceLoader extends DefaultResourceLoader {

	@Resource(name = "messageSource")
	private PMSBundleMessageSource messageSource;

}
