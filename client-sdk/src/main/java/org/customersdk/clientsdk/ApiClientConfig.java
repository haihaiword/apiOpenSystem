package org.customersdk.clientsdk;

import lombok.Data;
import org.customersdk.clientsdk.client.MyClient;
import org.customersdk.clientsdk.model.User;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("api.client")
@Data
@ComponentScan
public class ApiClientConfig {
    private String accessKey;
    private String secretKey;

    @Bean
    public MyClient myClient() {
       return   new MyClient(accessKey,secretKey);
    }


}
