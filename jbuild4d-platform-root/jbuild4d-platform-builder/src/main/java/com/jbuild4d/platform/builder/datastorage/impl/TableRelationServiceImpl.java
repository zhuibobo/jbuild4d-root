package com.jbuild4d.platform.builder.datastorage.impl;
import java.util.Date;
import java.util.List;

import com.jbuild4d.base.dbaccess.dao.builder.TableRelationMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.TableRelationEntityWithBLOBs;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.ITableRelationService;
import org.mybatis.spring.SqlSessionTemplate;

public class TableRelationServiceImpl extends BaseServiceImpl<TableRelationEntityWithBLOBs> implements ITableRelationService
{
    TableRelationMapper tableRelationMapper;
    public TableRelationServiceImpl(TableRelationMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableRelationMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, TableRelationEntityWithBLOBs record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<TableRelationEntityWithBLOBs>() {
            @Override
            public TableRelationEntityWithBLOBs run(JB4DSession jb4DSession,TableRelationEntityWithBLOBs sourceEntity) throws JBuild4DGenerallyException {
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
    public List<TableRelationEntityWithBLOBs> getRelationByGroup(JB4DSession jb4DSession, String groupId) {
        return tableRelationMapper.selectByGroupId(groupId);
    }

    @Override
    public void updateDiagram(JB4DSession jb4DSession, String recordId, String relationContent, String relationDiagramJson) throws JBuild4DGenerallyException {
        TableRelationEntityWithBLOBs tableRelationEntityWithBLOBs=getByPrimaryKey(jb4DSession,recordId);
        if(tableRelationEntityWithBLOBs!=null){
            tableRelationEntityWithBLOBs.setRelationContent(relationContent);
            tableRelationEntityWithBLOBs.setRelationDiagramJson(relationDiagramJson);
            this.updateByKeySelective(jb4DSession,tableRelationEntityWithBLOBs);
        }
        else {
            throw new JBuild4DGenerallyException("不存在记录为" + recordId + "的数据!");
        }
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableRelationEntityWithBLOBs selfEntity=tableRelationMapper.selectByPrimaryKey(id);
        TableRelationEntityWithBLOBs ltEntity=tableRelationMapper.selectLessThanRecord(id,selfEntity.getRelationGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        TableRelationEntityWithBLOBs selfEntity=tableRelationMapper.selectByPrimaryKey(id);
        TableRelationEntityWithBLOBs ltEntity=tableRelationMapper.selectGreaterThanRecord(id,selfEntity.getRelationGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(TableRelationEntityWithBLOBs toEntity,TableRelationEntityWithBLOBs selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getRelationOrderNum();
            toEntity.setRelationOrderNum(selfEntity.getRelationOrderNum());
            selfEntity.setRelationOrderNum(newNum);
            tableRelationMapper.updateByPrimaryKeySelective(toEntity);
            tableRelationMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
