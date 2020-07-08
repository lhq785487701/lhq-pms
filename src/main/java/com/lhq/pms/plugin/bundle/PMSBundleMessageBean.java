package com.lhq.pms.plugin.bundle;

import java.io.IOException;

import javax.annotation.Resource;

import org.springframework.context.support.ReloadableResourceBundleMessageSource;


public class PMSBundleMessageBean {
	@Resource(name = "messageSource")
	private ReloadableResourceBundleMessageSource messageSource;

	public void setBasenames(String... basenames) throws IOException {
		messageSource.addBasenames(basenames);
	}
}
