package com.jbuild4d.base.tools.common;

import java.net.InetAddress;
import java.net.UnknownHostException;

public class InetAddressUtility {
    public static String getThisPCIp() throws UnknownHostException {
        InetAddress addr=null;
        addr = InetAddress.getLocalHost();
        return addr.getHostAddress().toString();
    }

    public static String getThisPCHostName() throws UnknownHostException {
        InetAddress addr=null;
        addr = InetAddress.getLocalHost();
        return addr.getHostName().toString();
    }
}
