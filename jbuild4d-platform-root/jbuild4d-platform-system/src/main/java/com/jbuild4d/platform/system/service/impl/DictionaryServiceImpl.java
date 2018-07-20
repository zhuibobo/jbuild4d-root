package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.DictionaryMapper;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.IGeneralService;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.system.service.IDictionaryService;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.Date;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryServiceImpl extends BaseServiceImpl<DictionaryEntity> implements IDictionaryService {

    DictionaryMapper dictionaryMapper;

    public DictionaryServiceImpl(DictionaryMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _sqlBuilderService);
        dictionaryMapper=_defaultBaseMapper;
    }

    @Override
    public int saveBySelective(JB4DSession jb4DSession, String id, DictionaryEntity entity) throws JBuild4DGenerallyException {
        return this.saveBySelective(jb4DSession, id, entity, new IAddBefore<DictionaryEntity>() {
            @Override
            public DictionaryEntity run(JB4DSession jb4DSession, DictionaryEntity sourceEntity) throws JBuild4DGenerallyException {
                sourceEntity.setDictChildCount(0);
                sourceEntity.setDictOrderNum(dictionaryMapper.nextOrderNum());
                sourceEntity.setDictCreateTime(new Date());
                String parentIdList;
                if(sourceEntity.getDictParentId().equals(sourceEntity.getDictGroupId())){
                    parentIdList=sourceEntity.getDictParentId();
                }
                else
                {
                    DictionaryEntity parentDictionEntity=dictionaryMapper.selectByPrimaryKey(sourceEntity.getDictParentId());
                    parentIdList=parentDictionEntity.getDictParentIdlist();
                }
                sourceEntity.setDictParentIdlist(parentIdList+"*"+sourceEntity.getDictId());
                sourceEntity.setDictOrganId(jb4DSession.getOrganId());
                sourceEntity.setDictOrganName(jb4DSession.getOrganName());
                sourceEntity.setDictUserId(jb4DSession.getUserId());
                sourceEntity.setDictUserName(jb4DSession.getUserName());
                return sourceEntity;
            }
        });
    }

    @Override
    public List<DictionaryEntity> getListDataByGroupId(JB4DSession session, String groupId) {
        return dictionaryMapper.selectByGroupId(groupId);
    }
}
