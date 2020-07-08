package com.lhq.pms.file.bo;

import java.io.InputStream;
import java.util.Map;

import com.lhq.pms.data.PMSContext;
import com.lhq.pms.file.FileInfo;

/**
 * 文件管理接口
 * 
 * @author lhq
 */
public interface FileManageBo {

	/**
	 * 查询文件
	 * 
	 * @param context
	 */
	public void queryFiles(PMSContext context);

	/**
	 * 保存多个文件
	 * 
	 * @param context
	 */
	public void uploadFiles(PMSContext context);

	/**
	 * 保存单个文件
	 * 
	 * @param context
	 */
	public void uploadFile(PMSContext context);

	/**
	 * 批量删除文件
	 * 
	 * @param context
	 */
	public void delFiles(PMSContext context);

	/**
	 * 删除单个文件
	 * 
	 * @param context
	 */
	public void delFile(PMSContext context);

	/**
	 * 下载文件
	 * 
	 * @param context
	 */
	public void downFile(PMSContext context);

	/**
	 * 保存文件
	 * 
	 * @param name
	 *            文件名称
	 * @param inputStream
	 *            文件流
	 * @param params
	 *            包含参数 bus_type business_no line_no $user_code
	 * @return
	 */
	public FileInfo saveFile(String name, InputStream inputStream, Map<String, Object> params);
	
	/**
	 * 更新文件
	 * 
	 * @param context
	 */
	public void updateFile(PMSContext context);
}
