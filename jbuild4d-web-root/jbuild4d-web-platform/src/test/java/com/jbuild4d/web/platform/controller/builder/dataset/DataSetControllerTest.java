package com.jbuild4d.web.platform.controller.builder.dataset;
import com.jbuild4d.base.dbaccess.dbentities.builder.DatasetEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.platform.builder.exenum.DataSetTypeEnum;
import com.jbuild4d.platform.builder.service.IDatasetService;
import com.jbuild4d.platform.builder.vo.DataSetVo;
import com.jbuild4d.platform.builder.vo.SQLResolveToDataSetVo;
import com.jbuild4d.web.platform.controller.ControllerTestBase;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/9/3
 * To change this template use File | Settings | File Templates.
 */
public class DataSetControllerTest extends ControllerTestBase {

    @Autowired
    IDatasetService datasetService;

    private String dataSetId="UnitTestDataSet001";
    private String dataSetGroupId=DataSetGroupControllerTest.devGroupId;

    @Test
    public void addSQLDataSet() throws Exception {

        DatasetEntity existDataSet=datasetService.getByPrimaryKey(getSession(),dataSetId);
        if(existDataSet!=null){
            datasetService.deleteByKeyNotValidate(getSession(),dataSetId);
        }
        if(existDataSet==null) {
            DataSetSQLDesignerControllerTest dataSetSQLDesignerControllerTest = new DataSetSQLDesignerControllerTest();
            JBuild4DResponseVo jBuild4DResponseVo = dataSetSQLDesignerControllerTest.validateSQLEnable("select TDEV_TEST_1.*,TDEV_TEST_2.F_TABLE1_ID,'address' address,'sex' sex from TDEV_TEST_1 join TDEV_TEST_2 on TDEV_TEST_1.ID=TDEV_TEST_2.F_TABLE1_ID where TDEV_TEST_1.ID='#{ApiVar.当前用户所在组织ID}'");
            SQLResolveToDataSetVo resolveToDataSetVo = (SQLResolveToDataSetVo) jBuild4DResponseVo.getData();
            JB4DSession jb4DSession=getSession();
            DataSetVo dataSetVo = new DataSetVo();
            dataSetVo.setDsId(dataSetId);
            dataSetVo.setDsCaption("单元测试数据集");
            dataSetVo.setDsName("单元测试数据集");
            dataSetVo.setDsOrganId(0);
            dataSetVo.setDsCreateTime(new Date());
            dataSetVo.setDsCreater(jb4DSession.getUserName());
            dataSetVo.setDsUpdateTime(new Date());
            dataSetVo.setDsUpdater(jb4DSession.getUserName());
            dataSetVo.setDsType(DataSetTypeEnum.SQLDataSet.getText());
            dataSetVo.setDsIssystem(TrueFalseEnum.False.getDisplayName());
            dataSetVo.setDsGroupId(dataSetGroupId);
            dataSetVo.setDsStatus(EnableTypeEnum.enable.getDisplayName());
            dataSetVo.setDsSqlSelectText(resolveToDataSetVo.getSqlWithEnvText());
            dataSetVo.setDsSqlSelectValue(resolveToDataSetVo.getSqlWithEnvValue());
            dataSetVo.setDsClassName("");
            dataSetVo.setDsRestUrl("");

            做到这里
        }
    }
}
