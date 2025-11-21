export const ONE_PAGER_PROMPT_TEMPLATE = `
## Objective
{Objective}

## Background
{Background}

## Value
{Value}

## Principles
{Principles}

## Goals
{Goals}

## Metrics
{Metrics}

## Roadmap
{Roadmap}

## FAQ
{FAQ}
`;

export const ONE_PAGER_GENERATION_PROMPT = `{LANGUAGE_INSTRUCTION}
Please generate the 1-Pager document in JSON format. The content for each field (Objective, Background, Value, Principles, Goals, Metrics, Roadmap, FAQ) must be in the specified language.

Given the idea: "{ideaText}",
The 1-Pager should include the following sections and their content:
- Objective: A concise description of the objective.
- Background: The background context.
- Value: The value proposition.
- Principles: Guiding principles.
- Goals: Quantifiable goals.
- Metrics: Key metrics.
- Roadmap: High-level roadmap items.
- FAQ: Frequently asked questions.

Ensure the output is a valid JSON that strictly adheres to the following TypeScript interface:
interface OnePager {
  Objective: string;
  Background: string;
  Value: string;
  Principles: string;
  Goals: string;
  Metrics: string;
  Roadmap: string[];
  FAQ: string[];
}
`;

export const ONE_PAGER_FALLBACK_PROMPT = `{LANGUAGE_INSTRUCTION}
Please generate the 1-Pager document. The content for each section must be in the specified language.

Given the idea: "{ideaText}",
Please structure it clearly with the following sections and provide the content for each:
- Objective:
- Background:
- Value:
- Principles:
- Goals:
- Metrics:
- Roadmap: (List each roadmap item on a new line starting with -)
- FAQ: (List each FAQ on a new line starting with -)
`;

export const SPEC_GENERATION_PROMPT = `{LANGUAGE_INSTRUCTION}
Please generate a detailed Specification (Spec) document in JSON format. The content for each feature's title and priority must be in the specified language.

Given the following 1-Pager data (JSON format):
{onePagerData}

The Spec should contain a 'feature_list', which is an array of objects.
Each object in the 'feature_list' should have:
- 'title': A descriptive name for the feature.
- 'priority': The priority of the feature, which must be one of 'P0' (Must-have), 'P1' (Should-have), or 'P2' (Nice-to-have).

Prioritization rules:
- P0: Essential features for the core functionality.
- P1: Important features that enhance the product but are not critical for MVP.
- P2: Features that can be implemented in later stages.

Ensure the output is a valid JSON that strictly adheres to the following TypeScript interface:
interface Spec {
  feature_list: {
    title: string;
    priority: 'P0' | 'P1' | 'P2';
  }[];
}
`;

export const SPEC_FALLBACK_PROMPT = `{LANGUAGE_INSTRUCTION}
Please generate a detailed Specification (Spec) document. The content for each feature's title and priority must be in the specified language.

Given the following 1-Pager data (text format for fallback):
{onePagerData}

The Spec should describe a 'feature_list', where each feature has a title and a priority.
Please list each feature on a new line, specifying its priority. Example:
- Feature Title (P0)
- Another Feature (P1)

Prioritization rules:
- P0: Essential features for the core functionality.
- P1: Important features that enhance the product but are not critical for MVP.
- P2: Features that can be implemented in later stages.
`;

export const ACTION_PLAN_GENERATION_PROMPT = `{LANGUAGE_INSTRUCTION}
Please generate an Action Plan in JSON format, outlining tasks for each day. The content for each task must be in the specified language.

Given the following feature list (sorted by priority) and a {duration}-day duration:
{featureList}

The Action Plan should contain a 'timeline', which is an array of objects.
Each object in the 'timeline' should have:
- 'day': The day number (starting from 1).
- 'task': A descriptive name for the task.

Rules for generation:
- Allocate 1 to 3 tasks per day.
- Prioritize P0 features first, then P1, then P2.
- Schedule tasks serially; no parallel tasks are allowed.
- Ensure the plan covers the full {duration} days, distributing tasks logically.

Ensure the output is a valid JSON that strictly adheres to the following TypeScript interface:
interface ActionPlan {
  timeline: {
    day: number;
    task: string;
  }[];
}
`;

export const ACTION_PLAN_FALLBACK_PROMPT = `{LANGUAGE_INSTRUCTION}
Please generate an Action Plan, outlining tasks for each day. The content for each task must be in the specified language.

Given the following feature list (sorted by priority) and a {duration}-day duration:
{featureList}

The Action Plan should describe a 'timeline', where each item has a day number and a task.
Please list each task on a new line, specifying its day. Example:
- Day 1: Task A
- Day 2: Task B

Rules for generation:
- Allocate 1 to 3 tasks per day.
- Prioritize P0 features first, then P1, then P2.
- Schedule tasks serially; no parallel tasks are allowed.
- Ensure the plan covers the full {duration} days, distributing tasks logically.
`;
