package com.jbuild4d.base.tools.common;
/*
* 文件名: XmlUtils.java
* 版权信息：CopyRight By liliang ? 2009
* 功能描述:xml操作工具类，提供一些对XML文件常见操作的公有方法。
* 修改人：liliang
* 修改时间:2009-06-26
* 修改内容：获取指定节点的属性增加了通过判断是Element后直接使用getAttirubte(name)的方式获取。
*/

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import javax.xml.namespace.QName;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.XMLInputFactory;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.DOMException;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;


/**
 * XML文件操作相关的工具类。该类的主要功能有：
 * 1.根据xml文件的名字获取Document对象。
 * 2.根据字节输入流获取一个Document对象。
 * 3.根据字符串获取一个Document对象。
 * 4.通过XPath表达式获取单个节点。
 * 5.通过XPath表达式获取多个节点。
 * 6.通过XPath表达式获取字符串值。
 * 7.通过XPath表达式获取布尔值。
 * 8.将Document输出到指定的文件。
 * 9.获取Node节点的属性值。
 * 10.替换node节点。
 * 11.将Node节点转换成字符串。
 */
public class XMLUtility {

    /**
     * 获取Document对象。根据xml文件的名字获取Document对象。
     *
     * @param file 要获取对象的xml文件全路径。
     * @return 返回获取到的Document对象。
     * @throws IOException                  如果发生任何 IO 错误时抛出此异常。
     * @throws SAXException                 如果发生任何解析错误时抛出此异常。
     * @throws ParserConfigurationException 如果无法创建满足所请求配置的 DocumentBuilder，将抛出该异常。
     * @throws NullPointerException         如果file为空时，抛出此异常。
     */
    public static Document parseForDoc(final String file) throws SAXException, IOException, SecurityException,
            NullPointerException, ParserConfigurationException {
        return XMLUtility.parseForDoc(new FileInputStream(file));
    }

    /**
     * 将一个xml字符串解析成Document对象。
     *
     * @param xmlStr   要被解析的xml字符串。
     * @param encoding 字符串的编码。
     * @return 返回解析后的Document对象。
     * @throws IOException                  如果发生任何 IO 错误时抛出此异常。
     * @throws SAXException                 如果发生任何解析错误时抛出此异常。
     * @throws ParserConfigurationException 如果无法创建满足所请求配置的 DocumentBuilder，将抛出该异常。
     */
    public static Document parseForDoc(String xmlStr, String encoding) throws SAXException, IOException,
            ParserConfigurationException {
        if (xmlStr == null) {
            xmlStr = "";
        }
        ByteArrayInputStream byteInputStream = new ByteArrayInputStream(xmlStr.getBytes(encoding));
        return XMLUtility.parseForDoc(byteInputStream);
    }

    public static Document parseForDocUTF8(String xmlStr) throws ParserConfigurationException, SAXException, IOException {
        return parseForDoc(xmlStr,"utf-8");
    }

    /**
     * 获取Document对象。根据字节输入流获取一个Document对象。
     *
     * @param is 获取对象的字节输入流。
     * @return 返回获取到的Document对象。如果出现异常，返回null。
     * @throws IOException                  如果发生任何 IO 错误时抛出此异常。
     * @throws SAXException                 如果发生任何解析错误时抛出此异常。
     * @throws ParserConfigurationException 如果无法创建满足所请求配置的 DocumentBuilder，将抛出该异常。
     * @throws IllegalArgumentException     当 is 为 null 时抛出此异常。
     */
    public static Document parseForDoc(final InputStream is) throws SAXException, IOException, ParserConfigurationException,
            IllegalArgumentException {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setValidating(false);
            factory.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
            DocumentBuilder builder = factory.newDocumentBuilder();
            return builder.parse(is);
        } finally {
            is.close();
        }
    }

    /**
     * 通过xpath表达式解析某个xml节点。
     *
     * @param obj   要被解析的xml节点对象。
     * @param xPath xpath表达式。
     * @param qName 被解析的目标类型。
     * @return 返回解析后的对象。
     * @throws XPathExpressionException 如果不能计算 expression。
     * @throws RuntimeException         创建默认对象模型的 XPathFactory 遇到故障时。
     * @throws NullPointerException     如果xPath为空时抛出时异常。
     */
    private static Object parseByXpath(final Object obj, final String xPath, QName qName) throws NullPointerException,
            RuntimeException, XPathExpressionException {
        XPathFactory xpathFactory = XPathFactory.newInstance();

        XPath path = xpathFactory.newXPath();
        return path.evaluate(xPath, obj, qName);
    }

    /**
     * 通过XPath表达式获取单个节点。
     *
     * @param obj   要被解析的對象。
     * @param xPath XPath表达式。
     * @return 返回获取到的节点。
     * @throws XPathExpressionException 如果不能计算 expression。
     * @throws RuntimeException         创建默认对象模型的 XPathFactory 遇到故障时。
     * @throws NullPointerException     如果xPath为空时抛出时异常。
     */
    public static Node parseForNode(final Object obj, final String xPath) throws NullPointerException, RuntimeException,
            XPathExpressionException

    {
        return (Node) XMLUtility.parseByXpath(obj, xPath, XPathConstants.NODE);
    }

    /**
     * 通过XPath表达式获取某个xml节点的字符串值。
     *
     * @param obj   要被解析的對象。
     * @param xPath XPath表达式。
     * @return 返回获取到的节点的字符串值。
     * @throws XPathExpressionException 如果不能计算 expression。
     * @throws RuntimeException         创建默认对象模型的 XPathFactory 遇到故障时。
     * @throws NullPointerException     如果xPath为空时抛出时异常。
     */
    public static String parseForString(final Object obj, final String xPath) throws NullPointerException, RuntimeException,
            XPathExpressionException

    {

        return (String) XMLUtility.parseByXpath(obj, xPath, XPathConstants.STRING);
    }

    /*
     * 把dom文件转换为xml字符串
     */
    public static String documentToString(Document document) {
        String result = null;

        if (document != null) {
            StringWriter strWtr = new StringWriter();
            StreamResult strResult = new StreamResult(strWtr);
            TransformerFactory tfac = TransformerFactory.newInstance();
            try {
                Transformer t = tfac.newTransformer();
                t.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
                t.setOutputProperty(OutputKeys.INDENT, "yes");
                t.setOutputProperty(OutputKeys.METHOD, "xml"); // xml, html,
                // text
                t.setOutputProperty(
                        "{http://xml.apache.org/xslt}indent-amount", "4");
                t.transform(new DOMSource(document.getDocumentElement()),
                        strResult);
            } catch (Exception e) {
                System.err.println("XML.toString(Document): " + e);
            }
            result = strResult.getWriter().toString();
            try {
                strWtr.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return result;
    }

    /**
     * 通过XPath表达式获取某个xml节点的布尔值。
     *
     * @param obj   要被解析的對象。
     * @param xPath XPath表达式。
     * @return 返回获取到的节点的布尔值。
     * @throws XPathExpressionException 如果不能计算 expression。
     * @throws RuntimeException         创建默认对象模型的 XPathFactory 遇到故障时。
     * @throws NullPointerException     如果xPath为空时抛出时异常。
     */
    public static Boolean parseForBoolean(final Object obj, final String xPath) throws NullPointerException, RuntimeException,
            XPathExpressionException

    {
        return (Boolean) XMLUtility.parseByXpath(obj, xPath, XPathConstants.BOOLEAN);
    }

    /**
     * 通过XPath表达式获取Node列表。
     *
     * @param obj   要被解析的對象。
     * @param xPath XPath表达式。
     * @return 返回获取到的Node列表。
     * @throws XPathExpressionException 如果不能计算 expression。
     * @throws RuntimeException         创建默认对象模型的 XPathFactory 遇到故障时。
     * @throws NullPointerException     如果xPath为空时抛出时异常。
     */
    public static List parseForNodeList(final Object obj, final String xPath) throws NullPointerException,
            RuntimeException, XPathExpressionException
    {
        List lists = new ArrayList();
        NodeList nList = (NodeList) XMLUtility.parseByXpath(obj, xPath, XPathConstants.NODESET);
        if (nList != null) {
            for (int i = 0; i < nList.getLength(); i++) {
                lists.add(nList.item(i));
            }
        }
        return lists;
    }

    /**
     * 获取节点的制定属性。
     *
     * @param node     节点。
     * @param attrName 属性名。
     * @return 返回获取到的属性值。如果找不到相关的
     */
    public static String getAttribute(final Object node, final String attrName) {
        String result = "";
        if ((node != null) && (node instanceof Node)) {
            if (((Node) node).getNodeType() == Node.ELEMENT_NODE) {
                result = ((Element) node).getAttribute(attrName);
            } else {
                // 遍历整个xml某节点指定的属性
                NamedNodeMap attrs = ((Node) node).getAttributes();
                if ((attrs.getLength() > 0) && (attrs != null)) {
                    Node attr = attrs.getNamedItem(attrName);
                    result = attr.getNodeValue();
                }
            }
        }
        return result;
    }

    /**
     * 使用新节点替换原来的旧节点。
     *
     * @param oldNode 要被替换的旧节点。
     * @param newNode 替换后的新节点。
     * @throws DOMException 如果此节点为不允许
     *                      newNode节点类型的子节点的类型；或者如果要放入的节点为此节点的一个祖先或此节点本身；或者如果此节点为
     *                      Document 类型且替换操作的结果将第二个 DocumentType 或 Element 添加到
     *                      Document 上。 WRONG_DOCUMENT_ERR: 如果 newChild
     *                      是从不同的文档创建的，不是从创建此节点的文档创建的，则引发此异常。
     *                      NO_MODIFICATION_ALLOWED_ERR: 如果此节点或新节点的父节点为只读的，则引发此异常。
     *                      NOT_FOUND_ERR: 如果 oldChild 不是此节点的子节点，则引发此异常。
     *                      NOT_SUPPORTED_ERR: 如果此节点为 Document 类型，则如果 DOM 实现不支持替换
     *                      DocumentType 子节点或 Element 子节点，则可能引发此异常。
     */
    public static void replaceNode(Node oldNode, Node newNode) {
        if ((oldNode != null) && (newNode != null)) {
            oldNode.getParentNode().replaceChild(newNode, oldNode);
        }
    }

    /**
     * 将Document输出到指定的文件中。
     *
     * @param fileName 文件名。
     * @param node     要保存的对象。
     * @param encoding 保存的编码。
     * @throws FileNotFoundException 指定的文件名不存在时，抛出此异常。
     * @throws TransformerException  如果转换过程中发生不可恢复的错误时，抛出此异常。
     */
    public static void saveXml(final String fileName, final Node node, String encoding) throws FileNotFoundException,
            TransformerException {
        XMLUtility.writeXml(new FileOutputStream(fileName), node, encoding);
    }

    /**
     * 将Document输出成字符串的形式。
     *
     * @param node     Node对象。
     * @param encoding 字符串的编码。
     * @return 返回输出成的字符串。
     * @throws TransformerException         如果转换过程中发生不可恢复的错误时，抛出此异常。
     * @throws UnsupportedEncodingException 指定的字符串编码不支持时，抛出此异常。
     */
    public static String nodeToString(Node node, String encoding) throws TransformerException, UnsupportedEncodingException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        XMLUtility.writeXml(outputStream, node, encoding);
        return outputStream.toString(encoding);
    }

    public static String nodeToStringUTF8(Node node) throws TransformerException, UnsupportedEncodingException {
        return nodeToString(node,"utf-8");
    }

    /**
     * 将指定的Node写到指定的OutputStream流中。
     *
     * @param encoding 编码。
     * @param os       OutputStream流。
     * @param node     Node节点。
     * @throws TransformerException 如果转换过程中发生不可恢复的错误时，抛出此异常。
     */
    private static void writeXml(OutputStream os, Node node, String encoding) throws TransformerException {
        TransformerFactory transFactory = TransformerFactory.newInstance();
        Transformer transformer = transFactory.newTransformer();
        transformer.setOutputProperty("indent", "yes");
        //transformer.setOutputProperty(OutputKeys.STANDALONE, "no");
        transformer.setOutputProperty(OutputKeys.ENCODING, encoding);

        DOMSource source = new DOMSource();
        source.setNode(node);
        StreamResult result = new StreamResult();
        result.setOutputStream(os);

        transformer.transform(source, result);
    }

    public static XMLInputFactory createSafeXmlInputFactory() {
        XMLInputFactory xif = XMLInputFactory.newInstance();
        if (xif.isPropertySupported(XMLInputFactory.IS_REPLACING_ENTITY_REFERENCES)) {
            xif.setProperty(XMLInputFactory.IS_REPLACING_ENTITY_REFERENCES, false);
        }

        if (xif.isPropertySupported(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES)) {
            xif.setProperty(XMLInputFactory.IS_SUPPORTING_EXTERNAL_ENTITIES, false);
        }

        if (xif.isPropertySupported(XMLInputFactory.SUPPORT_DTD)) {
            xif.setProperty(XMLInputFactory.SUPPORT_DTD, false);
        }
        return xif;
    }
}