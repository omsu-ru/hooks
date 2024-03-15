const config = {
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/git',
      {
        assets: ['dist/*.js', 'dist/*.js.map'],
        message:
          'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};

// "releaseRules": [
//     {"tag": "breaking", "release": "major"},
//     {"tag": "chore", "release": false},
//     {"tag": "ci", "release": false},
//     {"tag": "docs", "release": false},
//     {"tag": "feat", "release": "minor"},
//     {"tag": "fix", "release": "patch"},
//     {"tag": "refactor", "release": "patch"},
//     {"tag": "security", "release": "patch"},
//     {"tag": "style", "release": "patch"},
//     {"tag": "test", "release": false}
//   ]
