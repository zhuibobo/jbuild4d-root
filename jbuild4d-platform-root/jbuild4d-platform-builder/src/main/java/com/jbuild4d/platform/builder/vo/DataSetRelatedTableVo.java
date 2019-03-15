package com.jbuild4d.platform.builder.vo;

import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetRelatedTableEntity;
import com.jbuild4d.base.tools.JsonUtility;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/9
 * To change this template use File | Settings | File Templates.
 */
public class DataSetRelatedTableVo extends DatasetRelatedTableEntity {
    public static List<DataSetRelatedTableVo> EntityListToVoList(List<DatasetRelatedTableEntity> source) throws IOException {
        if(source==null)
            return null;
        else if(source.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(source);
        List<DataSetRelatedTableVo> result=JsonUtility.toObjectListIgnoreProp(json,DataSetRelatedTableVo.class);
        return result;
    }
}
