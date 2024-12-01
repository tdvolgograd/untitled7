pipeline {
    agent any

    stages {
        stage('w/0 docker') {
            steps {
                sh 'echo "Hello World"'
            }
        }
        stage('with docker') {
            agent {
                docker {
                    image "node:18-alpine"
                }
            }
            steps {
                sh 'echo "with Docker"'
                sh 'npm --version'
            }
        }
    }
}
