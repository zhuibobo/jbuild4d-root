package com.jbuild4d.platform.system.devdemo.impl;

import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTreeTableMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTreeTableEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.platform.system.devdemo.IDevDemoTreeTableService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/23
 * To change this template use File | Settings | File Templates.
 */
public class DevDemoTreeTableServiceImpl extends BaseServiceImpl<DevDemoTreeTableEntity> implements IDevDemoTreeTableService {

    DevDemoTreeTableMapper devDemoTreeTableMapper;

    private String rootId="0";
    private String rootParentId="-1";

    public DevDemoTreeTableServiceImpl(DevDemoTreeTableMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        devDemoTreeTableMapper=_defaultBaseMapper;
    }

    @Override
    public int saveSimple(JB4DSession jb4DSession, String id, DevDemoTreeTableEntity entity) throws JBuild4DGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DevDemoTreeTableEntity>() {
            @Override
            public DevDemoTreeTableEntity run(JB4DSession jb4DSession, DevDemoTreeTableEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setDdttChildCount(0);
                sourceEntity.setDdttOrderNum(devDemoTreeTableMapper.nextOrderNum());
                sourceEntity.setDdttCreatetime(new Date());
                String parentIdList;
                if(sourceEntity.getDdttId().equals(rootId)){
                    parentIdList=rootParentId;
                    sourceEntity.setDdttParentId(rootParentId);
                }
                else
                {
                    DevDemoTreeTableEntity parentEntity=devDemoTreeTableMapper.selectByPrimaryKey(sourceEntity.getDdttParentId());
                    parentIdList=parentEntity.getDdttParentIdlist();
                    parentEntity.setDdttChildCount(parentEntity.getDdttChildCount()+1);
                    devDemoTreeTableMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setDdttParentIdlist(parentIdList+"*"+sourceEntity.getDdttId());
                return sourceEntity;
            }
        });
    }

    @Override
    public DevDemoTreeTableEntity createRootNode(JB4DSession jb4DSession) throws JBuild4DGenerallyException {
        DevDemoTreeTableEntity treeTableEntity=new DevDemoTreeTableEntity();
        //treeTableEntity.setDdglParentId(rootId);
        treeTableEntity.setDdttId("0");
        treeTableEntity.setDdttKey("Root");
        treeTableEntity.setDdttName("Root");
        treeTableEntity.setDdttValue("Root");
        treeTableEntity.setDdttStatus("启用");
        this.saveSimple(jb4DSession,treeTableEntity.getDdttId(),treeTableEntity);
        return treeTableEntity;
    }


    @Override
    public void statusChange(JB4DSession jb4DSession, String ids, String status) throws JBuild4DGenerallyException {
        if(StringUtility.isNotEmpty(ids)) {
            String[] idArray = ids.split(";");
            for (int i = 0; i < idArray.length; i++) {
                DevDemoTreeTableEntity entity = getByPrimaryKey(jb4DSession, idArray[i]);
                entity.setDdttStatus(status);
                devDemoTreeTableMapper.updateByPrimaryKeySelective(entity);
            }
        }
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoTreeTableEntity selfEntity=devDemoTreeTableMapper.selectByPrimaryKey(id);
        DevDemoTreeTableEntity ltEntity=devDemoTreeTableMapper.selectLessThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoTreeTableEntity selfEntity=devDemoTreeTableMapper.selectByPrimaryKey(id);
        DevDemoTreeTableEntity ltEntity=devDemoTreeTableMapper.selectGreaterThanRecord(id,selfEntity.getDdttParentId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DevDemoTreeTableEntity toEntity,DevDemoTreeTableEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDdttOrderNum();
            toEntity.setDdttOrderNum(selfEntity.getDdttOrderNum());
            selfEntity.setDdttOrderNum(newNum);
            devDemoTreeTableMapper.updateByPrimaryKeySelective(toEntity);
            devDemoTreeTableMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
