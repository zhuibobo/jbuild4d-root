package com.jbuild4d.platform.system.service.impl;
import com.jbuild4d.base.dbaccess.dao.systemsetting.HistoryDataMapper;
import com.jbuild4d.base.dbaccess.dbentities.systemsetting.HistoryDataEntity;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.platform.system.service.IHistoryDataService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

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
        historyDataMapper=_defaultBaseMapper;
    }

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

    @Override
    public void keepRecordData(JB4DSession jb4DSession, String tableName, String recordId, String recordData){
        HistoryDataEntity historyDataEntity=new HistoryDataEntity();
        historyDataEntity.setHistoryId(UUIDUtility.getUUID());
        historyDataEntity.setHistoryOrganId(jb4DSession.getOrganId());
        historyDataEntity.setHistoryOrganName(jb4DSession.getOrganName());
        historyDataEntity.setHistoryUserId(jb4DSession.getUserId());
        historyDataEntity.setHistoryUserName(jb4DSession.getUserName());
        historyDataEntity.setHistoryCreatetime(new Date());
        historyDataEntity.setHistoryTableName(tableName);
        historyDataEntity.setHistoryRecordId(recordId);
        historyDataEntity.setHistoryRecord(recordData);

        historyDataMapper.insert(historyDataEntity);
    }
}
