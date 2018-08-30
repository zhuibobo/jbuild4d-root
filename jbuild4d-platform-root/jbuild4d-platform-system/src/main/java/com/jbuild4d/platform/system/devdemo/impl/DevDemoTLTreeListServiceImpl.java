package com.jbuild4d.platform.system.devdemo.impl;

import com.jbuild4d.base.dbaccess.dao.devdemo.DevDemoTLTreeListMapper;
import com.jbuild4d.base.dbaccess.dbentities.devdemo.DevDemoTLTreeListEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.devdemo.IDevDemoTLTreeListService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/24
 * To change this template use File | Settings | File Templates.
 */
public class DevDemoTLTreeListServiceImpl extends BaseServiceImpl<DevDemoTLTreeListEntity> implements IDevDemoTLTreeListService {

    DevDemoTLTreeListMapper devDemoTLTreeListMapper;

    public DevDemoTLTreeListServiceImpl(DevDemoTLTreeListMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        devDemoTLTreeListMapper=_defaultBaseMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, DevDemoTLTreeListEntity entity) throws JBuild4DGenerallyException {
        return this.save(jb4DSession, id, entity, new IAddBefore<DevDemoTLTreeListEntity>() {
            @Override
            public DevDemoTLTreeListEntity run(JB4DSession jb4DSession, DevDemoTLTreeListEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setDdtlCreatetime(new Date());
                sourceEntity.setDdtlOrderNum(devDemoTLTreeListMapper.nextOrderNum());
                return sourceEntity;
            }
        });
    }


    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoTLTreeListEntity selfEntity=devDemoTLTreeListMapper.selectByPrimaryKey(id);
        DevDemoTLTreeListEntity ltEntity=devDemoTLTreeListMapper.selectGreaterThanRecord(id,selfEntity.getDdtlGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoTLTreeListEntity selfEntity=devDemoTLTreeListMapper.selectByPrimaryKey(id);
        DevDemoTLTreeListEntity ltEntity=devDemoTLTreeListMapper.selectLessThanRecord(id,selfEntity.getDdtlGroupId());
        switchOrder(ltEntity,selfEntity);
    }

    private void switchOrder(DevDemoTLTreeListEntity toEntity,DevDemoTLTreeListEntity selfEntity) {
        if(toEntity !=null){
            int newNum= toEntity.getDdtlOrderNum();
            toEntity.setDdtlOrderNum(selfEntity.getDdtlOrderNum());
            selfEntity.setDdtlOrderNum(newNum);
            devDemoTLTreeListMapper.updateByPrimaryKeySelective(toEntity);
            devDemoTLTreeListMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }
}
