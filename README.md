# ETH Global New Delhi - Star Verifier

A Next.js application for ETH Global New Delhi that verifies GitHub repository stars and rewards users with a lucky spin wheel to win exciting swag!

## Features

- **GitHub Star Verification**: Users must star the [fetchai/innovation-lab-examples](https://github.com/fetchai/innovation-lab-examples) repository
- **Lucky Spin Wheel**: After verification, users can spin a wheel to win one of 5 exciting prizes:
  - 👕 T-Shirt
  - 🍼 Water Bottle  
  - 🧢 Cap
  - 🖊️ Pen
  - 📓 Diary

## How It Works

1. **User Landing**: Users see the repository link and are prompted to star it
2. **Username Entry**: Users enter their GitHub username
3. **Verification**: The app checks if the user has starred the repository using GitHub API
4. **Lucky Draw**: Verified users get to spin the wheel and win swag!

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Setup

The GitHub API integration uses a personal access token that's currently hardcoded. For production deployment, consider:

1. Moving the token to environment variables
2. Implementing proper token rotation
3. Adding rate limiting

## Technical Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **API**: GitHub REST API v3
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## Project Structure

```
src/
├── app/
│   ├── api/verify-star/     # GitHub API integration
│   ├── globals.css          # Global styles
│   ├── layout.tsx          # App layout
│   └── page.tsx            # Main page with flow logic
└── components/
    ├── StarVerification.tsx # GitHub star verification component
    └── SpinWheel.tsx       # Lucky spin wheel component
```

## API Endpoints

### POST /api/verify-star

Verifies if a GitHub user has starred the repository.

**Request:**
```json
{
  "username": "github-username"
}
```

**Response:**
```json
{
  "hasStarred": true,
  "username": "github-username"
}
```

## Customization

### Changing Prizes

Edit the `prizes` array in `src/components/SpinWheel.tsx`:

```typescript
const prizes = [
  { name: 'T-Shirt', color: '#FF6B6B', emoji: '👕' },
  { name: 'Water Bottle', color: '#4ECDC4', emoji: '🍼' },
  // Add more prizes...
];
```

### Changing Repository

Update the repository details in `src/app/api/verify-star/route.ts`:

```typescript
const repoOwner = 'fetchai';
const repoName = 'innovation-lab-examples';
```

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

### Other Platforms

```bash
npm run build
npm start
```

## Security Considerations

- The GitHub token is currently hardcoded for demo purposes
- In production, use environment variables and implement proper token management
- Consider implementing rate limiting to prevent API abuse
- Add input validation and sanitization

## License

MIT License - feel free to use this project for your events!
