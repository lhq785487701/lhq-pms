package com.lhq.pms.sys.bo;

/**
 * @author lhq
 *
 */
public interface SystemInitCacheBo {

	/**
	 * 缓存标题
	 * 
	 * @return
	 */
	public String getTile();

	/**
	 * 初始化缓存
	 */
	public void initCache();
}
