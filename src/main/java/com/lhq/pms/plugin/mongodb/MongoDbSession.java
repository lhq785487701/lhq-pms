package com.lhq.pms.plugin.mongodb;

import java.io.InputStream;

/**
 * 类功能描述
 * 
 * @author lhq
 */
public interface MongoDbSession {
	/**
	 * 保存文件
	 * 
	 * @param name
	 * @param ins
	 */
	public void saveFile(String name, InputStream ins);

	/**
	 * 查找文件
	 * 
	 * @param name
	 *            文件id
	 * @return 文件流
	 */
	public InputStream findFile(String name);

	/**
	 * 删除文件
	 * 
	 * @param name
	 *            文件id
	 */
	public void deleteFile(String name);
}
