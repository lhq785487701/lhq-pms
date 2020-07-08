package com.lhq.pms.plugin.redis;

import java.util.Arrays;

import org.springframework.data.redis.connection.RedisClusterConfiguration;

/**
 * redis 集群地址
 * 
 * @author lhq 
 */
public class ReidsClusterConfig extends RedisClusterConfiguration {
	public ReidsClusterConfig(String clusterNodes) {
		super(Arrays.asList(clusterNodes.split(",")));
	}
}
