---
tags:
  - in-progress
---
## Synthesis
- Classification and regression are the two most fundamental and widely recognized tasks in supervised learning. 
	- #question Why are they called tasks? What does task mean in this context? 
- [[Structured prediction]] is a broader category that encompasses tasks where the output is a complex object (like a sequence, tree, or graph), but involves elements of classification or regression internally
	- #question So are the only methods in supervised learning either classification or regression (aside from structured prediction?)
	- #question What does "encompasses tasks" mean? Are we saying that structured prediction is the task itself or is something else the task? 
## Organize
-   **#question So are the only methods in supervised learning either classification or regression (aside from structured prediction?)**
    While classification and regression are indeed the two most fundamental and widely recognized tasks in supervised learning, they are not the *only* ones. Many other supervised learning problems can be framed as variations or combinations of these, or as distinct tasks that build upon them.
    -   **Structured prediction** is a significant category that goes beyond simple classification or regression by predicting complex, interdependent outputs (e.g., sequences, trees, graphs). It often utilizes classification or regression internally to construct these complex outputs.
    -   Other specialized tasks include:
        -   **Ranking:** Predicting an ordered list of items (e.g., search results).
        -   **Time series forecasting:** Predicting future values in a sequence.
        -   **Supervised Anomaly Detection:** Identifying unusual data points when labeled examples of anomalies are available (often framed as a classification problem).
-   **#question What does "encompasses tasks" mean? Are we saying that structured prediction is the task itself or is something else the task?**
    When it says "structured prediction is a broader category that encompasses tasks," it means that structured prediction is an **overarching type of problem or framework**. Within this framework, there are various specific problems, which are the individual "tasks."
    -   **Structured prediction** is the general class of problems where the output is a complex, structured object (like a sequence, tree, or graph).
    -   Specific examples of tasks *within* structured prediction include:
        -   **Sequence labeling** (e.g., Part-of-Speech tagging, Named Entity Recognition)
        -   **Syntactic parsing** (predicting a parse tree for a sentence)
        -   **Image segmentation** (assigning a label to each pixel in an image)
    These individual tasks are specific instances of structured prediction problems. They often involve internal classification or regression decisions to build up the complex output structure.
## Organize 2
Yes, "task" is an official and widely used term in machine learning. It's not just a casual word choice to demonstrate an idea.

In machine learning, a **task** refers to the specific problem that a machine learning model is designed to solve. It defines the objective and the type of output expected from the model. For example:

*   **Classification task:** Predicting a discrete category (e.g., spam or not spam).
*   **Regression task:** Predicting a continuous numerical value (e.g., house price).
*   **Structured prediction task:** Predicting a complex, structured output (e.g., a sequence of words, a parse tree).
*   **Clustering task:** Grouping similar data points together.

Researchers and practitioners commonly use "task" to categorize and discuss different types of machine learning problems.
## Source [^1]
- 
## References

[^1]: