package com.lhq.pms.plugin.bundle;

import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.core.io.ResourceLoader;

/**
 * 国际化文件加载
 */
public class PMSBundleMessageSource extends ReloadableResourceBundleMessageSource {

	private ResourceLoader loader = null;

	@Override
	public void setResourceLoader(ResourceLoader resourceLoader) {
		if (loader == null && !(loader instanceof PMSResourceLoader)) {
			loader = resourceLoader;
			super.setResourceLoader(loader);
		}
	}

}
