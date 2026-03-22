package org.customersdk.clientsdk.client;

import cn.hutool.core.util.RandomUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import org.customersdk.clientsdk.model.User;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.customersdk.clientsdk.utils.SignUtils.getSign;


/**
 * 调用第三方接口
* */

public class MyClient {

    private  static  final  String GATEWAY_HOST= "http://localhost:8097";
    private String accessKey;
    private String secretKey;


    public MyClient(String accessKey, String secretKey) {
        this.secretKey = secretKey;
        this.accessKey = accessKey;
    }

    public String getNameByGet(String name){

        //可以单独传入http参数，这样参数会自动做URL编码，拼接在URL中
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("name", name);
        String  result= HttpUtil.get(GATEWAY_HOST+"/api/name/", paramMap);
        return result;
    }

    public String getNameByPost(  String name) {
        //可以单独传入http参数，这样参数会自动做URL编码，拼接在URL中
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("name", name);
        String  result= HttpUtil.post(GATEWAY_HOST+"/api/name/", paramMap);
        return result;
    }



    private Map<String, String> getHeaders(String body) {
        Map<String, String>  hashMaps = new HashMap<>();
        hashMaps.put("accessKey", accessKey);
//        密码一定不能发
//        hashMaps.put("secretKey", secretKey);
        hashMaps.put("nonce", RandomUtil.randomNumbers(4));
        hashMaps.put("body", body);
        hashMaps.put("timestamp",String.valueOf(System.currentTimeMillis()/1000)) ;
        hashMaps.put("sign", getSign(body,secretKey));
        return hashMaps;
    }


    public String getUsernameByPost(  User user) {
        String json= JSONUtil.toJsonStr(user);
        HttpResponse httpResponse = HttpRequest.post(GATEWAY_HOST+"/api/name/user")
                .charset(StandardCharsets.UTF_8)
                .addHeaders(getHeaders(json))
                .body(json)
                .execute();
        System.out.println(httpResponse.getStatus());
        System.out.println(httpResponse.body());
        String result=httpResponse.body();
        return result;
    }
}
