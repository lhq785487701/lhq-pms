package com.lhq.pms.plugin.mongodb;

import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.MongoClientOptions.Builder;
import com.mongodb.MongoException;
import com.lhq.pms.exception.PMSException;
import com.lhq.pms.utils.StringUtils;

/**
 * mongo管理器
 * 
 * @author lhq
 */
public class MongoManager {
	private static final int HOST_LEN = 2;
	private static final int TIME_OUT = 0;
	private String hosts = "";
	/** 连接超时，推荐>3000毫秒 **/
	private int connectTimeout = 10000;
	private int maxWaitTime = 3000;
	/** 连接池设置为300个连接,默认为100 **/
	private int connectionsPerHost = 100;
	/** 线程队列数，如果连接线程排满了队列就会抛出“Out of semaphores to get db”错误。 **/
	private int blockSize = 200;
	private String defaultDB = "pms";

	private MongoClient mongoClient;

	public int getConnectTimeout() {
		return connectTimeout;
	}

	public void setConnectTimeout(int connectTimeout) {
		this.connectTimeout = connectTimeout;
	}

	public int getMaxWaitTime() {
		return maxWaitTime;
	}

	public void setMaxWaitTime(int maxWaitTime) {
		this.maxWaitTime = maxWaitTime;
	}

	public int getConnectionsPerHost() {
		return connectionsPerHost;
	}

	public void setConnectionsPerHost(int connectionsPerHost) {
		this.connectionsPerHost = connectionsPerHost;
	}

	private MongoManager() {
		super();
	}

	public String getHosts() {
		return hosts;
	}

	public void setHosts(String hosts) {
		this.hosts = hosts;
	}

	public int getBlockSize() {
		return blockSize;
	}

	public void setBlockSize(int blockSize) {
		this.blockSize = blockSize;
	}

	public String getDefaultDB() {
		return defaultDB;
	}

	public void setDefaultDB(String defaultDB) {
		this.defaultDB = defaultDB;
	}

	public MongoClient getMongoClient() {
		try {
			if (StringUtils.isEmpty(this.hosts)) {
				throw new PMSException("exp-sdp-mongodb-001");
			}
			String[] str = hosts.split(":");
			String ip = str[0];
			int port = 27017;
			if (str.length == HOST_LEN) {
				port = Integer.parseInt(str[1]);
			}

			mongoClient = new MongoClient(ip, port);

			Builder options = new MongoClientOptions.Builder();
			options.connectionsPerHost(connectionsPerHost);
			options.connectTimeout(connectTimeout);
			/** 套接字超时时间，0无限制 **/
			options.socketTimeout(TIME_OUT);
			options.maxWaitTime(maxWaitTime);
			options.threadsAllowedToBlockForConnectionMultiplier(blockSize);
			options.build();

		} catch (MongoException e) {
			throw new PMSException(e);
		}
		return mongoClient;
	}
}
