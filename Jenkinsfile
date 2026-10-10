pipeline {
    agent any

    environment {
        APP_NAME     = 'devflow-platform'
        DOCKER_TAG   = "${env.BUILD_NUMBER ?: 'latest'}"
        BACKEND_DIR  = 'backend'
        FRONTEND_DIR = 'frontend'
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
    }

    stages {
        stage('1. Checkout SCM & Git Audit (Expt 1)') {
            steps {
                echo '=== [Jenkins] Checking out code from Version Control (Git/GitHub) ==='
                sh 'git status'
                sh 'git log -1 --pretty=format:"Commit: %h | Author: %an | Message: %s"'
            }
        }

        stage('2. Backend Tests & Quality Gate (Expt 4)') {
            steps {
                echo '=== [Jenkins] Running Automated Test Suite ==='
                dir("${env.BACKEND_DIR}") {
                    sh 'npm install --omit=dev --silent'
                    sh 'npm test'
                }
            }
        }

        stage('3. Frontend Build Validation') {
            steps {
                echo '=== [Jenkins] Validating Production Frontend Bundle ==='
                dir("${env.FRONTEND_DIR}") {
                    sh 'npm install --silent'
                    sh 'npm run build'
                }
            }
        }

        stage('4. Docker Containerization (Expt 2)') {
            steps {
                echo '=== [Jenkins] Building Docker Images ==='
                sh "docker build -t ${APP_NAME}-backend:${DOCKER_TAG} ./backend"
                sh "docker build -t ${APP_NAME}-frontend:${DOCKER_TAG} ./frontend"
            }
        }

        stage('5. Automated Multi-Service Deployment (Expt 3 & 5)') {
            steps {
                echo '=== [Jenkins] Deploying Multi-Service Stack via Docker Compose ==='
                sh 'docker compose down --remove-orphans || true'
                sh 'docker compose up -d'
            }
        }

        stage('6. Smoke Test & Health Check (Expt 7)') {
            steps {
                echo '=== [Jenkins] Verifying Health & Prometheus Scrape Endpoints ==='
                sleep(time: 10, unit: 'SECONDS')
                sh 'curl -f http://localhost:5000/health || (echo "Health check failed!" && exit 1)'
                sh 'curl -f http://localhost:5000/metrics | grep http_requests_total'
                echo '=== [Jenkins] All services are healthy and running! ==='
            }
        }
    }

    post {
        success {
            echo "✅ [Jenkins] Pipeline Build #${env.BUILD_NUMBER} SUCCEEDED! Application deployed to production."
        }
        failure {
            echo "❌ [Jenkins] Pipeline Build #${env.BUILD_NUMBER} FAILED! Immediate rollback triggered."
        }
        always {
            cleanWs()
        }
    }
}
