package com.lhq.pms.common.bo;

import java.util.Date;
import java.util.List;

import com.lhq.pms.data.Page;
import com.lhq.pms.data.PMSContext;

/**
 * 通用Bo接口
 */
public interface CommonBo {
	/**
	 * 查询单条数据
	 * 
	 * @param statement
	 * @param param
	 *            条件
	 * @return
	 */
	public <T> T selectOne(String statement, Object param);

	/**
	 * 查询单条数据
	 * 
	 * @param statement
	 *            条件
	 * @return
	 */
	public <T> T selectOne(String statement);

	/**
	 * 查询批量数据 无条件
	 * 
	 * @param statement
	 * @return
	 */
	public <T> List<T> selectList(String statement);

	/**
	 * 查询批量数据 无条件,带翻页
	 * 
	 * @param statement
	 * @return
	 */
	public <T> List<T> selectList(String statement, Page page);

	/**
	 * 查询批量数据 带条件
	 * 
	 * @param statement
	 * @param parameter
	 * @return
	 */
	public <T> List<T> selectList(String statement, Object parameter);

	/**
	 * 翻页带条件查询
	 * 
	 * @param statement
	 * @param parameter
	 * @param page
	 * @return
	 */
	public <T> List<T> selectList(String statement, Object parameter, Page page);

	/**
	 * 插入数据
	 * 
	 * @param statement
	 * @param parameter
	 * @return
	 */
	public int insert(String statement, Object parameter);

	/**
	 * 插入数据 无参数
	 * 
	 * @param statement
	 * @return
	 */
	public int insert(String statement);

	/**
	 * 插入批量数据
	 * 
	 * @param statement
	 * @param params
	 *            数据集合
	 * @return
	 */
	public void insert(String statement, List<Object> params);

	/**
	 * mybatis批量大数据插入
	 * 
	 * 
	 * * @param statement sqlmap命名空间
	 * 
	 * @param data
	 *            传过来的数据
	 * @param batchNum
	 *            每批次commit的个数
	 */
	public void batchInsert(String statement, List<Object> params, int batchNum);

	/**
	 * 更新批量数据
	 * 
	 * @param statement
	 * @param params
	 *            数据集合
	 * @return
	 */
	public void update(String statement, List<Object> params);

	/**
	 * 更新数据
	 * 
	 * @param statement
	 * @param parameter
	 * @return
	 */
	public int update(String statement, Object parameter);

	/**
	 * 更新数据
	 * 
	 * @param statement
	 * @return
	 */
	public int update(String statement);

	/**
	 * 删除数据
	 * 
	 * @param statement
	 * @param parameter
	 * @return
	 */
	public int delete(String statement, Object parameter);

	/**
	 * 无参数删除
	 * 
	 * @param statement
	 * @return
	 */
	public int delete(String statement);

	/**
	 * 删除批量数据
	 * 
	 * @param statement
	 * @param params
	 *            数据集合
	 * @return
	 */
	public void delete(String statement, List<Object> params);

	/**
	 * 查询单条数据
	 * 
	 * @param context
	 */
	public void selectOne(PMSContext context);

	/**
	 * 查询批量数据
	 * 
	 * @param context
	 */
	public void selectList(PMSContext context);

	/**
	 * 插入数据
	 * 
	 * @param context
	 */
	public void insert(PMSContext context);

	/**
	 * 更新数据
	 * 
	 * @param context
	 */
	public void update(PMSContext context);

	/**
	 * 删除数据
	 * 
	 * @param context
	 * @return
	 */
	public void delete(PMSContext context);

	/**
	 * 保存数据 包含 insert update insert 操作多数据集时采用
	 * 
	 * @param context
	 */
	public void save(PMSContext context);

	/**
	 * 批量更新
	 * 
	 * @param statement
	 *            语句
	 * @param data
	 *            参数列表
	 * @param batchNum
	 *            每次同步条数
	 */
	public void batchUpdate(String statement, List<Object> data, int batchNum);

	/**
	 * 批量删除
	 * 
	 * @param statement
	 *            语句
	 * @param data
	 *            参数列表
	 * @param batchNum
	 *            每次同步条数
	 */
	public void batchDelete(String statement, List<Object> data, int batchNum);

	/**
	 * 获取当前数据库事件
	 * 
	 * @return
	 */
	public Date getDBCurDate();
}
