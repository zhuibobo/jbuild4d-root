package com.jbuild4d.base.tools.common.search;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jbuild4d.base.tools.common.DateUtility;
import com.jbuild4d.base.tools.common.StringUtility;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class GeneralSearchUtility {
    public static Map<String,Object> deserializationToMap(String jsonString) throws IOException, ParseException {
        Map<String, GeneralSearchItem> mapEntity = null;
        if (StringUtility.isNotEmpty(jsonString)) {
            mapEntity=deserializationToT(jsonString);
        } else {
            mapEntity = new HashMap<>();
        }
        Map<String, Object> map = new HashMap<>();
        for (Map.Entry<String, GeneralSearchItem> stringGeneralSearchItemEntry : mapEntity.entrySet()) {
            GeneralSearchItem generalSearchItem = stringGeneralSearchItemEntry.getValue();
            map.put(stringGeneralSearchItemEntry.getKey(), generalSearchItem.getValue());
        }
        return map;
    }

    public static Map<String,GeneralSearchItem> deserializationToT(String jsonString) throws IOException, ParseException {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        TypeReference<HashMap<String,GeneralSearchItem>> typeRef
                = new TypeReference<HashMap<String,GeneralSearchItem>>() {};
        Map<String,GeneralSearchItem> mapResult=objectMapper.readValue(jsonString,typeRef);
        resolveSearchMapResult(mapResult);
        return mapResult;

    }

    private static void resolveSearchMapResult(Map<String, GeneralSearchItem> mapResult) throws ParseException {
        for (Map.Entry<String, GeneralSearchItem> stringGeneralSearchItemEntry : mapResult.entrySet()) {
            GeneralSearchItem generalSearchItem= stringGeneralSearchItemEntry.getValue();
            Object value=generalSearchItem.value;

            if(stringGeneralSearchItemEntry.getValue().getType()==GeneralSearchItemTypeEnum.DateStringType){
                if(value!=""&&!value.toString().equals("")&&value.toString().indexOf("T")>0) {
                    String stringValue=value.toString();
                    stringValue = stringValue.replace("Z", " UTC");
                    //String date = "2015-12-7T16:00:00.000Z";
                    stringValue = stringValue.replace("Z", " UTC");//注意是空格+UTC
                    System.out.println(stringValue);
                    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS Z");//注意格式化的表达式
                    Date d = format.parse(stringValue);
                    String newDateValue= DateUtility.getDate_yyyy_MM_dd(d);
                    System.out.println(newDateValue);
                    generalSearchItem.setValue(newDateValue);
                }
            }
            else if(stringGeneralSearchItemEntry.getValue().getType()==GeneralSearchItemTypeEnum.LikeStringType){
                if(value!=""&&!value.toString().equals("")) {
                    generalSearchItem.setValue("%"+value+"%");
                }
            }
            else if(stringGeneralSearchItemEntry.getValue().getType()==GeneralSearchItemTypeEnum.LeftLikeStringType){
                if(value!=""&&!value.toString().equals("")) {
                    generalSearchItem.setValue("%"+value);
                }
            }
            else if(stringGeneralSearchItemEntry.getValue().getType()==GeneralSearchItemTypeEnum.RightLikeStringType){
                if(value!=""&&!value.toString().equals("")) {
                    generalSearchItem.setValue(value+"%");
                }
            }
        }
    }
}
