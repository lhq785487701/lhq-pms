package com.lhq.pms.restful;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller  
@RequestMapping("/hr")
public class Test {
	
	@RequestMapping(value = "/unit")
	@ResponseBody
	public String saveOrUpdateOrg(@RequestBody(required=false) String hrUnitLog) {
		System.out.println("1");
		return "1";
	}

	@RequestMapping(value = "/user")
	@ResponseBody
	public String saveOrUpdateUser(@RequestBody(required=false) String hrUserLog) {
		System.out.println("2");
		return "2";
	}

	@RequestMapping(value = "/station")
	@ResponseBody
	public String saveOrUpdateStation(@RequestBody(required=false) String hrStationLog) {
		System.out.println("3");
		return "3";
	}
}
