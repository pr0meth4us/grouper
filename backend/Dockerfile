# Use an official Maven image as the base image
FROM maven:3.9.5-amazoncorretto-17 AS build

# Set the working directory
WORKDIR /app

# Copy the Maven Wrapper scripts
COPY mvnw .
COPY .mvn ./.mvn

# Copy the pom.xml and the source code
COPY pom.xml .
COPY src ./src

# Run the Maven build
RUN chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Create a new stage for the final image
FROM amazoncorretto:17-alpine

# Set the working directory for the final image
WORKDIR /app

# Copy the jar file from the build stage
COPY --from=build /app/target/grouping-0.0.1-SNAPSHOT.jar ./grouping.jar

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["java", "-jar", "grouping.jar"]