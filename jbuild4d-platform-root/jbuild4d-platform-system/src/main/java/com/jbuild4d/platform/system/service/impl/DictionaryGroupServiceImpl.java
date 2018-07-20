package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.DictionaryGroupMapper;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.dbaccess.exenum.TrueFalseEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryGroupServiceImpl extends BaseServiceImpl<DictionaryGroupEntity> implements IDictionaryGroupService {

    DictionaryGroupMapper dictionaryGroupMapper;

    public DictionaryGroupServiceImpl(DictionaryGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dictionaryGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveBySelective(JB4DSession jb4DSession, String id, DictionaryGroupEntity record) throws JBuild4DGenerallyException {
        return super.saveBySelective(jb4DSession,id, record, new IAddBefore<DictionaryGroupEntity>() {
            @Override
            public DictionaryGroupEntity run(JB4DSession jb4DSession1,DictionaryGroupEntity item) throws JBuild4DGenerallyException {
                item.setDictGroupOrderNum(dictionaryGroupMapper.nextOrderNum());
                item.setDictGroupStatus(EnableTypeEnum.enable.getDisplayName());
                item.setDictGroupCreateTime(new Date());
                return item;
            }
        });
    }

    @Override
    public void statusChange(JB4DSession jb4DSession,String ids,String status) {
        String[] idArray=ids.split(";");
        for(int i=0;i<idArray.length;i++){
            DictionaryGroupEntity dictionaryGroupEntity=getByPrimaryKey(jb4DSession,idArray[i]);
            dictionaryGroupEntity.setDictGroupStatus(status);
            dictionaryGroupMapper.updateByPrimaryKeySelective(dictionaryGroupEntity);
        }
    }

    @Override
    public int deleteByKey(JB4DSession jb4DSession, String id) throws JBuild4DGenerallyException {
        DictionaryGroupEntity dictionaryGroupEntity=dictionaryGroupMapper.selectByPrimaryKey(id);
        if(dictionaryGroupEntity!=null){
            if(dictionaryGroupEntity.getDictGroupIssystem().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DGenerallyException.getSystemRecordDelException();
            }
            if(dictionaryGroupEntity.getDictGroupDelEnable().equals(TrueFalseEnum.True.getDisplayName())){
                throw JBuild4DGenerallyException.getDBFieldSettingDelException();
            }
            List<DictionaryGroupEntity> childEntityList=dictionaryGroupMapper.selectChilds(id);
            if(childEntityList!=null&&childEntityList.size()>0){
                throw JBuild4DGenerallyException.getHadChildDelException();
            }
            return super.deleteByKey(jb4DSession, id);
        }
        else
        {
            throw new JBuild4DGenerallyException("找不到要删除的记录!");
        }
    }
}
