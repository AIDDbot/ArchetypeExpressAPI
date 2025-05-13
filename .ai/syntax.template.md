# Template Syntax

## Overview

Syntax for using templates to generate structured content.

Consist of a `YAML` _header_ section and a `Markdown` _body_.

### YAML Header

A metadata section to guide the process of generating the output file.
Defines variables and naming conventions.

**IMPORTANT**

Do NOT include the `YAML` header in the output document.

**EXAMPLE**

Indicates the folder and file to be generated.

```md
---
folder: /docs
file: {{ projectName | lower }}.md
---
```


### Markdown Body

The template used to generate the output file.

Contains all the literal content, placeholders and instructions to be followed.

## Syntax Elements

### Instruction Comments

Standard comments contain instructions for processing the template.

Read and follow them but do NOT include them in the output.

**EXAMPLE**

```md
<!-- This is an instruction comment
  It can span multiple lines
  Contains instructions for the LLM
-->
```

### Expression Placeholders

_Placeholders_ are special tokens inside double curly braces `{{  }}` that indicate content that must be generated or filled in.

Can be expressed in natural language or as variable in `camelCase`.

Can include the pipe symbol `|` to add a formatting modifier.

Resolve the placeholder expression to a text value to be included in the output.

Resolution priority:

1. Use provided variables if defined
2. Use your knowledge if enough information is provided
3. Ask the user for details
   - Ask one question at a time
   - Take into account the context of the previous answers
   - Offer a choice of predefined answers if possible

**EXAMPLE**

```md
{{ description in natural language }}
{{ variableName }}
{{ something | modifier }}
```

### Conditional Sections

Some sections are only included if a _condition_ is met.

Use natural language to describe the conditions.

Use `if` and `end` to enclose the section.

**EXAMPLE**

```md
{{ if condition }}
Content when true
{{ end condition }}
```

### Loops

Some sections are repeated for each item in a list.

Use natural language to describe the _loop_.

Use `for` and `end` to enclose the section.

**EXAMPLE**

```md
{{ for item in items }}
Content for each {{ item }}
{{ end item }}
```

### Value Constraints

Some placeholders can be _constrained_ to specific values.

You can pick from the list or offer them to user to choose from.

Those lists are prefixed by `:` and separated by `|` or `,` for single or multiple choices.

**EXAMPLE**

```md
The main theme of the project is {{ : red | green | blue }}.
We will use {{ : console, file, database | none }} for logging.
```

Can produce something like:

```md
The main theme of the project is red.
We will use console and file for logging.
```

### Numbering

Use the hash `#` symbol to _number_ items.

When used in a loop, it will be replaced with the current item _number_.

**EXAMPLE**

```md
# Feature {{ F# }}

User Story **{{ US_# }}**
{{ for task in tasks }}
Task `{{ # }}`: {{ task_description }}
{{ end task }}
```

Should produce:

```md
# Feature F1

User Story **US_1**
Task `1`: Do something
Task `2`: Do something else
```

### Variable aliases

Define reusable values with the equal assignment `=` symbol, named variables in `camelCase` :

Variables rules:

- Only one alias per expression placeholder
- Have template-wide scope
- Can reference other aliases defined earlier
- Cannot be redefined

**EXAMPLE**

```md
{{ userName = John Doe }}
{{ projectStart = 2023-01-15 }}

Project lead: {{ userName }}
Start date: {{ projectStart }}
```

### Mandatory vs optional sections

Some sections are mandatory, others are optional.

Use the `?` symbol as a suffix to make a section optional.

Use the `!` symbol as a suffix to make a section mandatory.

**EXAMPLE**

```md
{{ optionalSection? }}
{{ normalSection }}
{{ mandatorySection! }}
```


### Summary of syntax symbols

**IMPORTANT**

Presented between `code blocks` just for ease of reading, not to be included in the template.

- `<!-- -->` for instruction comments
- `{{ }}` for placeholders
- `{{ | }}` for formatting modifiers
- `{{ = }}` for aliases
- `{{ # }}` for numbering
- `{{ : | }}` for single choice constraints
- `{{ : , }}` for multiple choice constraints
- `{{ if }}` for conditionals
- `{{ for }}` for loops
- `{{ end }}` for loop or conditional end

---

## Example template

Here you have a complete example of a template using all the syntax elements:

```md
---
folder: /docs
file: {{ projectName | lower }}.md
---

<!-- Ask the user for the projectName -->

# {{ projectName }}

<!-- Ask the user for the projectType : web | mobile | desktop -->

{{ if projectType is web }}

This is a web project.
The main colors will be {{ : blue , green , red }}.
The CSS framework will be `{{ : bootstrap | tailwind | none }}`.

{{ end is web }}

## Features

{{ for feature in features }}

### {{#}} {{ feature name | one short sentence }}

<!-- Generate a code for the feature using the F prefix and an ordinal number and the feature short name in slug format -->

{{ featureCode = F#_feature | slugify }}

**{{ featureCode }}**

{{ feature description | one short paragraph }}

{{ end feature }}
```

## Example output

Should generate a file at `docs/my-project.md` with the following content:

```md
# My Project

This is a web project.
The main colors will be blue and green.
The CSS framework will be `bootstrap`.

## Features

### 1 Feature one

**f1_feature_one**

Description for feature one

### 2 Feature two

**f2_feature_two**

Description for feature two
```
