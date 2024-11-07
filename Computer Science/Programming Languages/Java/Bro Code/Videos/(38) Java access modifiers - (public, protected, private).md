[Video](https://youtube.com/watch?v=T632kAJ_9VA)

Key:
<mark style="background: #FFF3A3A6;">public</mark>: visible in all classes in all packages
<mark style="background: #FFF3A3A6;">protected</mark>: visible to all classes in the same package or classes in other packages that are a subclass
<mark style="background: #FFF3A3A6;">default</mark>: visible to all classes in the same package 
<mark style="background: #FFF3A3A6;">private</mark>: visible only in the same class

Access Levels

| Modifier    | Class | Package | Subclass | World |
| ----------- | ----- | ------- | -------- | ----- |
| public      | Y     | Y       | Y        | Y     |
| protected   | Y     | Y       | Y        | N     |
| no modifier | Y     | Y       | N        | N     |
| private     | Y     | N       | N        | N      |

- Need to create 2 packages
	- A package is just a collection of classes
	- A class is a collection of code
- There are 2 classes in each package
- Default access modifier (no modifier)
- ![[Screenshot 2023-08-07 at 6.23.56 AM.png|300]]
	- These packages were inside the "`scr`" folder of the "`Java`" folder. The packages are just folders themselves in this case

#### Example of Default Access Modifier (No Access Modifier)

##### package1
A.java
```java
package package1;
import package2.*;

public class A {
	public static void main(String[] args) {
		//TODO Auto-generated method stub

		C c = new C();
		//Error: The field C.defaultMessage is not visible
		System.out.println(c.defaultMessage);
	}
}
```

B.java
```java
package package1;
import package2.*;

public class B {

}
```

##### package2
C.java
```java
package package2;
import package1.*;

public class C{

	//Anything using the default access modifier is only visible to
	//anything within the same package. Anything in package2 can access
	//the defaultMessage, but not the classes in Package1
	String defaultMessage = "This is the default";

}
```

##### Output
- When pressing "Run Java" 
	- A.java, I get the error 
		- `The field C.defaultMessage is not visible`. 
	-` Asub.java`, I get the output
		- `This is the default`


`Asub.java`
```java
package package2;
import package1.*;

public class Asub extends A {

	public static void main(String[] args) {
		//TODO Auto-generated method stub

		C c = new C();
		//We now have access to this variable b/c Asub.java is
		//within the same package as C.java
		System.out.println(c.defaultMessage);
	}
}

```

#### Example of Public Access Modifier
##### package1
A.java
```java
package package1;
import package2.*;

public class A {
	public static void main(String[] args) {
		C c = new C();
		//This will work
		System.out.println(c.publicMessage);
	}
}
```

B.java
```java
package package1;
import package2.*;

public class B {

}
```

##### package2
C.java
```java
package package2;
import package1.*;

public class C{
	//Anything that uses the public keyword is visible to any
	//package within the project folder. Even though in package2,
	//it is still visible to package1
	public String publicMessage = "This is public";

}
```
Asub.java
```java
package package2;
import package1.*;

public class Asub extends C {

	public static void main(String[] args) {

	}
}

```

##### Output
- When running A.java, output is
	- `This is public`

#### Example of Protected Access Modifier
##### package1
A.java
```java
package package1;
import package2.*;

public class A {
	//We are able to access this protected variable in package 2 b/c
	//Asub.java is a subclass of A.java
	protected String protectedMessage = "This is protected";
}
```

B.java
```java
package package1;
import package2.*;

public class B {

}
```

##### package2
C.java
```java
package package2;
import package1.*;

public class C{
	protected String protectedMessage = "This is protected";
}
```
Asub.java
```java
package package2;
import package1.*;

public class Asub extends A {

	public static void main(String[] args) {
		Asub asub = new Asub();

		//Even though A is in a different package, we have access
		//to this protected variable because something that is
		//protected is accessible to a different class in a different
		//package as long as that class is a subclass of whatever class
		//contains that protected member
		System.out.println(asub.protectedMessage);
	
	}
}
```

##### Output
- When running `Asub.java`, we get 
	- `This is protected`
#### Example of Private Access Modifier
##### package1
A.java
```java
package package1;
import package2.*;

public class A {
	public static void main(String[] args){
		B b = new B();
		//Error: This field B.privateMessage is not visible
		System.out.println(b.privateMessage);
		
	}

}
```

B.java
```java
package package1;
import package2.*;

public class B {
	//Something that is private is only visible to the class that
	//it contains itself.
	//Only Class B has access to this private message
	//Something that is private is only visible to the class
	//that it contains, even if it's in the same package
	private String privateMessage = "This is private";
}
```

##### package2
C.java
```java
package package2;
import package1.*;

public class C{
	private String privateMessage = "This is private";
}
```
Asub.java
```java
package package2;
import package1.*;

public class Asub extends A {

	public static void main(String[] args) {
	
	}
}
```

##### Output
- When running "A.java", error we get is
	- `The field B.privateMessage is not visible`