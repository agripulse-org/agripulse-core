package com.agripulse.api.config;

import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.quartz.autoconfigure.QuartzDataSource;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.quartz.SpringBeanJobFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Configuration
public class QuartzConfig {

    private static final String QUARTZ_SCHEMA = "quartz";

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties dataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    public DataSource dataSource(@Qualifier("dataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }

    @Bean
    public QuartzSchemaInitializer quartzSchemaInitializer(@Qualifier("dataSourceProperties") DataSourceProperties properties) {
        return new QuartzSchemaInitializer(properties.getUrl(), properties.getUsername(), properties.getPassword(), QUARTZ_SCHEMA);
    }

    static class QuartzSchemaInitializer {
        QuartzSchemaInitializer(String url, String username, String password, String schemaName) {
            try (Connection conn = DriverManager.getConnection(url, username, password);
                 Statement stmt = conn.createStatement()) {
                stmt.execute("CREATE SCHEMA IF NOT EXISTS " + schemaName);
            } catch (SQLException e) {
                throw new IllegalStateException("Failed to create Quartz schema '" + schemaName + "'", e);
            }
        }
    }

    @Bean
    @QuartzDataSource
    @DependsOn("quartzSchemaInitializer")
    public DataSource quartzDataSource(@Qualifier("dataSourceProperties") DataSourceProperties properties) {
        return DataSourceBuilder.create()
                .url(appendQuartzSchema(properties.getUrl()))
                .username(properties.getUsername())
                .password(properties.getPassword())
                .driverClassName(properties.getDriverClassName())
                .build();
    }

    private static String appendQuartzSchema(String url) {
        String separator = url.contains("?") ? "&" : "?";
        return url + separator + "currentSchema=" + QuartzConfig.QUARTZ_SCHEMA;
    }

    @Bean
    public SpringBeanJobFactory springBeanJobFactory(ApplicationContext applicationContext) {
        AutowireCapableJobFactory factory = new AutowireCapableJobFactory();
        factory.setApplicationContext(applicationContext);
        return factory;
    }

    static class AutowireCapableJobFactory extends SpringBeanJobFactory implements ApplicationContextAware {

        private AutowireCapableBeanFactory beanFactory;

        @Override
        public void setApplicationContext(ApplicationContext context) throws BeansException {
            this.beanFactory = context.getAutowireCapableBeanFactory();
        }

        @Override
        protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception {
            Object job = super.createJobInstance(bundle);
            beanFactory.autowireBean(job);
            return job;
        }
    }
}
