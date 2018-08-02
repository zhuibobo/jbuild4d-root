package com.jbuild4d.base.tools.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

public class JsonUtility {
    public static String toObjectString(Object vo) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        String jsonString=objectMapper.writeValueAsString(vo);
        return jsonString;
    }

    public static <T> T toObject(String str,Class<T> _class) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.readValue(str,_class);
    }

    public static <T> List<T> toObjectList(String str,Class<T> _class) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<T> objList = null;
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false);
        JavaType t = mapper.getTypeFactory().constructParametricType(
                List.class, _class);
        objList = mapper.readValue(str, t);

        return objList;
        /*List<_class> listT = mapper.readValue(str,new TypeReference<List<_class>>() { });
        return listT;*/
    }
    /*public static <T> Map<String,T> toMapT(String jsonString,T obj) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT);
        TypeReference<HashMap<String,T>> typeRef
                = new TypeReference<HashMap<String,T>>() {};
        Map<String,T> mapResult=objectMapper.readValue(jsonString,typeRef);
        return mapResult;
    }*/
}
