pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = "deemart-backend"
        DOCKER_IMAGE_FRONTEND = "deemart-frontend"
        DOCKER_REGISTRY = "" // e.g., "your-registry.azurecr.io" or leave empty for local
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            agent {
                docker {
                    image 'maven:3.9.6-eclipse-temurin-17'
                    reuseNode true
                }
            }
            steps {
                dir('backend') {
                    sh 'mvn clean compile -DskipTests'
                }
            }
            post {
                success {
                    stash name: 'backend-jar', includes: 'backend/target/*.jar'
                }
            }
        }

        stage('Test Backend') {
            agent {
                docker {
                    image 'maven:3.9.6-eclipse-temurin-17'
                    reuseNode true
                }
            }
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Package Backend') {
            agent {
                docker {
                    image 'maven:3.9.6-eclipse-temurin-17'
                    reuseNode true
                }
            }
            steps {
                dir('backend') {
                    sh 'mvn package -DskipTests -B'
                }
            }
            post {
                success {
                    stash name: 'backend-jar-final', includes: 'backend/target/*.jar'
                }
            }
        }

        stage('Build Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    reuseNode true
                }
            }
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
            post {
                success {
                    stash name: 'frontend-dist', includes: 'frontend/dist/**'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    // Build backend Docker image
                    unstash 'backend-jar-final'
                    sh """
                        docker build -t ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ./backend
                        docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_IMAGE_BACKEND}:latest
                    """

                    // Build frontend Docker image
                    unstash 'frontend-dist'
                    sh """
                        docker build -t ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ./frontend
                        docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_IMAGE_FRONTEND}:latest
                    """
                }
            }
        }

        stage('Push Docker Images') {
            when {
                expression { return env.DOCKER_REGISTRY != '' }
            }
            steps {
                script {
                    sh """
                        docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                        docker tag ${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:latest
                        docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                        docker tag ${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG} ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:latest
                        docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:${DOCKER_TAG}
                        docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_BACKEND}:latest
                        docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:${DOCKER_TAG}
                        docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE_FRONTEND}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh """
                        docker-compose down
                        docker-compose up -d
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
        success {
            echo "Pipeline completed successfully!"
        }
    }
}