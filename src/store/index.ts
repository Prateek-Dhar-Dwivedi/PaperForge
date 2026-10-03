import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Paper, ResearchNote, PaperFormData, NoteFormData } from '@/types'
import { generateId, parseAuthors, parseKeywords } from '@/lib/utils'

// ─── Demo Dataset ─────────────────────────────────────────────────────────────
// NOTE: All papers below are fictional demo records created to showcase
// PaperForge features. They are NOT real published papers, do NOT represent
// actual research findings, and should NOT be cited or treated as real scholarship.
// ─────────────────────────────────────────────────────────────────────────────

const SEED_PAPERS: Paper[] = [
  // ── 1. NLP / Automated Short Answer Grading ───────────────────────────────
  {
    id: 'demo-1',
    title: 'AutoGrade-NLP: Automated Short Answer Grading Using Transformer-Based Semantic Similarity',
    authors: ['Priya Nair', 'Lucas Fernández', 'Yuki Tanaka'],
    year: 2023,
    domain: 'Natural Language Processing',
    abstract:
      'Automated short answer grading (ASAG) remains a challenging NLP task due to the semantic diversity of student responses. We present AutoGrade-NLP, a system that fine-tunes a sentence-transformer model on pedagogical rubrics to score free-text responses. We introduce a novel contrastive alignment loss that brings model-assigned scores closer to expert-grader distributions, achieving state-of-the-art results on three publicly available ASAG benchmarks.',
    keywords: ['automated grading', 'ASAG', 'sentence transformers', 'semantic similarity', 'contrastive learning', 'education AI'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'Very relevant to my thesis. The contrastive alignment loss is the key contribution — need to understand whether it generalises to non-English responses. Check Section 4.3 on rubric encoding.',
    analysis: {
      researchProblem:
        'Manual grading of short-answer questions is labour-intensive and inconsistent across graders. Existing automated systems rely on surface-level lexical overlap and fail to capture semantic equivalence, leading to poor performance on paraphrased correct answers.',
      researchObjective:
        'To develop an ASAG system that leverages pre-trained sentence transformers fine-tuned with a contrastive alignment loss, enabling accurate scoring of semantically diverse student responses against structured rubrics.',
      methodology:
        'AutoGrade-NLP fine-tunes a sentence-transformer backbone (based on a bidirectional transformer encoder) using a two-stage training procedure: (1) domain-adaptive pre-training on educational corpora, (2) task-specific fine-tuning with a contrastive alignment loss that minimises distance between model scores and expert grader distributions. Rubrics are encoded as prototype embeddings and compared against student response embeddings via cosine similarity.',
      dataset:
        'Three ASAG benchmarks: SemEval-2013 Task 7 (10,000 response pairs, STEM subjects), Mohler dataset (2,273 computer science responses), and a newly collected university-level biology dataset (4,150 responses across 85 questions, annotated by three independent graders).',
      evaluationMetrics:
        'Pearson and Spearman correlation with human grader scores; quadratic weighted kappa (QWK); exact agreement rate (EAR) within 0.5 score points. AutoGrade-NLP achieves QWK of 0.81 on SemEval-2013, outperforming the prior best of 0.74.',
      keyFindings:
        'The contrastive alignment loss reduces mean absolute error by 18% compared to standard fine-tuning. Performance is particularly strong on paraphrased correct answers (+23% QWK). Domain-adaptive pre-training contributes +0.06 QWK on the biology dataset. The system approaches inter-human agreement on two of three benchmarks.',
      limitations:
        'Performance degrades significantly on questions requiring multi-step mathematical reasoning. The system struggles with responses that are factually correct but use domain-specific terminology absent from the training corpus. Evaluation is limited to English-language datasets only.',
      futureWork:
        'Extending the approach to multilingual ASAG settings using multilingual sentence transformers. Incorporating rubric uncertainty modelling to handle ambiguous grading criteria. Investigating the system\'s behaviour on open-ended essay responses with longer contexts.',
      importantKeywords: ['ASAG', 'contrastive alignment', 'sentence-transformer', 'rubric encoding', 'QWK', 'semantic scoring'],
      generatedAt: '2024-03-10T09:00:00Z',
    },
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
  },

  // ── 2. RAG ────────────────────────────────────────────────────────────────
  {
    id: 'demo-2',
    title: 'FaithfulRAG: Improving Factual Consistency in Retrieval-Augmented Generation via Entailment-Guided Reranking',
    authors: ['Mei-Ling Chen', 'Arjun Patel', 'Sofia Reyes', 'Dmitri Volkov'],
    year: 2024,
    domain: 'Natural Language Processing',
    abstract:
      'Retrieval-Augmented Generation (RAG) systems frequently produce responses that contradict or hallucinate beyond their retrieved context. We propose FaithfulRAG, a pipeline enhancement that introduces an entailment-guided reranking step between retrieval and generation. A lightweight natural language inference (NLI) module scores candidate passages for entailment with the generated draft, suppressing hallucination-prone passages before the final generation pass.',
    keywords: ['RAG', 'retrieval-augmented generation', 'hallucination', 'NLI', 'entailment', 'factual consistency'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'The entailment-guided reranking is elegant. My concern: the two-pass generation doubles latency — Table 5 shows ~1.8x slowdown. Need to check if this matters for my use case.',
    analysis: {
      researchProblem:
        'RAG systems suffer from faithfulness failures: generated responses frequently introduce facts not present in retrieved documents or contradict retrieved evidence. Standard retrieval ranking by semantic similarity does not account for whether a passage actually supports the eventual answer.',
      researchObjective:
        'To improve factual consistency of RAG outputs by inserting an NLI-based reranking step that selects passages most likely to entail the correct answer, reducing hallucination without requiring retraining of the base LLM.',
      methodology:
        'FaithfulRAG operates in three stages: (1) initial retrieval via dense passage retrieval, (2) a draft generation pass using the top-k passages, (3) NLI-based reranking that scores each candidate passage for entailment with the draft answer, followed by a final generation pass using only the highest-entailment passages. The NLI module is a fine-tuned DeBERTa model trained on MultiNLI and a domain-specific faithfulness dataset.',
      dataset:
        'TriviaQA (95,000 question-answer pairs), Natural Questions (307,000 samples), and a custom HallucinationQA benchmark (1,200 adversarial questions designed to trigger RAG hallucinations, human-annotated for faithfulness). Retrieval corpus: Wikipedia dump (December 2023).',
      evaluationMetrics:
        'FactScore (factual precision against retrieved passages), ROUGE-L, BERTScore, and a human faithfulness annotation study (3 annotators, 500 samples). FaithfulRAG achieves FactScore of 0.79 vs 0.64 for standard RAG baseline on HallucinationQA.',
      keyFindings:
        'FaithfulRAG reduces hallucination rate by 37% on adversarial QA benchmarks. The entailment reranking step is particularly effective when the initial retrieval returns topically-related but not directly-supporting passages. The approach is model-agnostic and improves faithfulness across three different base LLMs tested.',
      limitations:
        'The two-pass generation introduces approximately 1.8x latency overhead, which may be prohibitive for real-time applications. The NLI module can incorrectly suppress passages that use indirect or implicit entailment. Performance on multi-hop questions requiring evidence synthesis across multiple passages is below expectation.',
      futureWork:
        'Developing single-pass faithfulness-aware generation that avoids the latency penalty of two-pass approaches. Extending entailment scoring to multi-document fusion settings. Investigating faithfulness in multilingual RAG pipelines.',
      importantKeywords: ['faithfulness', 'hallucination reduction', 'entailment reranking', 'NLI', 'FactScore', 'DeBERTa'],
      generatedAt: '2024-04-05T08:30:00Z',
    },
    createdAt: '2024-04-01T09:00:00Z',
    updatedAt: '2024-04-05T08:30:00Z',
  },

  // ── 3. Agentic AI ─────────────────────────────────────────────────────────
  {
    id: 'demo-3',
    title: 'ReAct-Edu: An Agentic Framework for Personalised Learning Path Generation in Higher Education',
    authors: ['James Okonkwo', 'Lin Wei', 'Fatima Al-Rashid'],
    year: 2024,
    domain: 'Natural Language Processing',
    abstract:
      'We present ReAct-Edu, an agentic AI framework that combines reasoning and acting capabilities of large language models to generate personalised learning paths in higher education settings. The agent iteratively retrieves course materials, assesses learner knowledge states, selects pedagogically appropriate content sequences, and adapts in real time based on learner performance signals.',
    keywords: ['agentic AI', 'LLM agent', 'personalised learning', 'learning path generation', 'ReAct', 'educational technology'],
    url: undefined,
    status: 'reading',
    personalNotes:
      'ReAct-style prompting adapted to education — interesting architecture. The knowledge state estimation module uses a BKT variant. How does this compare to deep knowledge tracing approaches?',
    analysis: {
      researchProblem:
        'Existing personalised learning systems rely on predefined rule-based curricula or shallow collaborative filtering, which cannot dynamically adapt to heterogeneous learner needs, diverse course structures, or emergent misconceptions identified during a learning session.',
      researchObjective:
        'To design an agentic LLM system that autonomously constructs personalised learning paths by interleaving reasoning over learner knowledge states with action selection from a course material database, enabling real-time curriculum adaptation.',
      methodology:
        'ReAct-Edu implements a ReAct-style prompting loop where the agent alternates between (1) Thought — reasoning about the learner\'s current knowledge state using a Bayesian Knowledge Tracing-inspired estimator, (2) Action — retrieving or selecting learning objects from a RAG-backed course repository, and (3) Observation — interpreting learner responses and formative assessment signals. The system is evaluated in a controlled classroom study over a 12-week semester.',
      dataset:
        'Deployment study across three undergraduate courses at a mid-sized European university (N=312 students). Learner interaction logs (4.2M events), formative assessment responses (28,000 items), and end-of-course examination scores used as outcome measures. Baseline comparison against static curriculum and rule-based adaptive system.',
      evaluationMetrics:
        'Final examination score improvement (primary); time-to-mastery for individual learning objectives; learner satisfaction (5-point Likert scale); curriculum coverage rate. ReAct-Edu students showed +11.3% mean examination improvement vs static curriculum control group.',
      keyFindings:
        'Students using ReAct-Edu achieved significantly higher examination scores and reported higher satisfaction compared to both static curriculum and rule-based adaptive baselines. The system was most effective for students with heterogeneous prior knowledge. Real-time misconception detection and remediation contributed an estimated +4.2 percentage points to final outcomes.',
      limitations:
        'The study is limited to three courses at a single institution, limiting generalisability. The agent occasionally generates pedagogically inconsistent learning sequences when course prerequisite structures are not explicitly encoded. LLM hallucination in reasoning steps occasionally leads to incorrect knowledge state assessments.',
      futureWork:
        'Large-scale multi-institution deployment studies to assess generalisability. Integration of multimodal learner signals (facial engagement, keystroke dynamics). Developing a lightweight on-device variant for low-bandwidth educational settings in emerging economies.',
      importantKeywords: ['ReAct', 'knowledge tracing', 'agentic LLM', 'curriculum adaptation', 'personalised learning', 'formative assessment'],
      generatedAt: '2024-05-12T10:00:00Z',
    },
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-05-12T10:00:00Z',
  },

  // ── 4. Explainable AI ─────────────────────────────────────────────────────
  {
    id: 'demo-4',
    title: 'GradCAM-Reason: Extending Gradient-Weighted Class Activation Mapping to Textual Explanations for Medical Image Diagnosis',
    authors: ['Nalini Krishnamurthy', 'Erik Johansson', 'Amara Diallo'],
    year: 2023,
    domain: 'Computer Science',
    abstract:
      'Explainability in medical AI is critical for clinical adoption. We extend Gradient-weighted Class Activation Mapping (GradCAM) with an automatic textual explanation module that grounds visual saliency maps in diagnostic language. GradCAM-Reason produces both a spatial heatmap and a natural language explanation referencing the highlighted anatomical region, improving radiologist trust and diagnostic agreement rates in a user study.',
    keywords: ['explainable AI', 'GradCAM', 'medical imaging', 'saliency maps', 'XAI', 'clinical AI', 'radiology'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'The textual grounding of visual explanations is the novel part. The radiologist trust study is compelling but N=24 is small. Would be stronger with a larger cohort.',
    analysis: {
      researchProblem:
        'Visual saliency methods such as GradCAM produce heatmaps that clinicians without deep learning expertise struggle to interpret. The gap between spatial attention visualisations and clinician-readable diagnostic explanations hinders real-world adoption of AI-assisted diagnosis tools.',
      researchObjective:
        'To bridge visual and linguistic explainability in medical image AI by automatically generating textual diagnostic explanations grounded in GradCAM saliency regions, enabling radiologists to understand and trust model predictions.',
      methodology:
        'GradCAM-Reason consists of three components: (1) a CNN-based diagnostic classifier fine-tuned on chest X-rays, (2) standard GradCAM for producing class-discriminative saliency maps, (3) a region-to-text module that maps activated saliency regions to anatomical segments and generates natural language explanations using a fine-tuned medical language model. A user study with 24 radiologists evaluates explanation quality.',
      dataset:
        'CheXpert dataset (224,316 chest X-rays, 14 diagnostic labels). NIH ChestX-ray14 dataset (112,120 images) used for cross-dataset evaluation. User study conducted with 24 board-certified radiologists across 3 tertiary hospitals, rating 480 explanation pairs on plausibility, completeness, and trust.',
      evaluationMetrics:
        'Diagnostic accuracy (AUC-ROC), explanation plausibility score (radiologist 5-point rating), text-saliency alignment (IoU between GradCAM region and referenced anatomical segment), and diagnostic agreement rate with/without AI explanation. GradCAM-Reason achieves 0.91 mean AUC-ROC across 14 pathology classes.',
      keyFindings:
        'GradCAM-Reason explanations achieve mean plausibility score of 4.1/5 vs 2.8/5 for heatmap-only baseline. Radiologist diagnostic agreement with AI recommendations increases from 61% to 78% when textual explanations accompany predictions. The system is most effective for consolidation and pleural effusion detection.',
      limitations:
        'The user study is limited to 24 radiologists at three hospitals, limiting statistical power. Explanation quality degrades for rare pathologies under-represented in training data. The region-to-text module occasionally generates anatomically plausible but diagnostically imprecise descriptions for boundary-region activations.',
      futureWork:
        'Extending to CT and MRI modalities where 3D saliency mapping introduces additional complexity. Developing uncertainty-aware explanations that convey model confidence alongside saliency. Conducting prospective clinical trials to assess impact on patient outcomes.',
      importantKeywords: ['GradCAM', 'XAI', 'saliency-to-text', 'medical imaging', 'radiologist trust', 'diagnostic agreement'],
      generatedAt: '2024-02-20T09:00:00Z',
    },
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-20T09:00:00Z',
  },

  // ── 5. Computer Vision — Object Detection ────────────────────────────────
  {
    id: 'demo-5',
    title: 'DenseDetect: Real-Time Dense Object Detection in Crowded Scenes via Hierarchical Deformable Attention',
    authors: ['Yiwei Zhang', 'Carlos Mendoza', 'Olga Ivanova', 'Ravi Kumar'],
    year: 2023,
    domain: 'Computer Vision',
    abstract:
      'Dense object detection in crowded scenes — such as pedestrian counting, retail shelf analysis, and stadium crowd monitoring — presents a major challenge for existing detectors due to heavy occlusion and scale variation. We propose DenseDetect, a real-time detector that employs hierarchical deformable attention at multiple feature pyramid scales to attend to object-specific regions even under significant overlap.',
    keywords: ['object detection', 'dense scenes', 'deformable attention', 'feature pyramid', 'real-time detection', 'crowd analysis'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'The hierarchical deformable attention is clever. Runtime is 47 FPS on V100 — good for real-time. Check if this holds on edge hardware (they only report server GPU results).',
    analysis: {
      researchProblem:
        'Existing object detection architectures suffer significant performance degradation in densely crowded scenes, primarily due to extreme inter-object occlusion, high variation in object scale, and anchor-based regression failures when overlapping bounding boxes are common.',
      researchObjective:
        'To develop a real-time object detection system capable of accurately detecting and localising objects in crowded scenes by introducing hierarchical deformable attention that focuses on object-specific features at multiple spatial scales simultaneously.',
      methodology:
        'DenseDetect extends a DETR-style detection transformer with hierarchical deformable attention modules at 4 feature pyramid levels. Deformable attention samples a small set of key locations around each query point, enabling the detector to focus on discriminative object parts under occlusion. A density-aware loss weighting scheme up-weights predictions in high-density image regions during training.',
      dataset:
        'CrowdHuman (15,000 training images, 470,000 annotated pedestrians), MOT17Det (pedestrian detection in video sequences), and an in-house Retail Shelf dataset (8,200 images, 380,000 product annotations across 12 retail environments). Cross-domain evaluation on VisDrone 2023 drone imagery.',
      evaluationMetrics:
        'Mean Average Precision (mAP@0.5, mAP@0.5:0.95), Miss Rate (lower is better), inference speed (FPS on NVIDIA V100). DenseDetect achieves mAP@0.5 of 91.3% on CrowdHuman, with 47 FPS inference speed maintaining real-time capability.',
      keyFindings:
        'DenseDetect outperforms the previous best detector by +4.2 mAP on CrowdHuman and +6.1 mAP on VisDrone. The hierarchical deformable attention provides the largest improvement over baseline (+3.1 mAP in ablation). Density-aware loss weighting contributes an additional +1.1 mAP in high-density image regions.',
      limitations:
        'Evaluation focuses exclusively on server-class GPUs (V100); performance on edge devices or mobile hardware has not been characterised. The approach shows reduced improvement on very small objects (< 10px height) where feature pyramid resolution remains a limiting factor. Training requires substantially more GPU memory than baseline DETR.',
      futureWork:
        'Adapting DenseDetect for edge deployment via knowledge distillation targeting mobile NPUs. Extending to video object detection with temporal attention to leverage motion cues. Investigating applicability to satellite and aerial imagery where extreme density and scale variation are common.',
      importantKeywords: ['deformable attention', 'feature pyramid', 'CrowdHuman', 'DETR', 'mAP', 'density-aware loss'],
      generatedAt: '2024-01-28T09:00:00Z',
    },
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-28T09:00:00Z',
  },

  // ── 6. ML — Federated Learning ────────────────────────────────────────────
  {
    id: 'demo-6',
    title: 'FedAlign: Federated Learning with Cross-Client Feature Alignment for Heterogeneous Medical Data',
    authors: ['Sandra Oduya', 'Tomasz Kowalski', 'Hiroshi Yamamoto'],
    year: 2024,
    domain: 'Machine Learning',
    abstract:
      'Federated learning (FL) for medical data is hampered by severe statistical heterogeneity (non-IID distributions) across hospital clients. We propose FedAlign, a framework that augments standard federated averaging with a cross-client feature alignment loss computed from shared prototype embeddings, without exchanging raw patient data. FedAlign consistently outperforms FedAvg and competing personalised FL methods across three medical imaging tasks.',
    keywords: ['federated learning', 'medical AI', 'non-IID', 'feature alignment', 'privacy-preserving', 'healthcare'],
    url: undefined,
    status: 'reading',
    personalNotes:
      'Privacy-preserving ML is central to my research direction. The prototype sharing mechanism is a clever way to align representations without exposing data. Need to verify the differential privacy analysis in Appendix B.',
    analysis: {
      researchProblem:
        'Standard federated averaging (FedAvg) assumes clients share similar data distributions, but in practice hospital data is severely non-IID due to equipment differences, patient demographics, and local clinical protocols, causing client drift and degraded global model performance.',
      researchObjective:
        'To improve federated learning performance under severe statistical heterogeneity by introducing a cross-client feature alignment mechanism that shares lightweight class-conditional prototype embeddings — not raw data — enabling clients to align their local feature spaces toward a global representation.',
      methodology:
        'FedAlign adds a prototype alignment round to standard FL: after each local training epoch, each client computes class-conditional prototype embeddings from its local data. The server aggregates prototypes via federated averaging and redistributes global prototypes. Each client adds a contrastive alignment loss between local and global prototypes to its local training objective. Total communication overhead over standard FedAvg is less than 0.1%.',
      dataset:
        'Three federated medical imaging tasks: (1) chest X-ray pathology classification across 8 simulated hospital clients (CheXpert, split by acquisition site), (2) histopathology slide classification across 6 lab clients (CAMELYON17), (3) skin lesion classification across 12 dermatology clinic clients (ISIC 2019). All splits simulate realistic non-IID distributions.',
      evaluationMetrics:
        'Global model accuracy, worst-client accuracy (fairness metric), communication rounds to convergence, communication cost (MB transmitted). FedAlign achieves +5.7% mean accuracy and +9.2% worst-client accuracy over FedAvg on chest X-ray task.',
      keyFindings:
        'FedAlign consistently outperforms FedAvg, FedProx, SCAFFOLD, and MOON across all three tasks. Worst-client accuracy improvements are particularly pronounced (+9.2% to +13.4%), demonstrating improved fairness across heterogeneous clients. Prototype alignment converges in 30% fewer communication rounds than FedAvg on histopathology.',
      limitations:
        'Prototype sharing, while privacy-preserving in practice, has not undergone formal differential privacy analysis. Performance improvement diminishes when client heterogeneity is low (IID-like settings). The framework has not been evaluated in cross-institutional deployments with real-world regulatory constraints.',
      futureWork:
        'Formal differential privacy guarantees for prototype sharing. Extending FedAlign to longitudinal medical records (EHR data) where temporal heterogeneity adds complexity. Real-world deployment pilot across partnering hospital networks with regulatory review.',
      importantKeywords: ['federated averaging', 'client drift', 'prototype alignment', 'non-IID', 'worst-client accuracy', 'contrastive alignment'],
      generatedAt: '2024-06-01T09:00:00Z',
    },
    createdAt: '2024-05-20T09:00:00Z',
    updatedAt: '2024-06-01T09:00:00Z',
  },

  // ── 7. RAG + Knowledge Graphs ─────────────────────────────────────────────
  {
    id: 'demo-7',
    title: 'KG-RAG: Augmenting Retrieval-Augmented Generation with Dynamic Knowledge Graph Traversal',
    authors: ['Aisha Mohammed', 'Benedict Osei', 'Valentina Ferrara'],
    year: 2024,
    domain: 'Natural Language Processing',
    abstract:
      'Dense retrieval in standard RAG systems treats the knowledge base as a flat corpus, missing relational structure between entities. KG-RAG augments retrieval with dynamic knowledge graph traversal: entity spans in the query are linked to a knowledge graph, and multi-hop neighbours are retrieved alongside dense passage matches. The combined context improves answer completeness and relational reasoning in open-domain QA.',
    keywords: ['RAG', 'knowledge graph', 'multi-hop reasoning', 'entity linking', 'open-domain QA', 'graph traversal'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'The graph traversal component adds latency (Table 3). But the gains on multi-hop questions are substantial. This is the approach I should compare against in my RAG experiments.',
    analysis: {
      researchProblem:
        'Standard dense retrieval in RAG treats the knowledge base as an unstructured document corpus, making it inherently unable to perform multi-hop relational reasoning. Questions requiring inference across multiple related entities (e.g., "What is the nationality of the founder of the institution where X works?") are systematically under-served.',
      researchObjective:
        'To enhance RAG systems with knowledge graph traversal capabilities, allowing the system to retrieve both unstructured passages and structured relational triples from a knowledge graph, improving performance on questions requiring multi-hop relational reasoning.',
      methodology:
        'KG-RAG consists of four modules: (1) entity detection and linking from the question to a knowledge graph (Wikidata), (2) multi-hop subgraph extraction via BFS traversal up to depth-2 from linked entities, (3) parallel dense passage retrieval, (4) context fusion that serialises KG triples alongside retrieved passages for LLM generation. The framework is evaluated on top of two base LLMs (Llama-3 and Mistral-7B).',
      dataset:
        'HotpotQA (113,000 multi-hop QA pairs), MuSiQue (20,000 multi-step reasoning questions), 2WikiMultiHopQA (167,000 samples). Single-hop QA evaluation on NaturalQuestions to assess regression on simpler queries.',
      evaluationMetrics:
        'Exact Match (EM), F1 score, and a new Multi-Hop Reasoning Score (MHRS) that measures coverage of required reasoning steps. KG-RAG achieves +11.4 EM and +14.2 F1 on HotpotQA compared to standard dense RAG baseline.',
      keyFindings:
        'KG-RAG substantially improves multi-hop reasoning performance across all three benchmarks. Gains are largest on questions requiring 3+ reasoning hops (+17.8 EM on MuSiQue 3-hop subset). Importantly, single-hop performance on NaturalQuestions does not regress, confirming backward compatibility of the augmentation.',
      limitations:
        'Knowledge graph traversal adds 340ms mean latency overhead per query. The approach is limited to entities covered by the linked knowledge graph; long-tail entities and niche domains are under-served. Entity linking errors propagate through graph traversal and can retrieve entirely irrelevant subgraphs.',
      futureWork:
        'Developing uncertainty-aware graph traversal that prunes low-confidence entity links before retrieval. Extending to domain-specific knowledge graphs (biomedical, legal). Investigating whether KG-RAG improves faithfulness and hallucination metrics alongside accuracy.',
      importantKeywords: ['knowledge graph', 'multi-hop QA', 'entity linking', 'subgraph extraction', 'HotpotQA', 'context fusion'],
      generatedAt: '2024-06-15T08:00:00Z',
    },
    createdAt: '2024-06-10T09:00:00Z',
    updatedAt: '2024-06-15T08:00:00Z',
  },

  // ── 8. Explainable AI — Tabular Data ─────────────────────────────────────
  {
    id: 'demo-8',
    title: 'TabExplain: Faithful Feature Attribution for Tabular Machine Learning via Integrated Gradients with Baseline Ensembling',
    authors: ['Marcus Thornton', 'Ji-Hye Park', 'Aditi Sharma'],
    year: 2023,
    domain: 'Machine Learning',
    abstract:
      'Feature attribution methods for tabular ML models often produce unstable or unfaithful explanations due to arbitrary baseline selection in gradient-based approaches. TabExplain introduces a baseline ensembling strategy for Integrated Gradients that averages attributions over a diverse set of semantically grounded baselines, producing more stable, faithful, and domain-consistent feature importance scores for both tree-based and neural models.',
    keywords: ['explainable AI', 'feature attribution', 'integrated gradients', 'tabular ML', 'XAI', 'SHAP', 'faithfulness'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'Baseline selection is genuinely underexplored in XAI for tabular data. The comparison with SHAP TreeExplainer is well done. Curious whether this extends to time-series tabular data.',
    analysis: {
      researchProblem:
        'Integrated Gradients explanations for tabular data are highly sensitive to the choice of baseline input, producing inconsistent attributions for the same prediction depending on which baseline is chosen. This instability undermines trustworthiness and makes explanations difficult to use for high-stakes decisions.',
      researchObjective:
        'To improve the stability and faithfulness of Integrated Gradients explanations for tabular models by replacing single-baseline attribution with a baseline ensembling approach that averages across multiple semantically meaningful reference points.',
      methodology:
        'TabExplain constructs a diverse baseline ensemble by sampling from: (1) the training data mean/median, (2) cluster centroids from K-means segmentation of training data, (3) out-of-distribution boundary samples. Attributions are computed independently for each baseline and aggregated via a weighted average, with weights proportional to the faithfulness score of each baseline measured by the deletion metric.',
      dataset:
        'Six UCI tabular datasets (Adult Income, German Credit, HELOC, MIMIC-III clinical subset, Bank Marketing, California Housing). Experiments run across three model families: XGBoost, Random Forest, and a 3-layer MLP. Comparison against SHAP KernelExplainer, SHAP TreeExplainer, standard Integrated Gradients, and LIME.',
      evaluationMetrics:
        'Faithfulness (deletion metric — AUC of accuracy vs fraction of features removed), stability (variance of attributions across 100 random runs), comprehensibility score (user study, N=32 domain experts). TabExplain achieves 23% lower attribution variance and 18% higher faithfulness score vs standard Integrated Gradients.',
      keyFindings:
        'TabExplain produces significantly more stable and faithful explanations than single-baseline Integrated Gradients across all six datasets and three model families. Baseline ensembling is most impactful for models with non-convex decision boundaries. The approach achieves comparable faithfulness to SHAP TreeExplainer while generalising to neural models where TreeExplainer is inapplicable.',
      limitations:
        'Baseline ensembling increases computation time by approximately 3–5x compared to single-baseline Integrated Gradients, which may be impractical for real-time explanation pipelines. The approach has not been evaluated on high-dimensional tabular data (>500 features). The weighted aggregation scheme adds a hyperparameter that requires validation.',
      futureWork:
        'Extending baseline ensembling to time-series and multivariate sensor data. Developing adaptive baseline selection that identifies semantically relevant baselines automatically per prediction. Investigating ensemble attribution methods for graph neural networks.',
      importantKeywords: ['integrated gradients', 'baseline ensembling', 'faithfulness', 'deletion metric', 'SHAP', 'attribution stability'],
      generatedAt: '2024-03-25T09:00:00Z',
    },
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-25T09:00:00Z',
  },

  // ── 9. NLP — Low-Resource MT ──────────────────────────────────────────────
  {
    id: 'demo-9',
    title: 'LowResMT: Curriculum-Based Data Augmentation for Low-Resource Neural Machine Translation',
    authors: ['Oluwaseun Adeyemi', 'Katarzyna Nowak', 'Wei-Chen Liu'],
    year: 2023,
    domain: 'Natural Language Processing',
    abstract:
      'Low-resource neural machine translation (NMT) systems face severe data scarcity for under-resourced language pairs. We propose LowResMT, a training framework that combines curriculum learning with three complementary data augmentation strategies: back-translation, paraphrase augmentation via a multilingual PLM, and cross-lingual transfer from typologically related pivot languages.',
    keywords: ['low-resource NMT', 'curriculum learning', 'back-translation', 'cross-lingual transfer', 'data augmentation', 'under-resourced languages'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'The curriculum ordering strategy is the most novel part. Back-translation is standard but the paraphrase augmentation via mBART is interesting. Tested on Yoruba-English — relevant to my multilingual work.',
    analysis: {
      researchProblem:
        'Neural machine translation for low-resource language pairs (< 100K parallel sentences) suffers from severe overfitting, poor generalisation to domain-shifted test data, and inability to leverage large multilingual PLMs effectively without catastrophic forgetting.',
      researchObjective:
        'To develop a training framework for low-resource NMT that combines curriculum learning with diverse data augmentation, enabling models to progressively learn from noisy augmented data while preserving high-quality signal from authentic parallel corpora.',
      methodology:
        'LowResMT applies three augmentation strategies in sequence, ordered by estimated noise level: (1) cross-lingual transfer from high-resource pivot languages (lowest noise), (2) back-translation from monolingual target-side data, (3) paraphrase augmentation using a fine-tuned mBART model (highest noise). A curriculum scheduler determines the mixing ratio of augmented data at each training epoch, starting with 10% augmented samples and increasing to 60% by mid-training.',
      dataset:
        'Four low-resource translation pairs: Yoruba-English (72K sentence pairs), Swahili-French (45K), Nepali-English (564K, lower-bound low-resource), and Basque-Spanish (91K). Evaluation on flores-200 and custom held-out domain-specific test sets for each language pair.',
      evaluationMetrics:
        'SacreBLEU, chrF++ score, and human adequacy/fluency ratings (200 samples per language pair, rated by bilingual speakers). LowResMT achieves +5.8 SacreBLEU on Yoruba-English over the strongest baseline (multilingual fine-tuning without curriculum).',
      keyFindings:
        'LowResMT outperforms all baselines across all four language pairs. The curriculum ordering of augmentation strategies is critical: removing curriculum scheduling reduces gains by 40% on average. Cross-lingual transfer from typologically related pivot languages provides the largest individual contribution (+2.3 SacreBLEU).',
      limitations:
        'Identifying suitable pivot languages requires linguistic knowledge not available for all under-resourced pairs. The paraphrase augmentation quality depends heavily on the multilingual PLM coverage of the target language, and quality degrades for languages poorly represented in mBART training data. Evaluation is limited to sentence-level translation without document-level context.',
      futureWork:
        'Extending the curriculum framework to document-level NMT where cross-sentence context is critical. Developing automatic pivot language selection based on typological databases. Investigating applicability to other sequence-to-sequence low-resource tasks beyond translation.',
      importantKeywords: ['curriculum learning', 'back-translation', 'mBART', 'pivot language', 'SacreBLEU', 'Yoruba-English'],
      generatedAt: '2024-02-28T09:00:00Z',
    },
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-28T09:00:00Z',
  },

  // ── 10. Agentic AI — Tool Use ─────────────────────────────────────────────
  {
    id: 'demo-10',
    title: 'ToolChain: Hierarchical Tool Orchestration for Multi-Step Reasoning in Agentic LLM Systems',
    authors: ['Dylan Park', 'Ingrid Svensson', 'Riya Mehta', 'Kofi Asante'],
    year: 2024,
    domain: 'Natural Language Processing',
    abstract:
      'Agentic LLM systems that invoke external tools for complex tasks face two key challenges: (1) selecting the appropriate tool from large, heterogeneous tool libraries, and (2) correctly chaining tool calls across multi-step tasks requiring intermediate reasoning. ToolChain proposes a hierarchical tool orchestration architecture that decomposes complex user intents into sub-goals, assigns tools to sub-goals via a fine-tuned tool router, and manages inter-step context propagation through a structured scratchpad mechanism.',
    keywords: ['agentic AI', 'tool use', 'tool orchestration', 'LLM agents', 'multi-step reasoning', 'function calling'],
    url: undefined,
    status: 'reading',
    personalNotes:
      'The hierarchical decomposition is the interesting bit — most tool use papers just do flat selection. The structured scratchpad for inter-step context is similar to what I\'m building. Need to compare our approaches.',
    analysis: {
      researchProblem:
        'Current agentic LLM systems using tool calling struggle with tasks requiring multi-step reasoning across heterogeneous tools, especially when intermediate tool outputs must be correctly interpreted and propagated to subsequent tool calls. Flat tool selection approaches scale poorly beyond 20–30 tools.',
      researchObjective:
        'To develop a hierarchical tool orchestration architecture that decomposes complex tasks into sub-goals, routes sub-goals to specialised tool libraries, and manages inter-step context through a structured scratchpad, enabling reliable multi-step tool use at scale.',
      methodology:
        'ToolChain uses a three-level hierarchy: (1) a goal decomposer that breaks the user query into a DAG of sub-goals, (2) a tool router that maps each sub-goal to the relevant tool cluster (trained on synthetic tool-use trajectories), (3) a step executor that invokes individual tools and writes outputs to a structured scratchpad with explicit data type tracking. The orchestrator uses a fine-tuned 7B parameter LLM for goal decomposition and routing.',
      dataset:
        'ToolBench benchmark (16,000 tool-use instructions across 49 categories), APIBench (REST API function calling dataset, 1,645 APIs), and a custom Multi-Step Reasoning benchmark (ToolChain-MSR, 2,400 tasks requiring 3–7 sequential tool calls, human-verified ground truth). Cross-evaluation on GAIA benchmark.',
      evaluationMetrics:
        'Task success rate (TSR) — fraction of tasks where all required sub-goals are correctly completed; tool selection accuracy; mean number of unnecessary tool calls (efficiency metric). ToolChain achieves 73.2% TSR on ToolChain-MSR vs 54.6% for flat tool selection baseline.',
      keyFindings:
        'Hierarchical decomposition improves task success rate by +18.6 percentage points over flat tool selection on multi-step tasks. The structured scratchpad reduces inter-step context errors by 67%. Tool selection accuracy scales well with tool library size, maintaining >85% accuracy up to 200 tools (flat approaches degrade below 60% at 100 tools).',
      limitations:
        'Goal decomposition quality degrades significantly for tasks with ambiguous or underspecified user intents. The system relies on a fine-tuned LLM for routing, which requires substantial synthetic training data generation. Evaluation is limited to text-based tool use; multi-modal tools (image generation, audio processing) are not addressed.',
      futureWork:
        'Extending ToolChain to multi-modal tool libraries. Developing self-improving tool routers that update from successful and failed trajectories. Investigating formal verification of tool chains for safety-critical applications (medical, legal).',
      importantKeywords: ['tool orchestration', 'goal decomposition', 'scratchpad', 'task success rate', 'ToolBench', 'hierarchical routing'],
      generatedAt: '2024-07-08T09:00:00Z',
    },
    createdAt: '2024-07-01T09:00:00Z',
    updatedAt: '2024-07-08T09:00:00Z',
  },

  // ── 11. ML — Self-Supervised CV ───────────────────────────────────────────
  {
    id: 'demo-11',
    title: 'MaskSight: Masked Image Modelling with Structural Priors for Self-Supervised Visual Representation Learning',
    authors: ['Chen Mingzhi', 'Preethi Ramachandran', 'Leon Fischer'],
    year: 2023,
    domain: 'Computer Vision',
    abstract:
      'Masked image modelling (MIM) has emerged as a powerful self-supervised learning paradigm but existing approaches apply uniform random masking that discards structural information. MaskSight introduces structurally-guided masking based on depth and edge priors, forcing the model to reconstruct semantically meaningful regions and producing representations with superior performance on dense prediction tasks such as object detection and semantic segmentation.',
    keywords: ['self-supervised learning', 'masked image modelling', 'visual representation', 'structural priors', 'dense prediction', 'depth estimation'],
    url: undefined,
    status: 'completed',
    personalNotes:
      'The use of depth/edge priors for masking is neat. Table 4 shows the largest gains on ADE20K segmentation (+2.1 mIoU). Random masking really does throw away too much structural information.',
    analysis: {
      researchProblem:
        'Standard masked image modelling uses uniform random masking that treats all image regions equally, causing the model to waste capacity reconstructing uninformative background pixels while under-learning the structural patterns critical for downstream dense prediction tasks.',
      researchObjective:
        'To improve self-supervised visual representation learning by introducing structurally-guided masking based on depth and edge priors, ensuring the model focuses on semantically meaningful reconstruction targets and learns structure-aware representations.',
      methodology:
        'MaskSight uses a ViT backbone with a masked autoencoder training objective. Masking strategy: depth and Canny edge maps are computed for each training image; regions with high structural information (high edge density or depth discontinuities) receive increased masking probability using a saliency-weighted Bernoulli sampler. A curriculum schedule gradually increases the masking ratio for structural regions from 30% to 70% over training. Reconstructed targets use normalised pixel values and HOG feature tokens for structural awareness.',
      dataset:
        'Pre-training: ImageNet-21K (11M images) with depth maps estimated by DPT-Large and edge maps from Canny detector. Fine-tuning evaluation: ADE20K semantic segmentation (20K train, 2K val), COCO object detection/instance segmentation, NYUv2 depth estimation. Linear probe evaluation on ImageNet-1K.',
      evaluationMetrics:
        'ADE20K mIoU (segmentation), COCO mAP (detection), NYUv2 RMSE (depth), ImageNet-1K linear probe accuracy. MaskSight achieves 53.8 mIoU on ADE20K vs 51.7 for MAE baseline (+2.1 mIoU) and 57.4 COCO mAP vs 55.9 (+1.5 mAP).',
      keyFindings:
        'Structurally-guided masking consistently outperforms random masking across all dense prediction tasks. Gains are largest on semantic segmentation (+2.1 mIoU) and depth estimation (+8% RMSE reduction). The depth-based masking prior contributes more than edge-based masking on segmentation, while the reverse holds for object detection in ablation studies.',
      limitations:
        'Depth prior estimation using DPT-Large adds approximately 40% to pre-training compute compared to random masking. Performance improvement on image classification (linear probe) is modest (+0.4%), suggesting the approach primarily benefits dense prediction. Depth estimation quality is poor for highly textured, flat scenes, degrading masking quality in those cases.',
      futureWork:
        'Replacing estimated depth priors with actual LiDAR depth for outdoor driving scene pre-training. Extending structural priors to video representation learning where temporal structure provides additional guidance. Investigating whether structurally-guided masking generalises to medical imaging pre-training.',
      importantKeywords: ['masked autoencoder', 'structural masking', 'ViT', 'ADE20K', 'depth prior', 'dense prediction'],
      generatedAt: '2024-01-22T09:00:00Z',
    },
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-22T09:00:00Z',
  },

  // ── 12. ASAG — Cross-Lingual ──────────────────────────────────────────────
  {
    id: 'demo-12',
    title: 'XASAG: Cross-Lingual Automated Short Answer Grading Using Language-Agnostic Semantic Embeddings',
    authors: ['Fatou Diallo', 'Andrzej Kowalczyk', 'Sunita Rao'],
    year: 2024,
    domain: 'Natural Language Processing',
    abstract:
      'Automated short answer grading systems are predominantly developed and evaluated on English-language datasets, leaving most of the world\'s education systems under-served. XASAG addresses this gap by leveraging language-agnostic sentence embeddings to enable zero-shot and few-shot cross-lingual ASAG, allowing a model trained on English rubrics and responses to grade answers in Arabic, Hindi, and French without language-specific training data.',
    keywords: ['ASAG', 'cross-lingual NLP', 'language-agnostic embeddings', 'zero-shot transfer', 'multilingual education', 'LaBSE'],
    url: undefined,
    status: 'reading',
    personalNotes:
      'This is directly relevant — they use LaBSE for cross-lingual scoring. Zero-shot Arabic ASAG is impressive (0.71 QWK). Compare with my multilingual fine-tuning baseline. Contact authors about their dataset.',
    analysis: {
      researchProblem:
        'The vast majority of ASAG research is English-centric. Deploying ASAG in multilingual educational settings requires either expensive language-specific annotation or cross-lingual transfer, which remains poorly studied for grading tasks where semantic nuance and domain vocabulary are critical.',
      researchObjective:
        'To enable cross-lingual automated short answer grading by leveraging language-agnostic semantic embeddings, allowing zero-shot deployment of an English-trained grading model to new languages without language-specific labelled data.',
      methodology:
        'XASAG uses LaBSE (Language-agnostic BERT Sentence Embedding) as the backbone encoder, fine-tuned on English ASAG data using the same contrastive alignment objective as AutoGrade-NLP (demo-1). Cross-lingual evaluation is performed in zero-shot (English-trained model applied directly) and few-shot (5–50 target-language labelled examples for adapter fine-tuning) settings across Arabic, Hindi, and French.',
      dataset:
        'Training: SemEval-2013 Task 7 English ASAG data (10,000 response pairs). Evaluation: newly collected XASAG benchmark spanning 3 languages (Arabic: 2,100 responses across 35 science questions; Hindi: 1,850 responses across 30 questions; French: 2,400 responses across 40 questions), all annotated by certified bilingual subject-matter experts.',
      evaluationMetrics:
        'Quadratic Weighted Kappa (QWK), Pearson correlation, and inter-annotator agreement (Cohen\'s kappa). Zero-shot results: Arabic QWK 0.71, Hindi QWK 0.68, French QWK 0.76. Few-shot with 50 examples: Arabic +0.07, Hindi +0.06, French +0.04 QWK improvement.',
      keyFindings:
        'Zero-shot cross-lingual ASAG achieves surprisingly strong performance (QWK 0.68–0.76 across target languages) using LaBSE, with French performing best due to higher lexical overlap with English training data. Few-shot adapter fine-tuning with as few as 10 examples provides significant improvements (+0.04–0.07 QWK), making deployment feasible with minimal annotation effort.',
      limitations:
        'Performance on Arabic and Hindi degrades significantly for responses containing domain-specific technical vocabulary absent from LaBSE training. The XASAG benchmark covers only science and mathematics — generalisability to humanities and language arts questions is untested. Script differences (Arabic, Devanagari) may introduce tokenisation inconsistencies not fully captured by LaBSE.',
      futureWork:
        'Extending XASAG to 10+ languages including lower-resource educational languages (Swahili, Tagalog, Nepali). Developing language-specific rubric adaptation methods that require minimal human effort. Investigating grading consistency and bias across languages and cultural contexts.',
      importantKeywords: ['LaBSE', 'zero-shot ASAG', 'cross-lingual transfer', 'multilingual grading', 'adapter fine-tuning', 'QWK'],
      generatedAt: '2024-08-05T09:00:00Z',
    },
    createdAt: '2024-07-25T09:00:00Z',
    updatedAt: '2024-08-05T09:00:00Z',
  },

  // ── 13. ML — Continual Learning ───────────────────────────────────────────
  {
    id: 'demo-13',
    title: 'ElasticCL: Elastic Weight Consolidation with Task-Adaptive Fisher Sampling for Continual Learning in NLP',
    authors: ['Marco Pellegrini', 'Zoe Hartmann', 'Pradeep Subramaniam'],
    year: 2023,
    domain: 'Machine Learning',
    abstract:
      'Catastrophic forgetting remains a fundamental challenge for continual learning in NLP, where models must sequentially learn new tasks without forgetting previously acquired knowledge. ElasticCL extends Elastic Weight Consolidation (EWC) with task-adaptive Fisher information sampling, dynamically adjusting the importance of model parameters based on task similarity, and achieves superior forgetting mitigation across sequential text classification and NLU benchmarks.',
    keywords: ['continual learning', 'catastrophic forgetting', 'EWC', 'Fisher information', 'NLP', 'sequential learning'],
    url: undefined,
    status: 'unread',
    personalNotes: '',
    analysis: undefined,
    createdAt: '2024-08-10T09:00:00Z',
    updatedAt: '2024-08-10T09:00:00Z',
  },
]

// ─── Demo Notes ───────────────────────────────────────────────────────────────
// NOTE: All notes below are fictional and created for PaperForge demonstration.

const SEED_NOTES: ResearchNote[] = [
  {
    id: 'demo-note-1',
    title: 'ASAG Research Theme — Synthesis',
    content:
      'Two strong ASAG papers in the library now:\n\n**AutoGrade-NLP (demo-1):** English-only, contrastive alignment loss, strong benchmark results. The QWK of 0.81 on SemEval-2013 is impressive but the English limitation is a clear gap.\n\n**XASAG (demo-12):** Directly extends ASAG to multilingual settings using LaBSE. Zero-shot Arabic at QWK 0.71 is promising.\n\n**Open questions:**\n- How do both systems handle responses that are partially correct? The scoring rubric granularity matters enormously.\n- Neither paper addresses adversarial inputs — can students game the system with high-similarity but conceptually wrong answers?\n- Both use QWK as primary metric. Is this the right metric when the rubric has unequal class frequencies?\n\n**Next step:** Synthesise these findings into my literature review Chapter 2. Compare the contrastive alignment approach with simpler cosine similarity baselines.',
    paperId: 'demo-1',
    tags: ['ASAG', 'literature-review', 'multilingual', 'synthesis'],
    createdAt: '2024-08-12T09:00:00Z',
    updatedAt: '2024-08-12T09:00:00Z',
  },
  {
    id: 'demo-note-2',
    title: 'RAG Faithfulness — Key Challenge Across Papers',
    content:
      'Both FaithfulRAG (demo-2) and KG-RAG (demo-7) target different failure modes of standard RAG:\n\n**FaithfulRAG** targets hallucination (model generates facts not in retrieved context). Solution: NLI-based reranking.\n\n**KG-RAG** targets incomplete reasoning (model cannot answer multi-hop questions from flat retrieval). Solution: knowledge graph traversal.\n\n**Key insight:** These are complementary, not competing. A production RAG system might need both:\n- KG traversal for multi-hop coverage\n- Entailment reranking for faithfulness to retrieved content\n\n**Latency concern:** KG-RAG adds 340ms, FaithfulRAG adds ~1.8x generation time. Combining both would be expensive. Need to think about when each is worth the overhead.',
    paperId: 'demo-2',
    tags: ['RAG', 'faithfulness', 'hallucination', 'architecture'],
    createdAt: '2024-06-20T09:00:00Z',
    updatedAt: '2024-06-20T09:00:00Z',
  },
  {
    id: 'demo-note-3',
    title: 'Agentic AI Papers — Comparison of Frameworks',
    content:
      'Two agentic AI papers with different application foci:\n\n**ReAct-Edu (demo-3):** Education domain. ReAct-style loop with Bayesian Knowledge Tracing for knowledge state estimation. Key result: +11.3% exam score improvement.\n\n**ToolChain (demo-10):** General-purpose multi-step tool use. Hierarchical decomposition. Key result: +18.6 pp task success rate.\n\n**Architectural differences:**\n- ReAct-Edu uses a continuous loop with learner feedback as observation signals\n- ToolChain uses a DAG decomposition with a structured scratchpad\n\n**Common limitations:**\n- Both degrade on ambiguous/underspecified inputs\n- Both rely on LLM hallucination in reasoning steps\n- Neither addresses multi-modal tool use\n\n**Research gap I can pursue:** Can a ToolChain-style hierarchical decomposition improve ReAct-Edu\'s curriculum planning? The knowledge state estimation module in ReAct-Edu seems like a candidate for tool-based augmentation.',
    paperId: 'demo-3',
    tags: ['agentic-AI', 'tool-use', 'ReAct', 'comparison'],
    createdAt: '2024-07-15T09:00:00Z',
    updatedAt: '2024-07-15T09:00:00Z',
  },
  {
    id: 'demo-note-4',
    title: 'XAI Evaluation — User Studies Are Necessary But Small',
    content:
      'Noticed a recurring pattern across XAI papers:\n\n**GradCAM-Reason (demo-4):** N=24 radiologists. Small sample but clinically relevant.\n\n**TabExplain (demo-8):** N=32 domain experts. Better, but still limited.\n\n**Problem:** User studies in XAI are expensive and hard to scale. Most papers use proxy metrics (faithfulness, stability) as substitutes, but proxy metrics don\'t always correlate with actual user understanding or trust.\n\n**Open research question:** What is the minimum study size for credible XAI evaluation? Can we design synthetic evaluation tasks that correlate with real user understanding?\n\n**Methodological note for my research:** Whatever XAI method I propose, plan for at least N=50 in the user study to ensure adequate statistical power. Pre-register the study design to avoid post-hoc metric selection.',
    paperId: 'demo-4',
    tags: ['XAI', 'user-study', 'evaluation', 'methodology'],
    createdAt: '2024-03-30T09:00:00Z',
    updatedAt: '2024-03-30T09:00:00Z',
  },
  {
    id: 'demo-note-5',
    title: 'Privacy + Performance Trade-off in Federated ML',
    content:
      'FedAlign (demo-6) makes an interesting claim: prototype sharing is practically privacy-preserving. But the paper acknowledges no formal differential privacy (DP) guarantee in the main text.\n\n**My concern:** In a real hospital deployment, "practically privacy-preserving" is not sufficient. GDPR and HIPAA require demonstrable privacy guarantees. The lack of formal DP analysis is a meaningful limitation.\n\n**What FedAlign does well:** The worst-client accuracy metric is important for fairness. Improving the performance of the weakest-performing hospital client is clinically meaningful — it means smaller hospitals with less data aren\'t penalised.\n\n**Questions for my thesis chapter on federated learning:**\n1. Is there a DP-compatible version of prototype sharing?\n2. How does FedAlign perform when clients have heterogeneous label spaces (different hospitals treating different patient populations)?\n3. Has this been deployed in a real multi-hospital study, or is all evaluation simulated from public datasets?',
    paperId: 'demo-6',
    tags: ['federated-learning', 'privacy', 'differential-privacy', 'medical-AI'],
    createdAt: '2024-06-05T09:00:00Z',
    updatedAt: '2024-06-05T09:00:00Z',
  },
]

// ─── Store Types ──────────────────────────────────────────────────────────────

interface AppState {
  papers: Paper[]
  notes: ResearchNote[]
  initialized: boolean

  // Papers
  addPaper: (data: PaperFormData) => Paper
  updatePaper: (id: string, data: PaperFormData) => void
  deletePaper: (id: string) => void
  getPaper: (id: string) => Paper | undefined
  setAnalysis: (paperId: string, analysis: Paper['analysis']) => void

  // Notes
  addNote: (data: NoteFormData) => ResearchNote
  updateNote: (id: string, data: NoteFormData) => void
  deleteNote: (id: string) => void

  // Init
  initializeWithSeedData: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      papers: [],
      notes: [],
      initialized: false,

      initializeWithSeedData: () => {
        const state = get()
        if (!state.initialized) {
          set({ papers: SEED_PAPERS, notes: SEED_NOTES, initialized: true })
        }
      },

      addPaper: (data) => {
        const now = new Date().toISOString()
        const paper: Paper = {
          id: generateId(),
          title: data.title.trim(),
          authors: parseAuthors(data.authors),
          year: data.year,
          domain: data.domain,
          abstract: data.abstract.trim(),
          keywords: parseKeywords(data.keywords),
          url: data.url.trim() || undefined,
          status: data.status,
          personalNotes: data.personalNotes.trim(),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ papers: [paper, ...state.papers] }))
        return paper
      },

      updatePaper: (id, data) => {
        set((state) => ({
          papers: state.papers.map((p) =>
            p.id === id
              ? {
                  ...p,
                  title: data.title.trim(),
                  authors: parseAuthors(data.authors),
                  year: data.year,
                  domain: data.domain,
                  abstract: data.abstract.trim(),
                  keywords: parseKeywords(data.keywords),
                  url: data.url.trim() || undefined,
                  status: data.status,
                  personalNotes: data.personalNotes.trim(),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }))
      },

      deletePaper: (id) => {
        set((state) => ({
          papers: state.papers.filter((p) => p.id !== id),
          notes: state.notes.filter((n) => n.paperId !== id),
        }))
      },

      getPaper: (id) => get().papers.find((p) => p.id === id),

      setAnalysis: (paperId, analysis) => {
        set((state) => ({
          papers: state.papers.map((p) =>
            p.id === paperId ? { ...p, analysis, updatedAt: new Date().toISOString() } : p
          ),
        }))
      },

      addNote: (data) => {
        const now = new Date().toISOString()
        const note: ResearchNote = {
          id: generateId(),
          title: data.title.trim(),
          content: data.content.trim(),
          paperId: data.paperId || undefined,
          tags: parseKeywords(data.tags),
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({ notes: [note, ...state.notes] }))
        return note
      },

      updateNote: (id, data) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  title: data.title.trim(),
                  content: data.content.trim(),
                  paperId: data.paperId || undefined,
                  tags: parseKeywords(data.tags),
                  updatedAt: new Date().toISOString(),
                }
              : n
          ),
        }))
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
      },
    }),
    {
      name: 'paperforge-storage',
      version: 2,
      migrate(persistedState, fromVersion) {
        // Version 2: new demo dataset — reset initialized flag so users get fresh data
        if (fromVersion < 2) {
          return { ...(persistedState as object), initialized: false }
        }
        return persistedState
      },
    }
  )
)
