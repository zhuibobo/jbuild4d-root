package com.jbuild4d.base.tools.common.encryption.cer;

import com.jbuild4d.base.tools.common.encryption.nsymmetric.RSAUtility;
import sun.misc.BASE64Encoder;

import java.io.FileInputStream;
import java.security.PublicKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */

public class CertUtility {
    public static X509Certificate readCer(String filePath) throws  Exception{
        try {
            FileInputStream bais=new FileInputStream(filePath);
            CertificateFactory certificatefactory=CertificateFactory.getInstance("X.509");
            X509Certificate cert = (X509Certificate)certificatefactory.generateCertificate(bais);
            bais.close();
            return cert;
        }
        catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public static PublicKey getCerPublicKey(X509Certificate cert) throws Exception{
        try {
            return cert.getPublicKey();
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String EncryptionByCerRSABase64(String content,String cerFilePath) throws Exception{
        try {
            X509Certificate cer=readCer(cerFilePath);
            byte[] endata=EncryptionByCerRSA(content.getBytes("utf8"),cer);
            BASE64Encoder base64Encoder=new BASE64Encoder();
            return base64Encoder.encode(endata);
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String EncryptionByCerRSABase64(X509Certificate cer,String content)  throws Exception{
        try {
            byte[] endata=EncryptionByCerRSA(content.getBytes("utf8"),cer);
            BASE64Encoder base64Encoder=new BASE64Encoder();
            return base64Encoder.encode(endata);
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static byte[] EncryptionByCerRSA(byte[] content,X509Certificate cert) throws Exception{
        try {
            PublicKey publicKey=cert.getPublicKey();
            byte[] result= RSAUtility.publicEncryption(content, publicKey);
            return result;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }
}
