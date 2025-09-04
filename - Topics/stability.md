## Synthesis
- 
## Source [^1]
- A multidiscipline term with a variety of (related) meanings. In numerical analysis it is used with what appears to be a bewildering array of possible prefixes. There are, however, two important basic usages.
- Given a well-defined numerical procedure it is important that roundoff errors do not seriously influence the accuracy of the results. This is referred to as [[numerical stability]] and depends on the error propagation properties of the procedure.
- Discretization methods for the solution of integral and differential equations are based on a subdivision of the region in which the solution is required. Stability here means that perturbations in the data (initial or boundary conditions) have a bounded effect on the solution obtained (ignoring roundoff error) for a given subdivision. The existence of a uniform bound on this effect over all sufficiently fine subdivisions is a necessary condition for the convergence of the method as the subdivision is refined.
- In the solution of ordinary differential equations much of the stability theory has been developed in the study of stiff systems of equations. Of great importance to this development was the concept of [[A-stability]] introduced by Dahlquist in 1963. A method is A-stable if it produces bounded solutions for the test problem$$y^{\prime}=q y, y(0)=1, \operatorname{Re}(q)<0$$for all stepsizes. The trapezoidal rule (see ORDINARY DIFFERENTIAL EQUATIONS) is an example of an A-stable method. Much of the later theory has investigated similar properties for more general test problems.
## References

[^1]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]