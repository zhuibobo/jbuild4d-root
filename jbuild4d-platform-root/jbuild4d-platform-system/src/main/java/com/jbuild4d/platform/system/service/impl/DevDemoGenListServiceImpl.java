package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.DevDemoGenListMapper;
import com.jbuild4d.base.dbaccess.dbentities.DevDemoGenListEntity;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IDevDemoGenListService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/15
 * To change this template use File | Settings | File Templates.
 */
public class DevDemoGenListServiceImpl extends BaseServiceImpl<DevDemoGenListEntity> implements IDevDemoGenListService
{
    DevDemoGenListMapper devDemoGenListMapper;

    public DevDemoGenListServiceImpl(DevDemoGenListMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        devDemoGenListMapper=_defaultBaseMapper;
    }

    @Override
    public int saveBySelective(JB4DSession jb4DSession, String id, DevDemoGenListEntity record) throws JBuild4DGenerallyException {
        return super.saveBySelective(jb4DSession,id, record, new IAddBefore<DevDemoGenListEntity>() {
            @Override
            public DevDemoGenListEntity run(JB4DSession jb4DSession,DevDemoGenListEntity item) throws JBuild4DGenerallyException {
                item.setDdglUserId(jb4DSession.getUserId());
                item.setDdglUserName(jb4DSession.getUserName());
                item.setDdglOrganId(jb4DSession.getOrganId());
                item.setDdglOrganName(jb4DSession.getOrganName());
                item.setDdglOrderNum((long) devDemoGenListMapper.nextOrderNum());
                item.setDdglStatus("启用");
                return item;
            }
        });
    }

    @Override
    public void statusChange(JB4DSession jb4DSession,String ids,String status) {
        String[] idArray=ids.split(";");
        for(int i=0;i<idArray.length;i++){
            DevDemoGenListEntity entity=getByPrimaryKey(jb4DSession,idArray[i]);
            entity.setDdglStatus(status);
            devDemoGenListMapper.updateByPrimaryKeySelective(entity);
        }
    }

    @Override
    public void moveUp(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoGenListEntity gtEntity=devDemoGenListMapper.selectGreaterThanRecord(id);
        switchOrder(id, gtEntity);
    }

    private void switchOrder(String id, DevDemoGenListEntity toEntity) {
        if(toEntity !=null){
            DevDemoGenListEntity selfEntity=devDemoGenListMapper.selectByPrimaryKey(id);
            long newNum= toEntity.getDdglOrderNum();
            toEntity.setDdglOrderNum(selfEntity.getDdglOrderNum());
            selfEntity.setDdglOrderNum(newNum);
            devDemoGenListMapper.updateByPrimaryKeySelective(toEntity);
            devDemoGenListMapper.updateByPrimaryKeySelective(selfEntity);
        }
    }

    @Override
    public void moveDown(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DevDemoGenListEntity ltEntity=devDemoGenListMapper.selectLessThanRecord(id);
        switchOrder(id, ltEntity);
    }
}
