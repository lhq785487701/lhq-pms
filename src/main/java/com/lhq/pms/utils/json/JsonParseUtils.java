package com.lhq.pms.utils.json;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.lhq.pms.data.DataStore;
import com.lhq.pms.data.Page;
import com.lhq.pms.data.Row;
import com.lhq.pms.data.PMSContext;
import com.lhq.pms.type.StateType;

/**
 * 类功能描述
 */
public class JsonParseUtils {
	private static ObjectMapper UPDATEOM = null;
	private static ObjectMapper RESULTOM = null;

	static {
		UPDATEOM = new ObjectMapper();
		UPDATEOM.configure(Feature.ALLOW_COMMENTS, true);
		UPDATEOM.configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
		UPDATEOM.configure(Feature.ALLOW_SINGLE_QUOTES, true);
		UPDATEOM.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);

		UPDATEOM.registerSubtypes(Page.class);
		UPDATEOM.registerSubtypes(DataStore.class);
		UPDATEOM.registerSubtypes(StateType.class);
		UPDATEOM.registerSubtypes(Row.class);

		SimpleModule module = new SimpleModule();
		module.addKeyDeserializer(Row.class, new RowDeserializer());
		UPDATEOM.registerModule(module);

		RESULTOM = new ObjectMapper().configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
		RESULTOM.configure(Feature.ALLOW_SINGLE_QUOTES, true);
		RESULTOM.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
		RESULTOM.configure(Feature.IGNORE_UNDEFINED, true);

		RESULTOM.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
	}

	/**
	 * 将json对象，转变为SDPContext对象.
	 * 
	 * @param jp
	 *            要转变的对象.
	 * @return 转变后的SDPContext.
	 * @throws JsonProcessingException
	 * @throws IOException
	 */
	public static PMSContext toJsonObject(byte[] bts) throws JsonProcessingException, IOException {
		PMSContext context = UPDATEOM.readValue(bts, PMSContext.class);
		return context;
	}

	/**
	 * 对象转json字符串
	 * 
	 * @param obj
	 *            对象
	 * @return
	 * @throws JsonProcessingException
	 */
	public static String readJson(Object obj) throws JsonProcessingException {
		return RESULTOM.writeValueAsString(obj);
	}

	/**
	 * 对象转byte[]
	 * 
	 * @param m
	 *            map
	 * @return
	 * @throws JsonProcessingException
	 */
	public static byte[] readJson(Map<String, Object> m) throws JsonProcessingException {
		return RESULTOM.writeValueAsBytes(m);
	}

	/**
	 * byte [] 转 map
	 * 
	 * @param bytes
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> jsonToMap(byte[] bytes)
			throws JsonParseException, JsonMappingException, IOException {
		return UPDATEOM.readValue(bytes, Map.class);
	}

	/**
	 * byte [] 转 List
	 * 
	 * @param bytes
	 * @return
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	public static List<Map<String, Object>> jsonToListMap(byte[] bytes)
			throws JsonParseException, JsonMappingException, IOException {
		return UPDATEOM.readValue(bytes, List.class);
	}
}
