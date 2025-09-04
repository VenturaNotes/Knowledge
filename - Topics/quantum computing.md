## Synthesis
- 
## Source [^1]
- The use of computational methods inspired by the principles of quantum mechanics. See feature Quantum Computing.
- Quantum computing is the study of ways in which unusual quantum-mechanical effects could be employed to improve the processing power of computers in solving problems. As computer technology has developed, a notable feature has been a steady decrease in the size of components, both for storage and processing. Ultimately, it will be possible to use components formed of only a few atoms, or even single atoms. For instance, one could imagine a storage system in which two bits of information were stored using two different quantized spin states of an atomic nucleus. Alternatively, a logic gate might be formed of a small number of atoms on the surface of a substrate. This branch of the subject is often referred to as nanocomputing. Although these devices do involve quantum-mechanical effects, they would not be part of a quantum computer in the sense in which the term is now used. True quantum computing involves more unusual phenomena characteristic of microscopic systems. Although considered earlier, the interest of quantum computing really started in 1985 when David Deutsch published a theoretical paper on the idea of a universal quantum computer.

  

# Superposition and entanglement

  

There are certain quantum-mechanical effects that are observed for small systems (atoms, molecules, elementary particles, etc.) and have no counterpart in macroscopic systems described by classical mechanics. It can be shown that, in quantum mechanics, a system such as an atom or elementary particle may have two (or more) distinct states. For example, an atom might have two different electronic energy levels, an electron might have two different spin states, or a photon might have two different polarizations. It is part of the formalism of quantum mechanics that a particle, say, is able to exist in an indeterminate superposition of the two states - i.e. it is in both states at the same time. It is only when a measurement is made that the particle adopts one or other state (a process known as 'collapse of the wave function' or 'state vector reduction'). This indeterminacy, in which two distinct states coexist simultaneously, is called superposition.

  

Another unusual phenomenon is that of quantum entanglement. The idea comes from a thought experiment first discussed by Einstein, Podolsky, and Rosen in 1935 and known as the 'EPR experiment.' Suppose two different particles are created from a single particle and move in different directions. It is known that they must have opposite spins (because spin is conserved) but the spins of both are taken to be indeterminate until a measurement is made. If the spin of one particle is measured, then its spin is fixed. But the measurement on one particle instantly fixes the spin of the other, even though the particles may be widely separated. The two particles are effectively part of the same system and are said to be in an 'entangled state.' Quantum computing is designed to exploit such effects.

![[A Dictionary of Computer Science [part 9]_img_6.jpeg]]

  

Quantum superposition. A system can exist in two superposed states constituting a qubit $(0,1)$. It collapses to one of two real states 0 or 1 corresponding to classical bits.

  

# Quantum bits and registers

  

This superposition of two states leads to the idea of a quantum bit or qubit, i.e. a superposed state that can store the bits 0 and 1 at the same time. A computer register made of three physical classical physical bits can store any of eight numbers, namely $000,001,010,011,100,101,110$, and 111 , but it can obviously store only one of these numbers at a time. A register made of three qubits actually stores all eight numbers simultaneously. But this is not of interest as an efficient storage device; the key point about quantum register is that if it can be made to change to perform a computation, the processing occurs on all possible numbers in the register simultaneously. Increasing the number of qubits in the register increases the numbers exponentially. Four qubits store 16 numbers, five store 32 , six store 64 , and $n$ cubits store $2^{n}$ numbers. Consequently, a working quantum computer would have the potential for massive amounts of parallel processing. It is as if the computer were operating simultaneously in many parallel universes - indeed, some of the people who developed early ideas on quantum computing had an interest in the so-called 'many-worlds' formalism of quantum mechanics.

  

# Quantum algorithms

  

There are a number of problems with the idea of quantum computers, an obvious one being how to make one. Also there is a problem with the superposed states, which collapse to classical states by interacting with the environment - a process known as decoherence. A quantum computer would have to operate with the decoherence time, typically nanoseconds. More fundamentally, how would it be possible to access information? Measuring the state of a quantum register would simply collapse its wave function and give one of the eight possible numbers as in a classical register. Various quantum algorithms have been considered, aimed at using these quantum effects to give usable information. Algorithms of this type exploit the fact that there can be destructive or constructive interference between states and give results based on probabilities.

  

# Factorization of numbers

  

In 1994 interest in the subject increased considerably when Peter Shor of Bell Laboratories devised a quantum algorithm, Shor's algorithm, that could in principle enable a quantum computer to factorize a large number.

  

Factorization is important because it is the basis of the widely used RSA system of public key cryptography. Given any two whole prime numbers, $N$ and $M$, it is easy to multiply them together to give a product $P$ (known as a semiprime). The reverse problem, starting with a semiprime $P$ and finding the two unknown prime factors, $N$ and $M$, is much more difficult. It involves a large number of trial divisions. It is perfectly possible in principle to factorize any number using a classical computer, but the problem is that, for large numbers, even the fastest conventional computers would take impractically long times. To date, the largest semiprime factored in this way has 200 (decimal) digits and the process took many months of computer time. Larger numbers would need impossibly large computer runs. However, a quantum computer, with its vastly increased parallel processing power, might lead to the breaking of public-key cryptograms. This is why Schor's algorithm caused such interest when it was first published.

  

# Practical devices

  

So far no-one has produced a large working quantum computer, although a considerable amount of work has been done on physical systems that might be used to store qubits and to work with entangled registers. These include ions held in an ion trap, superconducting quantum devices, quantum dots in semiconductors, and nuclear magnetic resonance.
## Source[^2]
- Quantum computing is a type of computing where information is processed using quantum-mechanical phenomena, such as superposition. Quantum computers are much faster and more powerful than traditional ones because they can perform several calculations simultaneously. This makes them well-suited for tasks that require a high amount of computational power, such as data encryption and quantum simulation. Quantum computing is still in its early stages, but it has the potential to revolutionize the way people process information.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
[^2]: [[(Home Page) Glossary by Capterra]]