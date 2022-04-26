FROM openjdk:11
WORKDIR /app
COPY ./placementmanager/target/placementmanager-0.0.1-SNAPSHOT.jar /app/backend-app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "backend-app.jar"]
