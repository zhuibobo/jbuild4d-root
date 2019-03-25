package com.jbuild4d.sso.client.utils;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class HttpClientUtil {

    private static Logger logger = LoggerFactory.getLogger(HttpClientUtil.class);

    public static Map<String, String> valueUrlDecode(Map<String, String> source) throws UnsupportedEncodingException {
        for (Map.Entry<String, String> entry : source.entrySet()) {
            if (!entry.getValue().equals("")) {
                entry.setValue(URLDecoder.decode(entry.getValue(), "utf-8"));
            }
        }
        return source;
    }

    public static String getResponseText(CloseableHttpResponse response) throws IOException {
        String ServerResponeString = "";
        HttpEntity entity = response.getEntity();
        logger.info("-------------------getResponseText:begin-------------------");
        // 打印响应状态
        logger.info(response.getStatusLine().toString());
        if (entity != null) {
            // 打印响应内容长度
            logger.info("Response content length: " + entity.getContentLength());
            // 打印响应内容
            ServerResponeString = EntityUtils.toString(entity);
            logger.info("Response content: " + ServerResponeString);
        }
        logger.info("----------------getResponseText:end--------------------");
        return ServerResponeString;
    }

    public static String getHttpPostResult(String url, Map<String, String> senddata, boolean encode) {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        String ServerResponeString = "";
        try {
            // 创建httpget.
            HttpPost httpPost = new HttpPost(url);
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            String postData = "";
            for (Map.Entry<String, String> stringEntry : senddata.entrySet()) {
                if (encode) {
                    nvps.add(new BasicNameValuePair(stringEntry.getKey(), URLEncoder.encode(stringEntry.getValue(), "utf-8")));
                    postData += stringEntry.getKey() + "=" + URLEncoder.encode(stringEntry.getValue(), "utf-8") + "&";
                } else {
                    nvps.add(new BasicNameValuePair(stringEntry.getKey(), stringEntry.getValue()));
                    postData += stringEntry.getKey() + "=" + stringEntry.getValue();
                }
            }
            ;
            httpPost.setEntity(new UrlEncodedFormEntity(nvps));
            System.out.println("executing request " + httpPost.getURI());
            System.out.println("executing request post " + postData);

            // 执行get请求.
            CloseableHttpResponse response = httpclient.execute(httpPost);
            try {
                // 获取响应实体
                ServerResponeString = getResponseText(response);
            } finally {
                response.close();
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 关闭连接,释放资源
            try {
                httpclient.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return ServerResponeString;
    }

    public static String getHttpPostResult(String url, Map<String, String> senddata) {
        return getHttpPostResult(url, senddata, false);
    }

    public static String getHttpGetResult(String url) {
        return getHttpGetResult(url, 3);
    }

    public static String getHttpGetResult(String url, int retryTime) {
        RequestConfig defaultRequestConfig = RequestConfig.custom()
                .setSocketTimeout(5000)
                .setConnectTimeout(5000)
                .setConnectionRequestTimeout(20000)
                .build();
        CloseableHttpClient httpclient = HttpClients.custom()
                .setDefaultRequestConfig(defaultRequestConfig)
                .build();
        String ServerResponeString = "";
        //log.info("-------------------getHttpGetResult:begin-------------------");
        try {
            // 创建httpget.
            HttpGet httpget = new HttpGet(url);
            //httpget.
            //System.out.println("executing request " + httpget.getURI());
            // 执行get请求.
            RequestConfig requestConfig = RequestConfig.copy(defaultRequestConfig).build();
            httpget.setConfig(requestConfig);
            CloseableHttpResponse response = httpclient.execute(httpget);
            try {
                // 获取响应实体
                ServerResponeString = getResponseText(response);
            } finally {
                response.close();
            }
        } catch (ClientProtocolException e) {
            e.printStackTrace();
            //log.info("ClientProtocolException："+e.getMessage());
        } catch (ParseException e) {
            e.printStackTrace();
            //log.info("ParseException："+e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            logger.info("IOException：" + e.getMessage());
            logger.info("-------------------链接超时重试:begin:" + retryTime + "-------------------");
            if (retryTime > 0) {
                ServerResponeString = getHttpGetResult(url, retryTime - 1);
            }
            logger.info("-------------------链接超时重试:end" + retryTime + "-------------------");
        } finally {
            // 关闭连接,释放资源
            try {
                httpclient.close();
            } catch (IOException e) {
                logger.info("finally:IOException：" + e.getMessage());
                e.printStackTrace();
            }
        }
        //log.info("ServerResponeString："+ ServerResponeString);
        //log.info("-------------------getHttpGetResult:end-------------------");
        return ServerResponeString;
    }
}
