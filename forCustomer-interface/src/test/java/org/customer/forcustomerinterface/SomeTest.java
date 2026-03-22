package org.customer.forcustomerinterface;

import jakarta.annotation.Resource;

import org.customersdk.clientsdk.client.MyClient;
import org.customersdk.clientsdk.model.User;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

// JUnit 4 核心注解：指定 Spring 运行器
@RunWith(SpringRunner.class)
@SpringBootTest

public class SomeTest {

    @Resource
    private MyClient myClient;

    @Test
    public void testPrint() {
        System.out.println("111"+myClient);
        String result = myClient.getNameByGet("shushu");
        User user = new User();
        user.setUsername("shushu123");
        String usernamePyPost = myClient.getUsernameByPost(user);
        System.out.println(result);
        // 通过POST请求获取用户名，传入User对象
        System.out.println(usernamePyPost);
    }

}

