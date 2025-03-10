---
Source:
  - https://youtube.com/watch?v=yvnO8WDJ5tg
Reviewed: false
---
- ![[Screenshot 2023-01-08 at 5.41.12 PM.png]]
- One of the most confusing aspects of electrical engineering when talking about current is what the direction of the current is
- The conventional direction of the current is that the current flows from a power source and from the positive end of the power source to the negative end of the power source.
	- This is the current concept set up by Benjamin Franklin
		- He claimed that the positive charge is flown through the circuit. However at the time, we didn't understand about the positive and negative charges were. We knew there were positive and negative charges. We didn't know which ones were flown through the circuit so the assumption was made that it was the positive charge that moved through the circuit. We call that the IEEE convention. It is the conventional direction of the current from positive to negative. However, we all now realize that it's the negative charge that are actually doing the moving. It's the negative electrons in the atoms of material that are moving through the circuit. In essence, the current (real current) (real charges), are moving in the opposite direction from the negative end of the battery to the positive end of the battery through the [[(2) Electrical Engineering - Basic Concepts  (2 of 7) Basic Circuit Elements#^d123cf|load resistor]]. 
	- From now on, we're going to assume that the positive current (conventional current) is flowing from the positive to negative side (while we understand that the electrons are flowing the opposite direction and the electrons form the negative current.) That way, we're always safe
	- The conventional current flows from positive to negative and the electron current flows from negative to positive (we call it therefore the negative current)
	- Definition of current is defined by the differential equation: $I = \frac {dQ}{dt}$ 
		- I = the change in the change per unit time
		- We don't really mean the change. We mean the amount of charge is flowing past a particular point.
		- If we take any point on the circuit and we watch the current going by that point, we can say that the current flow is equal to the amount of charge that passes that point per unit time. 
		- The charge is usually indicated in terms of coulombs and the time in seconds so $\frac {Coulombs}{sec}$ = Amp (or amperes). We use the symbol "A" to indicate the amount of current that we have.
	- 1 amp is determined or defined by the ratio of 1 Coulomb per second ($\frac {1 C} {1 sec}$).  When you know we have a current flow of one amp, you know that there is 1 Coulomb of charge is passing that point every single second. 
		- 1 C = 6.24 $\times$ $10^{18}$ $e^-$ 
			- Unit charges
			- The unit charge is the charge we have on a single electron or a single proton.
			- If the charge is positive and yet we indicate negative charges (electron charges) how can you justify that? An electron charge is simply a unitary charge. The simplest charge in the universe. Therefore we call an electron charge a single charge and a Coulomb has $6.24 \times 10^{18} e^-$ of those. We think of Coulombs as positive as we think of current as positive charge of flowing.
	- $Q = \int_{0}^t i \,dt$ 
		- To calculate how much charge has passed a certain point in a circuit, the charges past that point is equal to the integral of the current at that point times "dt" integrated from 0 to t. So how much current has flown over a certain amount of time especially if "i" is not a constant but a variable. Then of course we want to keep track of that and the total charge will then simply be the integral of the current times "dt"
- This is the basic concept of current. From now on we realize current is positive charge flown from the positive end of the battery to the negative end of the battery. If we keep that in mind, then it'l be easier to follow the videos to come. This is how we look at current.
