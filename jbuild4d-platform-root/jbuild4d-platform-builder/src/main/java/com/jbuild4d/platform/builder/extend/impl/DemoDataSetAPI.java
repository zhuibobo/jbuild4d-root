package com.jbuild4d.platform.builder.extend.impl;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.platform.builder.extend.IDataSetAPI;
import com.jbuild4d.platform.builder.vo.DataSetColumnVo;
import com.jbuild4d.platform.builder.vo.DataSetRelatedTableVo;
import com.jbuild4d.platform.builder.vo.DataSetVo;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/7
 * To change this template use File | Settings | File Templates.
 */
public class DemoDataSetAPI implements IDataSetAPI {
    @Override
    public DataSetVo getDataSetStructure(JB4DSession session, String dsId, String op,String groupId,String paras) {
        DataSetVo dataSetVo= new DataSetVo();

        dataSetVo.setDsId(UUIDUtility.getUUID());
        dataSetVo.setDsCaption("测试API结果集");
        dataSetVo.setDsName("DemoDataSetAPI");
        dataSetVo.setDsOrganId(session.getOrganId());
        dataSetVo.setDsCreateTime(new Date());
        dataSetVo.setDsCreater(session.getUserName());
        dataSetVo.setDsUpdateTime(new Date());
        dataSetVo.setDsUpdater(session.getUserName());
        dataSetVo.setDsType("APIDataSet");
        dataSetVo.setDsIssystem(TrueFalseEnum.False.getDisplayName());
        dataSetVo.setDsOrderNum(0);
        dataSetVo.setDsDesc("");
        dataSetVo.setDsGroupId(groupId);
        dataSetVo.setDsStatus(EnableTypeEnum.enable.getDisplayName());
        dataSetVo.setDsSqlSelectText("");
        dataSetVo.setDsSqlSelectValue("");
        dataSetVo.setDsClassName("com.jbuild4d.platform.builder.extend.impl.DemoDataSetAPI");
        dataSetVo.setDsRestStructureUrl("");
        dataSetVo.setDsRestDataUrl("");

        List<DataSetColumnVo> dataSetColumnVoList=new ArrayList<>();

        for(int i=0;i<10;i++){
            DataSetColumnVo dataSetColumnVo=new DataSetColumnVo();
            dataSetColumnVo.setColumnId(UUIDUtility.getUUID());
            dataSetColumnVo.setColumnDsId(dataSetVo.getDsId());
            dataSetColumnVo.setColumnCaption("标题"+i);
            dataSetColumnVo.setColumnName("NAME"+i);
            dataSetColumnVo.setColumnIsCustom("否");
            dataSetColumnVo.setColumnOrderNum(i+1);
            dataSetColumnVo.setColumnTableName("API_TABLE");
            dataSetColumnVoList.add(dataSetColumnVo);
        }

        List<DataSetRelatedTableVo> dataSetRelatedTableVoList=new ArrayList<>();

        dataSetVo.setColumnVoList(dataSetColumnVoList);
        dataSetVo.setRelatedTableVoList(dataSetRelatedTableVoList);

        return dataSetVo;
    }
}
