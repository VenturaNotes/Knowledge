## Synthesis
- Systems programming involves writing software that interacts closely with the hardware and operating systems. Includes developing
	- [[Operating systems]]
		- The software that manages the hardware and provides services for application software. Examples include Windows, Linux, and macOS.
			- #question what kind of services? Would like to see an example
	- [[Device drivers]]
		- Programs that allow the operating system to communicate with hardware components like printers, graphics cards, and storage devices.
	- [[Embedded systems]]
		- Software designed for specialized hardware, such as the software running on microcontrollers in cars, industrial machines, or IoT devices.
	- [[Network protocols]]
		- The rules and standards that allow different devices to communicate over a network, like TCP/IP, which underpins the internet.
	- High-performance applications
		- Software that requires optimal performance, such as databases, game engines, and scientific computing applications.
			- #question Is this a typical industry term?
			- #question What other high-performance applications are there?
- The above are system-level components
- Without robust systems programming, the applications and services people use daily (web browsers, mobile apps, cloud services) wouldn't be able to function effectively or reliably
	- #question would like to see an example of systems programming. What language is typically used for this? 
### What exactly is Systems Programming in Rust?
- It refers to writing low-level software that interacts directly with hardware or provides essential services that other software depend on.
	- #question How can I make rust interact with hardware?
	- #question Is rust a low-level or high-level programming language?
	- #question How could I provide an essential service through rust?
- Rust suitable for systems programming because 
	- offers fine-grained control over system resources like memory and CPU
		- #question I would like to see an example of controlling a computers memory or CPU.
		- #question How accurate are we talking about fine-grained?
	- Ensures safety through strong type system and ownership model
		- #question what is meant by strong type system?
		- #question What is meant by ownership model?
		- which prevent many common programming errors such as [[null pointer dereferencing]] or [[buffer overflows]]
			- #question Show me an example of preventing null pointer dereferencing in Rust
			- #question Show me an example of preventing buffer overflows in Rust
#### Characteristics of Systems Programming in Rust
- (1) Memory safety without garbage collection
	- Rust ensures memory managed safely at compile time, without relying on a [[garbage collector]], making it suitable for performance-critical applications
	- #question Does java have garbage collection and how does it work?
	- #question why is garbage collection a bad thing?
	- #question what is meant by memory safety?
	- #question What are some examples of performance-critical applications?
- (2) [[Concurrency]] without [[Data Races]]
	- Rust's [[ownership model]] prevents data races, making concurrent programming safer
		- #question what is an ownership model and examples
			- #question How would it prevent data races
		- #question what is concurrent programming?
- (3) Low-Level Control: 
	- Rust allows direct manipulation of hardware, system calls, and low-level operations similar to languages like C and C++
		- #question How does it directly manipulate hardware
		- #question I need to see an example of system calls
		- #question what are some examples of low-level operations

#### A Basic Operating System Kernel in Rust
- #question What is an operating system kernel?
	- #question Are there different types of kernels aside from operating systems?
```Rust
#![no_std] // Don't link the standard library
#![no_main] // Disable all Rust-level entry points

use core::panic::PanicInfo;

// This function is called on panic
#[panic_handler]
fn panic(_info: &PanicInfo) -> ! {
    loop {}
}

// The entry point for the OS kernel
#[no_mangle] // Don't mangle the name of this function
pub extern "C" fn _start() -> ! {
    let vga_buffer = 0xb8000 as *mut u8;

    for (i, &byte) in b"Hello, world!".iter().enumerate() {
        unsafe {
            *vga_buffer.offset(i as isize * 2) = byte;
            *vga_buffer.offset(i as isize * 2 + 1) = 0x07;
        }
    }

    loop {}
}
```
- #question Why is the standard library not linked
- #question why are all rust-level entry points disabled?
	- #question what is a rust-level entry point?
- #question What does the line `use core::panic::PanicInfo` mean?
- #question why is there a panic handler?
- #question does this function need to start with `panic`?
- #question what is meant by `_info`?
- #question What is `&PanicInfo`?
- #question why is it pointing towards an exclamation point? `-> !`
	- #question does `loop {}` break the loop? 
- #question what does `[no_mangle]` mean? It doesn't mangle the name of the function?
- #question what does the keyword `pub` mean?
- #question what does the keyword `extern` mean?
- #question why is `C` mentioned?
- #question why is it pointing towards another exclamation point?
- #question what is the purpose of `vga_buffer`?
- #question What does `0xb8000` mean? 
- #question what does `as` mean and the `*mut` u8?
- #question I don't understand how the for loop is working
- #question I don't understand what `&byte` means or why there are 2 arguments
	- #question Are the variables inside parentheses known as arguments or do I say something like parameters?
- #question Why are we iterating through "Hello World"?
	- #question What does `enumerate` mean in this context?
	- #question what is the point of the `unsafe` keyword? Why is there an `offset` being made and what does the `*` mean in this case?
- #question what kind of calculation is being done inside the loop?
- #question does `loop {}` just break out of the program or loop? What is the purpose of the program?

##### Code Description
- (1) The following attributes tell the Rust compiler
	- #question how does the rust compiler work?
	- [[no_std (rust)|no_std]]
		- `#![no_std]` Don't link to the standard library
	- [[no_main (rust)|no_main]]
		- `#![no_main]` Don't expect a `main` function
			- #question how will the program run if it doesn't expect a main function?
			- These are typical in operating systems or embedded development where you need to control the entry point of the program
				- #question If `main` is typical in operating systems, why is it not used to create an operating system kernel?
				- #question how does embedded development work?
				- #question How can this program run if we can't control the entry point?
				- #question what is the entry point for rust? 
- (2) The `_start`function is the entry point of the kernel. It replaces the usual `main` function in a typical Rust program. In many systems, `_start` is the first code that runs when the system boots
	- #question Why didn't we just use the main function instead of `_start`? Does it react differently?
	- #question Which systems uses `_start` to make the system boot?
- (3) VGA Buffer: The `vga_buffer` is a memory location on many `x86` PCs where text is displayed on the screen. By writing directly to this memory, you can display text without any operating system support
	- #question What are `x86` PCs like and how are they different from others?
	- #question what exactly is a VGA Buffer and how does it work?
- (4) Unsafe code. Rust allows `unsafe` blocks, where you can perform operations that the compiler cannot guarantee to be safe, such as [[pointer dereferencing]]. This is crucial in systems programming where direct hardware access is needed.
	- #question Could you give a simpler example of unsafe blocks? I don't want a vivid description. More to the point would be useful for me
- (5) Panic handler: The `#[panic_handler]` attribute defines what should happen if the code panics. In this simple example, the kernel just enters an infinite loop
	- In the provided Rust kernel example, when the `panic` handler is invoked, the kernel enters an infinite loop (`loop {}`). This loop does not perform any active computation or interaction. Its purpose is to halt the program's execution indefinitely at the point of the panic. This is a common, minimalist strategy in low-level or embedded systems where there isn't an operating system to handle errors or a complex recovery mechanism. It prevents the system from proceeding in an undefined or potentially unsafe state after an unrecoverable error.
		- #question When would a function be called on panic?
		- #question What does a low-level or embedded system look like? 
			- #question How do low-level or embedded systems operate without an operating system? 
		- #question What is meant by a potentially unsafe state and what does an unrecoverable error look like? 
	- #question The kernel enters an infinite loop doing what?
	- #question What makes this code a kernel?
	- #question What is a [[panic_handler (rust)|panic_handler]]?
	- #question what are all the attributes

##### Explanation
- This simple kernel writes "Hello, world!" to the screen by directly manipulating the VGA text buffer.
	- What is a vga text buffer?
- It doesn't depend on any existing operating system or runtime
	- #question what is an operating system
	- #question what is a runtime?
- It makes a good illustration of how Rust can be used for low-level systems programming, offering both control and safety
	- #question what demonstrates control and safety in code?

#### Real-World Applications with Rust
- Operating systems: The [[Redox OS]] project is an example of a Rust-based operating system
- Web Browsers: Parts of Mozilla Firefox, such as the [[Servo]] engine, are written in Rust.
- Cryptography Libraries: Rust is used to develop safe, fast cryptography libraries that are used in various applications
	- #question what is cryptography?
	- What kind of cryptography libraries has rust made?

#### Summary
- Rust's ability to provide low-level control, along with its guarantees of safety, make it an excellent choice for systems programming, particularly in areas where reliability and performance are critical
	- #question I need more examples of low-level control

### Rust Interacting with Hardware
- For Rust to interact with hardware, you typically write code that directly accesses [[memory-mapped registers]] or uses [[low-level operations]]. These are common in [[embedded systems]] or [[operating system development]]
	- #question Describe me in more detail about memory-mapped registers
	- #question What are low-level operations? 
	- #question What is an embedded system. Just need some simple examples
	- #question What is the difference between embedded systems and operating system development?
- Rust's [[unsafe (rust)|unsafe]] blocks allows you to perform operations that the compiler cannot guarantee to be safe, which is necessary when working directly with hardware
	- #question why is this the case
	- #question Why do we need unsafe block to potentially not be safe? Why can't the blocks be safe?

#### Simple Demo: Blinking an LED on an Embedded Device
- #question what is an embedded device
- #question How does an [[LED]] work?
- We can write a Rust program that would blink an [[LED]] on a [[microcontroller]]
	- #question what defines a microcontroller?
- This assumes we're using an [[embedded development board]]
	- What is an embedded development board?
		- Examples include
			- [[Raspberry Pi Pico]]
				- #question Same questions as below
			- [[STM32]]
				- #question what is this? When was it made? I need a little history about it and maybe some electrical engineering details on it
#### Prerequisites
- [[Rust toolchain]] installed
	- #question Please describe this more in detail to me
- `rust-embedded`HAL ([[hardware abstraction layer]]): These libraries simplify hardware interaction
	- #question what is meant by `rust-embedded` here?
- A microcontroller board: Assumes you have an LED connected to a [[GPIO pin]]
	- #question what is the difference between a microcontroller and a microcontroller board?
	- #question how many parts are there to a microcontroller?
	- #question How could you make a microcontroller and why does it work?
	- #question how would the LED be connected? Do you need wires for this? What kind of wires are best?
#### Blinking an LED on GPIO Pin Code
```Rust
#![no_std]
#![no_main]

use cortex_m_rt::entry; // For the entry point
use panic_halt as _; // Halts the program on panic
use stm32f4xx_hal::{pac, prelude::*}; // STM32F4 HAL (change for your board)

// The entry point of the program
#[entry]
fn main() -> ! {
    // Take ownership of the peripherals singleton
    let peripherals = pac::Peripherals::take().unwrap();

    // Configure the GPIO pin
    let gpioa = peripherals.GPIOA.split();
    let mut led = gpioa.pa5.into_push_pull_output();

    // Blink the LED in an infinite loop
    loop {
        led.set_high().unwrap(); // Turn the LED on
        cortex_m::asm::delay(8_000_000); // Delay for a bit
        led.set_low().unwrap(); // Turn the LED off
        cortex_m::asm::delay(8_000_000); // Delay for a bit
    }
}

```
- #question What is meant by [[no_std (rust)|no_std]]
- #question Why is [[no_main (rust)|no_main]] needed again? Is this just something we need to do to change the entry point? What if we made the entry point main? Would that just make it difficult for other applications to run?
- #question What is [[cortex_m_rt]]?
- #question what is [[entry (rust)|entry]]?
- #question I need more information on [[panic_halt (rust)|panic_halt]] and how is it different than [[panic_handler (rust)|panic_handler]]
- #question I need to understand [[as (rust)|as]] better. What does the underscore mean here?
- #question What is [[stm32f4xx_hal]] and what is meant by pac and prelude?
- #question What does the \* mean?
- #question Can I just write `#[entry]` for there to be an entry point to the program? Why was this not included in the previous program when writing a basic operating system kernel in rust?
- #question If we have `![no_main]` why is there a main()?
- #question what is the peripherals singleton?
- #question how is the GPIO pin configured?
- #question What kind of LED is being used? Do we need a specific brand so that `led.set_high().unwrap();` is needed?
	- #question Why does it need to be unwrapped?
##### Code Description
- (1) It's common in embedded programming to not use standard library and not have a normal `main` function according to `#![no_main]` and `#![no_std]`. 
	- #question How are we still able to have a main function though?
- (2) [[Peripheral Access Crate]] (`pac`): The `pac` module gives you access to the microcontroller's hardware peripherals, like GPIO, timers, etc.
	- #question is the microcontroller connected to the LED or are they the same thing? 
- (3) GPIO configuration: We configure a GPIO pin (in this case, `PA5`) as an output pin, which we will use to control an LED
	- #question What does PA5 mean in this case?
- (4) Blinking the LED: The LED is turned on and off in an infinite loop, with delays between to create the blinking effect
	- #question does the `cortex_m::asm::delay` delay the entire program?
	- #question What are all the packages/modules/attributes (idk) of [[cortex_m]]?

##### Running Code
- To run code, would need to compile it to a specific microcontroller target and [[flash]] it onto the board using a tool like [[cargo-embed]] or [[openocd]]. Details of process vary depending on hardware being used
	- #question What does it mean to flash?
	- #question What is the tool cargo-embed and openocd like? 

#### Key Points
- No [[unsafe (rust)|unsafe]] in this example because the HAL handles the unsafe parts for you, but under the hood. It's using unsafe code to access [[hardware registers]]
	- #question How do we know when there is an unsafe part? 
	- #question What does the code inside HAL look like?
- No Standard Library: Because many embedded systems don't have operating systems, you work with Rust's standard library, using only what's provided by the hardware
	- #question How do I know what is provided by the hardware?

#### Conclusion
- This example shows how Rust can interact with hardware by controlling an LED on a microcontroller. Involves setting up GPIO pins, writing to those pins to turn the LED on and off and using a delay to make the LED blink. 
- Rust's strong typing and safety guarantees help make it robust even in low-level systems programming
	- #question How is rust strong typing, give some examples
	- #question Show how Rust is safer than other languages and make a comparison
## Source [^1]
- Provides foundation for world's computation
## Source[^2]
- Work carried out by systems programmers, i.e. the production of systems software.
## References

[^1]:[[(Home Page) Programming Rust 2nd Edition by O'Reilly#Intro]]
[^2]: [[(Home Page) A Dictionary of Computer Science 7th Edition by Oxford Reference]]
