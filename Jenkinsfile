pipeline {
    agent {label 'pipeline-agent'}

    stages {
        stage('Install dependencies') {
            steps {
                    sh 'npm ci'
                }
        }
         
        stage('Test') {
            steps {
                    sh 'npm test'
            }
            post {
                always {
                    junit 'reports/junit.xml'

                }
            }
        }

        stage('SonarQube Analysis'){
            steps{
                withSonarQubeEnv('SonarQube'){
                    script{
                        def scannerHome = tool 'SonarScanner'
                        sh "${scannerHome}/bin/sonar-scanner/"
                    }
                }
            }
        }

        stage('Build and save artifact') {
            steps {
                sh '''
                rm -rf dist
                npm run pack:artifact
                '''
                archiveArtifacts artifacts: 'dist/*', fingerprint: true

            }
        }
    }
}
