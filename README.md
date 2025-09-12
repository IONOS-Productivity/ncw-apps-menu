# NCW Apps Menu

A Nextcloud app that provides an enhanced apps menu interface for better navigation and app management.

## Description

The NCW Apps Menu app enhances the default Nextcloud apps menu with improved functionality and user experience. It provides a more intuitive way to access and manage your Nextcloud applications.

## Features

- Enhanced apps menu interface
- Improved navigation experience
- Better app organization and discovery
- Seamless integration with Nextcloud's existing interface

## Installation

### From Source

1. Clone this repository into your Nextcloud apps directory:
   ```bash
   cd nextcloud/apps
   git clone <repository-url> ncw_apps_menu
   ```

2. Install dependencies:
   ```bash
   cd ncw_apps_menu
   npm install
   composer install
   ```

3. Build the frontend:
   ```bash
   npm run build
   ```

4. Enable the app in your Nextcloud admin panel or via command line:
   ```bash
   php occ app:enable ncw_apps_menu
   ```

## Development

### Prerequisites

- Node.js (^22.0.0)
- npm (^10.5.0)
- PHP 8.1+
- Composer

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   composer install
   ```

3. Start development mode:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run build` - Build for production
- `npm run dev` - Build for development
- `npm run watch` - Watch mode for development
- `npm run test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues

### Testing

Run the test suite:
```bash
npm test
```

Run with coverage:
```bash
npm run test:coverage
```

## License

This project is licensed under the AGPL-3.0-or-later license. See the [LICENSE](LICENSE) file for details.
