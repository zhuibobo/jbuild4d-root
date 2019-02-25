package com.jbuild4d.platform.system.service.impl;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.systemsetting.HistoryDataMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.HistoryDataEntity;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IHistoryDataService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/2/25
 * To change this template use File | Settings | File Templates.
 */
public class HistoryDataServiceImpl implements IHistoryDataService
{
    HistoryDataMapper historyDataMapper;
    public HistoryDataServiceImpl(HistoryDataMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        //super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        historyDataMapper=_defaultBaseMapper;
    }

    /*@Override
    public int save(JB4DSession jb4DSession, String id, HistoryDataEntity record) throws JBuild4DGenerallyException {
        throw
    }*/

    @Override
    public void keepRecordData(JB4DSession jb4DSession, Object record){
        HistoryDataEntity historyDataEntity=new HistoryDataEntity();
        historyDataEntity.setHistoryId("");
        historyDataEntity.setHistoryOrganId("");
        historyDataEntity.setHistoryOrganName("");
        historyDataEntity.setHistoryUserId("");
        historyDataEntity.setHistoryUserName("");
        historyDataEntity.setHistoryCreatetime(new Date());
        historyDataEntity.setHistoryTableName("");
        historyDataEntity.setHistoryRecordId("");
        historyDataEntity.setHistoryRecord("");

        historyDataMapper.insert(historyDataEntity);
    }
}
