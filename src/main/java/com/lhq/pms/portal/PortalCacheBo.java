package com.lhq.pms.portal;

import com.lhq.pms.data.PMSContext;

/**
 * @author lhq
 *
 */
public interface PortalCacheBo {
	/**
	 * 查询门户缓存数据
	 * 
	 * @param context
	 */
	public void queryPortalCache(PMSContext context);

}
