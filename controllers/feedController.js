const axios = require('axios');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const SavedContent = require('../models/SavedContent');
const ReportedContent = require('../models/ReportedContent');

// @desc    Get feed from multiple sources
// @route   GET /api/v1/feed
// @access  Public
exports.getFeed = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20, sources } = req.query;
  const offset = (page - 1) * limit;
  
  let sourcesToFetch = ['twitter', 'reddit', 'linkedin'];
  if (sources) {
    sourcesToFetch = sources.split(',');
  }

  let results = [];
  
  try {
    // Fetch some real content from JSONPlaceholder API (free and no auth required)
    const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
    const commentsResponse = await axios.get('https://jsonplaceholder.typicode.com/comments?_limit=100');
    
    const posts = postsResponse.data.slice(0, 30);
    const users = usersResponse.data;
    const comments = commentsResponse.data;
    
    // Mock Twitter feed data
    if (sourcesToFetch.includes('twitter')) {
      try {
        // Use reliable hardcoded content instead of external APIs that might fail
        const twitterPosts = [
          "The key to success is to focus on goals, not obstacles.",
          "Learn from yesterday, live for today, hope for tomorrow.",
          "Code is like humor. When you have to explain it, it's bad.",
          "The best error message is the one that never shows up.",
          "First, solve the problem. Then, write the code.",
          "It's not a bug – it's an undocumented feature.",
          "The only way to learn a new programming language is by writing programs in it.",
          "The most important property of a program is whether it accomplishes the intention of its user.",
          "Programming isn't about what you know; it's about what you can figure out.",
          "Good code is its own best documentation."
        ];
        
        // Add tech/programming related tweets
        const techTweets = [
          {
            text: "Just pushed a major update to our React component library. Check it out on GitHub!",
            author: "React Developer"
          },
          {
            text: "The future of web development is here! WebAssembly + JavaScript is a game changer.",
            author: "Web Enthusiast"
          },
          {
            text: "10 VS Code extensions every developer should install today. Number 5 changed my workflow completely!",
            author: "Code Explorer"
          },
          {
            text: "Spent the weekend refactoring our authentication system. Reduced code by 30% while improving security!",
            author: "Security Dev"
          },
          {
            text: "If you're not using TypeScript in 2023, you're missing out on catching bugs before they happen.",
            author: "TypeScript Fan"
          }
        ];
        
        // Combine regular and tech tweets
        const combinedPosts = [...twitterPosts.map(post => ({ text: post })), ...techTweets];
        
        const twitterFeed = combinedPosts.map((post, i) => {
          const user = users[i % users.length] || {
            name: post.author || 'Twitter User',
            username: (post.author || 'user' + i).toLowerCase().replace(/\s+/g, '_')
          };
          
          return {
            id: `twitter-${Date.now()}-${i}`,
            platform: 'twitter',
            title: '',
            description: post.text,
            contentUrl: 'https://twitter.com/example/status/123456789',
            imageUrl: `https://picsum.photos/seed/twitter${i}/600/400`,
            author: {
              name: post.author || user.name,
              username: user.username,
              imageUrl: `https://picsum.photos/seed/${user.username}/100/100`
            },
            metrics: {
              likes: Math.floor(Math.random() * 100),
              retweets: Math.floor(Math.random() * 50),
              replies: Math.floor(Math.random() * 20)
            },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
          };
        });
        
        results.push(...twitterFeed);
      } catch (error) {
        console.error('Error generating Twitter feed:', error);
        
        // Minimal fallback in case the above fails
        const twitterFeed = Array(5).fill().map((_, i) => ({
          id: `twitter-fallback-${i}`,
          platform: 'twitter',
          title: '',
          description: `This is a simple Twitter post #${i + 1} about technology and development.`,
          contentUrl: 'https://twitter.com/example/status/123456789',
          imageUrl: `https://picsum.photos/seed/twitterfallback${i}/600/400`,
          author: {
            name: 'Twitter User',
            username: 'twitteruser',
            imageUrl: `https://picsum.photos/seed/twitteruser${i}/100/100`
          },
          metrics: {
            likes: Math.floor(Math.random() * 100),
            retweets: Math.floor(Math.random() * 50),
            replies: Math.floor(Math.random() * 20)
          },
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
        }));
        
        results.push(...twitterFeed);
      }
    }
    
    // Mock Reddit feed
    if (sourcesToFetch.includes('reddit')) {
      try {
        // Fetch some fun facts/jokes from a free API for Reddit content
        const redditContent = [];
        
        // Try to get jokes
        try {
          // Add a timeout to the jokes API call
          const jokesResponse = await axios.get('https://v2.jokeapi.dev/joke/Programming,Miscellaneous?amount=5&type=twopart&lang=en', {
            timeout: 3000 // 3 second timeout
          }).catch(() => ({ data: null })); // Handle timeouts gracefully
          
          if (jokesResponse.data && jokesResponse.data.jokes && jokesResponse.data.jokes.length > 0) {
            jokesResponse.data.jokes.forEach((joke, i) => {
              const user = users[(i + 5) % users.length];
              redditContent.push({
                id: `reddit-joke-${i}`,
                platform: 'reddit',
                title: joke.setup || 'Programming Joke',
                description: joke.delivery || joke.joke,
                subreddit: 'r/ProgrammerHumor',
                user,
                type: 'joke'
              });
            });
          } else {
            throw new Error('No jokes returned from API'); // Trigger the fallback jokes
          }
        } catch (error) {
          console.error('Error fetching jokes:', error);
        }
        
        // Try to get random facts
        try {
          // Use a more reliable facts API
          const factsResponse = await axios.get('https://api.api-ninjas.com/v1/facts?limit=5', {
            headers: { 'X-Api-Key': 'YOUR_API_KEY' }, // For demonstration - we use fallback anyway
            timeout: 3000
          }).catch(() => ({ data: null })); // Handle timeouts gracefully
          
          if (factsResponse.data) {
            // Format facts for Reddit
            const facts = Array.isArray(factsResponse.data) ? factsResponse.data : [];
            facts.forEach((fact, i) => {
              const user = users[(i + 2) % users.length];
              redditContent.push({
                id: `reddit-fact-${i}`,
                platform: 'reddit',
                title: 'Random Fact',
                description: fact.fact || "Did you know? The first computer bug was an actual real-life bug.",
                subreddit: 'r/todayilearned',
                user,
                type: 'fact'
              });
            });
          }
        } catch (error) {
          console.error('Error fetching facts:', error);
          
          // Add fallback facts if API fails
          const fallbackFacts = [
            "A group of flamingos is called a 'flamboyance'.",
            "The world's oldest known living tree is over 5,000 years old.",
            "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
            "A day on Venus is longer than a year on Venus. It takes 243 Earth days to rotate once on its axis (a day), but only 225 Earth days to go around the sun (a year).",
            "Octopuses have three hearts, nine brains, and blue blood."
          ];
          
          fallbackFacts.forEach((fact, i) => {
            const user = users[(i + 2) % users.length] || { username: `fact_user_${i}` };
            redditContent.push({
              id: `reddit-fact-fallback-${i}`,
              platform: 'reddit',
              title: 'Random Fact',
              description: fact,
              subreddit: 'r/todayilearned',
              user,
              type: 'fact'
            });
          });
        }
        
        // Add curated programming content to ensure we have programming jokes
        const programmingContent = [
          {
            title: "Why do programmers prefer dark mode?",
            description: "Because light attracts bugs!",
            subreddit: "r/ProgrammerHumor",
            type: "joke"
          },
          {
            title: "Why do Java developers wear glasses?",
            description: "Because they can't C#!",
            subreddit: "r/ProgrammerHumor",
            type: "joke"
          },
          {
            title: "How many programmers does it take to change a light bulb?",
            description: "None, that's a hardware problem.",
            subreddit: "r/ProgrammerHumor",
            type: "joke"
          },
          {
            title: "Why do programmers always mix up Halloween and Christmas?",
            description: "Because Oct 31 == Dec 25",
            subreddit: "r/ProgrammerHumor",
            type: "joke"
          },
          {
            title: "What's the object-oriented way to become wealthy?",
            description: "Inheritance.",
            subreddit: "r/ProgrammerHumor",
            type: "joke"
          }
        ];
        
        // Add the curated content
        programmingContent.forEach((content, i) => {
          const user = users[(i + 3) % users.length];
          redditContent.push({
            id: `reddit-prog-${i}`,
            platform: 'reddit',
            title: content.title,
            description: content.description,
            subreddit: content.subreddit,
            user,
            type: content.type
          });
        });
        
        // If we got some content, format it for the feed
        if (redditContent.length > 0) {
          const redditFeed = redditContent.map((content, i) => {
            const commentCount = Math.floor(Math.random() * 100);
            return {
              id: content.id,
              platform: 'reddit',
              title: content.title,
              description: content.description,
              contentUrl: `https://reddit.com/${content.subreddit}/comments/example`,
              // Always include an image to ensure consistency
              imageUrl: `https://picsum.photos/seed/reddit${content.type}${i}/600/400`,
              author: {
                name: content.user.username,
                username: content.user.username,
                imageUrl: `https://picsum.photos/seed/${content.user.username}/100/100`
              },
              metrics: {
                upvotes: Math.floor(Math.random() * 5000),
                comments: commentCount
              },
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString()
            };
          });
          
          results.push(...redditFeed);
        } else {
          // Fallback to guaranteed English content
          const redditPosts = [
            {
              title: "Discovered this gem while refactoring legacy code",
              description: "// This code works perfectly fine but I have no idea why or how. Do NOT modify it."
            },
            {
              title: "When you're debugging at 3AM and finally fix the issue",
              description: "That feeling when you find the missing semicolon after 5 hours of debugging."
            },
            {
              title: "Senior developer reviewing my PR",
              description: "Why did you do it this way? This could be much simpler."
            },
            {
              title: "My code in production vs during development",
              description: "Everything was working perfectly until the users got involved."
            },
            {
              title: "Naming variables is hard",
              description: "temp, temp1, temp2, finalTemp, reallyFinalTemp, actuallyFinalTemp, iPromiseThisIsTheLastTemp"
            },
            {
              title: "Documentation be like",
              description: "The function is self-explanatory. Figure it out yourself."
            },
            {
              title: "The three states of a programmer",
              description: "1. It doesn't work and I don't know why. 2. It works and I don't know why. 3. It works exactly as expected (never happens)."
            }
          ];
          
          const redditFeed = redditPosts.map((post, i) => {
            const user = users[(i + 5) % users.length];
            const commentCount = Math.floor(Math.random() * 100);
            
            return {
              id: `reddit-backup-${i}`,
              platform: 'reddit',
              title: post.title,
              description: post.description,
              contentUrl: 'https://reddit.com/r/programming/comments/example',
              imageUrl: `https://picsum.photos/seed/reddit${i}/600/400`,
              author: {
                name: user.username || `redditor${i}`,
                username: user.username || `redditor${i}`,
                imageUrl: `https://picsum.photos/seed/${user.username || `redditor${i}`}/100/100`
              },
              metrics: {
                upvotes: Math.floor(Math.random() * 5000),
                comments: commentCount
              },
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString()
            };
          });
          
          results.push(...redditFeed);
        }
      } catch (error) {
        console.error('Error generating Reddit feed:', error);
        
        // Ultimate fallback - English only, guaranteed to work
        const redditPosts = [
          {
            title: "Discovered this gem while refactoring legacy code",
            description: "// This code works perfectly fine but I have no idea why or how. Do NOT modify it."
          },
          {
            title: "When you're debugging at 3AM and finally fix the issue",
            description: "That feeling when you find the missing semicolon after 5 hours of debugging."
          },
          {
            title: "Senior developer reviewing my PR",
            description: "Why did you do it this way? This could be much simpler."
          },
          {
            title: "My code in production vs during development",
            description: "Everything was working perfectly until the users got involved."
          },
          {
            title: "Naming variables is hard",
            description: "temp, temp1, temp2, finalTemp, reallyFinalTemp, actuallyFinalTemp, iPromiseThisIsTheLastTemp"
          },
          {
            title: "Documentation be like",
            description: "The function is self-explanatory. Figure it out yourself."
          },
          {
            title: "The three states of a programmer",
            description: "1. It doesn't work and I don't know why. 2. It works and I don't know why. 3. It works exactly as expected (never happens)."
          }
        ];
        
        const redditFeed = redditPosts.map((post, i) => {
          const user = users[(i + 5) % users.length] || { username: `redditor${i}` };
          
          return {
            id: `reddit-fallback-${i}`,
            platform: 'reddit',
            title: post.title, 
            description: post.description,
            contentUrl: 'https://reddit.com/r/programming/comments/example',
            imageUrl: `https://picsum.photos/seed/redditfallback${i}/600/400`,
            author: {
              name: user.username || `redditor${i}`,
              username: user.username || `redditor${i}`,
              imageUrl: `https://picsum.photos/seed/${user.username || `redditor${i}`}/100/100`
            },
            metrics: {
              upvotes: Math.floor(Math.random() * 5000),
              comments: Math.floor(Math.random() * 100)
            },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString()
          };
        });
        
        results.push(...redditFeed);
      }
    }

    // Mock LinkedIn feed
    if (sourcesToFetch.includes('linkedin')) {
      try {
        // Try to fetch real news headlines from NewsAPI.org (using open-access endpoint)
        const newsResponse = await axios.get('https://saurav.tech/NewsAPI/top-headlines/category/technology/us.json');
        
        if (newsResponse.data && newsResponse.data.articles) {
          const articles = newsResponse.data.articles.slice(0, 5);
          
          const linkedinFeed = articles.map((article, i) => {
            const user = users[(i + 2) % users.length];
            
            return {
              id: `linkedin-news-${i}`,
              platform: 'linkedin',
              title: article.title || `Professional Development News #${i + 1}`,
              description: article.description || article.content || 'This is a news article shared on LinkedIn.',
              contentUrl: article.url || 'https://www.linkedin.com/posts/example',
              imageUrl: article.urlToImage && article.urlToImage.startsWith('http') 
                ? article.urlToImage 
                : `https://picsum.photos/seed/linkedin${i}/600/400`,
              author: {
                name: article.author || user.name,
                username: user.email.split('@')[0],
                imageUrl: `https://picsum.photos/seed/${user.username}/100/100`
              },
              metrics: {
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 30)
              },
              createdAt: article.publishedAt || new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString()
            };
          });
          
          results.push(...linkedinFeed);
        } else {
          // Fallback to English-only content
          const linkedinPosts = [
            {
              title: "10 Essential Skills Every Developer Needs in 2023",
              description: "In today's fast-evolving tech landscape, staying relevant requires more than just coding skills. Here are 10 essential skills every developer should master to stay competitive."
            },
            {
              title: "How We Improved Application Performance by 300%",
              description: "Our team recently completed a major optimization project that resulted in dramatic performance improvements. Here's how we approached the problem and what we learned."
            },
            {
              title: "The Future of Remote Work in Tech Companies",
              description: "As companies adapt to hybrid work models, the technology sector is leading innovation in remote collaboration tools and practices. Here's what to expect in the coming years."
            },
            {
              title: "Building Scalable Microservices Architecture",
              description: "Learn how we implemented a scalable microservices architecture that handles millions of requests daily while maintaining high availability and fault tolerance."
            },
            {
              title: "Career Transition: From Developer to Technical Leader",
              description: "Making the leap from individual contributor to technical leader requires developing a different skill set. Here's my journey and the lessons I learned along the way."
            }
          ];
          
          const linkedinFeed = linkedinPosts.map((post, i) => {
            const user = users[(i + 2) % users.length];
            
            return {
              id: `linkedin-custom-${i}`,
              platform: 'linkedin',
              title: post.title,
              description: post.description,
              contentUrl: 'https://www.linkedin.com/posts/example',
              imageUrl: `https://picsum.photos/seed/linkedin${i}/600/400`,
              author: {
                name: user.name,
                username: user.email.split('@')[0],
                imageUrl: `https://picsum.photos/seed/${user.username}/100/100`
              },
              metrics: {
                likes: Math.floor(Math.random() * 100),
                comments: Math.floor(Math.random() * 30)
              },
              createdAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString()
            };
          });
          
          results.push(...linkedinFeed);
        }
      } catch (error) {
        console.error('LinkedIn feed generation error:', error);
        
        // Fallback with English-only content
        const linkedinPosts = [
          {
            title: "10 Essential Skills Every Developer Needs in 2023",
            description: "In today's fast-evolving tech landscape, staying relevant requires more than just coding skills. Here are 10 essential skills every developer should master to stay competitive."
          },
          {
            title: "How We Improved Application Performance by 300%",
            description: "Our team recently completed a major optimization project that resulted in dramatic performance improvements. Here's how we approached the problem and what we learned."
          },
          {
            title: "The Future of Remote Work in Tech Companies",
            description: "As companies adapt to hybrid work models, the technology sector is leading innovation in remote collaboration tools and practices. Here's what to expect in the coming years."
          },
          {
            title: "Building Scalable Microservices Architecture",
            description: "Learn how we implemented a scalable microservices architecture that handles millions of requests daily while maintaining high availability and fault tolerance."
          },
          {
            title: "Career Transition: From Developer to Technical Leader",
            description: "Making the leap from individual contributor to technical leader requires developing a different skill set. Here's my journey and the lessons I learned along the way."
          }
        ];
        
        const linkedinFeed = linkedinPosts.map((post, i) => {
          const user = users[(i + 2) % users.length];
          
          return {
            id: `linkedin-${i}`,
            platform: 'linkedin',
            title: post.title,
            description: post.description,
            contentUrl: 'https://www.linkedin.com/posts/example',
            imageUrl: `https://picsum.photos/seed/linkedin${i}/600/400`,
            author: {
              name: user.name || 'LinkedIn Professional',
              username: user.email ? user.email.split('@')[0] : 'linkedin_user',
              imageUrl: `https://picsum.photos/seed/${user.username || 'linkedin_user'}/100/100`
            },
            metrics: {
              likes: Math.floor(Math.random() * 100),
              comments: Math.floor(Math.random() * 30)
            },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString()
          };
        });
        
        results.push(...linkedinFeed);
      }
    }
  } catch (error) {
    console.error('Error fetching data from JSONPlaceholder:', error);
    
    // Fallback to static data if API fails
    if (sourcesToFetch.includes('twitter')) {
      const twitterFeed = Array(10).fill().map((_, i) => ({
        id: `twitter-${Date.now()}-${i}`,
        platform: 'twitter',
        title: '',
        description: `This is a sample Twitter post #${i + 1} about technology, coding, and development.`,
        contentUrl: 'https://twitter.com/example/status/123456789',
        imageUrl: i % 2 === 0 ? `https://picsum.photos/seed/twitter${i}/600/400` : '',
        author: {
          name: 'Twitter User',
          username: 'twitteruser',
          imageUrl: `https://picsum.photos/seed/twitteruser${i}/100/100`
        },
        metrics: {
          likes: Math.floor(Math.random() * 100),
          retweets: Math.floor(Math.random() * 50),
          replies: Math.floor(Math.random() * 20)
        },
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
      }));
      
      results.push(...twitterFeed);
    }
    
    // Add similar fallbacks for Reddit and LinkedIn as needed
  }
  
  // Randomize or sort based on most recent
  const sortedResults = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination would happen here
  const paginatedResults = sortedResults.slice(offset, offset + parseInt(limit));
  
  res.status(200).json({
    success: true,
    count: sortedResults.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(sortedResults.length / limit)
    },
    data: paginatedResults
  });
});

// @desc    Save content from feed
// @route   POST /api/v1/feed/save
// @access  Private
exports.saveContent = asyncHandler(async (req, res, next) => {
  const { contentId, platform, title, description, imageUrl, contentUrl, author } = req.body;
  
  if (!contentId || !platform || !title || !contentUrl) {
    return next(new ErrorResponse('Missing required fields', 400));
  }
  
  // Check if already saved
  const existingSave = await SavedContent.findOne({
    user: req.user.id,
    contentId,
    platform
  });
  
  if (existingSave) {
    return res.status(200).json({
      success: true,
      message: 'Content already saved',
      data: existingSave
    });
  }
  
  // Create new saved content
  const savedContent = await SavedContent.create({
    user: req.user.id,
    contentId,
    platform,
    title,
    description, 
    imageUrl,
    contentUrl,
    author
  });
  
  res.status(201).json({
    success: true,
    data: savedContent
  });
});

// @desc    Get user's saved content
// @route   GET /api/v1/feed/saved
// @access  Private
exports.getSavedContent = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  
  const savedContent = await SavedContent.find({ user: req.user.id })
    .sort({ savedAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  
  const count = await SavedContent.countDocuments({ user: req.user.id });
  
  res.status(200).json({
    success: true,
    count,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    },
    data: savedContent
  });
});

// @desc    Delete saved content
// @route   DELETE /api/v1/feed/saved/:id
// @access  Private
exports.deleteSavedContent = asyncHandler(async (req, res, next) => {
  const savedContent = await SavedContent.findById(req.params.id);
  
  if (!savedContent) {
    return next(new ErrorResponse('Content not found', 404));
  }
  
  // Check ownership
  if (savedContent.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this content', 401));
  }
  
  await savedContent.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Report content from feed
// @route   POST /api/v1/feed/report
// @access  Private
exports.reportContent = asyncHandler(async (req, res, next) => {
  const { contentId, platform, reason, details } = req.body;
  
  if (!contentId || !platform || !reason) {
    return next(new ErrorResponse('Missing required fields', 400));
  }
  
  // Check if already reported by this user
  const existingReport = await ReportedContent.findOne({
    user: req.user.id,
    contentId,
    platform
  });
  
  if (existingReport) {
    return res.status(200).json({
      success: true,
      message: 'Content already reported',
      data: existingReport
    });
  }
  
  // Create new report
  const reportedContent = await ReportedContent.create({
    user: req.user.id,
    contentId,
    platform,
    reason,
    details
  });
  
  res.status(201).json({
    success: true,
    data: reportedContent
  });
}); 