FROM openjdk:11-jdk-slim as bulid
MAINTAINER Alberto Isaboke <alberto.isaboke@wake.co.ke>
WORKDIR application
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM openjdk:11-jdk-slim
WORKDIR application
COPY --from=bulid application/dependencies/ ./
COPY --from=bulid application/spring-boot-loader/ ./
COPY --from=bulid application/snapshot-dependencies/ ./
COPY --from=bulid application/application/ ./

RUN apt-get update
RUN apt-get install -y tzdata --no-install-recommends

RUN ln -sf /usr/share/zoneinfo/Africa/Nairobi /etc/localtime && echo "Africa/Nairobi" > /etc/timezone

ENTRYPOINT ["java", "org.springframework.boot.loader.JarLauncher"]