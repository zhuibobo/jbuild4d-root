package com.jbuild4d.platform.builder.vo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.JsonUtility;

import java.io.IOException;
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

    public static List<TableFieldEntity> VoListToEntityList(List<TableFieldVO> tableFieldVOList) throws IOException {
        String json= JsonUtility.toObjectString(tableFieldVOList);
        List<TableFieldEntity> entityList=JsonUtility.toObjectList(json,TableFieldEntity.class);
        return entityList;
    }

    public static boolean isUpdate(TableFieldVO oldVo,TableFieldVO newVo) throws JBuild4DGenerallyException {
        if(oldVo.getFieldId().equals(newVo.getFieldId())){
            if(!newVo.getFieldName().equals(oldVo.getFieldName())){
                return true;
            }
            else if(!newVo.getFieldDataType().equals(oldVo.getFieldDataType())){
                return true;
            }
            else if(newVo.getFieldDataLength()!=oldVo.getFieldDataLength()){
                return true;
            }
            else if(newVo.getFieldDecimalLength()!=newVo.getFieldDecimalLength()){
                return true;
            }
            else if(!newVo.getFieldAllowNull().equals(oldVo.getFieldAllowNull())){
                return true;
            }
            return false;
        }
        else
        {
            throw new JBuild4DGenerallyException("比较的字段Id不一致!");
        }
    }
}
