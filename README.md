# 📊 InfoS - Information System Dashboard

A modern full-stack web application built with **Laravel** (backend) and **React** (frontend) for building and managing comprehensive information systems dashboards. Features real-time data visualization, user authentication with Google OAuth, PDF export capabilities, and payment integration.

## 🎯 Overview

**InfoS** is an enterprise-grade information management platform that combines:
- **Backend**: Laravel 13 with TypeScript-based API
- **Frontend**: React 18 with React components and interactive dashboards
- **Database**: PostgreSQL (via Docker)
- **Styling**: Tailwind CSS with modern UI components
- **Features**: Authentication, Stripe payments, data visualization, PDF generation

Perfect for creating custom dashboards, reports, and information systems with a beautiful, responsive interface.

---

## ✨ Key Features

- **🔐 Google OAuth Authentication** - Seamless login with Google accounts
- **📊 Interactive Dashboards** - Data visualization with Recharts
- **💳 Stripe Integration** - Secure payment processing
- **📄 PDF Export** - Generate downloadable reports
- **🎨 Modern UI** - Beautiful React components with Tailwind CSS
- **⚡ Real-time Updates** - Powered by Inertia.js & Laravel
- **🚀 Production Ready** - Deployed on Railway with Docker support
- **🔒 Secure** - Built with Laravel Sanctum for API security

---

## 🛠️ Tech Stack

### Backend
- **Laravel 13** - Web application framework
- **PHP 8.3+** - Server-side language
- **Laravel Socialite** - OAuth authentication
- **Resend** - Email delivery
- **Laravel Sanctum** - API token authentication

### Frontend
- **React 18** - JavaScript library for building UIs
- **TypeScript** - Type-safe JavaScript
- **Inertia.js** - Connect Laravel and React seamlessly
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Modern build tool
- **Recharts** - React charting library
- **Lucide React** - Beautiful icons

### Infrastructure
- **PostgreSQL** - Database
- **Docker & Docker Compose** - Containerization
- **Railway** - Cloud platform for deployment
- **Node.js 22.x** - JavaScript runtime

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.3+
- Node.js 22.x
- npm 10+
- Docker & Docker Compose (for database)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Marindo-12/InfoS.git
cd InfoS
```

**2. Install dependencies**
```bash
# Run the setup script (composer + npm install + migrations)
composer run setup
```

Or manually:
```bash
# Backend
composer install

# Frontend
npm install

# Create .env file
cp .env.example .env

# Generate app key
php artisan key:generate

# Start Docker
docker-compose up -d

# Run migrations
php artisan migrate
```

**3. Configure Google OAuth** (Optional)
See [GOOGLE_AUTH_COMPLETE_GUIDE.md](./GOOGLE_AUTH_COMPLETE_GUIDE.md) for detailed setup instructions.

**4. Start development servers**

```bash
# Option 1: Using the composer dev script (recommended)
composer run dev

# Option 2: Manually in separate terminals
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Laravel queue worker
php artisan queue:listen

# Terminal 3: Vite dev server
npm run dev

# Terminal 4 (optional): Log streaming
php artisan pail
```

**5. Access the application**
- Frontend: http://localhost:8000
- Laravel API: http://localhost:8000/api

---

## 📦 Building for Production

```bash
# Build TypeScript & bundle assets
npm run build

# Or use Composer script
composer run build
```

---

## 🔧 Available Commands

### Composer Scripts
```bash
# Setup (first-time installation)
composer run setup

# Development (runs all services)
composer run dev

# Build production assets
npm run build

# Run tests
composer run test
```

### Laravel Commands
```bash
# Database migrations
php artisan migrate
php artisan migrate:fresh --seed

# Clear caches
php artisan cache:clear
php artisan config:clear

# Queue worker (for emails, jobs)
php artisan queue:listen

# View application logs
php artisan pail
```

### npm Scripts
```bash
# Development build
npm run dev

# Production build
npm run build

# Type checking
npx tsc
```

---

## 🗄️ Database

This project uses **PostgreSQL** via Docker. The database is automatically initialized when running:

```bash
docker-compose up -d
```

To view the database:
```bash
# Access PostgreSQL CLI
docker-compose exec postgres psql -U postgres -d infos_db
```

---

## 🔐 Authentication

### Google OAuth Setup
For detailed instructions on setting up Google OAuth authentication, see:
[GOOGLE_AUTH_COMPLETE_GUIDE.md](./GOOGLE_AUTH_COMPLETE_GUIDE.md)

Quick steps:
1. Create a project at https://console.cloud.google.com/
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add credentials to `.env` file
5. Run migrations: `php artisan migrate`

---

## 💳 Stripe Integration

To enable Stripe payments:

1. Add your Stripe keys to `.env`:
```env
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

2. The frontend includes Stripe React components ready to use

---

## 🚢 Deployment

### Deploy to Railway

1. **Connect your repo to Railway**
   - Go to https://railway.app
   - Create a new project and connect your GitHub repo

2. **Set environment variables** in Railway dashboard:
```env
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
STRIPE_PUBLIC_KEY=your_key
STRIPE_SECRET_KEY=your_key
```

3. **Deploy**
   ```bash
   git push origin main
   ```

Railway automatically detects changes and deploys!

### Docker Compose for Local Production
```bash
docker-compose up
```

---

## 📚 Project Structure

```
InfoS/
├── app/                           # Laravel application
│   ├── Http/Controllers/          # API controllers
│   ├── Models/                    # Database models
│   └── ...
├── resources/
│   ├── js/                        # React components & pages
│   │   ├── Pages/                 # Page components
│   │   ├── Components/            # Reusable components
│   │   └── ...
│   └── css/                       # Stylesheets
├── routes/                        # API & web routes
├── database/
│   ├── migrations/                # Database schema
│   ├── factories/                 # Model factories
│   └── seeders/                   # Database seeders
├── public/                        # Static assets (built)
├── config/                        # Configuration files
├── docker-compose.yml             # Docker configuration
├── vite.config.js                 # Vite bundler config
├── tailwind.config.ts             # Tailwind CSS config
├── tsconfig.json                  # TypeScript config
├── package.json                   # npm dependencies
├── composer.json                  # PHP dependencies
└── README.md                      # This file
```

---

## 🧪 Testing

Run tests with:
```bash
composer run test
```

Tests are in the `tests/` directory using PHPUnit.

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -i :8000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Database Connection Error
```bash
# Restart Docker
docker-compose restart

# Verify PostgreSQL is running
docker ps | grep postgres
```

### Node Modules Issues
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Laravel Issues
```bash
# Clear all caches
php artisan optimize:clear

# Fresh migrations
php artisan migrate:fresh --seed
```

---

## 📄 Documentation

- **Google OAuth Setup**: [GOOGLE_AUTH_COMPLETE_GUIDE.md](./GOOGLE_AUTH_COMPLETE_GUIDE.md)
- **Laravel Docs**: https://laravel.com/docs
- **React Docs**: https://react.dev
- **Inertia.js**: https://inertiajs.com
- **Railway**: https://docs.railway.app/

---

## 📞 Support & Issues

Found a bug or have a feature request? Please open an issue on GitHub.

---

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## 🎓 Learning Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Official Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Inertia.js Guide](https://inertiajs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## ✅ Quick Checklist for New Developers

- [ ] Clone the repository
- [ ] Run `composer run setup`
- [ ] Run `composer run dev`
- [ ] Access http://localhost:8000
- [ ] Set up Google OAuth (optional)
- [ ] Explore the codebase in `app/` and `resources/js/`

---

**Made with ❤️ for building amazing information systems**
