# IVS Side Event 2025 to Google Calendar

## Project Overview

A Next.js application that extracts event information from IVS Side Event URLs (like 4s.link) and provides an easy way for users to add events to their Google Calendar with a single click.

## Key Features

- Extract event details from 4s.link URLs
- Generate Google Calendar add-event links
- Responsive design for mobile and tablet devices
- Clean, user-friendly interface

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS for responsive design
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Development Guidelines

### Code Standards

- All functions must have JSDoc comments in Japanese
- Remove trailing whitespace (except in markdown files)
- Files must end with a newline
- Run code formatter/linter auto-fix after changes to HTML/CSS/JS files

### Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── EventExtractor.tsx
│   ├── CalendarButton.tsx
│   └── LoadingSpinner.tsx
├── lib/
│   ├── event-parser.ts
│   └── calendar-utils.ts
└── types/
    └── event.ts
```

### Core Functionality

#### Event Data Extraction

- Parse 4s.link URLs to extract event information
- Handle different event page structures
- Extract: title, date, time, location, description

#### Google Calendar Integration

- Generate Google Calendar URLs with event parameters
- Format dates/times correctly for Google Calendar API
- Handle timezone conversion (JST to user's timezone)

#### Responsive Design Requirements

- Mobile-first approach
- Tablet and desktop layouts
- Touch-friendly buttons and inputs
- Readable typography on all screen sizes

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without changes
- `npm run type-check` - Run TypeScript compiler check

### Code Formatting and Quality Enforcement

This project uses **Prettier** and **ESLint** to enforce consistent code formatting:

#### Automatic Formatting Setup

- **Prettier** is configured to automatically format code
- **ESLint** rules enforce no trailing spaces and require newlines at end of files
- Run `npm run format` after making changes to ensure consistent formatting
- Run `npm run lint:fix` to automatically fix linting issues

#### Required Formatting Rules

1. **No trailing whitespace** - All lines must not end with spaces or tabs
2. **Files must end with newline** - Every file must have a final newline character
3. **Consistent indentation** - 2 spaces for all files
4. **Single quotes** - Use single quotes for strings in JavaScript/TypeScript
5. **No semicolons** - Semicolons are omitted where possible

#### Editor Configuration

Configure your editor to:

- Remove trailing whitespace on save
- Insert final newline on save
- Use project's Prettier configuration
- Show ESLint warnings and errors

#### Pre-commit Enforcement

Always run these commands before committing:

```bash
npm run format
npm run lint:fix
npm run type-check
```

### Testing

- Unit tests for event parsing logic
- Integration tests for calendar URL generation
- Responsive design testing on multiple devices

## API Endpoints

- `GET /api/parse-event?url=<4s.link-url>` - Extract event data from URL
- Error handling for invalid URLs or parsing failures

## Security Considerations

- Validate and sanitize input URLs
- Rate limiting for API endpoints
- CORS configuration for frontend requests

## Deployment

- Configure environment variables for production
- Set up CI/CD pipeline with Vercel
- Performance optimization for mobile devices
