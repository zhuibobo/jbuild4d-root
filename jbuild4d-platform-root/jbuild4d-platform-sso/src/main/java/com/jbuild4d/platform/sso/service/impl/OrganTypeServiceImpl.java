package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.OrganTypeMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganTypeEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.IUpdateBefore;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.platform.sso.service.IOrganTypeService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/27
 * To change this template use File | Settings | File Templates.
 */
public class OrganTypeServiceImpl extends BaseServiceImpl<OrganTypeEntity> implements IOrganTypeService
{
    public static String getValueExistErrorMsg(String value){
        return String.format("已经存在值为:%s的组织类型!", value);
    }

    OrganTypeMapper organTypeMapper;
    public OrganTypeServiceImpl(OrganTypeMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        organTypeMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, OrganTypeEntity record) throws JBuild4DGenerallyException {
        //判断是否存在相同Value的记录
        String value = record.getOrganTypeValue();
        return super.save(jb4DSession, id, record, new IAddBefore<OrganTypeEntity>() {
            @Override
            public OrganTypeEntity run(JB4DSession jb4DSession, OrganTypeEntity sourceEntity) throws JBuild4DGenerallyException {

                if (organTypeMapper.selectByOrganValue(value) == null) {
                    sourceEntity.setOrganTypeStatus(EnableTypeEnum.enable.getDisplayName());
                    sourceEntity.setOrganTypeOrderNum(organTypeMapper.nextOrderNum());
                    sourceEntity.setOrganTypeCreateTime(new Date());
                    return sourceEntity;
                } else {
                    throw new JBuild4DGenerallyException(getValueExistErrorMsg(value));
                }
            }
        }, new IUpdateBefore<OrganTypeEntity>() {
            @Override
            public OrganTypeEntity run(JB4DSession jb4DSession, OrganTypeEntity sourceEntity) throws JBuild4DGenerallyException {
                OrganTypeEntity oldEntity=organTypeMapper.selectByOrganValue(value);
                if (oldEntity!=null){
                    if(!oldEntity.getOrganTypeId().equals(sourceEntity.getOrganTypeId())){
                        throw new JBuild4DGenerallyException(getValueExistErrorMsg(value));
                    }
                }
                return sourceEntity;
            }
        });
    }

    @Override
    public void createDefaultOrganType(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        OrganTypeEntity organTypeEntity=new OrganTypeEntity();
        organTypeEntity.setOrganTypeId("0");
        organTypeEntity.setOrganTypeValue("TYPE10001");
        organTypeEntity.setOrganTypeName("默认类型");
        organTypeEntity.setOrganTypeDesc("默认类型");
        organTypeEntity.setOrganTypeCreateTime(new Date());
        organTypeEntity.setOrganTypeStatus(EnableTypeEnum.enable.getDisplayName());
        this.saveSimple(jb4DSession,organTypeEntity.getOrganTypeId(),organTypeEntity);
    }

    @Override
    public void statusChange(JB4DSession jb4DSession, String ids, String status) throws JBuild4DGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                OrganTypeEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setOrganTypeStatus(status);
                organTypeMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        OrganTypeEntity gtEntity=organTypeMapper.selectGreaterThanRecord(id);
        switchOrder(id, gtEntity);
    }

    private void switchOrder(String id, OrganTypeEntity toEntity) {
        if(toEntity !=null){
            OrganTypeEntity selfEntity=organTypeMapper.selectByPrimaryKey(id);
            int newNum= toEntity.getOrganTypeOrderNum();
            toEntity.setOrganTypeOrderNum(selfEntity.getOrganTypeOrderNum());
            selfEntity.setOrganTypeOrderNum(newNum);
            organTypeMapper.updateByPrimaryKeySelective(toEntity);
            organTypeMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        OrganTypeEntity ltEntity=organTypeMapper.selectLessThanRecord(id);
        switchOrder(id, ltEntity);
    }
}
