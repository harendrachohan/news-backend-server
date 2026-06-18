const { aiQueue } = require('./fetchQueue');
const { summarize } = require('../ai/summarizer');
const { classify } = require('../ai/classifier');
const { detectState } = require('../ai/stateDetector');
const { updateArticleAiFields } = require('../services/articleService');

function startAiWorker() {
  aiQueue.process(async (job) => {
    const { articleId, article } = job.data;

    const [summary, category] = await Promise.all([
      summarize(article.content || article.title),
      Promise.resolve(classify(article.title, article.content || '')),
    ]);

    const state = detectState(article.title, article.content || '', article.state);

    await updateArticleAiFields(articleId, {
      summary,
      category: article.category || category,
      state,
    });

    return { articleId, summary: summary.slice(0, 50) };
  });

  aiQueue.on('failed', (job, err) => {
    console.error(`AI job failed (article ${job.data?.articleId}):`, err.message);
  });
}

module.exports = { startAiWorker };
