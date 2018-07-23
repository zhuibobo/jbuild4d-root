package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dao.DevDemoTreeTableMapper;
import com.jbuild4d.base.dbaccess.dbentities.DevDemoGenListEntity;
import com.jbuild4d.base.dbaccess.dbentities.DevDemoTreeTableEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IDevDemoGenListService;
import com.jbuild4d.platform.system.service.IDevDemoTreeTableService;
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

    public DevDemoTreeTableServiceImpl(DevDemoTreeTableMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        devDemoTreeTableMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DevDemoTreeTableEntity entity) throws JBuild4DGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DevDemoTreeTableEntity>() {
            @Override
            public DevDemoTreeTableEntity run(JB4DSession jb4DSession, DevDemoTreeTableEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setDdglChildCount(0);
                sourceEntity.setDdttOrderNum(devDemoTreeTableMapper.nextOrderNum());
                sourceEntity.setDdttCreatetime(new Date());
                String parentIdList;
                if(sourceEntity.getDdttId().equals(rootId)){
                    parentIdList="-1";
                    sourceEntity.setDdglParentId("-1");
                }
                else
                {
                    DevDemoTreeTableEntity parentEntity=devDemoTreeTableMapper.selectByPrimaryKey(sourceEntity.getDdglParentId());
                    parentIdList=parentEntity.getDdglParentIdlist();
                    parentEntity.setDdglChildCount(parentEntity.getDdglChildCount()+1);
                    devDemoTreeTableMapper.updateByPrimaryKeySelective(parentEntity);
                }
                sourceEntity.setDdglParentIdlist(parentIdList+"*"+sourceEntity.getDdttId());
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
        this.save(jb4DSession,treeTableEntity.getDdttId(),treeTableEntity);
        return treeTableEntity;
    }
}
