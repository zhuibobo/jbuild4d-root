package com.jbuild4d.core.base.encryption.symmetric;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */
public class AESUtility {
    public static String genKeyAES() throws Exception{
        try {
            KeyGenerator keyGen=KeyGenerator.getInstance("AES");
            keyGen.init(128);
            SecretKey key=keyGen.generateKey();
            BASE64Encoder base64=new BASE64Encoder();
            String Base64Str=base64.encode(key.getEncoded());
            return Base64Str;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    private static SecretKey CreateKey(String base64Key) throws Exception {
        try {
            BASE64Decoder base64=new BASE64Decoder();
            byte[] bytes=base64.decodeBuffer(base64Key);
            SecretKey skey=new SecretKeySpec(bytes,"AES");
            return skey;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String Encryption(String s,String key) throws Exception {
        try {
            Cipher cipher=Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE,CreateKey(key));
            byte[] bytes=cipher.doFinal(s.getBytes("utf8"));
            BASE64Encoder base64=new BASE64Encoder();
            return base64.encode(bytes);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw e;
        }
    }

    public static String Decryption(String s,String key) throws Exception{
        try {
            BASE64Decoder base64=new BASE64Decoder();
            byte[] encodeByte=base64.decodeBuffer(s);
            Cipher cipher=Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE,CreateKey(key));
            byte[] bytes=cipher.doFinal(encodeByte);
            return new String(bytes, "utf-8");
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw e;
        }
    }
}