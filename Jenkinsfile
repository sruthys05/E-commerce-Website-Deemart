pipeline {
agent any


tools {
    maven 'Maven3'
    nodejs 'Node20'
}

stages {

    stage('Build Backend') {
        steps {
            dir('Backend') {
                bat 'mvn clean package -DskipTests'
            }
        }
    }

    stage('Build Frontend') {
        steps {
            dir('frontend') {
                bat 'npm install'
                bat 'npm run build'
            }
        }
    }

    stage('Docker Build') {
        steps {
            bat 'docker compose build'
        }
    }

    stage('Deploy') {
        steps {
            bat 'docker compose up -d'
        }
    }
}

post {
    success {
        echo 'Success'
    }

    failure {
        echo 'Failed'
    }
}
}
