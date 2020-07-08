package com.lhq.pms.sys.bo;

/**
 * @author lhq 系统初始化接口
 *
 */
public interface SystemInitBo {
	/**
	 * 初始化方法
	 */
	public void init();

	/**
	 * 销毁方法
	 */
	public void destory();

	/**
	 * 添加初始化
	 * 
	 * @param initBo
	 */
	public void addSystemInitCacheBo(SystemInitCacheBo initBo);
}
