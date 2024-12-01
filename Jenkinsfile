pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "tdvolgograd/untitled7"
        REGISTRY_CREDENTIALS = '38ba95ce-6c10-4201-b8db-d276d469f83f' // Jenkins credentials ID для Docker Hub
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/tdvolgograd/untitled7.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', "${REGISTRY_CREDENTIALS}") {
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {
                    sh """
                    docker pull ${DOCKER_IMAGE}:latest
                    docker-compose -f /path/to/docker-compose.staging.yml up -d
                    """
                }
            }
        }

        stage('Test Deployment') {
            steps {
                // Добавьте проверки работоспособности приложения
                sh "curl -f http://localhost:8080 || exit 1"
            }
        }

        stage('Deploy to Production') {
            when {
                input message: 'Deploy to Production?'
            }
            steps {
                script {
                    sh """
                    docker pull ${DOCKER_IMAGE}:latest
                    docker-compose -f /path/to/docker-compose.production.yml up -d
                    """
                }
            }
        }
    }

    post {
        failure {
            mail to: 'your_email@example.com',
                 subject: "Deployment Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Check the Jenkins logs for details."
        }
        success {
            mail to: 'your_email@example.com',
                 subject: "Deployment Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                 body: "Deployment was successful."
        }
    }
}
