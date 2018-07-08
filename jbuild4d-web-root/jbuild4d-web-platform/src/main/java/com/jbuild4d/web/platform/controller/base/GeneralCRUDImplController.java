package com.jbuild4d.web.platform.controller.base;

import com.github.pagehelper.PageInfo;
import com.jbuild4d.base.service.IBaseService;
import com.jbuild4d.base.service.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.UUIDUtility;
import com.jbuild4d.web.platform.model.JBuild4DResponseVo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

public abstract class GeneralCRUDImplController<T> implements IGeneralCRUDController<T> {

    IBaseService<T> baseService;
    T nullEntity;

    public IBaseService<T> getBaseService() {
        return baseService;
    }

    public void setBaseService(IBaseService<T> baseService) {
        this.baseService = baseService;
    }

    public T getNullEntity() {
        return nullEntity;
    }

    public void setNullEntity(T nullEntity) {
        this.nullEntity = nullEntity;
    }

    @RequestMapping(value = "List", method = RequestMethod.GET)
    public ModelAndView list() {
        ModelAndView modelAndView=new ModelAndView(getListViewName());
        return modelAndView;
    }

    public abstract String getListViewName();

    @RequestMapping(value = "GetListData", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo getListData(Integer pageSize,Integer pageNum,String search_condition) {
        PageInfo<T> proOrganPageInfo=baseService.getPage(pageNum,pageSize);
        return JBuild4DResponseVo.success("获取成功",proOrganPageInfo);
    }

    @RequestMapping(value = "Detail", method = RequestMethod.GET)
    public ModelAndView detail(String recordId,String op) {
        ModelAndView modelAndView=new ModelAndView(getDetailViewName());

        T entity=null;
        if(StringUtility.isEmpty(recordId)) {
            entity=nullEntity;
            modelAndView.addObject("recordId", UUIDUtility.getUUID());
        }
        else {
            entity=baseService.getByPrimaryKey(recordId);
            modelAndView.addObject("recordId", recordId);
        }
        modelAndView.addObject("entity",entity);
        modelAndView.addObject("op",op);
        return modelAndView;
    }

    public abstract String getDetailViewName();

    @RequestMapping(value = "SaveEdit", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo saveEdit(@RequestBody T entity) {
        try {
            baseService.saveBySelective(entityId(entity), entity);
            return JBuild4DResponseVo.saveSuccess();
        } catch (JBuild4DGenerallyException e) {
            return JBuild4DResponseVo.error(e.getMessage());
        }
    }

    public abstract String entityId(T entity);

    @RequestMapping(value = "StatusChange", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo statusChange(String ids,String status) {
        //BaseService.statusChange(ids,status);
        //dictionaryGroupService.saveBySelective(dictionaryEntity.getDictGroupId(), dictionaryEntity);
        return JBuild4DResponseVo.saveSuccess();
    }

    @RequestMapping(value = "Delete", method = RequestMethod.POST)
    @ResponseBody
    public JBuild4DResponseVo Delete(String recordId) {
        baseService.deleteByKey(recordId);
        return JBuild4DResponseVo.opSuccess();
    }
}
