package com.jbuild4d.platform.system.devdemo.impl;

import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTLTreeMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.devdemo.IDevDemoTLTreeService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
public class DevDemoTLTreeServiceImpl  extends BaseServiceImpl<DevDemoTLTreeEntity> implements IDevDemoTLTreeService {

    DevDemoTLTreeMapper devDemoTLTreeMapper;

    private String rootId="0";
    private String rootParentId="-1";

    public DevDemoTLTreeServiceImpl(DevDemoTLTreeMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        devDemoTLTreeMapper=_defaultBaseMapper;
    }

    @Override
    public DevDemoTLTreeEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        DevDemoTLTreeEntity treeTableEntity=new DevDemoTLTreeEntity();
        treeTableEntity.setDdttId("0");
        treeTableEntity.setDdttKey("Root");
        treeTableEntity.setDdttName("Root");
        treeTableEntity.setDdttValue("Root");
        treeTableEntity.setDdttStatus("启用");
        this.saveSimple(jb4DSession,treeTableEntity.getDdttId(),treeTableEntity);
        return treeTableEntity;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, DevDemoTLTreeEntity entity) throws JBuild4DGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DevDemoTLTreeEntity>() {
            @Override
            public DevDemoTLTreeEntity run(JB4DSession jb4DSession, DevDemoTLTreeEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setDdttChildCount(0);
                sourceEntity.setDdttOrderNum(devDemoTLTreeMapper.nextOrderNum());
                sourceEntity.setDdttCreatetime(new Date());
                String parentIdList;
                if(sourceEntity.getDdttId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setDdttParentId(rootParentId);
                }
                else
                {
                    DevDemoTLTreeEntity parentEntity=devDemoTLTreeMapper.selectByPrimaryKey(sourceEntity.getDdttParentId());
                    parentIdList=parentEntity.getDdttParentIdlist();
                    parentEntity.setDdttChildCount(parentEntity.getDdttChildCount()+1);
                    devDemoTLTreeMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setDdttParentIdlist(parentIdList+"*"+sourceEntity.getDdttId());
                return sourceEntity;
            }
        });
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoTLTreeEntity selfEntity=devDemoTLTreeMapper.selectByPrimaryKey(id);
        DevDemoTLTreeEntity ltEntity=devDemoTLTreeMapper.selectLessThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoTLTreeEntity selfEntity=devDemoTLTreeMapper.selectByPrimaryKey(id);
        DevDemoTLTreeEntity ltEntity=devDemoTLTreeMapper.selectGreaterThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DevDemoTLTreeEntity toEntity,DevDemoTLTreeEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDdttOrderNum();
            toEntity.setDdttOrderNum(selfEntity.getDdttOrderNum());
            selfEntity.setDdttOrderNum(newNum);
            String temp="";
            devDemoTLTreeMapper.updateByPrimaryKeySelective(toEntity);
            devDemoTLTreeMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
