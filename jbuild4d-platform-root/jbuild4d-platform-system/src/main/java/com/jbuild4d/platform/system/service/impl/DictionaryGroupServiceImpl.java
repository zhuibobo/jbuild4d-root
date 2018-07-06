package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.dbaccess.dao.BaseMapper;
import com.jbuild4d.base.dbaccess.dao.DictionaryGroupMapper;
import com.jbuild4d.base.dbaccess.dao.GeneralMapper;
import com.jbuild4d.base.dbaccess.dbentities.DictionaryGroupEntity;
import com.jbuild4d.base.dbaccess.exenum.EnableTypeEnum;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.impl.BaseService;
import com.jbuild4d.platform.system.service.IDictionaryGroupService;
import org.mybatis.spring.SqlSessionTemplate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/5
 * To change this template use File | Settings | File Templates.
 */
public class DictionaryGroupServiceImpl  extends BaseService<DictionaryGroupEntity> implements IDictionaryGroupService {

    DictionaryGroupMapper dictionaryGroupMapper;

    public DictionaryGroupServiceImpl(DictionaryGroupMapper _defaultBaseMapper, SqlSessionTemplate _sqlSessionTemplate, GeneralMapper _generalMapper) {
        super(_defaultBaseMapper, _sqlSessionTemplate, _generalMapper);
        dictionaryGroupMapper=_defaultBaseMapper;
    }

    @Override
    public int saveBySelective(String id, DictionaryGroupEntity record) {
        return super.saveBySelective(id, record, new IAddBefore<DictionaryGroupEntity>() {
            @Override
            public DictionaryGroupEntity run(DictionaryGroupEntity item) {
                item.setDictGroupOrderNum(generalMapper.nextOrderNum("TB4D_DICTIONARY_GROUP","DICT_GROUP_ORDER_NUM"));
                item.setDictGroupStatus(EnableTypeEnum.enable.getDisplayName());
                return item;
            }
        });
    }
}
