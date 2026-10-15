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
                    sh 'ls -l reports/junit.xml'
                }
            }
            post {
                always {
                    sh 'pwd'
                    junit testResults: 'npm-hello/reports/junit.xml',
                        allowEmptyResults: false
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
