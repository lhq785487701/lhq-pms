package com.lhq.pms.utils.json;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.KeyDeserializer;

/**
 * 类功能描述
 */
public class RowDeserializer extends KeyDeserializer {

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.fasterxml.jackson.databind.KeyDeserializer#deserializeKey(java.lang.
	 * String, com.fasterxml.jackson.databind.DeserializationContext)
	 */
	@Override
	public Object deserializeKey(String arg0, DeserializationContext arg1) throws IOException, JsonProcessingException {
		return null;
	}

}
