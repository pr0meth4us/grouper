# Use a specific Maven version with Java 17 for the build stage
FROM maven:3.8.3-openjdk-17 AS build

# Set the working directory for the build
WORKDIR /app

# Copy only the backend's pom.xml to leverage Docker layer caching
COPY backend/pom.xml .

# Download dependencies first
RUN mvn dependency:go-offline

# Copy the rest of the backend source code
COPY backend/src ./src

# Build the application, skipping tests
RUN mvn clean install -DskipTests


# --- Final Stage ---
# Use a lightweight, secure base image for the final application
FROM openjdk:17-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy the built JAR from the build stage into the final image
# Note: The JAR name might differ based on your pom.xml (artifactId-version.jar)
# The wildcard *.jar helps to avoid issues with version numbers.
COPY --from=build /app/target/*.jar /app/app.jar

# Expose the port your application runs on
EXPOSE 8080

# The command to run your application
ENTRYPOINT ["java", "-jar", "app.jar"]
