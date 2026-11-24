---
layout: default
permalink: /cv/
title: CV
nav: true
nav_order: 5
cv_format: rendercv
toc:
  sidebar: left
---

<link rel="stylesheet" href="{{ '/assets/css/al-folio-cv.css' | relative_url | bust_file_cache }}">
<link rel="stylesheet" href="{{ '/assets/css/cv-page.css' | relative_url | bust_file_cache }}">
<script defer src="{{ '/assets/js/cv-print.js' | relative_url | bust_file_cache }}"></script>

{% capture rendered_cv %}{% al_folio_cv_render %}{% endcapture %}

<div class="cv-page" markdown="0">
  <div class="cv-print-actions" hidden>
    <button type="button" class="cv-print-button">Print / Save as PDF</button>
  </div>
  {{ rendered_cv | replace: '>Experience</h3>', '>Research Experience</h3>' | replace: 'id="experience"', 'id="research-experience"' }}
</div>
