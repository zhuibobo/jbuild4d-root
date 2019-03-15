package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.core.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.cache.IBuildGeneralObj;
import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.core.base.tools.ClassUtility;
import com.jbuild4d.core.base.tools.StringUtility;
import com.jbuild4d.core.base.tools.XMLUtility;
import com.jbuild4d.core.base.list.IListWhereCondition;
import com.jbuild4d.core.base.list.ListUtility;
import com.jbuild4d.platform.system.extend.apivariable.IAPIVariableCreater;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.service.IJb4dCacheService;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/8/3
 * To change this template use File | Settings | File Templates.
 */
public class EnvVariableServiceImpl implements IEnvVariableService {

    static String configResource= "envvariable"+File.separator+"EnvVariableConfig.xml";
    IJb4dCacheService jb4dCacheService;

    public EnvVariableServiceImpl(IJb4dCacheService _jb4dCacheService) {
        jb4dCacheService=_jb4dCacheService;
    }

    @Override
    public List<EnvVariableVo> getDateTimeVars() throws JBuild4DGenerallyException {
        return ListUtility.Where(getVoListFromCache(), new IListWhereCondition<EnvVariableVo>() {
            @Override
            public boolean Condition(EnvVariableVo item) {
                return item.getType().equals("DateTime");
            }
        });
    }

    @Override
    public List<EnvVariableVo> getAPIVars() throws JBuild4DGenerallyException {
        return ListUtility.Where(getVoListFromCache(), new IListWhereCondition<EnvVariableVo>() {
            @Override
            public boolean Condition(EnvVariableVo item) {
                return item.getType().equals("ApiVar");
            }
        });
    }

    @Override
    public String execEnvVarResult(JB4DSession jb4DSession, String value) throws XPathExpressionException, JBuild4DGenerallyException, IOException, SAXException, ParserConfigurationException {
        List<EnvVariableVo> envVariableVoList=getVoListFromCache();
        EnvVariableVo envVariableVo=ListUtility.WhereSingle(envVariableVoList, new IListWhereCondition<EnvVariableVo>() {
            @Override
            public boolean Condition(EnvVariableVo item) {
                return item.getValue().equals(value);
            }
        });
        if(envVariableVo==null){
            throw new JBuild4DGenerallyException("找不到Value为"+value+"的变量节点!");
        }
        String className=envVariableVo.getClassName();
        if(StringUtility.isEmpty(className)){
            throw new JBuild4DGenerallyException("Value为"+value+"的变量节点中未设置对应的ClassName!");
        }
        IAPIVariableCreater varCreater=null;
        try {
            varCreater=(IAPIVariableCreater)ClassUtility.loadClass(className).newInstance();
        } catch (InstantiationException ex) {
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        } catch (IllegalAccessException ex) {
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }

        try {
            return varCreater.createVar(jb4DSession,envVariableVo);
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }

    @Override
    public String getValueByName(String name) throws XPathExpressionException, ParserConfigurationException, IOException, SAXException, JBuild4DGenerallyException {
        List<EnvVariableVo> _allEnvVariableVoList=getVoListFromCache();
        EnvVariableVo vo=ListUtility.WhereSingle(_allEnvVariableVoList, new IListWhereCondition<EnvVariableVo>() {
            @Override
            public boolean Condition(EnvVariableVo item) {
                return item.getText().equals(name);
            }
        });
        if(vo==null){
            return "";
        }
        return vo.getValue();
    }

    private List<EnvVariableVo> getVoListFromCache() throws JBuild4DGenerallyException {
        /*List<EnvVariableVo> allEnvVariableVoList=null;
        if(jb4dCacheService.sysRunStatusIsDebug()){
            allEnvVariableVoList=loadDocumentToVoList();
            return allEnvVariableVoList;
        }
        else{
            allEnvVariableVoList=JB4DCacheManager.getObject(JB4DCacheManager.jb4dPlatformBuilderCacheName,"EnvVariableVoList");
            if(allEnvVariableVoList==null){
                allEnvVariableVoList=loadDocumentToVoList();
                JB4DCacheManager.put(JB4DCacheManager.jb4dPlatformBuilderCacheName,"EnvVariableVoList",allEnvVariableVoList);
                return allEnvVariableVoList;
            }
            return allEnvVariableVoList;
        }*/
        return JB4DCacheManager.autoGetFromCache(JB4DCacheManager.jb4dPlatformBuilderCacheName, jb4dCacheService.sysRunStatusIsDebug(), "EnvVariableVoList", new IBuildGeneralObj<List<EnvVariableVo>>() {
            @Override
            public List<EnvVariableVo> BuildObj() throws JBuild4DGenerallyException {
                return loadDocumentToVoList();
            }
        });
    }

    private List<EnvVariableVo> loadDocumentToVoList() throws JBuild4DGenerallyException {
        try {
            Document xmlDocument = null;
            List<EnvVariableVo> allEnvVariableVoList = null;
            InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(configResource);
            xmlDocument = XMLUtility.parseForDoc(inputStream);
            validateDocumentEnable(xmlDocument);
            allEnvVariableVoList = new ArrayList<>();
            /*List<Node> nodes = XMLUtility.parseForNodeList(xmlDocument, "//EnvVariable");
            for (Node node : nodes) {
                allEnvVariableVoList.add(EnvVariableVo.parseEnvVarNode(node, "", ""));
            }*/
            Node groupRootNode = XMLUtility.parseForNode(xmlDocument, "/Config/Type[@Value='DateTime']/Group");
            EnvVariableVo groupRootVo = EnvVariableVo.parseGroupNode(groupRootNode, "-1", "DateTime");
            allEnvVariableVoList.add(groupRootVo);
            loopLoadGroup(allEnvVariableVoList, groupRootNode, groupRootVo, "DateTime");

            groupRootNode = XMLUtility.parseForNode(xmlDocument, "/Config/Type[@Value='ApiVar']/Group");
            groupRootVo = EnvVariableVo.parseGroupNode(groupRootNode, "-1", "ApiVar");
            allEnvVariableVoList.add(groupRootVo);
            loopLoadGroup(allEnvVariableVoList, groupRootNode, groupRootVo, "ApiVar");

            return allEnvVariableVoList;
        }
        catch (Exception ex){
            ex.printStackTrace();
            throw new JBuild4DGenerallyException(ex.getMessage());
        }
    }

    private void loopLoadGroup(List<EnvVariableVo> result,Node parentGroupNode,EnvVariableVo parentGroupVo,String type){
        NodeList childNodes = parentGroupNode.getChildNodes();
        for(int i=0;i<childNodes.getLength();i++){
            if(childNodes.item(i).getNodeName().equals("Group")){
                EnvVariableVo groupVo=EnvVariableVo.parseGroupNode(childNodes.item(i),parentGroupVo.getId(), type);
                result.add(groupVo);
                loopLoadGroup(result,childNodes.item(i),groupVo, type);
            }
            else if(childNodes.item(i).getNodeName().equals("EnvVariable")){
                EnvVariableVo groupVo=EnvVariableVo.parseEnvVarNode(childNodes.item(i),parentGroupVo.getId(), type);
                result.add(groupVo);
            }
        }
    }

    private void validateDocumentEnable(Document xmlDocument) throws XPathExpressionException, JBuild4DGenerallyException, ParserConfigurationException, SAXException, IOException {
        //Document xmlDocument=XMLUtility.parseForDoc(configResource);
        List<Node> nodes=XMLUtility.parseForNodeList(xmlDocument,"//EnvVariable");
        List<EnvVariableVo> voList=new ArrayList<>();
        for (Node node : nodes) {
            EnvVariableVo vo=EnvVariableVo.parseEnvVarNode(node,"-1","");
            if(vo.getValue().equals("")){
                throw new JBuild4DGenerallyException("存在Value为空的EnvVariable节点!");
            }
            if(ListUtility.Exist(voList, new IListWhereCondition<EnvVariableVo>() {
                @Override
                public boolean Condition(EnvVariableVo item) {
                    return item.getValue().equals(vo.getValue());
                }
            })){
                throw new JBuild4DGenerallyException("存在Value="+vo.getValue()+"的重复EnvVariable节点!");
            }
            if(ListUtility.Exist(voList, new IListWhereCondition<EnvVariableVo>() {
                @Override
                public boolean Condition(EnvVariableVo item) {
                    return item.getText().equals(vo.getText());
                }
            })){
                throw new JBuild4DGenerallyException("存在Text="+vo.getText()+"的重复EnvVariable节点!");
            }
            voList.add(vo);
        }
    }
}
