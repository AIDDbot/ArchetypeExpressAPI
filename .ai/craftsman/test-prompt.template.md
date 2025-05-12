---
syntax: "[Template Syntax](/.ai/syntax.template.md)"
feature: "The feature to be tested"
folder: "/{{ container.slug }}/docs/{{ feature.id }}/"
file: "{{ feature.slug }}.test.md"
---

# Prompt for Feature {{ feature.id }} - {{ feature.name }} tests

### Reference



<!--
  {{ containerFolder: /{{container.slug}} }}
  {{ folderRules: {{containerFolder}}/.ai/}}
  -->

- [Feature Documentation](/docs/{{feature.slug}}.blueprint.md)
- [Archetype Node CLI](/{{container.slug}}/docs/{{container.archetype}}.archetype.md)
- [Test Rules](/{{container.slug}}/.ai/rules/test.rules.md)

<!--
  Read this documents to understand the feature requirements and the container rules.
  Ask the user if you don`t find any of the needed documents.
-->

## Instructions

You are to generate a comprehensive set of tests for the {{ feature.id }} {{ feature.name }} feature as implemented in the current `src` folder. Follow these instructions:

- Start by writing the JSDoc gherkin syntax for the feature.
- Then write the `describe` block for the feature with appropriate texts.
- Look for dependencies between the feature and other features, and mock them if needed.
- Then write the tests for the feature.
- Use the test rules to refactor the tests as needed.

> End of prompt for {{ feature.id }} {{ feature.name }} tests. 