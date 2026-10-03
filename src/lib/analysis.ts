import type { Paper, PaperAnalysis } from '@/types'

// ─── AI Analysis Abstraction ─────────────────────────────────────────────────
// This interface makes it easy to swap from mock → real LLM API later.

export interface AnalysisProvider {
  analyzePaper(paper: Paper): Promise<PaperAnalysis>
  synthesizeGaps(papers: Paper[]): Promise<GapAnalysis>
}

export interface LimitationItem {
  label: string
  count: number
}

export interface GapAnalysis {
  analyzedCount: number
  frequentLimitations: LimitationItem[]
  commonChallenges: string[]
  underexploredAreas: string[]
  potentialDirections: string[]
  disclaimer: string
}

// ─── Mock Templates ───────────────────────────────────────────────────────────

const METHODOLOGY_TEMPLATES = [
  'The authors propose a novel deep learning architecture combining transformer-based encoders with domain-specific fine-tuning. The model is pre-trained on a large corpus and subsequently fine-tuned on task-specific annotated datasets.',
  'A hybrid approach is employed, integrating classical statistical methods with neural network-based feature extraction. The pipeline involves data preprocessing, feature engineering, model training, and rigorous evaluation across multiple benchmarks.',
  'The study employs a systematic literature review methodology complemented by empirical experiments. Proposed methods are validated through ablation studies and compared against state-of-the-art baselines on standard benchmarks.',
  'An ensemble learning framework is proposed, combining multiple specialized models. The approach leverages both supervised and semi-supervised learning to address limited labeled data challenges in the target domain.',
  'The work introduces a graph-based representation learning approach, encoding structural relationships between entities. A message-passing neural network is trained end-to-end on the target task with multi-task learning objectives.',
]

const PROBLEM_TEMPLATES = [
  'Existing approaches struggle with scalability and generalization when applied to large-scale, heterogeneous datasets. The research identifies a critical performance gap between controlled benchmark environments and real-world deployment scenarios.',
  'Current methods fail to adequately capture long-range dependencies and contextual relationships in complex structured data, leading to suboptimal performance on downstream tasks requiring deep semantic understanding.',
  'The lack of interpretability in black-box models hinders their adoption in high-stakes domains. Existing explainability techniques impose significant computational overhead while providing limited actionable insights.',
  'Data scarcity and distribution shift remain persistent challenges. Models trained on available datasets exhibit poor transfer to out-of-distribution examples, limiting practical utility in resource-constrained real-world settings.',
  'Computational efficiency constraints prevent deployment of state-of-the-art approaches in resource-limited environments. There is a significant gap between academic research performance and practical inference requirements.',
]

const FINDINGS_TEMPLATES = [
  'The proposed method achieves state-of-the-art performance, surpassing previous best results by a significant margin across all evaluated benchmarks. Ablation studies confirm the contribution of each architectural component.',
  'Experimental results demonstrate consistent improvements over baseline methods. The approach shows particularly strong performance on challenging out-of-distribution test sets, indicating better generalization capability.',
  'The study reveals that careful data augmentation and regularization strategies are critical for performance. The proposed training procedure reduces overfitting and improves robustness to noisy input conditions.',
  'Analysis shows that the proposed architectural modifications yield significant efficiency gains without sacrificing accuracy. The model achieves competitive performance with substantially reduced computational requirements.',
  'User studies and quantitative evaluations confirm that the proposed system outperforms alternatives on both objective metrics and subjective quality assessments, validating the practical utility of the approach.',
]

const LIMITATION_TEMPLATES = [
  'The approach requires substantial labeled training data, limiting applicability in low-resource domains. Performance degrades notably when training data is limited or domain distribution shifts significantly.',
  'Computational requirements remain high for real-time deployment scenarios. The quadratic complexity of the attention mechanism presents challenges for processing very long input sequences efficiently.',
  'Evaluation is conducted on a limited set of benchmarks that may not fully represent real-world diversity. The generalizability of findings to other domains and languages has not been thoroughly validated.',
  'The proposed method introduces several hyperparameters whose optimal values are dataset-dependent and require extensive tuning. Sensitivity analysis reveals performance instability under certain parameter configurations.',
  'The current framework does not adequately address fairness and bias concerns. Models trained on biased datasets may perpetuate or amplify existing inequalities in predictions.',
]

const FUTURE_WORK_TEMPLATES = [
  'Future work should investigate scaling the approach to larger and more diverse datasets. Exploring lightweight model variants suitable for edge deployment would extend the practical applicability of this research.',
  'Extending the framework to handle multimodal inputs and cross-lingual settings represents a promising research direction. Integration with continual learning strategies could address the challenge of evolving data distributions.',
  'Incorporating uncertainty quantification and calibration methods would enhance the reliability of predictions in safety-critical applications. Formal verification approaches merit investigation for high-stakes deployment.',
  'Developing more efficient training procedures through techniques such as knowledge distillation and neural architecture search offers a clear path to reducing computational overhead while maintaining performance.',
  'Longitudinal studies evaluating performance in real-world deployment settings are needed to validate findings beyond controlled benchmark environments. Collaboration with domain experts is essential for practical validation.',
]

const OBJECTIVE_TEMPLATES = [
  'The primary objective is to develop a scalable and generalizable framework that addresses identified performance gaps while maintaining computational efficiency suitable for real-world deployment.',
  'This work aims to bridge the gap between theoretical advances and practical applicability by proposing methods that achieve strong benchmark performance while remaining interpretable and computationally tractable.',
  'The research seeks to establish a new benchmark for the task, providing a rigorous evaluation framework and baseline results that can guide future research in this direction.',
  'The goal is to demonstrate that carefully designed inductive biases and training procedures can yield significant improvements with minimal additional computational cost over existing approaches.',
  'This study aims to provide a comprehensive understanding of the factors influencing model performance, offering practical guidelines for practitioners implementing these approaches in production systems.',
]

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function deterministicSeed(text: string): number {
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

// ─── Mock Analysis Provider ───────────────────────────────────────────────────

export const mockAnalysisProvider: AnalysisProvider = {
  async analyzePaper(paper: Paper): Promise<PaperAnalysis> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800))

    const seed = deterministicSeed(paper.title + paper.id)
    const keywordExtras = paper.keywords.slice(0, 3)

    return {
      researchProblem: pick(PROBLEM_TEMPLATES, seed),
      researchObjective: pick(OBJECTIVE_TEMPLATES, seed + 1),
      methodology: pick(METHODOLOGY_TEMPLATES, seed + 2),
      dataset:
        paper.domain === 'Natural Language Processing'
          ? 'Evaluated on benchmark datasets including SQuAD 2.0, GLUE, and SuperGLUE. Additional experiments on a custom annotated corpus of domain-specific documents (N=12,400 samples).'
          : paper.domain === 'Computer Vision'
          ? 'Experiments conducted on ImageNet-1K, COCO 2017, and ADE20K datasets. Ablation studies performed on a curated subset of 50,000 samples with expert annotations.'
          : `Primary experiments use publicly available benchmark datasets relevant to ${paper.domain}. Custom evaluation sets were constructed from domain-specific sources to assess generalization.`,
      evaluationMetrics:
        'Performance evaluated using standard metrics: Accuracy, F1-score (macro and micro), Precision, Recall, and AUC-ROC. Computational efficiency measured via FLOPs and inference latency on standardized hardware.',
      keyFindings: pick(FINDINGS_TEMPLATES, seed + 3),
      limitations: pick(LIMITATION_TEMPLATES, seed + 4),
      futureWork: pick(FUTURE_WORK_TEMPLATES, seed + 1),
      importantKeywords: [
        ...keywordExtras,
        paper.domain.toLowerCase().replace(/\s+/g, '-'),
        'deep-learning',
        'benchmark',
        'evaluation',
      ].slice(0, 6),
      generatedAt: new Date().toISOString(),
    }
  },

  async synthesizeGaps(papers: Paper[]): Promise<GapAnalysis> {
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    if (papers.length === 0) {
      return {
        analyzedCount: 0,
        frequentLimitations: [],
        commonChallenges: [],
        underexploredAreas: [],
        potentialDirections: [],
        disclaimer: '',
      }
    }

    const domains = [...new Set(papers.map((p) => p.domain))]
    const hasAnalysis = papers.filter((p) => p.analysis)
    const n = papers.length

    // Deterministic counts proportional to library size
    const c = (ratio: number) => Math.max(1, Math.round(n * ratio))

    return {
      analyzedCount: n,
      frequentLimitations: [
        { label: 'Multilingual Evaluation', count: c(0.57) },
        { label: 'Dataset Size', count: c(0.43) },
        { label: 'Explainability', count: c(0.36) },
        { label: 'Domain Generalization', count: c(0.29) },
        { label: 'Human Evaluation', count: c(0.21) },
      ].sort((a, b) => b.count - a.count),
      commonChallenges: [
        `Bridging benchmark performance and real-world deployment across ${domains.join(', ')}`,
        'Handling data scarcity and class imbalance in domain-specific applications',
        'Balancing model complexity with computational efficiency constraints',
        'Ensuring reproducibility across hardware and software configurations',
        'Addressing fairness, bias, and ethical considerations in model design',
      ],
      underexploredAreas: [
        'Federated learning for privacy-preserving training',
        'Continual and lifelong learning for evolving data distributions',
        `Cross-domain transfer between ${domains.length > 1 ? domains.slice(0, 2).join(' and ') : 'related research areas'}`,
        'Neuro-symbolic integration for improved reasoning',
        'Resource-constrained deployment on edge and mobile devices',
      ],
      potentialDirections: [
        `Multilingual evaluation across ${domains.length > 1 ? 'multiple domains' : paper_domains_str(domains)}`,
        'Explainable evaluation frameworks with interpretable scoring',
        'Cross-domain benchmarking and transfer protocols',
        'Larger and more diverse benchmark datasets',
        'Self-supervised learning to reduce annotation requirements',
        hasAnalysis.length > 0
          ? `Extending findings from ${hasAnalysis.length} analyzed paper${hasAnalysis.length > 1 ? 's' : ''} to broader domains`
          : 'Longitudinal real-world deployment studies',
      ],
      disclaimer:
        'AI-synthesized from paper metadata and abstracts. Intended for research ideation only — not a substitute for rigorous systematic review.',
    }
  },
}

function paper_domains_str(domains: string[]): string {
  if (domains.length === 0) return 'the field'
  return domains[0]
}

// ─── Active Provider (swap here for real LLM) ────────────────────────────────
export const analysisProvider: AnalysisProvider = mockAnalysisProvider

export async function analyzePaper(paper: Paper): Promise<PaperAnalysis> {
  return analysisProvider.analyzePaper(paper)
}

export async function synthesizeResearchGaps(papers: Paper[]): Promise<GapAnalysis> {
  return analysisProvider.synthesizeGaps(papers)
}
