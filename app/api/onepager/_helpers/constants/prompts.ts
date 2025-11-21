import { ONE_PAGER_TEMPLATE } from './template';

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

export const ONE_PAGER_GENERATION_PROMPT = `Given the idea: "{ideaText}", generate a 1-Pager document in JSON format.
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

export const ONE_PAGER_FALLBACK_PROMPT = `Given the idea: "{ideaText}", generate a 1-Pager document.
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
