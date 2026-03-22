package org.customersdk.clientsdk.utils;

import cn.hutool.crypto.digest.DigestAlgorithm;
import cn.hutool.crypto.digest.Digester;

public class SignUtils {

    /**
     * 获取数据的签名
     * @param body 包含待签名的数据的键值对集合
     * @param secretKey 用于签名的密钥
     * @return 返回经过SHA-256算法加密后的签名字符串
     */
    public static String getSign(String body, String secretKey) {
        // 创建一个使用SHA-256算法的Digester对象
        Digester md5 = new Digester(DigestAlgorithm.SHA256);
        // 将hashMap的内容与密钥拼接，用点号(.)分隔
        String content=body+'.'+secretKey;
        // 对拼接后的内容进行SHA-256加密，并返回十六进制格式的结果
        return md5.digestHex(content);

    }
}
