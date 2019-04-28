package com.jbuild4d.platform.builder.datastorage.impl;
import java.util.Date;

import com.jbuild4d.base.dbaccess.dao.builder.DbLinkMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.DbLinkEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.builder.datastorage.IDbLinkService;
import com.jbuild4d.platform.builder.datastorage.ITableGroupService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

public class DbLinkServiceImpl extends BaseServiceImpl<DbLinkEntity> implements IDbLinkService
{
    DbLinkMapper dbLinkMapper;

    @Autowired
    ITableGroupService tableGroupService;

    public DbLinkServiceImpl(DbLinkMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dbLinkMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, DbLinkEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<DbLinkEntity>() {
            @Override
            public DbLinkEntity run(JB4DSession jb4DSession,DbLinkEntity sourceEntity) throws JBuild4DGenerallyException {
                //自动创建该连接的表分组根节点
                tableGroupService.deleteByKeyNotValidate(jb4DSession,id, JBuild4DProp.getWarningOperationCode());
                tableGroupService.createRootNode(jb4DSession,id,record.getDbLinkName(),record.getDbLinkValue());

                sourceEntity.setDbCreateTime(new Date());
                sourceEntity.setDbOrderNum(dbLinkMapper.nextOrderNum());
                sourceEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
                sourceEntity.setDbOrganId(jb4DSession.getOrganId());
                sourceEntity.setDbOrganName(jb4DSession.getOrganName());

                if(record.getDbIsLocation()==null||record.getDbIsLocation().equals("")){
                    record.setDbIsLocation(TrueFalseEnum.False.getDisplayName());
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public String getLocationDBLinkId(){
        return "JBuild4dLocationDBLink";
    }

    @Override
    public DbLinkEntity getDBLinkEntity(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        return this.getByPrimaryKey(jb4DSession,this.getLocationDBLinkId());
    }

    @Override
    public void createLocationDBLink(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        DbLinkEntity dbLinkEntity=new DbLinkEntity();
        dbLinkEntity.setDbId(this.getLocationDBLinkId());
        dbLinkEntity.setDbLinkValue("Location");
        dbLinkEntity.setDbLinkName("应用构建库连接");
        dbLinkEntity.setDbType("Location");
        dbLinkEntity.setDbDriverName("Location");
        dbLinkEntity.setDbDatabaseName("Location");
        dbLinkEntity.setDbUrl("Location");
        dbLinkEntity.setDbUser("Location");
        dbLinkEntity.setDbPassword("Location");
        dbLinkEntity.setDbDesc("应用构建库本身数据库连接");
        dbLinkEntity.setDbIsLocation(TrueFalseEnum.True.getDisplayName());
        dbLinkEntity.setDbStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DSession,dbLinkEntity.getDbId(),dbLinkEntity);
    }
}