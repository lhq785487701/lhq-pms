package com.lhq.pms.plugin.elasticsearch;

import java.util.List;
import java.util.Map;

import com.lhq.pms.data.Page;

/**
 * Elasticsearch接口
 * 
 * @author lhq 
 */
public interface ElasticsearchService {
	/**
	 * 写数据到 Elasticsearch服务
	 * 
	 * @param index
	 *            索引
	 * @param indexType
	 *            索引类型
	 * @param data
	 *            数据
	 */
	public void write(String index, String indexType, Map<String, Object> data);

	/**
	 * 查询数据 Elasticsearch服务
	 * 
	 * @param index
	 *            索引
	 * 
	 * @param indexType
	 *            索引类型
	 * @param p
	 *            翻页
	 * 
	 * @param where
	 *            上下文数据结构 {
	 *            "must":{"name1":"val1","name2":"val2","name3":{"gt":"5","lte":
	 *            "10"}},
	 * 
	 *            }
	 * @param order
	 *            排序 {'name1':'desc','name2':'asc'}
	 * @return 返回数据
	 */
	public List<Map<String, Object>> query(String index, String indexType, Page p, Map<String, Object> where, Map<String, String> order);
}
