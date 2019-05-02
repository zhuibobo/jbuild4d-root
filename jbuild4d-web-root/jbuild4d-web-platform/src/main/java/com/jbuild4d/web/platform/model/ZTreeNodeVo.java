package com.jbuild4d.web.platform.model;

import com.jbuild4d.base.dbaccess.dbentities.builder.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/10
 * To change this template use File | Settings | File Templates.
 */
public class ZTreeNodeVo {
    String value;
    String text;
    String id;
    String parentId;
    String outerId;
    String code;
    String attr1;
    String attr2;
    String attr3;
    String attr4;
    String nodeTypeName;
    boolean nocheck;



    public boolean isNocheck() {
        return nocheck;
    }

    public void setNocheck(boolean nocheck) {
        this.nocheck = nocheck;
    }

    public String getNodeTypeName() {
        return nodeTypeName;
    }

    public void setNodeTypeName(String nodeTypeName) {
        this.nodeTypeName = nodeTypeName;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getAttr1() {
        return attr1;
    }

    public void setAttr1(String attr1) {
        this.attr1 = attr1;
    }

    public String getAttr2() {
        return attr2;
    }

    public void setAttr2(String attr2) {
        this.attr2 = attr2;
    }

    public String getAttr3() {
        return attr3;
    }

    public void setAttr3(String attr3) {
        this.attr3 = attr3;
    }

    public String getAttr4() {
        return attr4;
    }

    public void setAttr4(String attr4) {
        this.attr4 = attr4;
    }

    public String getOuterId() {
        return outerId;
    }

    public void setOuterId(String outerId) {
        this.outerId = outerId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public static List<ZTreeNodeVo> parseTableToZTreeNodeList(List<TableGroupEntity> tableGroupEntityList, List<TableEntity> tableEntityList){
        List<ZTreeNodeVo> result=new ArrayList<>();
        for (TableGroupEntity tableGroupEntity : tableGroupEntityList) {
            ZTreeNodeVo nodeVo=new ZTreeNodeVo();
            nodeVo.setId(tableGroupEntity.getTableGroupId());
            nodeVo.setValue(tableGroupEntity.getTableGroupValue());
            nodeVo.setText(tableGroupEntity.getTableGroupText());
            nodeVo.setAttr1(tableGroupEntity.getTableGroupText());
            nodeVo.setParentId(tableGroupEntity.getTableGroupParentId());
            nodeVo.setNocheck(true);
            nodeVo.setNodeTypeName("TableGroup");
            nodeVo.setOuterId(tableGroupEntity.getTableGroupLinkId());
            result.add(nodeVo);
        }

        for (TableEntity tableEntity : tableEntityList) {
            ZTreeNodeVo nodeVo=new ZTreeNodeVo();
            nodeVo.setId(tableEntity.getTableId());
            nodeVo.setValue(tableEntity.getTableName());
            nodeVo.setText("【"+tableEntity.getTableCode()+"】"+tableEntity.getTableCaption()+"【"+tableEntity.getTableName()+"】");
            nodeVo.setAttr1(tableEntity.getTableCaption());
            nodeVo.setParentId(tableEntity.getTableGroupId());
            nodeVo.setNodeTypeName("Table");
            nodeVo.setNocheck(false);
            nodeVo.setOuterId(tableEntity.getTableLinkId());
            nodeVo.setCode(tableEntity.getTableCode());
            result.add(nodeVo);
        }

        return result;
    }

    public static List<ZTreeNodeVo> parseDataSetToZTreeNodeList(List<DatasetGroupEntity> datasetGroupEntityList, List<DatasetEntity> datasetEntityList){
        List<ZTreeNodeVo> result=new ArrayList<>();
        for (DatasetGroupEntity group : datasetGroupEntityList) {
            ZTreeNodeVo nodeVo=new ZTreeNodeVo();
            nodeVo.setId(group.getDsGroupId());
            nodeVo.setValue(group.getDsGroupValue());
            nodeVo.setText(group.getDsGroupText());
            nodeVo.setAttr1(group.getDsGroupText());
            nodeVo.setParentId(group.getDsGroupParentId());
            nodeVo.setNocheck(true);
            nodeVo.setNodeTypeName("DataSetGroup");
            result.add(nodeVo);
        }

        for (DatasetEntity datasetEntity : datasetEntityList) {
            ZTreeNodeVo nodeVo=new ZTreeNodeVo();
            nodeVo.setId(datasetEntity.getDsId());
            nodeVo.setValue(datasetEntity.getDsName());
            nodeVo.setText(datasetEntity.getDsCaption()+"【"+datasetEntity.getDsCode()+"】");
            nodeVo.setAttr1(datasetEntity.getDsCaption());
            nodeVo.setParentId(datasetEntity.getDsGroupId());
            nodeVo.setNodeTypeName("DataSet");
            nodeVo.setNocheck(false);
            result.add(nodeVo);
        }

        return result;
    }

    public static List<ZTreeNodeVo> parseWebFormToZTreeNodeList(List<ModuleEntity> moduleEntityList, List<FormResourceEntity> formResourceEntityList) {
        Map<String,ModuleEntity> temp=new HashMap<>();
        List<ZTreeNodeVo> result=new ArrayList<>();
        for (ModuleEntity moduleEntity : moduleEntityList) {
            ZTreeNodeVo nodeVo=new ZTreeNodeVo();
            nodeVo.setId(moduleEntity.getModuleId());
            nodeVo.setValue(moduleEntity.getModuleValue());
            nodeVo.setText(moduleEntity.getModuleText());
            nodeVo.setAttr1(moduleEntity.getModuleText());
            nodeVo.setParentId(moduleEntity.getModuleParentId());
            nodeVo.setNocheck(true);
            nodeVo.setNodeTypeName("Module");
            result.add(nodeVo);

            temp.put(moduleEntity.getModuleId(),moduleEntity);
        }

        for (FormResourceEntity formResourceEntity : formResourceEntityList) {
            ZTreeNodeVo nodeVo=new ZTreeNodeVo();
            nodeVo.setId(formResourceEntity.getFormId());
            nodeVo.setValue(formResourceEntity.getFormId());
            nodeVo.setText(formResourceEntity.getFormName()+"【"+formResourceEntity.getFormCode()+"】");
            nodeVo.setAttr1(formResourceEntity.getFormName());
            nodeVo.setAttr2(formResourceEntity.getFormCode());
            nodeVo.setAttr3(temp.get(formResourceEntity.getFormModuleId()).getModuleText());
            nodeVo.setAttr4(formResourceEntity.getFormModuleId());
            nodeVo.setParentId(formResourceEntity.getFormModuleId());
            nodeVo.setNodeTypeName("WebForm");
            nodeVo.setNocheck(false);
            result.add(nodeVo);
        }

        return result;
    }
}
