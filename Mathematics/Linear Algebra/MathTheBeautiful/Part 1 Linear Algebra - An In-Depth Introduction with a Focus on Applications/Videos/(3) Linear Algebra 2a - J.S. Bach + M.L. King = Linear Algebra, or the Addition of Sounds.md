---
Source:
  - https://www.youtube.com/watch?v=sNigRX9-z1A
Reviewed: false
---
- ![[Screenshot 2025-10-23 at 2.51.09 PM.png]]
	- The eye receives 100 million individual signals, the ear receives a single one (which is the sum of all the available sounds)
		- Sounds are added in a very literal mathematical sense
		- Linear algebra is all about adding things together in various proportions
			- More precisely, it's about adding objects together of the same kind in such a way that the result is another object of the same kind
		- The addition of audio signals happens in a very precise mathematical sense
	- In the example of "Bach Prelude" vs the "I Have a Dream" speech, each array has about a million numbers in it. Best way to visualize these arrays is to plot them as a time series.
	- Playing the literal mathematical sum of "Bach Prelude" and "I Have a Dream" has them both playing at the same time where you can hear both
		- They get literally added together before they are received in our ear.
		- So doing `play(bach + mlk)` gives them added together and we hear both
		- Doing `play(0.5*bach + mlk)` makes the sound half as loud than before
			- So what we're learning is that audio signals are added together in various proportions in the precise mathematical sense. And this literal mathematical addition of the audio signals amount to combining the sounds together 
	- Vectors are objects of the same kind that can be multiplied by numbers and added together in a precise mathematical sense to produce another object of the same kind

## Worksheet
- [Source](https://www.lem.ma/content/BZKq0L0FXvSeK6gmEF7Q6w?book_id=AIApowDnjlDDQrp-uOZVow)
	- `mlk - bach` sounds the same as `mlk + bach`
	- Image
		- Audio signals can be combined by literal addition.
		- The idea of taking a very complicated phenomenon and breaking it to a sum of much simpler phenomenon is very powerful in all of science, applied mathematics in particular, and especially in linear algebra
		- We looked at sound by looking at the data that make up the wave
			- Sound travels through air as differences in pressure and you can capture it by a function of pressure as a function of time at a particular point
			- And if a single signal has to carry a bunch of information from music, speech, and background noises, you know it has to be complicated
		- Normal frequencies range from about 60hz
		- In the example there are 4 oscillations 