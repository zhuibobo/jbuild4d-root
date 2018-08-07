package com.jbuild4d.platform.system.service.impl;

import com.jbuild4d.base.exception.JBuild4DGenerallyException;
import com.jbuild4d.base.service.general.JB4DSession;
import com.jbuild4d.base.tools.common.ClassUtility;
import com.jbuild4d.base.tools.common.StringUtility;
import com.jbuild4d.base.tools.common.XMLUtility;
import com.jbuild4d.base.tools.common.list.IListWhereCondition;
import com.jbuild4d.base.tools.common.list.ListUtility;
import com.jbuild4d.platform.system.apivariable.IAPIVariableCreater;
import com.jbuild4d.platform.system.service.IEnvVariableService;
import com.jbuild4d.platform.system.vo.EnvVariableVo;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPathExpressionException;
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

    static String configResouce="EnvVariableConfig.xml";
    static Document xmlDocuemnt=null;
    static List<EnvVariableVo> allEnvVariableVoList=null;

    public EnvVariableServiceImpl() throws ParserConfigurationException, SAXException, IOException, XPathExpressionException, JBuild4DGenerallyException {
        if(xmlDocuemnt==null) {
            InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(configResouce);
            xmlDocuemnt = XMLUtility.parseForDoc(inputStream);
            validateDocumentEnable();
        }
    }

    @Override
    public List<EnvVariableVo> getDateTimeVars() throws XPathExpressionException {
        //List<Node> nodes=XMLUtility.parseForNodeList(xmlDocuemnt,"//Config/Tab[@Value='DateTime']/EnvVariable");
        List<EnvVariableVo> result=new ArrayList<>();
        Node groupRootNode=XMLUtility.parseForNode(xmlDocuemnt,"/Config/Type[@Value='DateTime']/Group");
        EnvVariableVo groupRootVo=EnvVariableVo.parseGroupNode(groupRootNode,"-1","DateTime");
        result.add(groupRootVo);
        loopLoadGroup(result,groupRootNode,groupRootVo,"DateTime");
        return result;
    }

    @Override
    public List<EnvVariableVo> getAPIVars() throws XPathExpressionException {
        Node groupRootNode=XMLUtility.parseForNode(xmlDocuemnt,"/Config/Type[@Value='ApiVar']/Group");
        List<EnvVariableVo> result=new ArrayList<>();
        EnvVariableVo groupRootVo=EnvVariableVo.parseGroupNode(groupRootNode,"-1","ApiVar");
        result.add(groupRootVo);
        loopLoadGroup(result,groupRootNode,groupRootVo, "ApiVar");
        return result;
    }

    @Override
    public String execEnvVarResult(JB4DSession jb4DSession, String value) throws XPathExpressionException, JBuild4DGenerallyException {
        List<EnvVariableVo> envVariableVoList=loadDocuemntToVoList();
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

    private List<EnvVariableVo> loadDocuemntToVoList() throws XPathExpressionException {
        if(allEnvVariableVoList==null){
            allEnvVariableVoList=new ArrayList<>();
            List<Node> nodes=XMLUtility.parseForNodeList(xmlDocuemnt,"//EnvVariable");
            for (Node node : nodes) {
                allEnvVariableVoList.add(EnvVariableVo.parseEnvVarNode(node,"",""));
            }
        }
        return allEnvVariableVoList;
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

    private void validateDocumentEnable() throws XPathExpressionException, JBuild4DGenerallyException {
        List<Node> nodes=XMLUtility.parseForNodeList(xmlDocuemnt,"//EnvVariable");
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
                throw new JBuild4DGenerallyException("存在Value="+vo.getValue()+"的EnvVariable节点!");
            }
            voList.add(vo);
        }
    }
}
