---
title: "AWARe: Mitigating Catastrophic Forgetting via Activation-Weighted Adaptive REtention"
collection: publications
category: conferences
permalink: /publication/2026-01-01-aware-catastrophic-forgetting
excerpt: 'AWARe uses activation-based parameter importance to preserve prior multimodal capabilities while adapting MLLMs to downstream tasks.'
date: 2026-01-01
venue: 'EMNLP 2026 Main Conference'
paperurl: '/files/aware-paper.pdf'
citation: 'Juncheng Liao, Jinfan Lv, Guoming Wang, Jupeng Zheng, Ling Xiao, and Siliang Tang. (2026). &quot;AWARe: Mitigating Catastrophic Forgetting via Activation-Weighted Adaptive REtention.&quot; <i>EMNLP 2026 Main Conference</i>.'
---

<p><strong>Authors:</strong> Juncheng Liao<sup>1</sup>, Jinfan Lv<sup>2</sup>, Guoming Wang<sup>1,†</sup>, Jupeng Zheng<sup>3,†</sup>, Ling Xiao<sup>4</sup>, and Siliang Tang<sup>1</sup>.</p>

<p><sup>†</sup>Corresponding authors: <a href="mailto:NB21013@zju.edu.cn">Guoming Wang</a> and <a href="mailto:zhengjp8@mail.sysu.edu.cn">Jupeng Zheng</a>.</p>

<p><strong>Affiliations:</strong> <sup>1</sup>School of Software Technology, Zhejiang University; <sup>2</sup>College of Intelligent Robotics and Advanced Manufacturing, Fudan University; <sup>3</sup>School of Artificial Intelligence, Sun Yat-Sen University; <sup>4</sup>Graduate School of Information Science, Hokkaido University.</p>

<figure>
  <a href="/files/aware-method-overview.pdf" title="Open the AWARe method overview PDF">
    <img src="/images/aware-method-overview.png" alt="Overview of AWARe: activation-weighted profiling identifies important neurons or weight groups, which are frozen during constrained fine-tuning while the remaining weights adapt to downstream data." />
  </a>
  <figcaption><strong>Overview of AWARe.</strong> The method profiles activation-based saliency on calibration samples, freezes high-saliency weights to retain prior capabilities, and updates the remaining weights for downstream adaptation. <a href="/files/aware-method-overview.pdf">Download the figure as a PDF</a>.</figcaption>
</figure>

<p>Multimodal large language models (MLLMs) can lose previously learned capabilities when fine-tuned on downstream tasks. AWARe, or Activation-Weighted Adaptive REtention, assigns importance scores from task-induced activation patterns, selectively freezes high-saliency parameters, and leaves less important parameters trainable. This preserves upstream capabilities without changing the model architecture while maintaining the flexibility needed for downstream learning.</p>

<p>Code and implementation details are available in the <a href="https://github.com/kaln27/AWARe">AWARe GitHub repository</a>.</p>
