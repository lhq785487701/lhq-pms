package com.lhq.pms.sys.vo;

import javax.annotation.Resource;

import org.springframework.beans.factory.InitializingBean;

import com.lhq.pms.sys.bo.SystemInitBo;
import com.lhq.pms.sys.bo.SystemInitCacheBo;

/**
 * 初始化bean
 * 
 * @author lhq
 *
 */
public class SystemInitBean implements InitializingBean {

	@Resource(name = "systemInitBo")
	private SystemInitBo systemInitBo;

	/** 缓存执行处理bo **/
	private SystemInitCacheBo initCacheBo;

	/**
	 * @return the initCacheBo
	 */
	public SystemInitCacheBo getInitCacheBo() {
		return initCacheBo;
	}

	/**
	 * @param initCacheBo
	 *            the initCacheBo to set
	 */
	public void setInitCacheBo(SystemInitCacheBo initCacheBo) {
		this.initCacheBo = initCacheBo;
	}

	/**
	 * 属性赋值后
	 */
	@Override
	public void afterPropertiesSet() throws Exception {
		if (systemInitBo != null) {
			systemInitBo.addSystemInitCacheBo(initCacheBo);
		}
	}
}
