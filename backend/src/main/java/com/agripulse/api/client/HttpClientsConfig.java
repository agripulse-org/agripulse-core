package com.agripulse.api.client;

import com.agripulse.api.client.openweather.OpenWeatherClient;
import com.agripulse.api.client.openweather.OpenWeatherClientFallback;
import com.agripulse.api.client.soilgrids.SoilGridsClient;
import com.agripulse.api.client.soilgrids.SoilGridsClientFallback;
import com.agripulse.api.config.ExternalServiceProperties;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;
import org.springframework.web.util.UriComponentsBuilder;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.net.http.HttpClient;
import java.time.Duration;

@Configuration
public class HttpClientsConfig {

    private static final Duration OPENWEATHER_CONNECT_TIMEOUT = Duration.ofSeconds(5);
    private static final Duration OPENWEATHER_READ_TIMEOUT = Duration.ofSeconds(10);

    private static final Duration SOILGRIDS_CONNECT_TIMEOUT = Duration.ofSeconds(5);
    private static final Duration SOILGRIDS_READ_TIMEOUT = Duration.ofSeconds(15);

    private static Object invoke(Method method, Object target, Object[] args) throws Throwable {
        try {
            return method.invoke(target, args);
        } catch (InvocationTargetException e) {
            throw e.getCause();
        }
    }

    @Bean
    public OpenWeatherClient openWeatherClient(ExternalServiceProperties props, CircuitBreakerRegistry cbRegistry) {
        ExternalServiceProperties.OpenWeather cfg = props.getOpenweather();

        String baseUrl = UriComponentsBuilder.fromUriString(cfg.getBaseUrl()).queryParam("appid", cfg.getApiKey()).build().toUriString();

        OpenWeatherClient real = buildHttpClient(
                baseUrl,
                OPENWEATHER_CONNECT_TIMEOUT,
                OPENWEATHER_READ_TIMEOUT,
                null,
                OpenWeatherClient.class
        );

        return circuitBreakerProxy(real, new OpenWeatherClientFallback(), cbRegistry.circuitBreaker("openweather"), OpenWeatherClient.class);
    }

    @Bean
    public SoilGridsClient soilGridsClient(ExternalServiceProperties props, CircuitBreakerRegistry cbRegistry) {
        ExternalServiceProperties.Soilgrids cfg = props.getSoilgrids();

        SoilGridsClient real = buildHttpClient(
                cfg.getBaseUrl(),
                SOILGRIDS_CONNECT_TIMEOUT,
                SOILGRIDS_READ_TIMEOUT,
                null,
                SoilGridsClient.class
        );

        return circuitBreakerProxy(real, new SoilGridsClientFallback(), cbRegistry.circuitBreaker("soilgrids"), SoilGridsClient.class);
    }

    @SuppressWarnings("unchecked")
    private <T> T circuitBreakerProxy(T real, T fallback, CircuitBreaker cb, Class<T> clientType) {
        return (T) Proxy.newProxyInstance(clientType.getClassLoader(), new Class<?>[]{clientType}, (proxy, method, args) -> {
            if (method.getDeclaringClass() == Object.class) {
                return method.invoke(real, args);
            }

            try {
                return cb.executeCheckedSupplier(() -> invoke(method, real, args));
            } catch (CallNotPermittedException e) {
                return invoke(method, fallback, args);
            } catch (Throwable t) { // Fix 1: fallback on any error
                return invoke(method, fallback, args);
            }
        });
    }

    private <T> T buildHttpClient(String baseUrl, Duration connectTimeout, Duration readTimeout, org.springframework.http.client.ClientHttpRequestInterceptor interceptor, Class<T> clientType) {
        HttpClient httpClient = HttpClient.newBuilder().connectTimeout(connectTimeout).build();
        JdkClientHttpRequestFactory factory = new JdkClientHttpRequestFactory(httpClient);
        factory.setReadTimeout(readTimeout);

        RestClient.Builder builder = RestClient.builder().baseUrl(baseUrl).requestFactory(factory);

        if (interceptor != null) {
            builder.requestInterceptor(interceptor);
        }

        return HttpServiceProxyFactory.builderFor(RestClientAdapter.create(builder.build())).build().createClient(clientType);
    }

}
