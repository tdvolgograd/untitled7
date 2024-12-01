pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "tdvolgograd/untitled7"
        REGISTRY_CREDENTIALS = '38ba95ce-6c10-4201-b8db-d276d469f83f' // Jenkins credentials ID for Docker Hub
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
                    # Check if the container with the name 'untitled7-staging' is running
                    if [ \$(docker ps -q -f name=untitled7-staging) ]; then
                        docker stop untitled7-staging
                        docker rm untitled7-staging
                    fi

                    # Pull the latest image
                    docker pull ${DOCKER_IMAGE}:latest

                    # Start a new container with the latest image
                    docker run -d --name untitled7-staging -p 80:80 ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Test Deployment') {
            steps {
                script {
                    sh "curl -f http://localhost:80 || exit 1"
                }
            }
        }

        stage('Deploy to Production') {
            when {
                expression {
                   input message: 'input-message', ok: 'OK'
                }
            }
            steps {
                script {
                    sh """
                    # Stop and remove previous production containers
                    docker ps -q --filter "ancestor=${DOCKER_IMAGE}" | xargs -r docker stop
                    docker ps -aq --filter "ancestor=${DOCKER_IMAGE}" | xargs -r docker rm

                    # Pull the latest image and run it
                    docker-compose up -d production
                    """
                }
            }
        }
    }
}

