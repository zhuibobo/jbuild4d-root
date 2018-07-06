package com.jbuild4d.base.tools.common.encryption.nsymmetric;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.Cipher;
import java.security.*;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2018/7/6
 * To change this template use File | Settings | File Templates.
 */

public class RSAUtility {
    public static KeyPair getKeyPair() throws  Exception{
        try {
            KeyPairGenerator keyPairGenerator=KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(512);
            KeyPair keyPair=keyPairGenerator.generateKeyPair();
            return keyPair;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String getPublicKeyBase64(KeyPair keyPair) throws  Exception{
        try {
            PublicKey publicKey=keyPair.getPublic();
            byte[] bytes=publicKey.getEncoded();
            BASE64Encoder base64=new BASE64Encoder();
            return base64.encode(bytes);
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String getPrivateKeyBase64(KeyPair keyPair) throws  Exception{
        try {
            PrivateKey privateKey=keyPair.getPrivate();
            byte[] bytes=privateKey.getEncoded();
            BASE64Encoder base64=new BASE64Encoder();
            return base64.encode(bytes);
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static PublicKey string2PublicKey(String pubBase64Str) throws Exception{
        try {
            BASE64Decoder base64Decoder=new BASE64Decoder();
            byte[] keyBytes=base64Decoder.decodeBuffer(pubBase64Str);
            X509EncodedKeySpec keySpec=new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory=KeyFactory.getInstance("RSA");
            PublicKey publicKey=keyFactory.generatePublic(keySpec);
            return publicKey;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static PrivateKey string2PrivateKey(String priBase64Str) throws Exception{
        try {
            BASE64Decoder base64Decoder=new BASE64Decoder();
            byte[] keyBytes=base64Decoder.decodeBuffer(priBase64Str);
            PKCS8EncodedKeySpec keySpec=new PKCS8EncodedKeySpec(keyBytes);
            KeyFactory keyFactory=KeyFactory.getInstance("RSA");
            PrivateKey privateKey=keyFactory.generatePrivate(keySpec);
            return privateKey;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static byte[] publicEncryption(byte[] content,PublicKey publicKey) throws  Exception{
        try {
            Cipher cipher=Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE,publicKey);
            byte[] bytes=cipher.doFinal(content);
            return bytes;
        }
        catch (Exception e){
            throw e;
        }
    }

    public static byte[] privateDecryption(byte[] content, PrivateKey privateKey) throws  Exception{
        try {
            Cipher cipher=Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE,privateKey);
            byte[] bytes=cipher.doFinal(content);
            return bytes;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String publicEncryptionBase64(String content, PublicKey publicKey) throws Exception{
        try {
            byte[] bytes = content.getBytes("utf8");
            byte[] result = publicEncryption(bytes, publicKey);
            BASE64Encoder base64Encoder=new BASE64Encoder();
            return base64Encoder.encode(result);
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String privateDecryptionBase64(String base64Content, PrivateKey privateKey) throws Exception{
        try {
            BASE64Decoder base64Decoder=new BASE64Decoder();
            byte[] content=base64Decoder.decodeBuffer(base64Content);
            byte[] deContent= privateDecryption(content, privateKey);
            return  new String(deContent,"utf8");
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static byte[] privateEncryption(byte[] content, PrivateKey privateKey) throws  Exception{
        try {
            Cipher cipher=Cipher.getInstance("RSA");
            cipher.init(Cipher.ENCRYPT_MODE,privateKey);
            byte[] bytes=cipher.doFinal(content);
            return bytes;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static byte[] publicDecryption(byte[] content, PublicKey publicKey) throws Exception{
        try {
            Cipher cipher=Cipher.getInstance("RSA");
            cipher.init(Cipher.DECRYPT_MODE,publicKey);
            byte[] bytes=cipher.doFinal(content);
            return bytes;
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String privateEncryptionBase64(String content, PrivateKey privateKey) throws  Exception{
        try {
            byte[] bytes = content.getBytes("utf8");
            byte[] result = privateEncryption(bytes, privateKey);
            BASE64Encoder base64Encoder=new BASE64Encoder();
            return base64Encoder.encode(result);
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }

    public static String publicDecryptionBase64(String base64Content, PublicKey publicKey) throws Exception{
        try {
            BASE64Decoder base64Decoder=new BASE64Decoder();
            byte[] content=base64Decoder.decodeBuffer(base64Content);
            byte[] deContent= publicDecryption(content, publicKey);
            return  new String(deContent,"utf8");
        }
        catch (Exception e){
            e.printStackTrace();
            throw e;
        }
    }
}