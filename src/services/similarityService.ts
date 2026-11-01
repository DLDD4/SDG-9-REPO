import { ResearchPaper, SimilarityReviewResult, MatchedPaperPriorArt } from '../types/repository';

// Common academic stopwords to filter out for meaningful lexical comparison
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is',
  'it', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what',
  'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
  'this', 'work', 'paper', 'present', 'propose', 'study', 'results', 'show', 'demonstrate', 'using', 'based'
]);

function extractTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

function extractNGrams(text: string, n = 3): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  
  const ngrams: string[] = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(' '));
  }
  return ngrams;
}

export const similarityService = {
  /**
   * Evaluates student's input against the entire college paper repository
   */
  analyzeDraft(
    title: string,
    abstract: string,
    department: string,
    keywords: string[],
    papers: ResearchPaper[]
  ): SimilarityReviewResult {
    const fullInputText = `${title} ${abstract} ${keywords.join(' ')}`;
    const inputTokens = extractTokens(fullInputText);
    const inputTokenSet = new Set(inputTokens);
    const inputTrigrams = extractNGrams(`${title} ${abstract}`, 3);
    const inputTrigramSet = new Set(inputTrigrams);
    const inputWords = fullInputText.split(/\s+/).filter(Boolean);

    const matches: MatchedPaperPriorArt[] = [];
    const allOverlappingConcepts = new Set<string>();
    const allNovelConcepts = new Set<string>(keywords);

    for (const paper of papers) {
      const paperFullText = `${paper.title} ${paper.abstract} ${paper.keywords.join(' ')}`;
      const paperTokens = extractTokens(paperFullText);
      const paperTokenSet = new Set(paperTokens);
      const paperTrigrams = extractNGrams(`${paper.title} ${paper.abstract}`, 3);

      // 1. Keyword Overlap (Jaccard)
      const inputKwLower = keywords.map(k => k.toLowerCase().trim());
      const paperKwLower = paper.keywords.map(k => k.toLowerCase().trim());
      const sharedKeywords = paper.keywords.filter(k => 
        inputKwLower.includes(k.toLowerCase().trim())
      );

      // 2. Lexical / Concept Overlap
      let intersectionCount = 0;
      for (const t of inputTokenSet) {
        if (paperTokenSet.has(t)) {
          intersectionCount++;
        }
      }
      const diceScore = (2 * intersectionCount) / (inputTokenSet.size + paperTokenSet.size || 1);

      // 3. Exact N-Gram / Phrase Overlap (detects verbatim sentence fragments)
      const matchedPhrases: string[] = [];
      for (const tri of paperTrigrams) {
        if (inputTrigramSet.has(tri) && !matchedPhrases.includes(tri)) {
          matchedPhrases.push(tri);
          if (matchedPhrases.length >= 4) break;
        }
      }

      // Title direct similarity bonus
      const titleOverlap = extractTokens(title).filter(t => extractTokens(paper.title).includes(t)).length;
      const titleBonus = titleOverlap > 2 ? 0.15 : 0;

      // Department affiliation bonus
      const deptBonus = paper.department === department ? 0.05 : 0;

      // Calculate composite score (0 to 100)
      const keywordRatio = (sharedKeywords.length / Math.max(keywords.length, 1));
      const phraseRatio = matchedPhrases.length > 0 ? 0.2 : 0;

      const rawScore = (diceScore * 0.45) + (keywordRatio * 0.35) + phraseRatio + titleBonus + deptBonus;
      const similarityPercentage = Math.min(Math.round(rawScore * 100), 96);

      if (similarityPercentage >= 6) {
        // Track concepts
        sharedKeywords.forEach(k => {
          allOverlappingConcepts.add(k);
          allNovelConcepts.delete(k);
        });

        // Generate citation recommendation
        const lead = paper.authors[0]?.name || 'Faculty Researcher';
        const year = paper.academicYear.split('-')[0] || '2025';
        const journalInfo = paper.publicationDetails 
          ? `${paper.publicationDetails.journalName}, doi:${paper.publicationDetails.doi}`
          : `College Institutional Repository, ID: ${paper.id}`;
        
        matches.push({
          paperId: paper.id,
          paperTitle: paper.title,
          similarityScore: similarityPercentage,
          leadAuthor: lead,
          department: paper.department,
          journalName: paper.publicationDetails?.journalName,
          matchedKeywords: sharedKeywords,
          matchedPhrases: matchedPhrases.slice(0, 3),
          suggestedCitation: `${lead} et al. (${year}). "${paper.title}." ${journalInfo}.`
        });
      }
    }

    // Sort by highest similarity
    matches.sort((a, b) => b.similarityScore - a.similarityScore);

    // Compute composite overall similarity index
    let overallSimilarityScore = 0;
    if (matches.length > 0) {
      // Highest match has highest weight
      const topScore = matches[0].similarityScore;
      const secondScore = matches[1]?.similarityScore || 0;
      overallSimilarityScore = Math.min(Math.round((topScore * 0.7) + (secondScore * 0.3)), 94);
    }

    // Safety Verdict
    let verdict: SimilarityReviewResult['verdict'] = 'Original (<10%)';
    if (overallSimilarityScore >= 28) {
      verdict = 'High Prior Art Overlap (>28%)';
    } else if (overallSimilarityScore >= 18) {
      verdict = 'Moderate Overlap (18-28%)';
    } else if (overallSimilarityScore >= 10) {
      verdict = 'Acceptable (10-18%)';
    }

    // Citation Guidance
    const citationGuidance: string[] = [];
    if (matches.length > 0) {
      citationGuidance.push(`Strong overlap detected with prior work by ${matches[0].leadAuthor} (${matches[0].paperId}). You must explicitly contrast your proposed methodology with this paper in Section 2 (Related Work).`);
      if (matches[1]) {
        citationGuidance.push(`Shared domain terminology with ${matches[1].leadAuthor} (${matches[1].paperId}). Ensure your experimental baselines cite this prior college study.`);
      }
      citationGuidance.push('Verify that no verbatim sentence clauses are duplicated without quotation marks and formal attribution.');
    } else {
      citationGuidance.push('No significant conceptual or phrase-level collisions found in the college repository.');
      citationGuidance.push('Your paper appears novel within the college repository scope. Proceed with external literature benchmarking on Google Scholar and Scopus.');
    }

    return {
      reviewId: `REV-${Date.now().toString(36).toUpperCase()}`,
      inputTitle: title,
      inputAbstract: abstract,
      inputDepartment: department,
      analyzedDate: new Date().toISOString(),
      overallSimilarityScore,
      verdict,
      topMatches: matches.slice(0, 5),
      novelConceptsIdentified: Array.from(allNovelConcepts),
      overlappingConceptsIdentified: Array.from(allOverlappingConcepts),
      citationGuidance,
      wordCount: inputWords.length
    };
  },

  /**
   * Pre-packaged realistic sample drafts for students to quickly test
   */
  getSampleDrafts() {
    return [
      {
        label: 'Sample 1: Heavy Overlap (Endoscopic NeRF)',
        title: 'Deep Neural Radiance Fields for Minimally Invasive Surgical Vision Phantoms',
        abstract: 'Depth estimation in laparoscopic surgery suffers from specular highlights and tissue deformations. We evaluate neural radiance fields (NeRF) with optical flow priors on tissue phantoms to generate sub-millimeter surgical reconstructions without structured light hardware.',
        department: 'Biomedical Engineering',
        keywords: ['Neural Radiance Fields', 'Endoscopic Vision', 'Computer Vision', 'Deep Learning', 'Surgical Robotics']
      },
      {
        label: 'Sample 2: Moderate Overlap (Solar Cells & MXenes)',
        title: 'Interfacial Chemistry of Perovskite Photovoltaics with Graphene Oxide Electrodes',
        abstract: 'Organic-inorganic halide perovskite solar cells require passivation layers to eliminate trap states. We study the electrochemical stability of functionalized carbon nanomaterials and MXenes for enhanced charge transport in solar devices under standard illumination.',
        department: 'Materials Science & Nanotechnology',
        keywords: ['Perovskite Solar Cells', '2D MXenes', 'Photocatalysis', 'Supercapacitors']
      },
      {
        label: 'Sample 3: Highly Original (Novel Neuromorphic Sensor)',
        title: 'Event-Driven Neuromorphic Spiking Architectures for Sub-Microwatt Acoustic Keyword Spotting',
        abstract: 'Ultra-low power edge devices require asynchronous event-based sensing rather than continuous analog sampling. We present an analog spike-timing co-processor consuming 420 nW for voice activity detection in battery-free wearables.',
        department: 'Electrical & Computer Engineering',
        keywords: ['Edge Computing', 'Low-Power IoT', 'Sensor Fusion']
      }
    ];
  }
};
