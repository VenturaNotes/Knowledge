---
Source:
  - zotero://open-pdf/library/items/JS4YEBES?page=3&annotation=8J2IRV5U
Length: "448"
tags:
  - type/textbook
  - status/incomplete
Year: 2024-02-10
---
## Preface
- “[[human brain]] is a complex self-organizing system which depends on precise timing of genes, circuits, experiences, and behaviors to function.” ([pdf](zotero://open-pdf/library/items/JS4YEBES?page=5&annotation=5XQ2SUE6))
	- #question what is meant by timing here? 
- “Through [[neurodiversity]], we learn the different ways that the brain can self-organize with varying degrees of impact on overall brain function.” ([pdf](zotero://open-pdf/library/items/JS4YEBES?page=5&annotation=I5U4ID55))
- Autism spectrum disorder is a neurodevelopmental disorder 
## (1) Dysfunctional Circuit Mechanisms of Sensory Processing in FXS and ASD: Insights from Mouse Models
## (2) Theory of mind in Autism
## (3) Prenatal and Early Life Environmental Stressors: Chemical Moieties Responsible for the Development of Autism Spectrum disorder

## (4) Animal Models of ASD
## (5) Mitochondrial Dysfunction in Autism Spectrum Disorders

## (6) The Usability of Mouse Models to Study the Neural Circuitry in Autism Spectrum Disorder: Regulatory Mechanisms of Core Behavioral Symptoms

## (7) Seizures in Mouse Models of Autism
## (8) Lipid-Related Pathophysiology of ASD
## (9) Perinatal Insulin-Like Growth Factor as a Risk Factor for Autism
## (10) Prophylactic Treatment of ASD Based on Sleep-Wake circadian Rhythm Formation in Infancy to Early Childhood
## (11) Imbalances of Inhibitory and Excitatory Systems in Autism Spectrum Disorders
## (12) Shared Development Neuropathological Traits Between Autism and Environmental Lead Exposures: Insights into Convergent Sulfur-Dependent Neurobiological Mechanisms
## (13) Epidemiological Surveys of ASD: Current findings and New Directions
## (14) Metabolic Approaches of the Treatment of Autism Spectrum disorders
## (15) Autism and Neurodiversity

## (16) Principal Findings of Auditory Evoked Potentials in Autism Spectrum Disorder

## (17) Developmental Origins of the Structural Defects Implicated in ASD: Insights from iPSC and Post-Mortem Studies
## (18) Genes and their Involvement in the Pathogenesis of Autism Spectrum Disorder: Insights from Earlier Genetic Studies
## (19) Electrophysiology of Semantic Processing in ASD
## (20) Gestational Exposure to Di-n-Butyl Phthalate Induces Autism-Like Behavior Through Inhibition of Neuro-Steroidogenesis

## Review
### Terms
```dataviewjs
// Get the current file content
let fileContent = await dv.io.load(dv.current().file.path);

// Extract links using a regular expression
let links = fileContent.match(/\[\[([^\]]+)\]\]/g);

// Initialize a Set to store unique filtered links
let filteredLinks = new Set();

if (links) {
    // Filter out links with the #studied tag
    for (let link of links) {
        let linkName = link.slice(2, -2); // Remove the [[ and ]] from the link
        let page = dv.page(linkName);
        if (page && (!page.tags || !page.tags.includes("studied"))) {
            filteredLinks.add(link);
        }
    }
}

// Display the count of filtered links
dv.header(5, `Link Count: ${filteredLinks.size}`);

// Display the links or show "No Links Found"
if (filteredLinks.size > 0) {
    dv.list(Array.from(filteredLinks));
} else {
    dv.paragraph("- NO LINKS FOUND");
}
```