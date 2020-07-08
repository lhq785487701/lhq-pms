package com.lhq.pms.message;

import java.io.Serializable;

import com.lhq.pms.exception.PMSException;
import com.lhq.pms.utils.UuidUtils;

/**
 * 类功能描述
 * 
 * @author lhq 
 */
public class PMSTopic implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = -8975762191111671889L;

	private final String channelName;

	private String type;

	private Object data;

	private String id = UuidUtils.getUuid();

	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @return the data
	 */
	public Object getData() {
		return data;
	}

	/**
	 * @param data
	 *            the data to set
	 */
	public void setData(Object data) {
		if (data == null) {
			throw new PMSException("exp-sdp-core-0002");
		}
		if (data instanceof Serializable) {
			this.data = data;
		} else {
			throw new PMSException("exp-sdp-core-0003", data.toString());
		}
	}

	/**
	 * @return the type
	 */
	public String getType() {
		return type;
	}

	/**
	 * @param type
	 *            the type to set
	 */
	public void setType(String type) {
		this.type = type;
	}

	/**
	 * @return the channelName
	 */
	public String getChannelName() {
		return channelName;
	}

	/**
	 * Constructs a new <code>ChannelTopic</code> instance.
	 * 
	 * @param name
	 */
	public PMSTopic(String name) {
		this.channelName = name;
	}

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder("id:");
		sb.append(id).append(";").append("channelName:");
		sb.append(this.channelName).append(";");
		if (this.data != null) {
			sb.append(this.data.toString());
		}
		return sb.toString();
	}
}
