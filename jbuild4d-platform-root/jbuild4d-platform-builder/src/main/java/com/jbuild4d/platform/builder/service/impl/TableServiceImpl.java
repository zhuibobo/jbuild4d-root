package com.jbuild4d.platform.builder.service.impl;

import com.jbuild4d.base.dbaccess.dao.TableFieldMapper;
import com.jbuild4d.base.dbaccess.dao.TableMapper;
import com.jbuild4d.base.dbaccess.dbentities.TableEntity;
import com.jbuild4d.base.service.IAddBefore;
import com.jbuild4d.base.service.ISQLBuilderService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.service.impl.BaseServiceImpl;
import com.jbuild4d.platform.builder.dbtablebuilder.BuilderResultMessage;
import com.jbuild4d.platform.builder.dbtablebuilder.TableBuilederFace;
import com.jbuild4d.platform.builder.service.ITableService;
import com.jbuild4d.platform.builder.vo.TableFieldVO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/30
 * To change this template use File | Settings | File Templates.
 */
public class TableServiceImpl extends BaseServiceImpl<TableEntity> implements ITableService
{
    TableBuilederFace tableBuilederFace;
    TableMapper tableMapper;
    TableFieldMapper tableFieldMapper;
    public TableServiceImpl(TableMapper _tableMapper,TableFieldMapper _tableFieldMapper, SqlSessionTemplate _sqlSessionTemplate, ISQLBuilderService _sqlBuilderService) throws JBuild4DGenerallyException {
        super(_tableMapper, _sqlSessionTemplate, _sqlBuilderService);
        tableMapper=_tableMapper;
        tableBuilederFace=TableBuilederFace.getInstance(_sqlBuilderService);
        tableFieldMapper=_tableFieldMapper;
    }

    @Override
    public int save(JB4DSession jb4DSession, String id, TableEntity record) throws JBuild4DGenerallyException {
        throw new JBuild4DGenerallyException("未使用改方法");
    }

    @Transactional(rollbackFor=JBuild4DGenerallyException.class)
    public void newTable(JB4DSession jb4DSession, String tableId, TableEntity tableEntity, List<TableFieldVO> tableFieldVOList) throws JBuild4DGenerallyException {
        try {
            if (this.existTableName(tableEntity.getTableName())) {
                throw new JBuild4DGenerallyException("已经存在表名为" + tableEntity.getTableName() + "的表!");
            } else {
                //创建物理表
                BuilderResultMessage builderResultMessage = tableBuilederFace.newTable(tableEntity, tableFieldVOList);
                if (builderResultMessage.isSuccess()) {
                    //写入逻辑表
                    tableMapper.insertSelective(tableEntity);
                    //写入字段

                }
                else{
                    throw new JBuild4DGenerallyException(builderResultMessage.getMessage());
                }
            }
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }
}
