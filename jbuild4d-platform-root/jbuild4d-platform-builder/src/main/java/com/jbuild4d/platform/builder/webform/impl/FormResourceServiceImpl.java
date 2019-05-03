package com.jbuild4d.platform.builder.webform.impl;

import com.jbuild4d.base.dbaccess.dao.builder.FormResourceMapper;
import com.jbuild4d.base.dbaccess.dbentities.builder.FormResourceEntity;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.htmldesign.IHTMLRuntimeResolve;
import com.jbuild4d.platform.builder.module.IModuleService;
import com.jbuild4d.platform.builder.vo.RecordDataVo;
import com.jbuild4d.platform.builder.webform.IFormResourceService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/11/13
 * To change this template use File | Settings | File Templates.
 */
public class FormResourceServiceImpl extends BaseServiceImpl<FormResourceEntity> implements IFormResourceService {
    FormResourceMapper formResourceMapper;
    IModuleService moduleService;

    @Autowired
    IHTMLRuntimeResolve htmlRuntimeResolve;

    public FormResourceServiceImpl(FormResourceMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService, IModuleService _moduleService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        formResourceMapper = _defaultBaseMapper;
        moduleService = _moduleService;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, FormResourceEntity record) throws JBuild4DGenerallyException {

        //修改时设置为未解析的状态.
        //record.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
        //保存时进行同步的表单内容的解析,并存入对应的字段中.
        String resolvedHtml=htmlRuntimeResolve.resolveSourceHTML(jb4DSession,id,record);
        record.setFormHtmlResolve(resolvedHtml);
        record.setFormIsResolve(TrueFalseEnum.True.getDisplayName());

        return super.save(jb4DSession, id, record, new IAddBefore<FormResourceEntity>() {
            @Override
            public FormResourceEntity run(JB4DSession jb4DSession, FormResourceEntity sourceEntity) throws JBuild4DGenerallyException {
                //设置排序,以及其他参数--nextOrderNum()
                sourceEntity.setFormOrderNum(formResourceMapper.nextOrderNum());
                sourceEntity.setFormCreater(jb4DSession.getUserName());
                sourceEntity.setFormCreateTime(new Date());
                sourceEntity.setFormIsResolve(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormIssystem(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormIsTemplate(TrueFalseEnum.False.getDisplayName());
                sourceEntity.setFormOrganId(jb4DSession.getOrganId());
                sourceEntity.setFormOrganName(jb4DSession.getOrganName());
                sourceEntity.setFormUpdater(jb4DSession.getUserName());
                sourceEntity.setFormUpdateTime(new Date());
                sourceEntity.setFormCode(moduleService.buildModuleItemCode(sourceEntity.getFormOrderNum()));
                return sourceEntity;
            }
        });
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        FormResourceEntity selfEntity = formResourceMapper.selectByPrimaryKey(id);
        FormResourceEntity ltEntity = formResourceMapper.selectGreaterThanRecord(id, selfEntity.getFormModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        FormResourceEntity selfEntity = formResourceMapper.selectByPrimaryKey(id);
        FormResourceEntity ltEntity = formResourceMapper.selectLessThanRecord(id, selfEntity.getFormModuleId());
        switchOrder(ltEntity, selfEntity);
    }

    private void switchOrder(FormResourceEntity toEntity, FormResourceEntity selfEntity) {
        if (toEntity != null) {
            int newNum = toEntity.getFormOrderNum();
            toEntity.setFormOrderNum(selfEntity.getFormOrderNum());
            selfEntity.setFormOrderNum(newNum);
            formResourceMapper.updateByPrimaryKeySelective(toEntity);
            formResourceMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public String getFormPreviewHTMLContent(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        return getFormRuntimeHTMLContent(jb4DSession,id,null);
    }

    @Override
    public String getFormRuntimeHTMLContent(JB4DSession jb4DSession, String id, RecordDataVo recordDataVo) throws JBuild4DGenerallyException {
        FormResourceEntity formResourceEntityWithBLOBs=getByPrimaryKey(jb4DSession,id);
        String runtimeForm=htmlRuntimeResolve.dynamicBind(jb4DSession,id,formResourceEntityWithBLOBs,formResourceEntityWithBLOBs.getFormHtmlResolve(),recordDataVo);
        return runtimeForm;
    }
}
