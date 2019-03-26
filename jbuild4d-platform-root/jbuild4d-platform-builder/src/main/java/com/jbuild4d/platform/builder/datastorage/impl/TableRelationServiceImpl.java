package com.jbuild4d.platform.builder.datastorage.impl;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.dao.builder.TableRelationMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.ITableRelationService;
import org.mybatis.spring.SqlSessionTemplate;

public class TableRelationServiceImpl extends BaseServiceImpl<TableRelationEntity> implements ITableRelationService
{
    TableRelationMapper tableRelationMapper;
    public TableRelationServiceImpl(TableRelationMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableRelationMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableRelationEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableRelationEntity>() {
            @Override
            public TableRelationEntity run(JB4DSession jb4DSession,TableRelationEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setRelationUserId(jb4DSession.getUserId());
                sourceEntity.setRelationUserName(jb4DSession.getUserName());
                sourceEntity.setRelationOrderNum(tableRelationMapper.nextOrderNum());
                sourceEntity.setRelationCreateTime(new Date());
                sourceEntity.setRelationStatus(EnableTypeEnum.enable.getDisplayName());
                return sourceEntity;
            }
        });
    }

    @Override
    public List<TableRelationEntity> getRelationByGroup(JB4DSession session, String groupId) {
        return tableRelationMapper.selectByGroupId(groupId);
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableRelationEntity selfEntity=tableRelationMapper.selectByPrimaryKey(id);
        TableRelationEntity ltEntity=tableRelationMapper.selectLessThanRecord(id,selfEntity.getRelationGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableRelationEntity selfEntity=tableRelationMapper.selectByPrimaryKey(id);
        TableRelationEntity ltEntity=tableRelationMapper.selectGreaterThanRecord(id,selfEntity.getRelationGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(TableRelationEntity toEntity,TableRelationEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getRelationOrderNum();
            toEntity.setRelationOrderNum(selfEntity.getRelationOrderNum());
            selfEntity.setRelationOrderNum(newNum);
            tableRelationMapper.updateByPrimaryKeySelective(toEntity);
            tableRelationMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
