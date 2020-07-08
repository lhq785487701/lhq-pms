package com.lhq.pms.plugin.elasticsearch.impl;

import java.io.IOException;
import java.net.InetAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.ClearScrollRequestBuilder;
import org.elasticsearch.action.search.ClearScrollResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.update.UpdateResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.unit.TimeValue;
import org.elasticsearch.index.IndexNotFoundException;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.RangeQueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.sort.SortOrder;

import com.lhq.pms.data.Page;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.plugin.elasticsearch.ElasticsearchService;
import com.lhq.pms.utils.StringUtils;


/**
 * Elasticsearch接口实现
 * 
 * @author lhq 
 */
public class ElasticsearchServiceImpl implements ElasticsearchService {

	private static final int SIZE = 10000;
	private String host;

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	private TransportClient client;

	private long scrollTimeOut = 0L;

	public long getScrollTimeOut() {
		return scrollTimeOut;
	}

	public void setScrollTimeOut(long scrollTimeOut) {
		this.scrollTimeOut = scrollTimeOut;
	}

	/**
	 * 写入数据
	 */
	@Override
	public void write(String index, String indexType, Map<String, Object> data) {
		try {
			Client t = getClient();
			if (t != null) {
				String id = (String) data.get("_id");
				if (StringUtils.isEmpty(id)) {
					IndexResponse response = t.prepareIndex(index, indexType).setSource(data).get();
					if (!response.isCreated()) {
						throw new PMSException("exp-sdp-elastic-003");
					}
					data.put("_id", response.getId());
				} else {
					Map<String, Object> tmp = new HashMap<String, Object>(20);
					tmp.putAll(data);
					tmp.remove("_id");
					UpdateResponse ur = t.prepareUpdate(index, indexType, id).setDoc(tmp).get();
					if (ur.isCreated()) {
						return;
					}
				}
			} else {
				throw new PMSException("exp-sdp-elastic-002");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	protected TransportClient getClient() throws IOException {
		if (client != null) {
			return client;
		}
		if (StringUtils.isNotEmpty(host)) {
			String[] hs = host.split(",");
			TransportClient clt = TransportClient.builder().build();
			for (String ht : hs) {
				String[] p = ht.split(":");
				String h = p[0];
				String pt = p[1];
				int port = (p.length == 1 ? 9300 : Integer.parseInt(pt));

				InetSocketTransportAddress inet = new InetSocketTransportAddress(InetAddress.getByName(h), port);
				clt.addTransportAddress(inet);
			}
			client = clt;
			return client;
		} else {
			throw new PMSException("exp-sdp-elastic-001");
		}
	}

	public void destory() {
		if (this.client != null) {
			this.client.close();
		}
	}

	/**
	 * 查询数据
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public List<Map<String, Object>> query(String index, String indexType, Page p, Map<String, Object> where, Map<String, String> order) {
		Client t;
		List<Map<String, Object>> rs = new ArrayList<Map<String, Object>>();
		try {
			t = getClient();
			if (t != null) {
				if (p == null) {
					throw new PMSException("exp-sdp-elastic-004");
				}

				Map<String, Object> must = (Map<String, Object>) where.get("must");
				if (must == null) {
					throw new PMSException("exp-sdp-elastic-005");
				}
				Map<String, String> match = (Map<String, String>) where.get("match");
				String matchAll = StringUtils.trim((String) where.get("matchAll"));
				Map<String, Object> matchMulti = (Map<String, Object>) where.get("matchMulti");

				// 匹配逻辑
				BoolQueryBuilder bool = QueryBuilders.boolQuery();
				for (Map.Entry<String, Object> entry : must.entrySet()) {
					String k = entry.getKey();
					Object val = entry.getValue();
					if (val instanceof Map) {
						Map<String, Object> m = (Map<String, Object>) val;
						RangeQueryBuilder rang = QueryBuilders.rangeQuery(k);
						if (m.containsKey("gt")) {
							rang.gt(m.get("gt"));
						} else if (m.containsKey("gte")) {
							rang.gte(m.get("gte"));
						}
						if (m.containsKey("lt")) {
							rang.lt(m.get("lt"));
						} else if (m.containsKey("lte")) {
							rang.lte(m.get("lte"));
						}
						bool.filter(rang);
					} else {
						bool.must(QueryBuilders.matchQuery(k, val));
					}
				}
				// 单个字段端匹配
				if (match != null && match.size() > 0) {
					for (Map.Entry<String, String> entry : match.entrySet()) {
						String k = entry.getKey();
						String val = "*" + entry.getValue() + "*";
						bool.must(QueryBuilders.matchQuery(k, val));
					}
				}
				// 多个字段匹配
				if (matchMulti != null && matchMulti.size() > 0) {
					for (Map.Entry<String, Object> entry : matchMulti.entrySet()) {
						String k = "*" + entry.getKey() + "*";
						String[] vals = null;
						if (entry.getValue() instanceof List) {
							vals = (String[]) ((List) entry.getValue()).toArray(new String[0]);
						} else {
							vals = (String[]) entry.getValue();
						}
						if (vals != null) {
							bool.must(QueryBuilders.multiMatchQuery(k, vals));
						}
					}
				}
				// 全字段匹配
				if (matchAll.length() > 0) {
					bool.must(QueryBuilders.queryStringQuery("*" + matchAll + "*"));
				}

				if (p.getStartRow() + p.getEndRow() > SIZE) {
					searchByScroll(t, index, indexType, p, bool, order, rs);
				} else {
					searchData(t, index, indexType, p, bool, order, rs);
				}

				return rs;
			}
		} catch (IndexNotFoundException e) {
			e.printStackTrace();
			return rs;
		} catch (Exception e) {
			Throwable te = e.getCause();
			while (te != null) {
				if (te instanceof IndexNotFoundException) {
					return rs;
				}
				te = te.getCause();
			}
			throw new PMSException(e);
		}
		return rs;
	}

	/**
	 * 普通翻页查询
	 * 
	 * @param t
	 * @param index
	 * @param indexType
	 * @param p
	 * @param bool
	 * @param order
	 * @param rs
	 * @throws InterruptedException
	 * @throws ExecutionException
	 */
	protected void searchData(Client t, String index, String indexType, Page p, BoolQueryBuilder bool, Map<String, String> order, List<Map<String, Object>> rs)
			throws InterruptedException, ExecutionException {
		SearchRequestBuilder srb = initSearch(t, index, indexType, p, bool, order);

		SearchResponse searchResponse = srb.execute().get();
		SearchHits hits = searchResponse.getHits();
		p.setTotal(hits.getTotalHits());
		SearchHit[] searchHists = hits.getHits();

		int i = 0;
		for (SearchHit hit : searchHists) {
			Map<String, Object> m = hit.getSource();
			m.put("$index", i++);
			rs.add(m);
		}
	}

	/**
	 * 通过滚动ID获取文档
	 * 
	 * @param client
	 */
	protected void searchByScroll(Client t, String index, String indexType, Page p, BoolQueryBuilder bool, Map<String, String> order, List<Map<String, Object>> rs) {
		TimeValue timeValue = new TimeValue(this.scrollTimeOut);
		SearchRequestBuilder srb;
		SearchResponse response;

		srb = initSearch(t, index, indexType, p, bool, order);
		srb.setScroll(timeValue);
		response = srb.execute().actionGet();
		// 第一次不返回数据
		long count = response.getHits().getTotalHits();
		p.setTotal(count);

		String scrollId = response.getScrollId();
		response = t.prepareSearchScroll(response.getScrollId()).setScroll(timeValue).execute().actionGet();
		SearchHit[] searchHits = response.getHits().getHits();
		for (SearchHit searchHit : searchHits) {
			rs.add(searchHit.getSource());
		}
		clearScroll(t, scrollId);
	}

	/**
	 * 初始化查询搜索
	 * 
	 * @param t
	 * @param index
	 * @param indexType
	 * @param p
	 * @param bool
	 * @param order
	 * @return
	 */
	protected SearchRequestBuilder initSearch(Client t, String index, String indexType, Page p, BoolQueryBuilder bool, Map<String, String> order) {
		SearchRequestBuilder srb = t.prepareSearch(index).setTypes(indexType).setQuery(bool);
		if (order != null && order.size() > 0) {
			for (Map.Entry<String, String> entry : order.entrySet()) {
				srb.addSort(entry.getKey(), SortOrder.valueOf(entry.getValue().toUpperCase()));
			}
		}
		srb.setFrom(p.getStartRow());
		srb.setSize(p.getEndRow());
		return srb;
	}

	/**
	 * 清除滚动ID
	 * 
	 * @param client
	 * @param scrollId
	 * @return
	 */
	public static boolean clearScroll(Client t, String scrollId) {
		ClearScrollRequestBuilder clearScrollRequestBuilder = t.prepareClearScroll();
		clearScrollRequestBuilder.addScrollId(scrollId);
		ClearScrollResponse response = clearScrollRequestBuilder.get();
		return response.isSucceeded();
	}

	/**
	 * 清除滚动ID
	 * 
	 * @param client
	 * @param scrollIdList
	 * @return
	 */
	public static boolean clearScroll(Client t, List<String> scrollIdList) {
		ClearScrollRequestBuilder clearScrollRequestBuilder = t.prepareClearScroll();
		clearScrollRequestBuilder.setScrollIds(scrollIdList);
		ClearScrollResponse response = clearScrollRequestBuilder.get();
		return response.isSucceeded();
	}
}
