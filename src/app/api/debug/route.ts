import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = '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';
    const repoOwner = 'fetchai';
    const repoName = 'innovation-lab-examples';

    // Get repository info
    const repoResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'star-verifier-app'
        }
      }
    );

    if (!repoResponse.ok) {
      return NextResponse.json({
        error: 'Failed to fetch repository info',
        status: repoResponse.status
      });
    }

    const repoInfo = await repoResponse.json();

    // Get first few stargazers to see the structure
    const stargazersResponse = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/stargazers?page=1&per_page=10`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'star-verifier-app'
        }
      }
    );

    const stargazers = stargazersResponse.ok ? await stargazersResponse.json() : [];

    return NextResponse.json({
      repoInfo: {
        name: repoInfo.name,
        full_name: repoInfo.full_name,
        stargazers_count: repoInfo.stargazers_count
      },
      firstFewStargazers: stargazers.map((s: any) => s.login).slice(0, 5),
      stargazersCount: stargazers.length
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}