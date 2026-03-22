package org.customer.forcustomerinterface;

import cn.hutool.json.JSONUtil;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {
        "org.customer.forcustomerinterface",  // 默认的包
        "org.customersdk.clientsdk"           // 添加 SDK 的包
})
public class ForCustomerInterfaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForCustomerInterfaceApplication.class, args);
//        System.out.println("111");
    }

}
