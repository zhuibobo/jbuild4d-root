package com.jbuild4d.platform.sso.service.impl;

import com.jbuild4d.base.dbaccess.dao.sso.OrganMapper;
import com.jbuild4d.base.dbaccess.dbentities.sso.OrganEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.base.tools.cache.IBuildGeneralObj;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.base.tools.BeanUtility;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.core.base.tools.XMLUtility;
import com.jbuild4d.platform.sso.service.IOnOrganChangeAware;
import com.jbuild4d.platform.sso.service.IOrganService;
import com.jbuild4d.base.service.general.JBuild4DProp;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.xml.xpath.XPathExpressionException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

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

    String configResource= "/sso/OrganInitConfig.xml";
    Document xmlDocument=null;

    OrganMapper organMapper;
    IJb4dCacheService jb4dCacheService;

    public OrganServiceImpl(OrganMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService,IJb4dCacheService _jb4dCacheService){
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        organMapper=_defaultBaseMapper;
        jb4dCacheService=_jb4dCacheService;
    }

    @Override
    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    public int saveSimple(JB4DSession jb4DSession, String id, OrganEntity record) throws JBuild4DGenerallyException {
        boolean isNew=false;
        if(this.getByPrimaryKey(jb4DSession,id)==null){
            isNew=true;
        }

        int result=super.save(jb4DSession,id, record, new IAddBefore<OrganEntity>() {
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

        if(isNew){
            this.awareCreatedOrgan(jb4DSession,record);
        }
        else{
            this.awareUpdatedOrgan(jb4DSession,record);
        }

        return result;
    }

    private void awareCreatedOrgan(JB4DSession jb4DSession, OrganEntity organEntity) throws JBuild4DGenerallyException {
        xmlDocument=getOrganInitConfigDoc();
        try {
            List<Node> nodeList=XMLUtility.parseForNodeList(xmlDocument,"//Bean");
            for (Node node : nodeList) {
                String beanName=XMLUtility.getAttribute(node,"Name");
                IOnOrganChangeAware createOrganAware= BeanUtility.getBean(beanName);
                if(createOrganAware==null){
                    throw new JBuild4DGenerallyException("再容器中找不到名称为"+beanName+"的Bean");
                }
                else {
                    createOrganAware.organCreated(jb4DSession,organEntity);
                }
            }

        } catch (XPathExpressionException e) {
            throw new JBuild4DGenerallyException(e);
        }
    }

    private void awareUpdatedOrgan(JB4DSession jb4DSession, OrganEntity organEntity) throws JBuild4DGenerallyException {
        xmlDocument=getOrganInitConfigDoc();
        try {
            List<Node> nodeList=XMLUtility.parseForNodeList(xmlDocument,"//Bean");
            for (Node node : nodeList) {
                String beanName=XMLUtility.getAttribute(node,"Name");
                IOnOrganChangeAware createOrganAware= BeanUtility.getBean(beanName);
                if(createOrganAware==null){
                    throw new JBuild4DGenerallyException("再容器中找不到名称为"+beanName+"的Bean");
                }
                else {
                    createOrganAware.organUpdated(jb4DSession,organEntity);
                }
            }

        } catch (XPathExpressionException e) {
            throw new JBuild4DGenerallyException(e);
        }
    }

    private Document getOrganInitConfigDoc() throws JBuild4DGenerallyException {
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformSSOCacheName, jb4dCacheService.sysRunStatusIsDebug(), "OrganServiceImpl.getOrganInitConfigDoc", new IBuildGeneralObj<Document>() {
            @Override
            public Document BuildObj() throws JBuild4DGenerallyException {
                try
                {
                    InputStream inputStream = this.getClass().getResourceAsStream(configResource);
                    Document _xml = XMLUtility.parseForDoc(inputStream);
                    return _xml;
                }
                catch (Exception ex){
                    ex.printStackTrace();
                    throw new JBuild4DGenerallyException(ex.getMessage());
                }
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
        organEntity.setOrganStatus(EnableTypeEnum.enable.getDisplayName());
        organEntity.setOrganShortName("组织管理");
        this.saveSimple(jb4DSession,organEntity.getOrganId(),organEntity);
        return organEntity;
    }

    @Override
    public void deleteByOrganName(JB4DSession session, String organName, String warningOperationCode) {
        if(JBuild4DProp.getWarningOperationCode().equals(warningOperationCode)){
            organMapper.deleteByOrganName(organName);
        }
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        OrganEntity organEntity=getByPrimaryKey(jb4DSession,id);
        organEntity.setOrganStatus(EnableTypeEnum.delete.getDisplayName());
        return organMapper.updateByPrimaryKey(organEntity);
        //return super.deleteByKey(jb4DSession, id);
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
