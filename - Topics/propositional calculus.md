## Synthesis
- 
## Source [^1]
- A system of symbolic logic, designed to study propositions. A proposition is a statement that is true or false. There are many alternative but equivalent definitions of propositional calculus, one of the more useful definitions for the computer scientist being given here.

  

The only terms of the propositional calculus are the two symbols $T$ and $F$ (standing for true and false) together with variables for logical propositions, which are denoted by small letters $p, q, r, \ldots$; these symbols are basic and indivisible and are thus called [[atomic formulas]].

  

The propositional calculus is based on the study of well-formed formulas, or [[Well-formed formulas|WFF]] for short. New wff of the form

  

$$

\begin{aligned}

& (-A),(A \vee B),(A \wedge B) \\

& (A \supset B),(A \equiv B) \\

& \text { (IF A THEN B ELSE } C \text { ) }

\end{aligned}

$$

  

are formed from given wff $A, B$, and $C$ using logical connectives; respectively they are called negation, disjunction, conjunction, implication, equivalence, and conditional. If 〈atf〉 denotes the class of atomic formulas, then the class of wff〈wff〉, can be described in BNF notation (see fig. 1).

  

Proofs and theorems within the propositional calculus are conducted in a formal and rigorous manner: certain basic axioms are assumed and certain rules of inference are followed. In particular these rules must deal with the various connectives.

  

$$

\begin{aligned}

& \langle w f f \rangle::=\langle a t f|\left(\sim\langle w f f\rangle\right)|\left(\langle w f f\rangle \vee\langle w f f\rangle\right) \mid \\

& \langle\langle w f f\rangle \wedge\langle w f f\rangle\rangle|\left(\langle w f f\rangle \supset\langle w f f\rangle\right)|

\end{aligned}

$$

  

$\langle\langle w f f\rangle \equiv\langle w f f\rangle\rangle \mid$

$\langle$ IF $\langle w f f\rangle$ THEN $\langle w f f\rangle$ ELSE $\langle w f f\rangle\rangle$

Fig. 1 Class of wff in BNF notation

  

$$

\begin{aligned}

& \frac{\Gamma \Rightarrow A \text { and } \Gamma \Rightarrow B}{\Gamma \Rightarrow A \wedge B} \\

& \frac{\Gamma \Rightarrow A \wedge B}{\Gamma \Rightarrow A} \quad \frac{\Gamma \Rightarrow A \wedge B}{\Gamma \Rightarrow B}

\end{aligned}

$$

  

Fig. 2 Rule of inference for $\wedge$

  

# Propositional calculus.

  

The rules of inference are stated using a form such as

  

$$

\stackrel{\alpha}{\beta}

$$

  

The rule should be interpreted to mean that on the assumption that $\alpha$ is true, it can be deduced that $\beta$ is then true. Logicians often use the notation $\alpha \mid-\beta$. In writing the rules it is convenient to employ a notation such as

  

$$

\Gamma, A \Rightarrow B

$$

  

$\Gamma$ is some set of wff whose truth has been established; $A$ and $B$ are some other wff highlighted for the purposes of the rule; $\Rightarrow$ denotes implication (to avoid confusion with the symbol $\supset$ ). For example, the rules for the introduction and elimination respectively of the $\Lambda$ connective are shown in Fig. 2.
## References

[^1]: [[Home Page - A Dictionary of Computer Science 7th Edition by Oxford Reference]]