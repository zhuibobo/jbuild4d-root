package com.jbuild4d.base.tools.common;

import org.springframework.util.StringUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.NumberFormat;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class StringUtility {


    private static final char[] bcdLookup = { '0', '1', '2', '3', '4', '5',
            '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

    /**
     * 字符串 正则表达式 正整数
     */
    private static final String REGEX = "^\\d*$";

    private StringUtility() {
        // util class, prevent from new instance
    }

    /**
     * 通过属性名字获取对象中的属性值
     * @param obj
     * @param fieldName
     * @return
     */
    public static String getFieldValue(Object obj, String fieldName) throws Exception {
        String retVal = "";
        try {
            retVal = "";
            Method m = null;
            Class clazz = obj.getClass();
            String getMethodName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
            try {
                m = clazz.getMethod(getMethodName);
                Object tmpObj = m.invoke(obj);
                if(tmpObj != null) {
                    retVal = tmpObj.toString();
                }else {
                    retVal = "";
                }
            } catch (NoSuchMethodException e) {
                //
            }
        } catch (Exception e) {
            throw new Exception("getFieldValue obj:" + obj + ";fieldName:" + fieldName, e);
        }
        return retVal;
    }
    public static String nullToString(String str) {
        if (null == str || "null".equals(str))
            return "";
        return str;
    }

    public static String nullObjectToString(Object obj) {
        String str="";
        if (null == obj ){
            return str;
        }else{
            str=obj.toString();
        }
        return str;
    }

    public static final byte[] hexStrToBytes(String s) {
        byte[] bytes;

        bytes = new byte[s.length() / 2];

        for (int i = 0; i < bytes.length; i++) {
            bytes[i] = (byte) Integer.parseInt(s.substring(2 * i, (2 * i) + 2),
                    16);
        }

        return bytes;
    }

    public static final String getStrNotInclude700(String s) {
        if (isEmpty(s)) {
            return "";
        }
        return s.substring(0, s.length() - 3);
    }

    /**
     * Transform the specified byte into a Hex String form.
     */
    public static final String bytesToHexStr(byte[] bcd) {
        StringBuffer s = new StringBuffer(bcd.length * 2);

        for (int i = 0; i < bcd.length; i++) {
            s.append(bcdLookup[(bcd[i] >>> 4) & 0x0f]);
            s.append(bcdLookup[bcd[i] & 0x0f]);
        }

        return s.toString();
    }

    public static boolean isNull(Object object) {
        if (object instanceof String) {
            return StringUtility.isEmpty(object.toString());
        }
        return object == null;
    }

    /**
     * Checks if string is null or empty.
     *
     * @param value
     *            The string to be checked
     * @return True if string is null or empty, otherwise false.
     */
    public static boolean isEmpty(final String value) {
        return value == null || value.trim().length() == 0;
    }

    /**
     * Converts <code>null</code> to empty string, otherwise returns it
     * directly.
     *
     * @param string
     *            The nullable string
     * @return empty string if passed in string is null, or original string
     *         without any change
     */
    public static String null2String(String string) {
        return string == null ? "" : string;
    }

    /**
     * Converts <code>null</code> to empty string, otherwise returns it
     * directly.
     *
     *            The nullable string
     * @return empty string if passed in string is null, or original string
     *         without any change
     */
    public static String nvl(Object object, String value) {
        return object == null ? value : object.toString();
    }

    public static String nvl(Object object) {
        return object == null ? "" : object.toString().trim();
    }

    /**
     * Converts string from GB2312 encoding ISO8859-1 (Latin-1) encoding.
     *
     * @param gbString
     *            The string of GB1212 encoding
     * @return New string of ISO8859-1 encoding
     */
    public static String iso2Gb(String gbString) {
        if (gbString == null)
            return null;
        String outString = "";
        try {
            byte[] temp = null;
            temp = gbString.getBytes("ISO8859-1");
            outString = new String(temp, "GB2312");
        } catch (java.io.UnsupportedEncodingException e) {
            // ignore it as no way to convert between these two encodings
        }
        return outString;
    }

    /**
     * Converts string from ISO8859-1 encoding to UTF-8 encoding.
     *
     * @param isoString
     *            String of ISO8859-1 encoding
     * @return New converted string of UTF-8 encoding
     */
    public static String iso2Utf(String isoString) {
        if (isoString == null)
            return null;
        String outString = "";
        try {
            byte[] temp = null;
            temp = isoString.getBytes("ISO8859-1");
            outString = new String(temp, "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {

        }
        return outString;
    }

    /**
     * Converts string from platform default encoding to GB2312.
     *
     * @param inString
     *            String in platform default encoding
     * @return New string in GB2312 encoding
     */
    public static String str2Gb(String inString) {
        if (inString == null)
            return null;
        String outString = "";
        try {
            byte[] temp = null;
            temp = inString.getBytes();
            outString = new String(temp, "GB2312");
        } catch (java.io.UnsupportedEncodingException e) {

        }
        return outString;
    }

    /**
     * Insert "0" in front of <em>dealCode</em> if its length is less than 3.
     *
     * @param dealCode
     *            The dealCode to be filled with "0" at the beginning
     * @return New string with "0" filled
     */
    public static String fillZero(String dealCode) {
        String zero = "";
        if (dealCode.length() < 3) {
            for (int i = 0; i < (3 - dealCode.length()); i++) {
                zero += "0";
            }
        }
        return (zero + dealCode);
    }

    public static String fillZero(String value, int len) {
        if (StringUtility.isNull(value) || len <= 0) {
            throw new IllegalArgumentException("参数不正确");
        }
        String zero = "";
        int paramLen = value.trim().length();
        if (paramLen < len) {
            for (int i = 0; i < len - paramLen; i++) {
                zero += "0";
            }
        }
        return (zero + value);
    }

    public static String convertAmount(String amount) {
        String str = String.valueOf(Double.parseDouble(amount));
        int pos = str.indexOf(".");
        int len = str.length();
        if (len - pos < 3) {
            return str.substring(0, pos + 2) + "0";
        } else {
            return str.substring(0, pos + 3);
        }
    }

    /**
     * to 10Decrypt
     */
    public static String to10(String opStr) {
        String zm = "#123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int lenOfOp = opStr.length();
        long result = 0;
        String indexOfOp;
        int js;
        for (int i = 0; i < lenOfOp; i++) {
            indexOfOp = opStr.substring(i, i + 1);
            js = zm.indexOf(indexOfOp);
            result = result * 36 + js;
        }
        // 补充到12位
        String jg = String.valueOf(result);
        int bc = 12 - jg.length();
        String jgq = "";
        for (int j = 0; j < bc; j++) {
            jgq += "0";
        }
        return jgq + jg;
    }

    /**
     * to 36Encrypt
     */
    public static String to36(String originalStr) {

        long oVal = Long.parseLong(originalStr);
        long shang;
        int yushu;
        String result = "";
        String zm = "#123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (int i = 1; i < 9; i++) {
            shang = oVal / 36;
            yushu = (int) (oVal % 36);
            result = zm.substring(yushu, yushu + 1) + result;
            oVal = shang;
        }

        return result;

    }

    /**
     * Encrypt deal Id : 2 bits year,10 bits sequence
     */
    public static String encDealId(String dealid) {
        if (dealid.length() != 23)
            return "notval";
        String ny = dealid.substring(5, 7);
        String sq = dealid.substring(11, 21);

        return to36(ny + sq);
    }

    /**
     * Decrypt deal Id : 12 bits
     */
    public static String decDealId(String opStr) {
        return to10(opStr);
    }

    /**
     * 数字转换为大写字母
     *
     * @param money
     *            format example: 100.00
     * @return
     */
    public static String[] numToWords(String money) {
        int j = money.length();
        String[] str = new String[j];
        for (int i = 0; i < j; i++) {
            switch (money.charAt(i)) {
                case '0':
                    str[i] = "零";
                    continue;
                case '1':
                    str[i] = "壹";
                    continue;
                case '2':
                    str[i] = "贰";
                    continue;
                case '3':
                    str[i] = "叁";
                    continue;
                case '4':
                    str[i] = "肆";
                    continue;
                case '5':
                    str[i] = "伍";
                    continue;
                case '6':
                    str[i] = "陆";
                    continue;
                case '7':
                    str[i] = "柒";
                    continue;
                case '8':
                    str[i] = "捌";
                    continue;
                case '9':
                    str[i] = "玖";
                    continue;
                case '.':
                    str[i] = "点";
                    continue;
            }
        }
        return str;
    }

    /**
     * 把人民币转换成大写的标准格式
     *
     * @return
     */
    public static String money2BigFormat(String money) {
        String[] bigNumber = numToWords(money);
        int len = bigNumber.length;
        if (len > 11)
            return "数额过高";
        StringBuffer sb = new StringBuffer();
        if (len >= 7) {
            if (len == 11) {
                sb.append(bigNumber[0] + "仟");
                sb.append(bigNumber[1] + "佰" + bigNumber[2] + "拾"
                        + bigNumber[3] + "万");
            }
            if (len == 10) {
                sb.append(bigNumber[0] + "佰" + bigNumber[1] + "拾"
                        + bigNumber[2] + "万");
            }
            if (len == 9) {
                sb.append(bigNumber[0] + "拾" + bigNumber[1] + "万");
            }
            if (len == 8) {
                sb.append(bigNumber[0] + "万");
            }
            sb.append(bigNumber[len - 7] + "仟" + bigNumber[len - 6] + "佰"
                    + bigNumber[len - 5] + "拾");
        }
        if (len == 6) {
            sb.append(bigNumber[0] + "佰" + bigNumber[1] + "拾");
        }
        if (len == 5) {
            sb.append(bigNumber[0] + "拾");
        }
        sb.append(bigNumber[len - 4] + "元" + bigNumber[len - 2] + "角"
                + bigNumber[len - 1] + "分整");
        return sb.toString();
    }

    /**
     * 货币格式化
     *
     * @param currency
     * @return
     */
    public static String formatCurrecy(String currency) {
        if ((null == currency) || "".equals(currency)
                || "null".equals(currency)) {
            return "";
        }

        NumberFormat usFormat = NumberFormat.getCurrencyInstance(Locale.CHINA);

        try {
            return usFormat.format(Double.parseDouble(currency));
        } catch (Exception e) {
            return "";
        }
    }

    public static String formatCurrecy(String currency, String currencyCode) {
        try {
            if ((null == currency) || "".equals(currency)
                    || "null".equals(currency)) {
                return "";
            }

            if (currencyCode.equalsIgnoreCase("1")) {
                NumberFormat usFormat = NumberFormat
                        .getCurrencyInstance(Locale.CHINA);
                return usFormat.format(Double.parseDouble(currency));
            } else {
                return currency + "点";
            }
        } catch (Exception e) {
            return "";
        }
    }

    // Useful split and replace methods

    /**
     * Splits the provided text into a list, using whitespace as the separator.
     * The separator is not included in the returned String array.
     *
     * @param str
     *            the string to parse
     * @return an array of parsed Strings
     */
    public static String[] split(String str) {
        return split(str, null, -1);
    }

    /**
     * @param text
     *            String
     * @param separator
     *            String
     * @return String[]
     */
    public static String[] split(String text, String separator) {
        return split(text, separator, -1);
    }

    /**
     * Splits the provided text into a list, based on a given separator. The
     * separator is not included in the returned String array. The maximum
     * number of splits to perfom can be controlled. A null separator will cause
     * parsing to be on whitespace.
     * <p>
     * <p>
     * This is useful for quickly splitting a string directly into an array of
     * tokens, instead of an enumeration of tokens (as
     * <code>StringTokenizer</code> does).
     *
     * @param str
     *            The string to parse.
     * @param separator
     *            Characters used as the delimiters. If <code>null</code>,
     *            splits on whitespace.
     * @param max
     *            The maximum number of elements to include in the list. A zero
     *            or negative value implies no limit.
     * @return an array of parsed Strings
     */
    public static String[] split(String str, String separator, int max) {
        StringTokenizer tok = null;
        if (separator == null) {
            // Null separator means we're using StringTokenizer's default
            // delimiter, which comprises all whitespace characters.
            tok = new StringTokenizer(str);
        } else {
            tok = new StringTokenizer(str, separator);
        }

        int listSize = tok.countTokens();
        if (max > 0 && listSize > max) {
            listSize = max;
        }

        String[] list = new String[listSize];
        int i = 0;
        int lastTokenBegin = 0;
        int lastTokenEnd = 0;
        while (tok.hasMoreTokens()) {
            if (max > 0 && i == listSize - 1) {
                // In the situation where we hit the max yet have
                // tokens left over in our input, the last list
                // element gets all remaining text.
                String endToken = tok.nextToken();
                lastTokenBegin = str.indexOf(endToken, lastTokenEnd);
                list[i] = str.substring(lastTokenBegin);
                break;
            }
            list[i] = tok.nextToken();
            lastTokenBegin = str.indexOf(list[i], lastTokenEnd);
            lastTokenEnd = lastTokenBegin + list[i].length();
            i++;
        }
        return list;
    }

    /**
     * Replace all occurances of a string within another string.
     *
     * @param text
     *            text to search and replace in
     * @param repl
     *            String to search for
     * @param with
     *            String to replace with
     * @return the text with any replacements processed
     * @see #replace(String text, String repl, String with, int max)
     */
    public static String replace(String text, String repl, String with) {
        return replace(text, repl, with, -1);
    }

    /**
     * Replace a string with another string inside a larger string, for the
     * first <code>max</code> values of the search string. A <code>null</code>
     * reference is passed to this method is a no-op.
     *
     * @param text
     *            text to search and replace in
     * @param repl
     *            String to search for
     * @param with
     *            String to replace with
     * @param max
     *            maximum number of values to replace, or <code>-1</code> if
     *            no maximum
     * @return the text with any replacements processed
     * @throws NullPointerException
     *             if repl is null
     */
    private static String replace(String text, String repl, String with, int max) {
        if (text == null) {
            return null;
        }

        StringBuffer buf = new StringBuffer(text.length());
        int start = 0;
        int end = text.indexOf(repl, start);
        while (end != -1) {
            buf.append(text.substring(start, end)).append(with);
            start = end + repl.length();

            if (--max == 0) {
                break;
            }
            end = text.indexOf(repl, start);
        }
        buf.append(text.substring(start));
        return buf.toString();
    }

    /**
     * 用Map中的变量名-变量值替换源字符串中的变量名.
     *
     * @param src
     *            字符串
     * @param value
     *            变量名-变量值
     * @return String <br>
     *         <br>
     *         Example: <br>
     *         String src = "Hello ${username}, this is ${target} speaking.";
     *         <br>
     *         Map map = new HashMap(); <br>
     *         map.put("username", "petter"); <br>
     *         map.put("target", "tom"); <br>
     *         src = StringUtil.replaceVariable(str, map); <br>
     *         #The src equals: <br>
     *         "Hello petter, this is tom speaking."
     */
    public static String replaceVariable(final String src, final Map value) {
        int len = src.length();
        StringBuffer buf = new StringBuffer(len);
        for (int i = 0; i < len; i++) {
            char c = src.charAt(i);
            if (c == '$') {
                i++;
                StringBuffer key = new StringBuffer();
                char temp = src.charAt(i);
                while (temp != '}') {
                    if (temp != '{') {
                        key.append(temp);
                    }
                    i++;
                    temp = src.charAt(i);
                }
                String variable = (String) value.get(key.toString());
                if (null == variable) {
                    buf.append("");
                } else {
                    buf.append(variable);
                }
            } else {
                buf.append(c);
            }
        }
        return buf.toString();
    }

    /**
     * 用Map中的变量名-变量值替换源字符串中的变量名,这个方法返回字符串是从char[] 构造的UTF字符串,不需要指定任何字符集都不可能乱码
     * 以前那个方法是把UTF字符串又转换成GBK的byte
     * ,所以要重新指定字符集为GBK是为了和其它的GBK字符同时输出,所以要把UTF字符串转换成GBK的字符串以便同时显示.
     */
    public static String utfToGBK(byte[] srcByte) throws Exception {
        StringBuffer str = new StringBuffer();
        int len = srcByte.length;
        int char1, char2, char3;
        int count = 0;
        while (count < len) {
            char1 = (int) srcByte[count] & 0xff;
            switch (char1 >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    count++;
                    str.append((char) char1);
                    break;
                case 12:
                case 13:
                    count += 2;
                    if (count > len) {
                        throw new Exception();
                    }
                    char2 = (int) srcByte[count - 1];
                    if ((char2 & 0xC0) != 0x80) {
                        throw new Exception();
                    }
                    str.append((char) (((char1 & 0x1F) << 6) | (char2 & 0x3F)));
                    break;
                case 14:

                    /* 1110 xxxx 10xx xxxx 10xx xxxx */
                    count += 3;
                    if (count > len) {
                        throw new Exception();
                    }
                    char2 = (int) srcByte[count - 2];
                    char3 = (int) srcByte[count - 1];
                    if (((char2 & 0xC0) != 0x80) || ((char3 & 0xC0) != 0x80)) {
                        throw new Exception();
                    }
                    str.append((char) (((char1 & 0x0F) << 12)
                            | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0)));
                    break;
                default:
                    throw new Exception();
            }
        }
        return str.toString();
    }

    /**
     * 可以直接以UTF-8显示字付串,如果要存储可以直接把转换后的UTF的byte写到文件或数据库.
     *
     * @param s
     *            :原始数据
     *            :解码字符集格式
     * @return
     */
    public static byte[] getUTF8Bytes(String s) {
        try {
            if(null != s){
                return  s.getBytes("UTF-8");
            }
            return null;
        } catch (Exception ex) {
            return null;
        }
    }

    public static String bytesToString(byte[] bytes, String charset){
        try {
            return new String(bytes,charset);
        }catch (Exception e){
            return null;
        }
    }
    /**
     * 判断是否为数字.
     *
     * @param s
     *            字符串
     * @return boolean true为数字,false不为数字 zzhong************
     */
    public static boolean isNumber(final String s) {
        if (StringUtility.isEmpty(s)) {
            return false;
        }
        Pattern p = Pattern.compile(StringUtility.REGEX);
        Matcher m = p.matcher(s);
        if (!m.find()) {
            return false;
        }
        return true;
    }

    /**
     * 判断是否为数字.
     *
     * @param s
     *            字符串
     * @return boolean true为数字,false不为数字
     *
     */
    public static boolean isNumber(final Object s) {
        if (StringUtility.isNull(s)) {
            return false;
        }
        if (StringUtility.isEmpty(s.toString())) {
            return false;
        }
        Pattern p = Pattern.compile(StringUtility.REGEX);
        Matcher m = p.matcher(s.toString());
        if (!m.find()) {
            return false;
        }
        return true;
    }

    public static long getNumber(Long s) {
        long l = 0;
        if (s == null) {
            return l;
        } else {
            return s.longValue();

        }
    }

    /**
     * 判断是否包含特殊数字.
     *
     * @param urlParam
     *            待验证的参数
     * @return boolean true为包含 false为不包含
     */
    public static boolean includeTchar(final String urlParam) {
        Pattern p = Pattern.compile("[‘’“”，&<>()]");
        Matcher m = p.matcher(urlParam);
        while (m.find()) {
            return true;
        }
        return false;
    }

    /**
     * Converts string from ISO8859-1 encoding to UTF-8 encoding.
     *
     * @param isoString
     *            String of ISO8859-1 encoding
     * @return New converted string of UTF-8 encoding
     */
    public static String iso2Utf(final String isoString, final String charset) {
        if (isoString == null)
            return null;
        String outString = "";
        try {
            byte[] temp = null;
            temp = isoString.getBytes(charset);
            outString = new String(temp, "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {

        }
        return outString;
    }

    public static String Map2String(Map map) {
        if (null == map)
            return null;
        String result = map.toString();
        result = result.substring(1, result.length() - 1);
        result = result.replace("{", "").replace("}", "");
        return result.replaceAll(",", ";");
    }

    public static Map String2Map(String str) {
        Map<String, String> map = new HashMap<String, String>();
        String[] ar = str.split(";");
        for (int i = 0; i < ar.length; i++) {
            String[] br = ar[i].trim().split("=");
            if (br.length <= 0) {
                continue;
            } else if (br.length == 1) {
                map.put(br[0], "");
            } else {
                map.put(br[0], br[1]);
            }
        }
        return map;
    }

    /**
     * 按键值对把参数key=value增加到buf对象中. 如果为空则不增加.
     *
     * @param buf
     *            StringBuffer
     * @param key
     *            String
     * @param value
     *            String
     */
    public static void appendSignParameter(final StringBuffer buf,
                                           final String key, final String value) {
        appendSignParameter(buf, key, value, true);
    }

    /**
     * 按键值对把参数key=value增加到buf对象中. 如果为空则不增加.
     *
     * @param buf
     *            StringBuffer
     * @param key
     *            String
     * @param value
     *            String
     * @param appendAndChar
     *            boolean
     */
    public static void appendSignParameter(final StringBuffer buf,
                                           final String key, final String value, final boolean appendAndChar) {
        if (StringUtility.isEmpty(value)) {
            return;
        } else {
            buf.append(key).append("=").append(value);
            if (appendAndChar) {
                buf.append('&');
            }
        }
    }

    /**
     * 去除所有空格
     *
     * @param str
     * @return
     */
    public static String replaceBlank(String str) {
        if (isEmpty(str)) {
            return "";
        }
        Pattern p = Pattern.compile("\\s*|\t|\r|\n");
        Matcher m = p.matcher(str);
        return m.replaceAll("");
    }

    /**
     * 将数字转换成中文
     */
    public static String num2char(String num) {
        int number = Integer.parseInt(num);
        String retinfo = "";
        switch (number) {
            case 1:
                retinfo = "一";
                break;
            case 2:
                retinfo = "二";
                break;
            case 3:
                retinfo = "三";
                break;
            case 4:
                retinfo = "四";
                break;
            case 5:
                retinfo = "五";
                break;
            case 6:
                retinfo = "六";
                break;
            case 7:
                retinfo = "七";
                break;
            case 8:
                retinfo = "八";
                break;
            case 9:
                retinfo = "九";
                break;
            case 10:
                retinfo = "十";
                break;
            default:
                break;
        }
        return retinfo;
    }

    /**
     * 替换所有空格
     *
     * @param value
     * @return
     */
    public static String trim(String value) {
        if (isEmpty(value)) {
            return "";
        }
        return value.replace(" ", "");
    }

    /**
     * 字符串转码为UTF-8
     *
     * @param str
     * @return
     */
    public static String enc2UTF_8(String str) {
        if (isEmpty(str)) {
            return "";
        }
        try {
            return URLDecoder.decode(str, "UTF-8");
        } catch (Exception e) {
            return str;
        }
    }

    /**
     * 字符串转码为UTF-8
     *
     * @param str
     * @return
     */
    public static String dnc2UTF_8(String str) {
        if (isEmpty(str)) {
            return "";
        }
        try {
            return URLEncoder.encode(str, "UTF-8");
        } catch (Exception e) {
            return str;
        }
    }

    /**
     * 将以","分隔符字符串转换为Long[]数组
     *
     * @param str
     * @return
     */
    public static Long[] splitStr2LongArr(String str) {
        if (!isEmpty(str)) {
            String[] strIds = str.split(",");
            int strIdsLen = strIds.length;
            if (null != strIds && strIdsLen > 0) {
                Long[] longIds = new Long[strIdsLen];
                for (int i = 0; i < strIdsLen; i++) {
                    longIds[i] = Long.parseLong(trim(strIds[i]));
                }
                strIds = null;
                return longIds;
            }
        }
        return null;
    }

    /**
     * 处理Sql条件中的%号
     * @param querySql
     * @return
     */
    public static String formatSql(String querySql){
        String str = querySql.replaceAll("%","/%");
        return str;
    }

    public static String myPercent(int y, int z) {
        String baifenbi = "";// 接受百分比的值
        double baiy = y * 1.0;
        double baiz = z * 1.0;
        double fen = baiy / baiz;
        NumberFormat nf = NumberFormat.getPercentInstance(); //注释掉的也是一种方法
        nf.setMinimumFractionDigits( 2 ); //保留到小数点后几位
        //DecimalFormat df1 = new DecimalFormat("##.00%"); // ##.00%
        // 百分比格式，后面不足2位的用0补齐
        baifenbi=nf.format(fen);
        //baifenbi = df1.format(fen);
        //System.out.println(baifenbi);
        return baifenbi;
    }
    /**
     * 获取实体类中的属性
     * @return String {"firstName":"Brett","lastName":"McLaughlin","email":"aaaa"}
     */
    public static String formatEntityToJson (Object obj){
        StringBuilder sb = new StringBuilder(); //局部的StringBuffer一律StringBuilder之
        sb.append("{");
        for(Field field : obj.getClass().getDeclaredFields()){
            String methodName = "get" + StringUtils.capitalize(field.getName()); //构造getter方法
            Object fieldValue;
            try{
                fieldValue = obj.getClass().getDeclaredMethod(methodName).invoke(obj); //执行getter方法,获取其返回值
            }catch(Exception e){
                //一旦发生异常,便将属性值置为UnKnown,故此处没必要一一捕获所有异常
                sb.append(",").append("\"").append(field.getName()).append("\"").append(":").append("\"").append("UnKnown").append("\"");
                continue;
            }
            if(fieldValue == null){
                sb.append(",").append("\"").append(field.getName()).append("\"").append(":").append("\"").append("null").append("\"");
            }else{
                sb.append(",").append("\"").append(field.getName()).append("\"").append(":").append("\"").append(fieldValue).append("\"");
            }
        }
        return sb.append("}").deleteCharAt(1).toString();
    }

    /**
     * 文本文件转换为指定编码的字符串
     *
     * @param in
     *            文本文件
     * @param encoding 编码类型 默认UTF-8
     * @return 转换后的字符串
     * @throws IOException
     */
    public static String file2String(InputStream in, String encoding) {
        InputStreamReader reader = null;
        StringWriter writer = new StringWriter();
        try {
            if (encoding == null || "".equals(encoding.trim())) {
                reader = new InputStreamReader(in, "UTF-8");
            } else {
                reader = new InputStreamReader(in, encoding);
            }
            // 将输入流写入输出流
            char[] buffer = new char[1024];
            int n = 0;
            while (-1 != (n = reader.read(buffer))) {
                writer.write(buffer, 0, n);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            if (reader != null)
                try {
                    reader.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
        }
        // 返回转换结果
        if (writer != null)
            return writer.toString();
        else
            return null;
    }

    /**
     * 分割字符串且转换为sql包含语句的字符串
     * @param str
     * @param regex
     * @return
     */
    public  static String stringSplitToSqlString(String str, String regex) {

        if (!StringUtility.isNull(str) && !StringUtility.isNull(regex)) {
            String[] strArray = str.split(regex);
            StringBuffer resultString = new StringBuffer();

            for (int i = 0; i < strArray.length; i++) {

                String temp = strArray[i];

                if(!"".equals(temp)) {
                    if (i == 0 || i == strArray.length - 1) {
                        resultString.append('\'').append(temp).append("\'");
                    } else {
                        resultString.append('\'').append(temp).append("\',");
                    }
                }
            }

            return resultString.toString();
        }

        return "";
    }

    /**
     * 判断字符串是否非空
     */
    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    public static String fisrtCharUpperThenLower(String name) {
        name = name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
        return name;
    }

    public static String fisrtCharLower(String name) {
        name = name.substring(0, 1).toLowerCase() + name.substring(1);
        return name;
    }
}