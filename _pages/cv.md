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

{% assign print_cv = site.data.cv.cv %}
{% assign print_sections = print_cv.sections %}

<article class="cv-print-sheet" hidden markdown="0" aria-labelledby="cv-print-name">
  <header class="cv-print-header">
    <h1 id="cv-print-name">{{ print_cv.name | escape }}</h1>
    <p class="cv-print-subtitle">{{ print_cv.label | escape }} · {{ print_sections.Education.first.institution | escape }}</p>
    <address class="cv-print-contact">
      <a href="mailto:{{ print_cv.email | escape }}">{{ print_cv.email | escape }}</a>
      <a href="{{ print_cv.website | escape }}">{{ print_cv.website | remove_first: 'https://' | escape }}</a>
      <span>{{ print_cv.address.city | escape }}, {{ print_cv.address.region | escape }}</span>
    </address>
  </header>

  <section class="cv-print-section">
    <h2 data-toc-skip>Education</h2>
    {% for entry in print_sections.Education %}
      {% assign start = entry.start_date | append: '-01' | date: '%b %Y' %}
      {% if entry.end_date == 'present' %}
        {% assign end = 'Present' %}
      {% else %}
        {% assign end = entry.end_date | append: '-01' | date: '%b %Y' %}
      {% endif %}
      <div class="cv-print-entry">
        <div>
          <h3 data-toc-skip>{{ entry.institution | escape }}</h3>
          <p>{{ entry.area | escape }} · {{ entry.degree | escape }}</p>
          {% for highlight in entry.highlights %}
            {% unless highlight contains 'Enrolled since' %}
              <p>{{ highlight | escape }}</p>
            {% endunless %}
          {% endfor %}
        </div>
        <div class="cv-print-meta">
          <p class="cv-print-date">{{ start }} – {{ end }}</p>
          <p>{{ entry.location | escape }}</p>
        </div>
      </div>
    {% endfor %}
  </section>

  <section class="cv-print-section">
    <h2 data-toc-skip>Research Experience</h2>
    {% assign print_experience = print_sections.Experience | al_cv_sort_by_date %}
    {% for entry in print_experience %}
      <div class="cv-print-entry">
        <div>
          <h3 data-toc-skip>{{ entry.position | escape }}</h3>
          <p>{{ entry.company | escape }}</p>
        </div>
        <div class="cv-print-meta">
          <p class="cv-print-date">{{ entry.date | escape }}</p>
          <p>{{ entry.location | escape }}</p>
        </div>
      </div>
    {% endfor %}
  </section>

  <section class="cv-print-section">
    <h2 data-toc-skip>Research Interests</h2>
    <div class="cv-print-interests">
      {% for entry in print_sections['Research Interests'] %}
        <div>{{ entry.bullet | markdownify }}</div>
      {% endfor %}
    </div>
  </section>

  <section class="cv-print-section">
    <h2 data-toc-skip>Honors and Awards</h2>
    {% for entry in print_sections['Honors and Awards'] %}
      {% assign award_date = entry.date | append: '-01' | date: '%b %Y' %}
      {% assign full_award_date = entry.date | append: '-01' | date: '%B %Y' %}
      {% assign date_suffix = full_award_date | prepend: ' (' | append: ')' %}
      {% assign award_summary = entry.summary | remove: date_suffix %}
      <div class="cv-print-entry">
        <div>
          <h3 data-toc-skip>{{ entry.title | escape }}</h3>
          <p>
            {{ entry.awarder | escape }}
            {% if award_summary != full_award_date and award_summary != empty %} · {{ award_summary | escape }}{% endif %}
          </p>
        </div>
        <p class="cv-print-meta cv-print-date">{{ award_date }}</p>
      </div>
    {% endfor %}
  </section>

  <section class="cv-print-section">
    <h2 data-toc-skip>Contest Organization</h2>
    {% for entry in print_sections['Contest Organization'] %}
      <div class="cv-print-contest">{{ entry.bullet | markdownify }}</div>
    {% endfor %}
  </section>
</article>
