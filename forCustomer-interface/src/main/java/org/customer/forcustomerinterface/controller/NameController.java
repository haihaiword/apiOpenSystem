package org.customer.forcustomerinterface.controller;

import cn.hutool.crypto.SignUtil;
import jakarta.servlet.http.HttpServletRequest;

import org.customersdk.clientsdk.model.User;
import org.customersdk.clientsdk.utils.SignUtils;
import org.springframework.web.bind.annotation.*;

/**
 * 名称api
 */
@RestController
@RequestMapping("/name")
public class NameController {

    @GetMapping("/get")
    public String getNameByGet(String name){
        return "helloGet,"+name;
    }

    @PostMapping("/post")
    public String getNameByPost( @RequestParam String name) {
        return "helloPost," + name;
    }

    @PostMapping("/user")
    public String getUsernameByPost(@RequestBody User user, HttpServletRequest request) {
//        String accessKey = request.getHeader("accessKey");
//        String secretKey = request.getHeader("secretKey");
//        String nonce = request.getHeader("nonce");
//        String timestamp = request.getHeader("timestamp");
//        String sign = request.getHeader("sign");
//        String body = request.getHeader("body");
//
//        if (!accessKey.equals("shushu")){
//            throw  new RuntimeException("assessKey is not valid");
//        }
//
//        if(Long.parseLong(nonce)>10000){
//            throw  new RuntimeException("nonce is not valid");
//        }
//
//        // 校验时间戳是否超过5分钟
//        if (timestamp != null && !timestamp.isEmpty()) {
//            try {
//                long requestTime = Long.parseLong(timestamp);
//                long currentTime = System.currentTimeMillis();
//
//                // 5分钟 = 5 * 60 * 1000 = 300000 毫秒
//                long fiveMinutes = 5 * 60 * 1000;
//
//                if (Math.abs(currentTime - requestTime) > fiveMinutes) {
//                    throw new RuntimeException("请求已过期");
//                }
//
//            } catch (NumberFormatException e) {
//                throw new RuntimeException("时间戳格式错误");
//            }
//        } else {
//            throw new RuntimeException("时间戳不能为空");
//        }
//        //是在数据库拿出密码
//        String serverSign = SignUtils.getSign(body, "12345678");
//        if (!sign.equals(serverSign)){
//            throw  new RuntimeException("sign is not valid");
//        }
        String result="helloPost," + user.getUsername() ;

        return result ;
    }


}
