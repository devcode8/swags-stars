import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }
    
    const repoOwner = 'fetchai';
    const repoName = 'innovation-lab-examples';

    // First, let's verify the user exists
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'star-verifier-app'
        }
      }
    );

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'GitHub user not found' },
        { status: 404 }
      );
    }

    // Check stargazers with pagination
    console.log(`Starting star verification for user: ${username}`);
    let hasStarred = false;
    let page = 1;
    const perPage = 100;
    let totalChecked = 0;

    while (true) {
      const response = await fetch(
        `https://api.github.com/repos/${repoOwner}/${repoName}/stargazers?page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'star-verifier-app'
          }
        }
      );

      if (!response.ok) {
        console.error('GitHub API Error:', response.status, response.statusText);
        return NextResponse.json(
          { error: `Failed to fetch repository data: ${response.statusText}` },
          { status: response.status }
        );
      }

      const stargazers = await response.json();
      totalChecked += stargazers.length;
      
      console.log(`Page ${page}: Found ${stargazers.length} stargazers (total checked: ${totalChecked})`);
      
      if (stargazers.length === 0) {
        console.log('No more stargazers found');
        break;
      }

      // Check if the username is in this page of stargazers
      const foundUser = stargazers.find((stargazer: { login: string }) => 
        stargazer.login.toLowerCase() === username.toLowerCase()
      );

      if (foundUser) {
        console.log(`Found user ${username} in stargazers!`);
        hasStarred = true;
        break;
      }

      // If we got less than perPage results, we've reached the end
      if (stargazers.length < perPage) {
        console.log(`Reached end of stargazers (got ${stargazers.length} < ${perPage})`);
        break;
      }

      page++;

      // Safety limit to prevent infinite loops (max 100 pages = 10,000 stars)
      if (page > 100) {
        console.log('Reached safety limit of 100 pages');
        break;
      }
    }

    console.log(`Final result - User ${username} has starred: ${hasStarred} (checked ${totalChecked} stargazers)`);
    return NextResponse.json({ hasStarred, username, totalChecked });
    
  } catch (error) {
    console.error('Error verifying star:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}