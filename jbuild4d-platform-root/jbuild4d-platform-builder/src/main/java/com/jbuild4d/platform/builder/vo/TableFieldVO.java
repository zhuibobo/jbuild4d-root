package com.jbuild4d.platform.builder.vo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.tools.common.JsonUtility;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/1
 * To change this template use File | Settings | File Templates.
 */
public class TableFieldVO extends TableFieldEntity {
    public String oldFieldName;

    public String getOldFieldName() {
        return oldFieldName;
    }

    public void setOldFieldName(String oldFieldName) {
        this.oldFieldName = oldFieldName;
    }

    @Override
    public String toString() {
        return super.toString();
    }

    public List<TableFieldEntity> VoListToEntityList(List<TableFieldVO> tableFieldVOList) throws JsonProcessingException {
        String json= JsonUtility.toObjectString(tableFieldVOList);
        List<TableFieldEntity> entityList=JsonUtility.toObject(json,List<TableFieldEntity>.getClass());
        return entityList;
    }
}
