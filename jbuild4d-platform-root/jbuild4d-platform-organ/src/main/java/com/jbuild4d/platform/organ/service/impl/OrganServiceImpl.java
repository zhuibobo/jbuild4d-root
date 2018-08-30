package com.jbuild4d.platform.organ.service.impl;

import com.jbuild4d.base.dbaccess.dao.organrelevance.OrganMapper;
import com.jbuild4d.base.dbaccess.dbentities.organrelevance.OrganEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.platform.organ.service.IOrganService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */

public class OrganServiceImpl extends BaseServiceImpl<OrganEntity> implements IOrganService
{
    private String rootId="0";
    private String rootParentId="-1";

    OrganMapper organMapper;
    public OrganServiceImpl(OrganMapper _defaultBaseMapper,SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        organMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, OrganEntity record) throws JBuild4DGenerallyException {
        return super.save(jb4DSession,id, record, new IAddBefore<OrganEntity>() {
            @Override
            public OrganEntity run(JB4DSession jb4DSession,OrganEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setOrganChildCount(0);
                sourceEntity.setOrganOrderNum(organMapper.nextOrderNum());
                sourceEntity.setOrganCreateTime(new Date());
                String parentIdList;
                if(sourceEntity.getOrganId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setOrganParentId(rootParentId);
                }
                else
                {
                    OrganEntity parentEntity=organMapper.selectByPrimaryKey(sourceEntity.getOrganParentId());
                    parentIdList=parentEntity.getOrganParentIdList();
                    parentEntity.setOrganChildCount(parentEntity.getOrganChildCount()+1);
                    organMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setOrganParentIdList(parentIdList+"*"+sourceEntity.getOrganId());
                return sourceEntity;
            }
        });
    }

    @Override
    public OrganEntity createRootOrgan(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        OrganEntity organEntity=new OrganEntity();
        //treeTableEntity.setDdglParentId(rootId);
        organEntity.setOrganCreateTime(new Date());
        organEntity.setOrganCode("0000");
        organEntity.setOrganId(rootId);
        organEntity.setOrganName("组织机构管理");
        organEntity.setOrganNo("0000");
        organEntity.setOrganIsVirtual(TrueFalseEnum.False.getDisplayName());
        organEntity.setOrganParentId(rootParentId);
        organEntity.setOrganStatus("启用");
        this.save(jb4DSession,organEntity.getOrganId(),organEntity);
        return organEntity;
    }

    @Override
    public void statusChange(JB4DSession jb4DSession, String ids, String status) throws JBuild4DGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                OrganEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setOrganStatus(status);
                organMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        OrganEntity selfEntity=organMapper.selectByPrimaryKey(id);
        OrganEntity ltEntity=organMapper.selectLessThanRecord(id,selfEntity.getOrganParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        OrganEntity selfEntity=organMapper.selectByPrimaryKey(id);
        OrganEntity ltEntity=organMapper.selectGreaterThanRecord(id,selfEntity.getOrganParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(OrganEntity toEntity,OrganEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getOrganOrderNum();
            toEntity.setOrganOrderNum(selfEntity.getOrganOrderNum());
            selfEntity.setOrganOrderNum(newNum);
            organMapper.updateByPrimaryKeySelective(toEntity);
            organMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
