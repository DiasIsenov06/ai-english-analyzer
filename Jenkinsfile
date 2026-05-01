pipeline {
    agent any

    environment {
        APP_NAME    = 'ai-english-analyzer'
        DOCKER_REPO = 'ai-english'
        NODE_ENV    = 'production'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        // ====================================
        // 1. КОД ТАРТУ
        // ====================================
        stage('Checkout') {
            steps {
                echo '📥 GitHub-тан код тартылуда...'
                checkout scm
            }
        }

        // ====================================
        // 2. ТӘУЕЛДІЛІКТЕРДІ ОРНАТУ
        // ====================================
        stage('Install Dependencies') {
            steps {
                echo '📦 npm тәуелділіктері орнатылуда...'
                sh 'npm ci --prefer-offline'
            }
        }

        // ====================================
        // 3. КОД ТЕКСЕРУ (Lint)
        // ====================================
        stage('Lint') {
            steps {
                echo '🔍 ESLint тексерілуде...'
                sh 'npm run lint'
            }
        }

        // ====================================
        // 4. TYPE CHECK (TypeScript)
        // ====================================
        stage('Type Check') {
            steps {
                echo '🔷 TypeScript типтер тексерілуде...'
                sh 'npx tsc --noEmit'
            }
        }

        // ====================================
        // 5. NEXT.JS BUILD
        // ====================================
        stage('Build') {
            steps {
                echo '🏗️ Next.js жинақталуда...'
                withCredentials([
                    string(credentialsId: 'GEMINI_API_KEY', variable: 'GEMINI_API_KEY'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_SECRET')
                ]) {
                    sh '''
                        export DATABASE_URL="postgresql://user:pass@localhost:5432/db"
                        export NEXT_TELEMETRY_DISABLED=1
                        npm run build
                    '''
                }
            }
        }

        // ====================================
        // 6. DOCKER IMAGE ЖАСАУ
        // ====================================
        stage('Docker Build') {
            steps {
                echo '🐳 Docker image жасалуда...'
                sh """
                    docker build -t ${DOCKER_REPO}/app:${BUILD_NUMBER} .
                    docker tag ${DOCKER_REPO}/app:${BUILD_NUMBER} ${DOCKER_REPO}/app:latest
                """
            }
        }

        // ====================================
        // 7. САҚТЫҚ КӨШІРМЕ
        // ====================================
        stage('Backup Database') {
            when {
                branch 'main'
            }
            steps {
                echo '💾 Дерекқор сақтық көшірмесі жасалуда...'
                sh '''
                    if docker ps | grep -q ai-english-db; then
                        bash scripts/backup.sh backup || true
                    else
                        echo "DB контейнері жоқ — өткізілді"
                    fi
                '''
            }
        }

        // ====================================
        // 8. ОРНАЛАСТЫРУ (тек main branch)
        // ====================================
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Өндіріске орналастырылуда...'
                sh '''
                    docker-compose down --remove-orphans || true
                    docker-compose up -d --build
                    echo "Орналастыру аяқталды, денсаулық тексерілуде..."
                    sleep 15
                    curl -sf http://localhost:3000 && echo "✅ Қосымша жұмыс істеп тұр" || echo "❌ Денсаулық тексеру сәтсіз"
                '''
            }
        }

        // ====================================
        // 9. ДЕНСАУЛЫҚ ТЕКСЕРУ
        // ====================================
        stage('Health Check') {
            when {
                branch 'main'
            }
            steps {
                echo '🔎 Денсаулық тексерілуде...'
                retry(3) {
                    sh '''
                        sleep 5
                        curl -sf http://localhost:3000 || exit 1
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline сәтті аяқталды! Build #${BUILD_NUMBER}"
        }
        failure {
            echo "❌ Pipeline сәтсіз! Build #${BUILD_NUMBER} — логтарды тексеріңіз"
        }
        always {
            // Ескі Docker image-дерді тазалау
            sh 'docker image prune -f || true'
        }
    }
}
