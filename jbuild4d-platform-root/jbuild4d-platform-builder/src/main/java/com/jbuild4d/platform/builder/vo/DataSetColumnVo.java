package com.jbuild4d.platform.builder.vo;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetColumnEntity;
import com.jbuild4d.base.tools.common.JsonUtility;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/8
 * To change this template use File | Settings | File Templates.
 */
public class DataSetColumnVo extends DatasetColumnEntity {

    public static List<DataSetColumnVo> EntityListToVoList(List<DatasetColumnEntity> source) throws IOException {
        if(source==null)
            return null;
        else if(source.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(source);
        List<DataSetColumnVo> result=JsonUtility.toObjectList(json,DataSetColumnVo.class);
        return result;
    }
}
