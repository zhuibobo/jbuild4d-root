package com.jbuild4d.platform.builder.vo;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.jbuild4d.base.dbaccess.dbentities.TableFieldEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.JsonUtility;

import java.io.IOException;
import java.util.ArrayList;
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
        if(tableFieldVOList==null)
            return null;
        else if(tableFieldVOList.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(tableFieldVOList);
        List<TableFieldEntity> entityList=JsonUtility.toObjectList(json,TableFieldEntity.class);
        return entityList;
    }

    public static List<TableFieldVO> EntityListToVoList(List<TableFieldEntity> source) throws IOException {
        if(source==null)
            return null;
        else if(source.size()==0){
            return new ArrayList<>();
        }
        String json= JsonUtility.toObjectString(source);
        List<TableFieldVO> result=JsonUtility.toObjectList(json,TableFieldVO.class);
        return result;
    }

    public static TableFieldVO parseToVo(TableFieldEntity entity) throws IOException {
        String jsonStr=JsonUtility.toObjectString(entity);
        return JsonUtility.toObject(jsonStr,TableFieldVO.class);
    }

    public static TableFieldEntity parseToEntity(TableFieldVO vo) throws IOException {
        String jsonStr=JsonUtility.toObjectString(vo);
        return JsonUtility.toObject(jsonStr,TableFieldEntity.class);
    }

    public static boolean isUpdate(TableFieldVO oldVo,TableFieldVO newVo) throws JBuild4DGenerallyException {
        if(oldVo.getFieldId().equals(newVo.getFieldId())){
            if(!newVo.getFieldName().equals(oldVo.getFieldName())){
                return true;
            }
            else if(!newVo.getFieldDataType().equals(oldVo.getFieldDataType())){
                return true;
            }
            else if(newVo.getFieldDataLength().intValue()!=oldVo.getFieldDataLength().intValue()){
                return true;
            }
            else if(newVo.getFieldDecimalLength().intValue()!=newVo.getFieldDecimalLength().intValue()){
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
