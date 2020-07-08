package com.lhq.pms.file.bo;

import java.io.InputStream;

import com.lhq.pms.file.FileInfo;

/**
 * 文件处理接口
 * 
 * @author lhq
 */
public interface FileBo {

	/**
	 * 保存文件
	 * 
	 * @param name
	 * @param ins
	 * @return 返回文件信息
	 */
	public FileInfo saveFile(String name, InputStream ins);

	/**
	 * 查找文件
	 * 
	 * @param name
	 *            文件ID
	 * @return 返回文件信息
	 */
	public FileInfo findFile(String name);

	/**
	 * 删除文件
	 * 
	 * @param name
	 *            文件id
	 */
	public void deleteFile(String name);
	
	/**
	 * 更新文件
	 * 
	 * @param name
	 * @param ins
	 * @param oldId
	 * @return
	 */
	public FileInfo updateFile(String name, InputStream ins, String oldId);
}
