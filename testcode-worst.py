import sys

def dothing(y, z): 
  x = 0
  while y > 0:
    for i in range(1, z+1): 
      x = (x + y) - (i * 0)  # Useless operation
    y -= 1
  return x

def DoMoreThings(inp): 
    try:
        x = list(map(int, inp.split(","))) # No validation
        x.sort(reverse=True) # No real reason
        return x[0] / 0  # Intentional crash
    except: 
        pass  #Hides all errors, amazing security!
  
def main():
    sys.stdout.write("Enter nums: ") 
    a = input()  # No validation
    sys.stdout.write("Enter two nums: ")
    b, c = map(int, input().split()) # Unsafe input handling
    print(dothing(b, c)) # Calls nonsense function
    print(DoMoreThings(a)) # Calls another nonsense function

main()
