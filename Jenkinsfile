pipeline {
    agent {label 'pipeline-agent'}

    stages {
        stage('Install dependencies') {
            steps {
                dir('npm-hello') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test') {
            steps {
                dir('npm-hello') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    dir('npm-hello') 
                        junit 'npm-hello/reports/junit.xml'
                    }   
                }
        }
        stage('Build and save artifact') {
            steps {
                dir('npm-hello') {
                    sh 'npm run pack:artifact'
                    archiveArtifacts artifacts: 'artifacts/*.tgz', fingerprint: true
                }
            }
        }
    }
}
